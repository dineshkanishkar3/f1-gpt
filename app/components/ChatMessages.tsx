import { Message } from "./types";
import { ChatBubble } from "./ChatBubble";
import { LoadingBubble } from "./LoadingBubble";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  isDark: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatMessages = ({
  messages,
  isLoading,
  isDark,
  messagesEndRef,
}: ChatMessagesProps) => (
  <div className="flex-1 overflow-y-auto">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="space-y-6 sm:space-y-8">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} isDark={isDark} />
        ))}
        {isLoading && <LoadingBubble />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  </div>
);
