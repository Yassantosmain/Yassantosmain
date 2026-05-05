import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { getSocket } from "@/hooks/useSocket";
import VideoPlayer from "@/components/VideoPlayer";
import JitsiMeet from "@/components/JitsiMeet";
import ChatPanel, { ChatMessage } from "@/components/ChatPanel";
import ParticipantsList, { Participant } from "@/components/ParticipantsList";
import InviteCode from "@/components/InviteCode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Clapperboard,
  LogOut,
  Link2,
  X,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Crown,
  Film,
  QrCode,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import QRCodeComponent from "@/components/QRCode";

interface VideoState {
  state: "playing" | "paused";
  currentTime: number;
  url: string;
}

export default function CinemaRoom() {
  const { code } = useParams<{ code: string }>();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  // Room data
  const roomQuery = trpc.rooms.get.useQuery({ code: code ?? "" }, { enabled: !!code && isAuthenticated });
  const room = roomQuery.data;
  const isHost = room?.hostId === user?.id;

  // Video state (driven by WebSocket)
  const [videoState, setVideoState] = useState<VideoState>({
    state: "paused",
    currentTime: 0,
    url: "",
  });

  // Chat
  const chatQuery = trpc.chat.list.useQuery(
    { roomId: room?.id ?? 0 },
    { enabled: !!room?.id }
  );
  const sendChatMutation = trpc.chat.send.useMutation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Participants
  const participantsQuery = trpc.rooms.participants.useQuery(
    { roomId: room?.id ?? 0 },
    { enabled: !!room?.id, refetchInterval: 10000 }
  );
  const [participants, setParticipants] = useState<Participant[]>([]);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const setVideoMutation = trpc.rooms.setVideo.useMutation();
  const leaveRoomMutation = trpc.rooms.leave.useMutation();

  const socketRef = useRef(getSocket());
  const joinedRef = useRef(false);

  // ── Initialize from room data ──────────────────────────────────────────────
  useEffect(() => {
    if (room) {
      setVideoState({
        state: room.videoState,
        currentTime: room.videoCurrentTime,
        url: room.videoUrl ?? "",
      });
      setVideoUrlInput(room.videoUrl ?? "");
    }
  }, [room]);

  useEffect(() => {
    if (chatQuery.data) {
      setMessages(
        chatQuery.data.map((m) => ({
          id: m.id,
          userId: m.userId,
          userName: m.userName,
          content: m.content,
          createdAt: m.createdAt.toISOString(),
        }))
      );
    }
  }, [chatQuery.data]);

  useEffect(() => {
    if (participantsQuery.data) {
      setParticipants(
        participantsQuery.data.map((p) => ({
          userId: p.userId,
          name: p.name,
          email: p.email,
          joinedAt: p.joinedAt,
          isOnline: true,
        }))
      );
    }
  }, [participantsQuery.data]);

  // ── Socket.IO setup ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!room || !user || joinedRef.current) return;
    const socket = socketRef.current;
    joinedRef.current = true;

    socket.emit("room:join", {
      roomId: room.id,
      userId: user.id,
      userName: user.name ?? user.email ?? "Anônimo",
    });

    // Video sync
    socket.on("video:sync", (data: { videoState: "playing" | "paused"; videoCurrentTime: number }) => {
      setVideoState((prev) => ({
        ...prev,
        state: data.videoState,
        currentTime: data.videoCurrentTime,
      }));
    });

    // Video URL change
    socket.on("video:url", (data: { videoUrl: string }) => {
      setVideoState((prev) => ({
        ...prev,
        url: data.videoUrl,
        state: "paused",
        currentTime: 0,
      }));
      setVideoUrlInput(data.videoUrl);
    });

    // Initial state on join
    socket.on("video:state", (data: { videoState: "playing" | "paused"; videoCurrentTime: number; videoUrl: string }) => {
      setVideoState({
        state: data.videoState,
        currentTime: data.videoCurrentTime,
        url: data.videoUrl ?? "",
      });
      setVideoUrlInput(data.videoUrl ?? "");
    });

    // Chat messages
    socket.on("chat:message", (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("chat:system", (data: { content: string; createdAt: string }) => {
      setMessages((prev) => [
        ...prev,
        { userName: "Sistema", content: data.content, createdAt: data.createdAt, isSystem: true },
      ]);
    });

    // Participants update
    socket.on("participants:update", (data: Participant[]) => {
      setParticipants(data);
    });

    return () => {
      socket.emit("room:leave", { roomId: room.id });
      socket.off("video:sync");
      socket.off("video:url");
      socket.off("video:state");
      socket.off("chat:message");
      socket.off("chat:system");
      socket.off("participants:update");
      joinedRef.current = false;
    };
  }, [room, user]);

  // ── Host controls ──────────────────────────────────────────────────────────
  const handlePlay = useCallback(() => {
    if (!room || !user || !isHost) return;
    const socket = socketRef.current;
    socket.emit("video:sync", {
      roomId: room.id,
      videoState: "playing",
      videoCurrentTime: videoState.currentTime,
      hostId: user.id,
      timestamp: Date.now(),
    });
    setVideoMutation.mutate({
      roomId: room.id,
      videoState: "playing",
      videoCurrentTime: videoState.currentTime,
    });
  }, [room, user, isHost, videoState.currentTime, setVideoMutation]);

  const handlePause = useCallback(() => {
    if (!room || !user || !isHost) return;
    const socket = socketRef.current;
    socket.emit("video:sync", {
      roomId: room.id,
      videoState: "paused",
      videoCurrentTime: videoState.currentTime,
      hostId: user.id,
      timestamp: Date.now(),
    });
    setVideoMutation.mutate({
      roomId: room.id,
      videoState: "paused",
      videoCurrentTime: videoState.currentTime,
    });
  }, [room, user, isHost, videoState.currentTime, setVideoMutation]);

  const handleSeek = useCallback((time: number) => {
    if (!room || !user || !isHost) return;
    const socket = socketRef.current;
    socket.emit("video:sync", {
      roomId: room.id,
      videoState: videoState.state,
      videoCurrentTime: time,
      hostId: user.id,
      timestamp: Date.now(),
    });
    setVideoMutation.mutate({
      roomId: room.id,
      videoState: videoState.state,
      videoCurrentTime: time,
    });
  }, [room, user, isHost, videoState.state, setVideoMutation]);

  const handleSetVideoUrl = () => {
    if (!room || !user || !isHost) return;
    const url = videoUrlInput.trim();
    if (!url) return;
    const socket = socketRef.current;
    socket.emit("video:url", { roomId: room.id, videoUrl: url, hostId: user.id });
    setVideoMutation.mutate({ roomId: room.id, videoUrl: url, videoState: "paused", videoCurrentTime: 0 });
    setShowUrlInput(false);
    toast.success("Vídeo atualizado!");
  };

  const handleSendChat = (content: string) => {
    if (!room || !user) return;
    const msg: ChatMessage = {
      userId: user.id,
      userName: user.name ?? user.email ?? "Anônimo",
      content,
      createdAt: new Date().toISOString(),
    };
    // Optimistic update
    setMessages((prev) => [...prev, msg]);
    // Broadcast via socket
    const socket = socketRef.current;
    socket.emit("chat:message", { ...msg, roomId: room.id });
    // Persist
    sendChatMutation.mutate({ roomId: room.id, content });
  };

  const handleLeave = async () => {
    if (!room) return;
    await leaveRoomMutation.mutateAsync({ roomId: room.id });
    socketRef.current.emit("room:leave", { roomId: room.id });
    navigate("/");
    toast.info("Você saiu da sala");
  };

  // ── Auth guard ─────────────────────────────────────────────────────────────
  if (authLoading || roomQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
          <p className="text-muted-foreground text-sm">Carregando sala...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  if (roomQuery.isError || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Film className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-semibold mb-2">Sala não encontrada</h2>
          <p className="text-muted-foreground mb-6">Esta sala não existe ou foi encerrada.</p>
          <Button onClick={() => navigate("/")} className="bg-gold text-primary-foreground hover:bg-gold/90">
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 h-14 border-b border-border/40 glass-panel flex items-center px-4 gap-3 z-20">
        <div className="flex items-center gap-2">
          <Clapperboard className="w-4 h-4 text-gold" />
          <span className="font-serif text-sm font-semibold hidden sm:block">CineSync</span>
        </div>

        <div className="w-px h-5 bg-border/60 mx-1" />

        <div className="flex items-center gap-2 min-w-0">
          <h1 className="font-serif text-base font-semibold truncate">{room.name}</h1>
          {isHost && (
            <span className="flex items-center gap-1 text-xs text-gold bg-gold/10 border border-gold/20 rounded-full px-2 py-0.5 flex-shrink-0">
              <Crown className="w-2.5 h-2.5" />
              Host
            </span>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <InviteCode code={room.code} compact />

          {isHost && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-muted-foreground hover:text-foreground h-8 px-2.5 hidden sm:flex"
              >
                <Link2 className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-xs">Vídeo</span>
              </Button>
              <QRCodeComponent roomCode={room.code} roomName={room.name} />
            </>
          )}

          {!isHost && (
            <QRCodeComponent roomCode={room.code} roomName={room.name} />
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLeave}
            className="text-muted-foreground hover:text-destructive h-8 px-2.5"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            <span className="text-xs hidden sm:block">Sair</span>
          </Button>
        </div>
      </header>

      {/* ── URL Input Bar (host only) ────────────────────────────────────────── */}
      {showUrlInput && isHost && (
        <div className="flex-shrink-0 border-b border-border/40 bg-card/50 px-4 py-2.5 flex items-center gap-2 z-10">
          <Link2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <Input
            value={videoUrlInput}
            onChange={(e) => setVideoUrlInput(e.target.value)}
            placeholder="Cole a URL do vídeo (YouTube, MP4...)"
            className="flex-1 h-8 text-sm bg-muted/40 border-border/40 focus:border-gold/40"
            onKeyDown={(e) => { if (e.key === "Enter") handleSetVideoUrl(); }}
          />
          <Button
            size="sm"
            onClick={handleSetVideoUrl}
            className="h-8 bg-gold text-primary-foreground hover:bg-gold/90 text-xs px-3"
          >
            Definir
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowUrlInput(false)}
            className="h-8 w-8 text-muted-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Player area */}
        <div className="flex-1 flex flex-col p-4 gap-4 min-w-0 overflow-y-auto">
          {videoState.url ? (
            <VideoPlayer
              videoUrl={videoState.url}
              isHost={isHost}
              videoState={videoState.state}
              videoCurrentTime={videoState.currentTime}
              onPlay={handlePlay}
              onPause={handlePause}
              onSeek={handleSeek}
            />
          ) : (
            <div className="w-full rounded-xl border border-dashed border-border/50 bg-card/30 flex flex-col items-center justify-center gap-4 py-16 text-center" style={{ aspectRatio: "16/9" }}>
              <div className="w-16 h-16 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Film className="w-8 h-8 text-gold/60" />
              </div>
              <div>
                <p className="text-muted-foreground font-medium mb-1">Nenhum vídeo selecionado</p>
                {isHost ? (
                  <p className="text-sm text-muted-foreground/60">
                    Clique em{" "}
                    <button
                      onClick={() => setShowUrlInput(true)}
                      className="text-gold hover:text-gold/80 underline underline-offset-2"
                    >
                      Vídeo
                    </button>{" "}
                    na barra superior para definir a URL
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground/60">
                    Aguardando o host selecionar um vídeo...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Jitsi on mobile (below player) */}
          <div className="lg:hidden">
            <JitsiMeet
              roomCode={room.code}
              userName={user?.name ?? user?.email ?? "Anônimo"}
            />
          </div>
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        <div
          className={cn(
            "flex-shrink-0 border-l border-border/40 flex flex-col transition-all duration-300 overflow-hidden",
            sidebarOpen ? "w-80" : "w-0"
          )}
        >
          <div className="flex flex-col gap-3 p-3 h-full overflow-y-auto">
            {/* Jitsi */}
            <JitsiMeet
              roomCode={room.code}
              userName={user?.name ?? user?.email ?? "Anônimo"}
            />

            {/* Participants */}
            <ParticipantsList
              participants={participants}
              hostId={room.hostId}
              currentUserId={user?.id ?? 0}
            />

            {/* Invite Code */}
            <InviteCode code={room.code} />

            {/* Chat */}
            <div className="flex-1 min-h-0" style={{ minHeight: "280px" }}>
              <ChatPanel
                messages={messages}
                currentUserId={user?.id ?? 0}
                onSend={handleSendChat}
              />
            </div>
          </div>
        </div>

        {/* Sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex-shrink-0 w-5 flex items-center justify-center border-l border-border/40 bg-card/30 hover:bg-card/60 transition-colors text-muted-foreground hover:text-foreground"
        >
          {sidebarOpen ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
