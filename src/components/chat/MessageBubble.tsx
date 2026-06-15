import { Zap } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Props {
  message: Message;
}

function formatContent(content: string) {
  return content.split("\n").map((line, i) => (
    <p
      key={i}
      className="text-[var(--color-text-2)]"
    >
      {line}
    </p>
  ));
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  if (!message.content?.trim()) {
    return null;
  }

  if (isUser) {
    return (
      <div className="msg-enter flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-[var(--color-accent)] px-4 py-2.5">
          <p className="text-[14px] leading-relaxed text-white">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="msg-enter flex gap-3">
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-900/30">
        <Zap
          className="h-3.5 w-3.5 text-white"
          strokeWidth={2.5}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-[12px] font-medium text-[var(--color-accent-2)]">
            Relay
          </span>

          <span className="text-[11px] text-[var(--color-text-3)]">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="rounded-2xl rounded-tl-sm border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3">
          <div className="flex flex-col gap-1 text-[14px] leading-relaxed">
            {formatContent(message.content)}
          </div>
        </div>
      </div>
    </div>
  );
}