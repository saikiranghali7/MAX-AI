export default function TypingIndicator()
 {
    const { messages, loading } = useChat();
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-zinc-800 rounded-2xl px-4 py-3">
        Thinking...
      </div>
    </div>
  );
}