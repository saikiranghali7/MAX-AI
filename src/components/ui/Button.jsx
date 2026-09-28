export default function Button({
  children,
  onClick,
  className = "",
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        px-4
        py-2
        rounded-xl
        bg-[var(--primary)]
        hover:opacity-90
        transition
        ${className}
      `}
    >
      {children}
    </button>
  );
}