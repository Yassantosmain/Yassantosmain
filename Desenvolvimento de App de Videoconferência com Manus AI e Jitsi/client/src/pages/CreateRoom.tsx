import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Clapperboard, Film, Link2, ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function CreateRoom() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const createRoom = trpc.rooms.create.useMutation({
    onSuccess: (room) => {
      toast.success("Sala criada com sucesso!");
      navigate(`/room/${room.code}`);
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao criar sala");
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
      {/* Nav */}
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

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="glass-panel rounded-2xl p-8 cinema-glow border-gold/10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
                <Film className="w-7 h-7 text-gold" />
              </div>
              <h1 className="font-serif text-2xl font-bold mb-1">Nova Sala de Cinema</h1>
              <p className="text-muted-foreground text-sm">
                Configure sua sessão e convide os amigos
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!name.trim()) {
                  toast.error("Digite um nome para a sala");
                  return;
                }
                createRoom.mutate({ name: name.trim(), videoUrl: videoUrl.trim() || undefined });
              }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground/80">
                  Nome da Sala
                </Label>
                <Input
                  id="name"
                  placeholder="Ex: Noite de Cinema com Amigos"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={120}
                  className="bg-muted/50 border-border/60 focus:border-gold/50 h-11 placeholder:text-muted-foreground/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoUrl" className="text-sm font-medium text-foreground/80">
                  URL do Vídeo{" "}
                  <span className="text-muted-foreground font-normal">(opcional)</span>
                </Label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="videoUrl"
                    placeholder="https://youtube.com/watch?v=... ou link .mp4"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="bg-muted/50 border-border/60 focus:border-gold/50 h-11 pl-10 placeholder:text-muted-foreground/50"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Suporta YouTube, Vimeo e links diretos de MP4. Você também pode definir depois.
                </p>
              </div>

              <Button
                type="submit"
                disabled={createRoom.isPending}
                className="w-full h-11 bg-gold text-primary-foreground hover:bg-gold/90 font-semibold text-base cinema-glow"
              >
                {createRoom.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Criando...</>
                ) : (
                  "Criar Sala e Entrar"
                )}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-border/40 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem um código?{" "}
                <Link href="/rooms/join">
                  <span className="text-gold hover:text-gold/80 cursor-pointer transition-colors">
                    Entrar em uma sala
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
