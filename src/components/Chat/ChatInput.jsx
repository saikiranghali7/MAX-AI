"use client";

import { useEffect, useState } from "react";

import Composer from "./composer/Composer";

import { useChat } from "@/context/ChatContext";
import { askAI } from "@/services/ai";

import { parseCommand } from "@/services/commandParser";

export default function ChatInput() {
  const [text, setText] = useState("");

  const [pendingCommand, setPendingCommand] =
    useState(null);

  const {
    messages,
    addMessage,
    setLoading,
    loading,
    autoTTS,
    speakText,
  } = useChat();

  /*
   * NORMAL AI MESSAGE
   */

  const sendAIMessage = async (prompt) => {
    if (!prompt?.trim()) return;

    addMessage({
      role: "user",
      content: prompt,
    });

    setLoading(true);

    try {
      // Pass full message history for RAG / context retrieval
      const response = await askAI(prompt, messages);

      addMessage({
        role: "assistant",
        content: response.content,
        ragActive: response.ragActive,
      });

      if (autoTTS) {
        speakText(response.content);
      }
    } catch (error) {
      console.error(
        "AI request failed:",
        error
      );

      addMessage({
        role: "assistant",
        content:
          "⚡ Oops! Something went wrong processing your request. Please try again!",
      });
    } finally {
      setLoading(false);
    }
  };

  /*
   * COMMAND HANDLER
   */

  const processCommand = async (input) => {
    if (loading) return;

    const parsed = parseCommand(input);

    console.log(
      "MAX COMMAND:",
      parsed
    );

    /*
     * CALL
     */

    if (parsed.type === "call") {
      setPendingCommand(parsed);

      return;
    }

    /*
     * OPEN
     */

    if (parsed.type === "open") {
      addMessage({
        role: "user",
        content: input,
      });

      addMessage({
        role: "assistant",
        content: `I understood that you want me to open "${parsed.target}". Phone app integration will be connected in the mobile MAX app.`,
      });

      return;
    }

    /*
     * SEARCH
     */

    if (parsed.type === "search") {
      addMessage({
        role: "user",
        content: input,
      });

      addMessage({
        role: "assistant",
        content: `I understood that you want me to search for "${parsed.query}".`,
      });

      return;
    }

    /*
     * MESSAGE
     */

    if (parsed.type === "message") {
      addMessage({
        role: "user",
        content: input,
      });

      addMessage({
        role: "assistant",
        content: `I understood that you want to send a message to "${parsed.target}". Messaging integration will be connected in the mobile MAX app.`,
      });

      return;
    }

    /*
     * NORMAL AI CHAT
     */

    await sendAIMessage(input);
  };

  /*
   * SEND BUTTON / ENTER
   */

  const sendMessage = async (
    messageText = text
  ) => {
    if (loading) return;

    if (!messageText?.trim()) return;

    const prompt = messageText.trim();

    setText("");

    await processCommand(prompt);
  };

  /*
   * VOICE COMMAND
   */

  const handleVoiceCommand = (command) => {
    if (loading) return;

    if (!command?.trim()) return;

    setText("");

    processCommand(command);
  };

  /*
   * SUGGESTION BUTTONS
   */

  useEffect(() => {
    const handleSuggestion = (event) => {
      const prompt =
        event.detail?.prompt;

      if (!prompt) return;

      processCommand(prompt);
    };

    window.addEventListener(
      "max-ai-suggestion",
      handleSuggestion
    );

    return () => {
      window.removeEventListener(
        "max-ai-suggestion",
        handleSuggestion
      );
    };
  }, [loading]);

  /*
   * CONFIRM CALL
   */

  const confirmCall = () => {
    if (!pendingCommand) return;

    const name =
      pendingCommand.contactName;

    addMessage({
      role: "user",
      content: `MAX call ${name}`,
    });

    addMessage({
      role: "assistant",
      content: `Call request confirmed for "${name}". Contact and phone integration will be handled by the mobile MAX app.`,
    });

    speakResponse(
      `Call request confirmed for ${name}.`
    );

    setPendingCommand(null);
  };

  /*
   * CANCEL CALL
   */

  const cancelCall = () => {
    if (!pendingCommand) return;

    addMessage({
      role: "assistant",
      content: `Okay, I won't call ${pendingCommand.contactName}.`,
    });

    setPendingCommand(null);
  };

  return (
    <div className="p-5">

      {/* CALL CONFIRMATION */}

      {pendingCommand && (
        <div className="mb-4 rounded-2xl border border-yellow-600/40 bg-yellow-500/10 p-4">

          <p className="text-sm text-zinc-300">
            Do you want MAX to call:
          </p>

          <p className="mt-1 text-lg font-semibold text-white">
            {pendingCommand.contactName}
          </p>

          <div className="mt-4 flex gap-2">

            <button
              type="button"
              onClick={confirmCall}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Confirm Call
            </button>

            <button
              type="button"
              onClick={cancelCall}
              className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-600"
            >
              Cancel
            </button>

          </div>

        </div>
      )}

      <Composer
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            !e.shiftKey
          ) {
            e.preventDefault();

            sendMessage();
          }
        }}
        onSend={() =>
          sendMessage()
        }
        onVoiceCommand={
          handleVoiceCommand
        }
        disabled={loading}
        loading={loading}
      />

      <p className="mt-3 text-center text-xs text-zinc-500">
        {loading
          ? "MAX is processing your request..."
          : 'Say "MAX" followed by your command.'}
      </p>

    </div>
  );
}