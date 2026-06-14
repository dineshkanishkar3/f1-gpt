import { Bot } from "lucide-react";

export const LoadingBubble = () => (
  <div className="flex gap-3 animate-message-in">
    <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border border-f1-border dark:border-f1-border-dark bg-f1-red-soft dark:bg-f1-red-soft-dark text-f1-red">
      <Bot className="w-4 h-4" />
    </div>

    <div className="px-5 py-4 rounded-2xl rounded-tl-md border border-f1-border dark:border-f1-border-dark bg-f1-surface dark:bg-f1-surface-dark">
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="loading-dot w-2 h-2 rounded-full bg-f1-red"
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
        <span className="text-sm ml-1 text-f1-text-muted dark:text-f1-text-muted-dark">
          Thinking...
        </span>
      </div>
    </div>
  </div>
);
