export default function Input({
  placeholder,
  value,
  onChange,
}) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="
        flex-1
        bg-transparent
        text-white
        placeholder:text-[var(--muted)]
      "
    />
  );
}