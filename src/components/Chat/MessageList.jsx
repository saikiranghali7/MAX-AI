"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@/context/ChatContext";
import { FiZap, FiCpu, FiVolume2, FiCode, FiLayers } from "react-icons/fi";
import Message from "./Message";

export default function MessageList() {
  const {
    messages,
    updateMessage,
    addMessage,
    setLoading,
    autoTTS,
    speakText,
  } = useChat();

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  const regenerate = async (messageIndex) => {
    const userMessage = messages
      .slice(0, messageIndex)
      .reverse()
      .find((message) => message.role === "user");

    if (!userMessage) return;

    setLoading(true);

    try {
      const priorHistory = messages.slice(0, messageIndex);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: priorHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to regenerate response.");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      addMessage({
        role: "assistant",
        content: data.reply,
        ragActive: data.ragActive,
      });

      if (autoTTS) {
        speakText(data.reply);
      }
    } catch (error) {
      console.error("Regenerate failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (messageIndex, newContent) => {
    updateMessage(messageIndex, newContent);
  };

  const sendSuggestion = (prompt) => {
    const event = new CustomEvent("max-ai-suggestion", {
      detail: {
        prompt,
      },
    });

    window.dispatchEvent(event);
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center overflow-y-auto p-6">
        <div className="w-full max-w-3xl text-center">
          {/* Hero Avatar & Energetic Badge */}
          <div className="mb-6 inline-flex relative">
            <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 text-white font-black text-3xl shadow-2xl shadow-blue-500/40 animate-aura">
              🚀
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Hey! I&apos;m{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              MAX AI
            </span>
          </h1>

          <p className="mt-3 text-base sm:text-lg text-zinc-300 max-w-xl mx-auto font-medium">
            Your ultra-energetic, high-vibe assistant powered by RAG context memory &amp; smart voice TTS!
          </p>

          {/* Feature Badges */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <FiZap /> Ultra High-Energy Mode
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <FiCpu /> RAG Chat History Memory
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <FiVolume2 /> Real-Time Voice TTS
            </span>
          </div>

          {/* Energetic Cards */}
          <div className="mt-10 grid grid-cols-1 gap-3.5 sm:grid-cols-2 text-left">
            <button
              type="button"
              onClick={() =>
                sendSuggestion("Remember my name is Sai and ask me what cool project we are building!")
              }
              className="group rounded-2xl border border-white/10 bg-[#121522]/80 p-4.5 transition-all hover:border-blue-500/40 hover:bg-[#1A1E30] hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-white text-sm group-hover:text-blue-400 transition">
                  🧠 Test RAG Context Memory
                </span>
                <FiCpu className="text-zinc-500 group-hover:text-blue-400" />
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tell MAX facts, then ask questions about earlier topics in the conversation!
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                sendSuggestion("Give me an energetic roadmap to master React 19 & Next.js 16!")
              }
              className="group rounded-2xl border border-white/10 bg-[#121522]/80 p-4.5 transition-all hover:border-cyan-500/40 hover:bg-[#1A1E30] hover:shadow-xl hover:shadow-cyan-500/10"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-white text-sm group-hover:text-cyan-400 transition">
                  ⚡ React &amp; Next.js Roadmap
                </span>
                <FiCode className="text-zinc-500 group-hover:text-cyan-400" />
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Get an upbeat, structured step-by-step developer guide with code snippets.
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                sendSuggestion("Generate a full high-performance async API handler in Node.js!")
              }
              className="group rounded-2xl border border-white/10 bg-[#121522]/80 p-4.5 transition-all hover:border-purple-500/40 hover:bg-[#1A1E30] hover:shadow-xl hover:shadow-purple-500/10"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-white text-sm group-hover:text-purple-400 transition">
                  💻 High-Performance Code
                </span>
                <FiLayers className="text-zinc-500 group-hover:text-purple-400" />
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Clean, production-ready code with detailed explanations.
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                sendSuggestion("Give me 3 energetic tips for building an incredible AI Assistant mobile app!")
              }
              className="group rounded-2xl border border-white/10 bg-[#121522]/80 p-4.5 transition-all hover:border-emerald-500/40 hover:bg-[#1A1E30] hover:shadow-xl hover:shadow-emerald-500/10"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-white text-sm group-hover:text-emerald-400 transition">
                  📱 Mobile AI Strategy
                </span>
                <FiZap className="text-zinc-500 group-hover:text-emerald-400" />
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Actionable tips for building MAX Mobile Android &amp; iOS React Native apps.
              </p>
            </button>
          </div>
        </div>
        <div ref={bottomRef} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
      {messages.map((message, index) => (
        <Message
          key={index}
          id={`msg-${index}`}
          role={message.role}
          content={message.content}
          ragActive={message.ragActive}
          onRegenerate={
            message.role === "assistant"
              ? () => regenerate(index)
              : undefined
          }
          onEdit={
            message.role === "user"
              ? (newContent) => handleEdit(index, newContent)
              : undefined
          }
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}