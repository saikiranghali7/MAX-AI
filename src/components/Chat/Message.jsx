"use client";

import { useState } from "react";
import {
  FiCopy,
  FiCheck,
  FiVolume2,
  FiSquare,
  FiRefreshCw,
  FiEdit2,
  FiX,
  FiCpu,
  FiZap,
} from "react-icons/fi";
import { useChat } from "@/context/ChatContext";
import MarkdownMessage from "./MarkdownMessage";

export default function Message({
  role,
  content,
  ragActive = false,
  onRegenerate,
  onEdit,
  id,
}) {
  const isUser = role === "user";
  const { speakText, stopSpeaking, speakingMessageId } = useChat();

  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(content);

  const messageKey = id || content?.slice(0, 30);
  const isSpeaking = speakingMessageId === messageKey;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(content, messageKey);
    }
  };

  const startEditing = () => {
    setEditText(content);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditText(content);
    setEditing(false);
  };

  const saveEditing = () => {
    const newContent = editText.trim();
    if (!newContent) return;
    if (onEdit) onEdit(newContent);
    setEditing(false);
  };

  if (editing && isUser) {
    return (
      <div className="mb-5 flex justify-end">
        <div className="w-full max-w-[80%] md:max-w-[70%]">
          <textarea
            autoFocus
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                saveEditing();
              }
              if (e.key === "Escape") {
                cancelEditing();
              }
            }}
            className="w-full resize-none rounded-2xl border border-blue-500/60 bg-zinc-900/90 p-4 text-white outline-none focus:ring-2 focus:ring-blue-500/30 shadow-xl"
            rows={3}
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={cancelEditing}
              className="flex items-center gap-1 rounded-xl bg-zinc-800/80 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
            >
              <FiX size={14} />
              Cancel
            </button>
            <button
              type="button"
              onClick={saveEditing}
              className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:from-blue-500 hover:to-indigo-500 transition"
            >
              <FiCheck size={14} />
              Save & Send
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group mb-5 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="flex gap-3 max-w-[88%] md:max-w-[78%]">
        {/* Assistant Avatar */}
        {!isUser && (
          <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 text-white font-black text-xs shadow-lg shadow-blue-500/20">
            MAX
          </div>
        )}

        <div
          className={`relative rounded-2xl px-5 py-4 shadow-xl transition-all ${
            isUser
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs"
              : "bg-[#141722]/90 border border-white/10 text-zinc-100 backdrop-blur-md rounded-tl-xs hover:border-white/20"
          }`}
        >
          {/* RAG Memory Retrieved Pill */}
          {!isUser && ragActive && (
            <div className="mb-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <FiCpu className="text-emerald-400" />
              <span>RAG Memory Context Retrieved</span>
            </div>
          )}

          <MarkdownMessage content={content} />

          {/* Action Footer */}
          {content && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-white/10 pt-2.5 text-xs">
              {isUser && onEdit && (
                <button
                  type="button"
                  onClick={startEditing}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-zinc-200 hover:bg-white/10 transition"
                >
                  <FiEdit2 size={13} />
                  Edit
                </button>
              )}

              {!isUser && (
                <>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-zinc-400 hover:bg-white/5 hover:text-white transition"
                  >
                    {copied ? (
                      <>
                        <FiCheck size={13} className="text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied!</span>
                      </>
                    ) : (
                      <>
                        <FiCopy size={13} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleSpeak}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition ${
                      isSpeaking
                        ? "bg-blue-500/20 border border-blue-500/40 text-blue-300 font-semibold"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {isSpeaking ? (
                      <>
                        <span className="flex gap-0.5 items-end h-3 mr-0.5">
                          <span className="wave-bar"></span>
                          <span className="wave-bar"></span>
                          <span className="wave-bar"></span>
                        </span>
                        <FiSquare size={12} className="text-blue-400" />
                        <span>Stop Voice</span>
                      </>
                    ) : (
                      <>
                        <FiVolume2 size={13} />
                        <span>Read Aloud</span>
                      </>
                    )}
                  </button>

                  {onRegenerate && (
                    <button
                      type="button"
                      onClick={onRegenerate}
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-zinc-400 hover:bg-white/5 hover:text-white transition"
                    >
                      <FiRefreshCw size={13} />
                      <span>Regenerate</span>
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}