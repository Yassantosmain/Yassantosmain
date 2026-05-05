import { Button } from "@/components/ui/button";
import { Clapperboard, Film } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen curtain-bg flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md"
      >
        <div className="w-20 h-20 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-8">
          <Film className="w-10 h-10 text-gold/60" />
        </div>

        <div className="font-serif text-8xl font-bold text-gradient-gold mb-4 leading-none">
          404
        </div>

        <h1 className="font-serif text-2xl font-semibold mb-3">
          Sala não encontrada
        </h1>

        <p className="text-muted-foreground mb-8 leading-relaxed">
          A página que você procura não existe ou foi removida.
          Que tal voltar ao início e criar uma nova sessão?
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button className="bg-gold text-primary-foreground hover:bg-gold/90 font-semibold px-6">
              <Clapperboard className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
          <Link href="/rooms/create">
            <Button variant="outline" className="border-border/60 hover:border-gold/40 hover:text-gold px-6">
              Criar Nova Sala
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
