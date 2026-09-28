import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

export default function ChatWindow() {
  return (
    <div className="flex flex-col h-full">
      <MessageList />
      <ChatInput />
    </div>
  );
}