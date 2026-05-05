import { useEffect, useRef, useState } from "react";
import { Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id?: number;
  userId?: number;
  userName: string;
  content: string;
  createdAt: string;
  isSystem?: boolean;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  currentUserId: number;
  onSend: (content: string) => void;
  disabled?: boolean;
}

export default function ChatPanel({ messages, currentUserId, onSend, disabled }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || disabled) return;
    onSend(text);
    setInput("");
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="glass-panel rounded-xl flex flex-col overflow-hidden" style={{ height: "100%" }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/40">
        <MessageSquare className="w-3.5 h-3.5 text-gold" />
        <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
          Chat da Sala
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center py-8">
            <MessageSquare className="w-6 h-6 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground/60">
              Nenhuma mensagem ainda.<br />Seja o primeiro a dizer algo!
            </p>
          </div>
        )}

        {messages.map((msg, i) => {
          if (msg.isSystem) {
            return (
              <div key={i} className="flex justify-center">
                <span className="text-[10px] text-muted-foreground/50 bg-muted/30 rounded-full px-3 py-0.5">
                  {msg.content}
                </span>
              </div>
            );
          }

          const isOwn = msg.userId === currentUserId;

          return (
            <div
              key={msg.id ?? i}
              className={cn("flex flex-col gap-0.5", isOwn ? "items-end" : "items-start")}
            >
              {!isOwn && (
                <span className="text-[10px] text-gold/70 font-medium px-1">
                  {msg.userName}
                </span>
              )}
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-1.5 text-sm leading-relaxed",
                  isOwn
                    ? "bg-gold/20 text-foreground rounded-br-sm"
                    : "bg-muted/60 text-foreground rounded-bl-sm"
                )}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-muted-foreground/40 px-1">
                {formatTime(msg.createdAt)}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-2.5 border-t border-border/40">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mensagem..."
            maxLength={500}
            disabled={disabled}
            className="flex-1 h-8 text-sm bg-muted/40 border-border/40 focus:border-gold/40 placeholder:text-muted-foreground/40"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || disabled}
            className="w-8 h-8 bg-gold/20 hover:bg-gold/30 text-gold border border-gold/20 flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
