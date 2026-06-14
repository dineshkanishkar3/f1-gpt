import { Bot, User } from "lucide-react";
import { MessageContent } from "./MessageContent";
import { Message } from "./types";

interface ChatBubbleProps {
  message: Message;
  isDark: boolean;
}

export const ChatBubble = ({ message }: ChatBubbleProps) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex gap-3 animate-message-in ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5 ${
          isUser
            ? "bg-f1-red text-white shadow-md shadow-f1-red/40"
            : "bg-f1-red-soft dark:bg-f1-red-soft-dark border border-f1-border dark:border-f1-border-dark text-f1-red"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div
        className={`flex flex-col min-w-0 ${
          isUser
            ? "items-end max-w-[85%] sm:max-w-[70%]"
            : "items-start max-w-[92%] sm:max-w-[85%] lg:max-w-3xl"
        }`}
      >
        <div
          className={`w-full px-4 py-3.5 rounded-2xl transition-all duration-200 ${
            isUser
              ? "rounded-tr-md bg-f1-red text-white shadow-lg shadow-f1-red/30"
              : "rounded-tl-md border border-f1-border dark:border-f1-border-dark bg-f1-surface dark:bg-f1-surface-dark text-f1-text dark:text-f1-text-dark shadow-sm"
          }`}
        >
          <MessageContent text={message.text} isUser={isUser} />
        </div>

        <span className="text-[11px] mt-1.5 px-1 text-f1-text-muted dark:text-f1-text-muted-dark">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};
