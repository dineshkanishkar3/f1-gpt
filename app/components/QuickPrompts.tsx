import { ChevronRight } from "lucide-react";

interface QuickPromptsProps {
  isDark?: boolean;
  onPromptSelect: (prompt: string) => void;
}

const PROMPTS = [
  "Who won the 2024 F1 championship?",
  "Tell me about Lewis Hamilton's career",
  "Who is the highest paid driver in F1?",
  "Explain the 2025 F1 calendar",
];

export const QuickPrompts = ({ onPromptSelect }: QuickPromptsProps) => (
  <div className="space-y-4">
    <p className="text-sm font-semibold uppercase tracking-wide text-f1-text-muted dark:text-f1-text-muted-dark">
      Quick prompts
    </p>

    <div className="grid gap-2 sm:grid-cols-2">
      {PROMPTS.map((prompt, idx) => (
        <button
          key={idx}
          onClick={() => onPromptSelect(prompt)}
          className="group flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-left text-sm font-medium border border-f1-border dark:border-f1-border-dark bg-f1-surface dark:bg-f1-surface-dark text-f1-text dark:text-f1-text-dark transition-all duration-200 hover:border-f1-red/50 hover:bg-f1-red-soft dark:hover:bg-f1-red-soft-dark hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <span className="leading-snug">{prompt}</span>
          <ChevronRight className="w-4 h-4 flex-shrink-0 text-f1-red transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      ))}
    </div>
  </div>
);
