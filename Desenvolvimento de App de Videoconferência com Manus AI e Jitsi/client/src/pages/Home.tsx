import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Film, Users, Mic, MessageSquare, Play, Star, ArrowRight, Clapperboard } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12 },
  }),
};

const features = [
  {
    icon: Film,
    title: "Player Sincronizado",
    desc: "Play, pause e seek em perfeita sincronia para todos os participantes via WebSocket em tempo real.",
  },
  {
    icon: Mic,
    title: "Videoconferência Integrada",
    desc: "Veja e ouça seus amigos enquanto assiste, com Jitsi Meet embutido diretamente na sala.",
  },
  {
    icon: Users,
    title: "Salas com Convite",
    desc: "Crie uma sala em segundos e compartilhe o código de convite. Até 50 amigos simultâneos.",
  },
  {
    icon: MessageSquare,
    title: "Chat em Tempo Real",
    desc: "Troque mensagens durante a sessão sem sair da experiência cinematográfica.",
  },
];

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <div className="min-h-screen curtain-bg overflow-hidden">
      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/40 glass-panel">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <Clapperboard className="w-5 h-5 text-gold" />
            <span className="font-serif text-lg font-semibold tracking-tight text-foreground">
              CineSync
            </span>
          </div>
          <div className="flex items-center gap-3">
            {!loading && (
              isAuthenticated ? (
                <>
                  <Link href="/rooms/join">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      Entrar em Sala
                    </Button>
                  </Link>
                  <Link href="/rooms/create">
                    <Button size="sm" className="bg-gold text-primary-foreground hover:bg-gold/90 font-medium">
                      Criar Sala
                    </Button>
                  </Link>
                </>
              ) : (
                <a href={getLoginUrl()}>
                  <Button size="sm" className="bg-gold text-primary-foreground hover:bg-gold/90 font-medium">
                    Entrar
                  </Button>
                </a>
              )
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-4 text-center overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-72 h-72 rounded-full bg-gold/3 blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-72 h-72 rounded-full bg-gold/3 blur-3xl pointer-events-none" />

        <div className="relative container max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs font-medium tracking-widest uppercase mb-8"
          >
            <Star className="w-3 h-3 fill-gold" />
            Cinema Virtual Premium
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6"
          >
            Assista junto.{" "}
            <span className="text-gradient-gold italic">Sinta junto.</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Uma sala de cinema virtual onde você e seus amigos assistem ao mesmo vídeo
            em perfeita sincronia, enquanto se veem, se ouvem e conversam em tempo real.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {isAuthenticated ? (
              <>
                <Link href="/rooms/create">
                  <Button
                    size="lg"
                    className="bg-gold text-primary-foreground hover:bg-gold/90 font-semibold px-8 h-12 text-base cinema-glow"
                  >
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Criar Sala de Cinema
                  </Button>
                </Link>
                <Link href="/rooms/join">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-border/60 text-foreground hover:border-gold/50 hover:text-gold px-8 h-12 text-base"
                  >
                    Entrar com Código
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button
                  size="lg"
                  className="bg-gold text-primary-foreground hover:bg-gold/90 font-semibold px-10 h-12 text-base cinema-glow"
                >
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Começar Agora — É Gratuito
                </Button>
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Preview mockup ──────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
        className="container max-w-5xl mx-auto px-4 pb-24"
      >
        <div className="relative rounded-2xl border border-border/50 overflow-hidden cinema-glow">
          {/* Fake browser chrome */}
          <div className="bg-card border-b border-border/50 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-gold/40" />
              <div className="w-3 h-3 rounded-full bg-green-500/40" />
            </div>
            <div className="flex-1 mx-4 bg-muted rounded-md h-6 flex items-center px-3">
              <span className="text-muted-foreground text-xs">cinesync.manus.space/room/ABCD1234</span>
            </div>
          </div>
          {/* Fake cinema room */}
          <div className="bg-cinema-dark p-4 md:p-6 grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4 min-h-[320px]">
            {/* Player area */}
            <div className="bg-black rounded-xl flex items-center justify-center aspect-video relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <div className="w-16 h-16 rounded-full border-2 border-gold/40 flex items-center justify-center">
                  <Play className="w-7 h-7 text-gold fill-gold ml-1" />
                </div>
                <span className="text-sm font-medium text-gold/70">Player Sincronizado</span>
              </div>
              {/* Fake controls */}
              <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/80 to-transparent flex items-end px-4 pb-2 gap-3">
                <div className="w-6 h-6 rounded bg-gold/20 flex items-center justify-center">
                  <Play className="w-3 h-3 text-gold fill-gold ml-0.5" />
                </div>
                <div className="flex-1 h-1 bg-border/40 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-gold rounded-full" />
                </div>
                <span className="text-gold/60 text-xs">24:15</span>
              </div>
            </div>
            {/* Side panel */}
            <div className="flex flex-col gap-3">
              {/* Jitsi placeholder */}
              <div className="glass-panel rounded-xl p-3 flex-1">
                <p className="text-xs text-muted-foreground mb-2 font-medium tracking-wide uppercase">Participantes</p>
                <div className="grid grid-cols-2 gap-2">
                  {["Ana", "Bruno", "Carol", "Você"].map((name) => (
                    <div key={name} className="bg-muted/50 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                        <span className="text-gold text-xs font-semibold">{name[0]}</span>
                      </div>
                      <span className="absolute bottom-1 left-1 text-[10px] text-muted-foreground">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Chat placeholder */}
              <div className="glass-panel rounded-xl p-3 h-32">
                <p className="text-xs text-muted-foreground mb-2 font-medium tracking-wide uppercase">Chat</p>
                <div className="space-y-1.5">
                  <div className="text-xs"><span className="text-gold/80">Ana:</span> <span className="text-foreground/70">Que cena incrível!</span></div>
                  <div className="text-xs"><span className="text-gold/80">Bruno:</span> <span className="text-foreground/70">Concordo 😍</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section className="container max-w-5xl mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-3">
            Tudo que você precisa para uma{" "}
            <span className="text-gradient-gold italic">sessão perfeita</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tecnologia de ponta a serviço de momentos inesquecíveis com quem você ama.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-panel rounded-xl p-6 group hover:border-gold/30 transition-colors duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center mb-4 group-hover:bg-gold/15 transition-colors">
                <f.icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="container max-w-3xl mx-auto px-4 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel rounded-2xl p-10 cinema-glow border-gold/20"
        >
          <Clapperboard className="w-10 h-10 text-gold mx-auto mb-4" />
          <h2 className="font-serif text-3xl font-bold mb-3">
            Pronto para o próximo filme?
          </h2>
          <p className="text-muted-foreground mb-8">
            Crie sua sala em segundos e convide seus amigos para uma experiência única.
          </p>
          {isAuthenticated ? (
            <Link href="/rooms/create">
              <Button size="lg" className="bg-gold text-primary-foreground hover:bg-gold/90 font-semibold px-10 h-12">
                <Play className="w-4 h-4 mr-2 fill-current" />
                Criar Minha Sala
              </Button>
            </Link>
          ) : (
            <a href={getLoginUrl()}>
              <Button size="lg" className="bg-gold text-primary-foreground hover:bg-gold/90 font-semibold px-10 h-12">
                Começar Agora
              </Button>
            </a>
          )}
        </motion.div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/40 py-8">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clapperboard className="w-4 h-4 text-gold" />
            <span className="font-serif text-sm font-medium">CineSync</span>
          </div>
          <p className="text-muted-foreground text-xs">
            Cinema virtual para momentos que importam.
          </p>
        </div>
      </footer>
    </div>
  );
}
