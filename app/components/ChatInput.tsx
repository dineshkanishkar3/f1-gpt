import { Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  isDark: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const ChatInput = ({
  input,
  isLoading,
  onInputChange,
  onSubmit,
}: ChatInputProps) => (
  <div className="sticky bottom-0 backdrop-blur-xl border-t border-f1-border dark:border-f1-border-dark bg-f1-surface/90 dark:bg-f1-surface-dark/90">
    <form onSubmit={onSubmit} className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
      <div className="flex gap-3 p-2 rounded-2xl border border-f1-border dark:border-f1-border-dark bg-white dark:bg-f1-surface-elevated-dark shadow-sm">
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={isLoading}
          placeholder="Ask about drivers, teams, races, stats..."
          className="flex-1 px-4 py-3 bg-transparent text-[0.9375rem] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-f1-text-muted dark:placeholder:text-f1-text-muted-dark text-f1-text dark:text-f1-text-dark"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-200 bg-f1-red hover:bg-f1-red-hover hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md shadow-f1-red/35"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <p className="text-center text-[11px] mt-2.5 text-f1-text-muted dark:text-f1-text-muted-dark">
        Powered by Ollama & Astra DB · F1 knowledge at your fingertips
      </p>
    </form>
  </div>
);
