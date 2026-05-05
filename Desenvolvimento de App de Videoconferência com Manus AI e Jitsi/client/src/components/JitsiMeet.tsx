import { useEffect, useRef, useState } from "react";
import { Loader2, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JitsiMeetProps {
  roomCode: string;
  userName: string;
  onParticipantCountChange?: (count: number) => void;
}

interface JitsiAPI {
  dispose: () => void;
  addEventListener: (event: string, handler: (data: unknown) => void) => void;
  getNumberOfParticipants: () => number;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    JitsiMeetExternalAPI: any;
  }
}

export default function JitsiMeet({ roomCode, userName, onParticipantCountChange }: JitsiMeetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<JitsiAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Load Jitsi script dynamically
    const loadJitsi = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Jitsi API"));
        document.head.appendChild(script);
      });
    };

    const initJitsi = async () => {
      try {
        await loadJitsi();
        if (!containerRef.current) return;

        // Clean up previous instance
        if (apiRef.current) {
          apiRef.current.dispose();
          apiRef.current = null;
        }

        const jitsiRoomName = `cinesync-${roomCode.toLowerCase()}`;

        apiRef.current = new window.JitsiMeetExternalAPI("meet.jit.si", {
          roomName: jitsiRoomName,
          parentNode: containerRef.current,
          width: "100%",
          height: "100%",
          userInfo: {
            displayName: userName,
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: false,
            disableDeepLinking: true,
            toolbarButtons: [
              "microphone",
              "camera",
              "hangup",
              "tileview",
              "settings",
            ],
            notifications: [],
            disableThirdPartyRequests: false,
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            BRAND_WATERMARK_LINK: "",
            SHOW_POWERED_BY: false,
            DISPLAY_WELCOME_PAGE_CONTENT: false,
            TOOLBAR_ALWAYS_VISIBLE: false,
            DEFAULT_BACKGROUND: "#0a0a0f",
            MOBILE_APP_PROMO: false,
            HIDE_INVITE_MORE_HEADER: true,
          },
        });

        const api = apiRef.current;
        if (!api) return;

        api.addEventListener("videoConferenceJoined", () => {
          setLoading(false);
        });

        api.addEventListener("participantJoined", () => {
          const count = apiRef.current?.getNumberOfParticipants() ?? 0;
          onParticipantCountChange?.(count);
        });

        api.addEventListener("participantLeft", () => {
          const count = apiRef.current?.getNumberOfParticipants() ?? 0;
          onParticipantCountChange?.(count);
        });

        // Fallback: hide loading after 5s
        setTimeout(() => setLoading(false), 5000);
      } catch (err) {
        console.error("[Jitsi] Error:", err);
        setError(true);
        setLoading(false);
      }
    };

    initJitsi();

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [roomCode, userName, onParticipantCountChange]);

  if (collapsed) {
    return (
      <div className="glass-panel rounded-xl p-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-medium">Videoconferência minimizada</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-gold hover:text-gold/80 text-xs"
          onClick={() => setCollapsed(false)}
        >
          Expandir
        </Button>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/40">
        <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
          Videoconferência
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground text-xs h-6 px-2"
          onClick={() => setCollapsed(true)}
        >
          Minimizar
        </Button>
      </div>

      {/* Jitsi container */}
      <div className="relative" style={{ height: "220px" }}>
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card z-10">
            <Loader2 className="w-5 h-5 text-gold animate-spin" />
            <span className="text-xs text-muted-foreground">Conectando à videoconferência...</span>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card z-10">
            <VideoOff className="w-6 h-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground text-center px-4">
              Não foi possível carregar a videoconferência. Verifique sua conexão.
            </span>
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
