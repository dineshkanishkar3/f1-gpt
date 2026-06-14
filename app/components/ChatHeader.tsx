import { ThemeToggle } from "./ThemeToggle";
import { F1Logo } from "./F1Logo";

interface ChatHeaderProps {
  isDark: boolean;
  onThemeToggle: (theme: "light" | "dark") => void;
}

export const ChatHeader = ({ isDark, onThemeToggle }: ChatHeaderProps) => (
  <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-f1-border dark:border-f1-border-dark bg-f1-surface/90 dark:bg-f1-surface-dark/90">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
      <div className="flex items-center gap-4 sm:gap-5">
        <div className="flex-shrink-0 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 border-2 border-f1-red/30 dark:border-f1-red/50 bg-white shadow-[0_0_0_4px_rgba(225,6,0,0.12),0_8px_24px_rgba(225,6,0,0.15)]">
          <F1Logo priority className="h-7 sm:h-9 w-auto object-contain logo-glow" />
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-f1-text dark:text-f1-text-dark">
            F1<span className="text-f1-red">-GPT</span>
          </h1>
          <p className="text-xs sm:text-sm font-medium mt-0.5 text-f1-text-muted dark:text-f1-text-muted-dark">
            Your AI Formula 1 Expert
          </p>
        </div>
      </div>

      <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
    </div>
  </header>
);
