<div align="center">

# 🎬 CineSync

### _Assista junto. Sinta junto._

**CineSync** é uma plataforma de cinema virtual que permite assistir vídeos em perfeita sincronia com seus amigos — com videoconferência, chat e convite por QR Code, tudo em uma única tela.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![tRPC](https://img.shields.io/badge/tRPC-11-398CCB?style=flat-square)](https://trpc.io/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

</div>

---

## ✨ Proposta de Valor — Por que o CineSync é único?

A maioria das soluções de "watch party" exige extensões de navegador, contas em serviços de streaming específicos ou ferramentas separadas para vídeo e voz. O **CineSync elimina todas essas fricções**:

| Recurso | CineSync | Extensões comuns |
|---|---|---|
| Funciona com qualquer URL de vídeo (YouTube + MP4) | ✅ | ❌ |
| Videoconferência **embutida** na sala | ✅ | ❌ |
| Sincronização via WebSocket em tempo real | ✅ | ⚠️ delay |
| Convite instantâneo por QR Code (com download) | ✅ | ❌ |
| Sem extensão, sem plugin | ✅ | ❌ |
| Tema cinematográfico dark + glassmorphism | ✅ | ❌ |

**Em resumo:** crie uma sala em segundos, compartilhe um QR Code e assista com até 50 amigos — vendo e ouvindo uns aos outros em tempo real.

---

## 📸 Capturas de Tela / GIF de Funcionamento

> _Adicione aqui os seus screenshots ou GIFs gravados da aplicação rodando._
> _Sugestão de ferramenta: [ScreenToGif](https://www.screentogif.com/) (Windows) ou [Kap](https://getkap.co/) (macOS)._

```
[ Screenshot — Landing Page ]
[ Screenshot — Criação de Sala ]
[ Screenshot — Sala de Cinema: Player + Jitsi + Chat ]
[ GIF — Sincronização de play/pause em tempo real ]
[ GIF — Abertura do modal de QR Code ]
```

---

## 🚀 Instruções de Uso

### Pré-requisitos

- **Node.js** 18+ e **pnpm** instalados
- Banco de dados PostgreSQL (ou use o SQLite configurado no projeto)
- Variáveis de ambiente configuradas (veja `.env.example`)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/cinesync.git
cd cinesync

# 2. Instale as dependências
pnpm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais de banco e chaves

# 4. Execute as migrações do banco de dados
pnpm db:migrate

# 5. Inicie o servidor de desenvolvimento
pnpm dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Como usar

**Criando uma sala:**
1. Acesse a home e clique em **Criar Sala**
2. Digite o nome da sala e (opcionalmente) a URL do vídeo (YouTube ou MP4)
3. Você será redirecionado para a sala como **host**

**Entrando em uma sala:**
1. Clique em **Entrar em Sala** e informe o código de convite
2. Ou escaneie o **QR Code** compartilhado pelo host

**Dentro da sala:**
- O **host** controla play, pause e seek — todos os espectadores são sincronizados automaticamente
- O host pode atualizar a URL do vídeo a qualquer momento
- O painel lateral alterna entre **Chat** e **Participantes**
- O botão de **QR Code** (ícone 🔲 no cabeçalho) abre um modal para compartilhar e baixar o QR Code da sala

### Scripts disponíveis

```bash
pnpm dev          # Inicia client + server em modo desenvolvimento
pnpm build        # Build de produção
pnpm test         # Executa os testes (Vitest)
pnpm db:migrate   # Aplica as migrações do banco
```

---

## 🔗 Preview

> **Escaneie o QR Code abaixo para acessar a demonstração ao vivo:**

<div align="center">



┌─────────────────────────────┐
│ ![QR Code](assetsqrcode.png)|
|                             |
│                             │
└─────────────────────────────┘

</div>

---

## 🛠️ Stack Tecnológica

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Radix UI, Framer Motion
- **Backend:** Node.js, tRPC, WebSocket (sincronização em tempo real)
- **Banco de dados:** Drizzle ORM + PostgreSQL
- **Videoconferência:** Jitsi Meet (embed)
- **Player:** react-youtube + HTML5 Video (suporte a YouTube e MP4)
- **QR Code:** qrcode.react

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.
