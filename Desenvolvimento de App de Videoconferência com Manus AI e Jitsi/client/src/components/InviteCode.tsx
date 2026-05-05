import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface InviteCodeProps {
  code: string;
  compact?: boolean;
}

export default function InviteCode({ code, compact = false }: InviteCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Código copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/rooms/join?code=${code}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "CineSync — Sala de Cinema Virtual",
          text: `Entre na minha sala de cinema! Código: ${code}`,
          url: shareUrl,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copiado para a área de transferência!");
    }
  };

  if (compact) {
    return (
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gold/10 border border-gold/20 hover:bg-gold/15 transition-colors group"
      >
        <span className="font-mono text-sm font-bold text-gold tracking-widest">{code}</span>
        {copied ? (
          <Check className="w-3 h-3 text-green-400" />
        ) : (
          <Copy className="w-3 h-3 text-gold/60 group-hover:text-gold transition-colors" />
        )}
      </button>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-4">
      <p className="text-xs text-muted-foreground mb-2 font-medium tracking-wide uppercase">
        Código de Convite
      </p>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-muted/50 rounded-lg px-4 py-2.5 border border-border/40">
          <span className="font-mono text-xl font-bold text-gold tracking-[0.3em]">{code}</span>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopy}
          className="w-10 h-10 border-border/60 hover:border-gold/40 hover:text-gold"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleShare}
          className="w-10 h-10 border-border/60 hover:border-gold/40 hover:text-gold"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Compartilhe este código com seus amigos para que entrem na sala.
      </p>
    </div>
  );
}
