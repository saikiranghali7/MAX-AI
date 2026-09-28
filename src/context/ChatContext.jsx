"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ChatContext = createContext(null);

const STORAGE_KEY = "max-ai-conversations";
const CURRENT_CHAT_KEY = "max-ai-current-chat";

function createChat() {
  return {
    id:
      Date.now().toString() +
      "-" +
      Math.random().toString(36).slice(2),

    title: "New Chat",

    messages: [],

    createdAt: Date.now(),

    updatedAt: Date.now(),
  };
}

export function ChatProvider({ children }) {
  const [conversations, setConversations] =
    useState([]);

  const [currentChatId, setCurrentChatId] =
    useState(null);

  const [loading, setLoading] = useState(false);

  const [ready, setReady] = useState(false);

  /*
   * TTS STATE & CONTROLS
   */
  const [autoTTS, setAutoTTS] = useState(true);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
  };

  const toggleAutoTTS = () => {
    setAutoTTS((prev) => {
      if (prev) stopSpeaking();
      return !prev;
    });
  };

  const speakText = (text, messageId = null) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !text) {
      return;
    }

    stopSpeaking();

    const cleanText = text
      .replace(/```[\s\S]*?```/g, " code block ")
      .replace(/[*_#`]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setSpeakingMessageId(messageId || "active");
    };

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    window.speechSynthesis.speak(utterance);
  };


  /*
   * LOAD SAVED CHATS
   */
  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY);

      const savedCurrent =
        localStorage.getItem(
          CURRENT_CHAT_KEY
        );

      if (saved) {
        const parsed = JSON.parse(saved);

        if (
          Array.isArray(parsed) &&
          parsed.length > 0
        ) {
          setConversations(parsed);

          const currentExists =
            parsed.some(
              (chat) =>
                chat.id === savedCurrent
            );

          setCurrentChatId(
            currentExists
              ? savedCurrent
              : parsed[0].id
          );

          setReady(true);

          return;
        }
      }

      /*
       * FIRST CHAT
       */

      const firstChat = createChat();

      setConversations([firstChat]);

      setCurrentChatId(firstChat.id);
    } catch (error) {
      console.error(
        "Failed to load saved chats:",
        error
      );

      const firstChat = createChat();

      setConversations([firstChat]);

      setCurrentChatId(firstChat.id);
    }

    setReady(true);
  }, []);

  /*
   * SAVE CHATS
   */
  useEffect(() => {
    if (!ready) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(conversations)
    );
  }, [conversations, ready]);

  /*
   * SAVE CURRENT CHAT
   */
  useEffect(() => {
    if (!ready || !currentChatId) return;

    localStorage.setItem(
      CURRENT_CHAT_KEY,
      currentChatId
    );
  }, [currentChatId, ready]);

  /*
   * CURRENT CHAT
   */

  const currentConversation =
    conversations.find(
      (chat) =>
        chat.id === currentChatId
    ) || null;

  const messages =
    currentConversation?.messages || [];

  /*
   * ADD MESSAGE
   */

  const addMessage = (message) => {
    setConversations((previous) =>
      previous.map((chat) => {
        if (chat.id !== currentChatId) {
          return chat;
        }

        let title = chat.title;

        /*
         * Automatically create title
         * from first user message.
         */

        if (
          title === "New Chat" &&
          message.role === "user"
        ) {
          const cleanTitle =
            message.content
              .replace(/\s+/g, " ")
              .trim();

          title =
            cleanTitle.length > 40
              ? cleanTitle.slice(0, 40) +
                "..."
              : cleanTitle;
        }

        return {
          ...chat,

          title,

          messages: [
            ...chat.messages,
            message,
          ],

          updatedAt: Date.now(),
        };
      })
    );
  };

  /*
   * UPDATE MESSAGE
   */

  const updateMessage = (
    messageIndex,
    newContent
  ) => {
    setConversations((previous) =>
      previous.map((chat) => {
        if (chat.id !== currentChatId) {
          return chat;
        }

        const updatedMessages = [
          ...chat.messages,
        ];

        if (
          messageIndex < 0 ||
          messageIndex >=
            updatedMessages.length
        ) {
          return chat;
        }

        updatedMessages[messageIndex] = {
          ...updatedMessages[messageIndex],

          content: newContent,
        };

        return {
          ...chat,

          messages: updatedMessages,

          updatedAt: Date.now(),
        };
      })
    );
  };

  /*
   * NEW CHAT
   */

  const newChat = () => {
    const chat = createChat();

    setConversations((previous) => [
      chat,
      ...previous,
    ]);

    setCurrentChatId(chat.id);

    setLoading(false);
  };

  /*
   * SWITCH CHAT
   */

  const switchChat = (chatId) => {
    const exists =
      conversations.some(
        (chat) =>
          chat.id === chatId
      );

    if (!exists) return;

    setCurrentChatId(chatId);

    setLoading(false);
  };

  /*
   * RENAME CHAT
   */

  const renameChat = (
    chatId,
    title
  ) => {
    const cleanTitle =
      title.trim();

    if (!cleanTitle) return;

    setConversations((previous) =>
      previous.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,

              title: cleanTitle,

              updatedAt: Date.now(),
            }
          : chat
      )
    );
  };

  /*
   * DELETE CHAT
   */

  const deleteChat = (chatId) => {
    setConversations((previous) => {
      if (previous.length <= 1) {
        return previous;
      }

      const remaining =
        previous.filter(
          (chat) =>
            chat.id !== chatId
        );

      if (chatId === currentChatId) {
        setCurrentChatId(
          remaining[0]?.id || null
        );
      }

      return remaining;
    });

    setLoading(false);
  };

  /*
   * CLEAR CURRENT CHAT
   */

  const clearCurrentChat = () => {
    setConversations((previous) =>
      previous.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,

              title: "New Chat",

              messages: [],

              updatedAt: Date.now(),
            }
          : chat
      )
    );
  };

  /*
   * WAIT UNTIL STORAGE IS LOADED
   */

  if (!ready) {
    return null;
  }

  return (
    <ChatContext.Provider
      value={{
        conversations,

        currentConversation,

        currentChatId,

        messages,

        addMessage,

        updateMessage,

        newChat,

        switchChat,

        renameChat,

        deleteChat,

        clearCurrentChat,

        loading,

        setLoading,

        autoTTS,

        toggleAutoTTS,

        speakingMessageId,

        speakText,

        stopSpeaking,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context =
    useContext(ChatContext);

  if (!context) {
    throw new Error(
      "useChat must be used inside ChatProvider"
    );
  }

  return context;
}