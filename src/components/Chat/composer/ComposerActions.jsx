"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiMic,
  FiMicOff,
  FiSend,
} from "react-icons/fi";

export default function ComposerActions({
  onSend,
  onVoiceResult,
  onVoiceCommand,
  disabled = false,
  loading = false,
}) {
  const [listening, setListening] = useState(false);
  const [wakeMode, setWakeMode] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition =
      new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        if (!event.results[i].isFinal) {
          continue;
        }

        const transcript =
          event.results[i][0].transcript.trim();

        if (!transcript) continue;

        const lower =
          transcript.toLowerCase();

        const maxIndex =
          lower.indexOf("max");

        if (maxIndex === -1) {
          if (
            wakeMode &&
            onVoiceResult &&
            !disabled
          ) {
            onVoiceResult(transcript);
          }

          continue;
        }

        const command =
          transcript
            .slice(maxIndex + 3)
            .trim();

        if (!command) {
          setWakeMode(true);
          continue;
        }

        setWakeMode(false);

        if (
          onVoiceCommand &&
          !disabled
        ) {
          onVoiceCommand(command);
        }
      }
    };

    recognition.onend = () => {
      setListening(false);
      setWakeMode(false);
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setListening(false);
      setWakeMode(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [
    onVoiceResult,
    onVoiceCommand,
    wakeMode,
    disabled,
  ]);

  const toggleVoice = () => {
    if (disabled) return;

    const recognition =
      recognitionRef.current;

    if (!recognition) {
      alert(
        "Voice recognition is not supported in this browser."
      );
      return;
    }

    if (listening) {
      recognition.stop();
      setListening(false);
      setWakeMode(false);
      return;
    }

    try {
      recognition.start();
    } catch (error) {
      console.error(
        "Could not start microphone:",
        error
      );
    }
  };

  return (
    <div className="flex items-center justify-between px-4 pb-4">

      <button
        type="button"
        disabled={disabled}
        onClick={toggleVoice}
        className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
          disabled
            ? "cursor-not-allowed text-zinc-700"
            : wakeMode
            ? "animate-pulse bg-green-500 text-white"
            : listening
            ? "bg-red-500 text-white"
            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
        }`}
        title="Voice input"
      >
        {listening ? (
          <FiMicOff size={19} />
        ) : (
          <FiMic size={19} />
        )}
      </button>

      <div className="flex-1 px-3 text-xs text-zinc-500">
        {loading
          ? "MAX is thinking..."
          : wakeMode
          ? "MAX is listening..."
          : listening
          ? 'Say "MAX" followed by your command'
          : "Voice mode off"}
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onSend}
        className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
          disabled
            ? "cursor-not-allowed bg-zinc-700 text-zinc-500"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
        title="Send message"
      >
        <FiSend size={18} />
      </button>

    </div>
  );
}