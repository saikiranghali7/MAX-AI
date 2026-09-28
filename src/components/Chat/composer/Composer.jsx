"use client";

import ComposerInput from "./ComposerInput";
import ComposerActions from "./ComposerActions";

export default function Composer({
  value,
  onChange,
  onKeyDown,
  onSend,
  onVoiceCommand,
  disabled = false,
  loading = false,
}) {
  const handleVoiceResult = (transcript) => {
    if (!transcript || disabled) return;

    onChange({
      target: {
        value: transcript,
      },
    });
  };

  return (
    <div
      className={`rounded-3xl border ${
        loading
          ? "border-blue-500/60"
          : "border-zinc-700"
      } bg-zinc-900 transition`}
    >
      {/* Input / Loading */}
      <div className="relative">

        <ComposerInput
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          disabled={disabled}
        />

        {loading && (
          <div className="absolute inset-0 flex items-center bg-zinc-900/95 px-5">
            <div className="flex items-center gap-3">

              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
                  style={{
                    animationDelay: "150ms",
                  }}
                />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
                  style={{
                    animationDelay: "300ms",
                  }}
                />
              </div>

              <span className="text-sm text-zinc-300">
                MAX is thinking...
              </span>

            </div>
          </div>
        )}

      </div>

      <ComposerActions
        onSend={onSend}
        onVoiceResult={handleVoiceResult}
        onVoiceCommand={onVoiceCommand}
        disabled={disabled}
        loading={loading}
      />
    </div>
  );
}