# CineSync - Sala de Cinema Virtual

## Backend

- [x] Schema: tabela `rooms` (id, code, name, hostId, videoUrl, videoState, createdAt)
- [x] Schema: tabela `room_participants` (id, roomId, userId, joinedAt, isActive)
- [x] Schema: tabela `chat_messages` (id, roomId, userId, content, createdAt)
- [x] Migração e aplicação do schema no banco de dados
- [x] DB helpers: createRoom, getRoomByCode, getRoomById, updateRoomVideo
- [x] DB helpers: addParticipant, removeParticipant, getParticipants
- [x] DB helpers: addChatMessage, getChatMessages
- [x] tRPC router: rooms.create (protectedProcedure)
- [x] tRPC router: rooms.join (protectedProcedure)
- [x] tRPC router: rooms.get (protectedProcedure)
- [x] tRPC router: rooms.leave (protectedProcedure)
- [x] tRPC router: rooms.setVideo (protectedProcedure, host only)
- [x] tRPC router: chat.send (protectedProcedure)
- [x] tRPC router: chat.list (protectedProcedure)
- [x] WebSocket server: sincronização de play/pause/seek em tempo real
- [x] WebSocket: broadcast de mensagens de chat
- [x] WebSocket: broadcast de lista de participantes ativos

## Frontend - Páginas

- [x] Landing page elegante com CTA de entrar/criar sala
- [x] Página de criação de sala (nome + URL do vídeo)
- [x] Página de entrada em sala por código de convite
- [x] Página da sala de cinema (player + Jitsi + chat + participantes)
- [x] Página 404 personalizada

## Frontend - Componentes

- [x] VideoPlayer: suporte a YouTube (react-youtube) e MP4 (HTML5 video)
- [x] VideoPlayer: controles de host (play/pause/seek) e modo espectador
- [x] JitsiMeet: embed da API do Jitsi Meet na sala
- [x] ChatPanel: lista de mensagens + input de envio
- [x] ParticipantsList: lista com status de conexão em tempo real
- [x] RoomHeader: nome da sala, código de convite copiável, botão de sair
- [x] InviteCode: componente de código copiável com feedback visual
- [x] VideoUrlInput: input para definir URL do vídeo (host only)

## Design

- [x] Tema dark cinematográfico (preto profundo, dourado, cinza escuro)
- [x] Tipografia premium (fonte serif para títulos, sans-serif para corpo)
- [x] Microinterações: hover, focus, transições suaves
- [x] Layout responsivo da sala de cinema
- [x] Animações de entrada nas páginas
- [x] Efeitos de glassmorphism nos painéis laterais

## Testes

- [x] Teste: rooms.create cria sala com código único
- [x] Teste: rooms.join valida código e adiciona participante
- [x] Teste: chat.send persiste mensagem no banco
- [x] Teste: controle de host rejeita ação de não-host

## Melhorias Solicitadas

- [x] QR Code para compartilhamento da sala (modal com download)
