"use client";

export default function ComposerInput({
  value,
  onChange,
  onKeyDown,
  disabled = false,
}) {
  return (
    <textarea
      rows={1}
      value={value}
      disabled={disabled}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={
        disabled
          ? "MAX is thinking..."
          : "Message MAX AI..."
      }
      className="w-full resize-none bg-transparent p-5 text-lg outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed"
    />
  );
}