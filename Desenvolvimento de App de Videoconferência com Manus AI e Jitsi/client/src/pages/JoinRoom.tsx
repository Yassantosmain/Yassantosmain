import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Clapperboard, Hash, ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function JoinRoom() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [code, setCode] = useState("");

  const joinRoom = trpc.rooms.join.useMutation({
    onSuccess: (room) => {
      toast.success(`Entrando em "${room.name}"...`);
      navigate(`/room/${room.code}`);
    },
    onError: (err) => {
      toast.error(err.message || "Código inválido ou sala não encontrada");
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 text-gold animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  return (
    <div className="min-h-screen curtain-bg flex flex-col">
      <nav className="border-b border-border/40 glass-panel">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Voltar</span>
            </button>
          </Link>
          <div className="flex items-center gap-2">
            <Clapperboard className="w-4 h-4 text-gold" />
            <span className="font-serif text-base font-semibold">CineSync</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="glass-panel rounded-2xl p-8 cinema-glow border-gold/10">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
                <Hash className="w-7 h-7 text-gold" />
              </div>
              <h1 className="font-serif text-2xl font-bold mb-1">Entrar em uma Sala</h1>
              <p className="text-muted-foreground text-sm">
                Insira o código de convite compartilhado pelo host
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!code.trim()) {
                  toast.error("Digite o código da sala");
                  return;
                }
                joinRoom.mutate({ code: code.trim() });
              }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium text-foreground/80">
                  Código da Sala
                </Label>
                <Input
                  id="code"
                  placeholder="Ex: ABCD1234"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  maxLength={12}
                  className="bg-muted/50 border-border/60 focus:border-gold/50 h-12 text-center text-xl font-mono tracking-[0.3em] uppercase placeholder:text-muted-foreground/40 placeholder:tracking-normal placeholder:text-base"
                />
              </div>

              <Button
                type="submit"
                disabled={joinRoom.isPending || !code.trim()}
                className="w-full h-11 bg-gold text-primary-foreground hover:bg-gold/90 font-semibold text-base cinema-glow"
              >
                {joinRoom.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Entrando...</>
                ) : (
                  "Entrar na Sala"
                )}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-border/40 text-center">
              <p className="text-sm text-muted-foreground">
                Quer criar uma sala?{" "}
                <Link href="/rooms/create">
                  <span className="text-gold hover:text-gold/80 cursor-pointer transition-colors">
                    Criar nova sala
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
