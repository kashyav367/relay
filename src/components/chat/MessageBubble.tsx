import { Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  if (!message.content?.trim()) {
    return null;
  }

  if (isUser) {
    return (
      <div className="msg-enter flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-[#1A1A1C] border border-[#27272A] px-4 py-2.5">
          <p className="text-[14px] leading-relaxed text-[#E4E4E7]">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="msg-enter flex gap-3">
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#FFE600]">
        <Sparkles className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-[12px] font-medium text-[#FFE600]">
            Relay
          </span>

          <span className="text-[11px] text-[#52525B]">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="rounded-2xl rounded-tl-sm border border-[#27272A] bg-[#111113] px-4 py-3.5">
          <div className="markdown-body text-[14px] leading-relaxed text-[#E4E4E7]">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}