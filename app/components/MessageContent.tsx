import type { ReactNode } from "react";

interface MessageContentProps {
  text: string;
  isUser?: boolean;
}

type Block =
  | { type: "paragraph"; lines: string[] }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

const BULLET_PATTERN = /^[\s]*[-*•]\s+(.+)$/;
const NUMBERED_PATTERN = /^[\s]*\d+[.)]\s+(.+)$/;

function parseInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function parseBlocks(text: string): Block[] {
  const lines = text.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }

    const bulletMatch = line.match(BULLET_PATTERN);
    if (bulletMatch) {
      const items: string[] = [];
      while (i < lines.length) {
        const match = lines[i].match(BULLET_PATTERN);
        if (!match) break;
        items.push(match[1].trim());
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    const numberedMatch = line.match(NUMBERED_PATTERN);
    if (numberedMatch) {
      const items: string[] = [];
      while (i < lines.length) {
        const match = lines[i].match(NUMBERED_PATTERN);
        if (!match) break;
        items.push(match[1].trim());
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    const paragraphLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== "") {
      const isListLine =
        BULLET_PATTERN.test(lines[i]) || NUMBERED_PATTERN.test(lines[i]);
      if (isListLine && paragraphLines.length > 0) break;
      if (isListLine) break;
      paragraphLines.push(lines[i]);
      i++;
    }
    if (paragraphLines.length > 0) {
      blocks.push({ type: "paragraph", lines: paragraphLines });
    }
  }

  return blocks;
}

export const MessageContent = ({ text, isUser = false }: MessageContentProps) => {
  if (isUser) {
    return <p className="text-[0.9375rem] leading-relaxed">{text}</p>;
  }

  const blocks = parseBlocks(text.trim());

  if (blocks.length === 0) {
    return <p className="prose-message">{text}</p>;
  }

  return (
    <div className="prose-message">
      {blocks.map((block, index) => {
        if (block.type === "ul") {
          return (
            <ul key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{parseInline(item)}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "ol") {
          return (
            <ol key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{parseInline(item)}</li>
              ))}
            </ol>
          );
        }

        return (
          <p key={index}>
            {block.lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {lineIndex > 0 && <br />}
                {parseInline(line)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
};
