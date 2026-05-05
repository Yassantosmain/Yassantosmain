import { Users, Crown, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Participant {
  userId: number;
  name: string | null;
  email?: string | null;
  joinedAt: Date | string;
  isOnline?: boolean;
}

interface ParticipantsListProps {
  participants: Participant[];
  hostId: number;
  currentUserId: number;
}

function getInitials(name: string | null, email?: string | null): string {
  if (name) return name.slice(0, 2).toUpperCase();
  if (email) return email.slice(0, 2).toUpperCase();
  return "??";
}

function getAvatarColor(userId: number): string {
  const colors = [
    "bg-blue-500/20 text-blue-400",
    "bg-purple-500/20 text-purple-400",
    "bg-green-500/20 text-green-400",
    "bg-orange-500/20 text-orange-400",
    "bg-pink-500/20 text-pink-400",
    "bg-cyan-500/20 text-cyan-400",
  ];
  return colors[userId % colors.length];
}

export default function ParticipantsList({ participants, hostId, currentUserId }: ParticipantsListProps) {
  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/40">
        <Users className="w-3.5 h-3.5 text-gold" />
        <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
          Participantes
        </span>
        <span className="ml-auto text-xs text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5">
          {participants.length}
        </span>
      </div>

      <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
        {participants.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            Nenhum participante ainda
          </p>
        )}

        {participants.map((p) => {
          const isHost = p.userId === hostId;
          const isCurrentUser = p.userId === currentUserId;
          const initials = getInitials(p.name, p.email);
          const avatarColor = getAvatarColor(p.userId);

          return (
            <div
              key={p.userId}
              className={cn(
                "flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-colors",
                isCurrentUser ? "bg-gold/5" : "hover:bg-muted/30"
              )}
            >
              {/* Avatar */}
              <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0", avatarColor)}>
                {initials}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-foreground truncate">
                    {p.name || p.email || "Anônimo"}
                  </span>
                  {isCurrentUser && (
                    <span className="text-[10px] text-muted-foreground">(você)</span>
                  )}
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {isHost && (
                  <Crown className="w-3 h-3 text-gold" />
                )}
                <div className="flex items-center gap-0.5">
                  <Wifi className="w-3 h-3 text-green-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
