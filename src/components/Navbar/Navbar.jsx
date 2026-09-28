"use client";

import { FiMenu, FiSettings, FiUser, FiVolume2, FiVolumeX, FiZap, FiCpu } from "react-icons/fi";
import { APP } from "@/constants/app";
import { useUI } from "@/context/UIContext";
import { useChat } from "@/context/ChatContext";

export default function Navbar() {
  const { toggleSidebar } = useUI();
  const { autoTTS, toggleAutoTTS, speakingMessageId, stopSpeaking } = useChat();

  return (
    <header className="h-16 border-b border-white/10 bg-[#0E1017]/80 backdrop-blur-xl flex items-center justify-between px-6 z-40">
      {/* Left: Sidebar Toggle & Branding */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition"
          title="Toggle Sidebar"
        >
          <FiMenu className="text-xl" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 animate-aura text-white font-black text-sm">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-zinc-200 to-blue-400 bg-clip-text text-transparent">
                MAX AI
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <FiZap className="animate-pulse" /> ENERGETIC
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Center/Right Status Badges & Controls */}
      <div className="flex items-center gap-3">
        {/* RAG Memory Status Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <FiCpu className="text-emerald-400" />
          <span>RAG History Active</span>
        </div>

        {/* TTS Toggle Button */}
        <button
          onClick={toggleAutoTTS}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            autoTTS
              ? "bg-blue-600/20 border border-blue-500/40 text-blue-300 hover:bg-blue-600/30"
              : "bg-zinc-800/80 border border-zinc-700/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          }`}
          title={autoTTS ? "Auto TTS Enabled (Click to Mute)" : "Auto TTS Muted (Click to Enable)"}
        >
          {autoTTS ? (
            <>
              <FiVolume2 className="text-sm text-blue-400 animate-pulse" />
              <span className="hidden sm:inline">Voice TTS: On</span>
            </>
          ) : (
            <>
              <FiVolumeX className="text-sm" />
              <span className="hidden sm:inline">Voice TTS: Off</span>
            </>
          )}
        </button>

        {/* Global Stop Speaking Indicator */}
        {speakingMessageId && (
          <button
            onClick={stopSpeaking}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/20 border border-red-500/40 text-red-300 animate-pulse hover:bg-red-500/30"
            title="Stop Speaking"
          >
            <span className="flex gap-0.5 items-end h-3">
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
            </span>
            <span>Stop Audio</span>
          </button>
        )}

        <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block"></div>

        <button className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition">
          <FiSettings className="text-lg" />
        </button>

        <button className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition">
          <FiUser className="text-lg" />
        </button>
      </div>
    </header>
  );
}