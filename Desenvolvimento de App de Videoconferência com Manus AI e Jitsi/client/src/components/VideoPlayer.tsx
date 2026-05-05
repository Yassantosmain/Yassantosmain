import { useEffect, useRef, useCallback, useState } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Lock } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  videoUrl: string;
  isHost: boolean;
  videoState: "playing" | "paused";
  videoCurrentTime: number;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function isYouTubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url);
}

export default function VideoPlayer({
  videoUrl,
  isHost,
  videoState,
  videoCurrentTime,
  onPlay,
  onPause,
  onSeek,
}: VideoPlayerProps) {
  const ytPlayerRef = useRef<YouTubePlayer | null>(null);
  const mp4Ref = useRef<HTMLVideoElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(videoCurrentTime);
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSyncRef = useRef<number>(0);

  const isYT = isYouTubeUrl(videoUrl);
  const ytId = isYT ? extractYouTubeId(videoUrl) : null;

  // ── Sync incoming state from WebSocket ────────────────────────────────────
  useEffect(() => {
    const now = Date.now();
    if (now - lastSyncRef.current < 300) return; // debounce rapid syncs
    lastSyncRef.current = now;

    if (isYT && ytPlayerRef.current) {
      const player = ytPlayerRef.current;
      try {
        const playerTime = player.getCurrentTime?.() ?? 0;
        if (Math.abs(playerTime - videoCurrentTime) > 1.5) {
          player.seekTo?.(videoCurrentTime, true);
        }
        if (videoState === "playing") {
          player.playVideo?.();
        } else {
          player.pauseVideo?.();
        }
      } catch {}
    } else if (mp4Ref.current) {
      const video = mp4Ref.current;
      if (Math.abs(video.currentTime - videoCurrentTime) > 1.5) {
        video.currentTime = videoCurrentTime;
      }
      if (videoState === "playing") {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
    setCurrentTime(videoCurrentTime);
  }, [videoState, videoCurrentTime, isYT]);

  // ── Time tracking for MP4 ─────────────────────────────────────────────────
  useEffect(() => {
    const video = mp4Ref.current;
    if (!video) return;
    const onTimeUpdate = () => {
      if (!isSeeking) setCurrentTime(video.currentTime);
    };
    const onDuration = () => setDuration(video.duration);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onDuration);
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onDuration);
    };
  }, [isSeeking]);

  // ── Controls auto-hide ────────────────────────────────────────────────────
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
  }, []);

  const formatTime = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (!isHost) return;
    if (videoState === "playing") {
      onPause();
    } else {
      onPlay();
    }
  };

  const handleSeek = (val: number[]) => {
    if (!isHost) return;
    const t = val[0];
    setCurrentTime(t);
    setIsSeeking(false);
    onSeek(t);
  };

  const handleVolumeChange = (val: number[]) => {
    const v = val[0];
    setVolume(v);
    if (isYT && ytPlayerRef.current) {
      ytPlayerRef.current.setVolume?.(v);
    } else if (mp4Ref.current) {
      mp4Ref.current.volume = v / 100;
    }
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (isYT && ytPlayerRef.current) {
      if (next) ytPlayerRef.current.mute?.();
      else ytPlayerRef.current.unMute?.();
    } else if (mp4Ref.current) {
      mp4Ref.current.muted = next;
    }
  };

  const handleFullscreen = () => {
    const el = document.getElementById("cinema-player-wrap");
    if (el?.requestFullscreen) el.requestFullscreen();
  };

  const ytOpts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 0 as const,
      controls: 0 as const,
      modestbranding: 1 as const,
      rel: 0 as const,
      iv_load_policy: 3 as const,
      disablekb: 1 as const,
    },
  };

  return (
    <div
      id="cinema-player-wrap"
      className="relative w-full bg-black rounded-xl overflow-hidden group"
      style={{ aspectRatio: "16/9" }}
      onMouseMove={resetControlsTimer}
      onMouseEnter={resetControlsTimer}
    >
      {/* ── Video Content ─────────────────────────────────────────────────── */}
      {isYT && ytId ? (
        <div className="absolute inset-0 pointer-events-none">
          <YouTube
            videoId={ytId}
            opts={ytOpts}
            className="w-full h-full"
            iframeClassName="w-full h-full"
            onReady={(e) => {
              ytPlayerRef.current = e.target;
              setDuration(e.target.getDuration?.() ?? 0);
              e.target.setVolume?.(volume);
            }}
            onStateChange={(e) => {
              const dur = e.target.getDuration?.() ?? 0;
              if (dur > 0) setDuration(dur);
            }}
          />
        </div>
      ) : (
        <video
          ref={mp4Ref}
          src={videoUrl}
          className="absolute inset-0 w-full h-full object-contain"
          playsInline
          onClick={handlePlayPause}
        />
      )}

      {/* ── Overlay gradient ──────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

      {/* ── Non-host lock indicator ───────────────────────────────────────── */}
      {!isHost && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 rounded-full px-3 py-1.5 text-xs text-muted-foreground">
          <Lock className="w-3 h-3" />
          Modo espectador
        </div>
      )}

      {/* ── Controls ─────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "absolute bottom-0 inset-x-0 px-4 pb-4 pt-8 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Progress bar */}
        <div className="mb-3">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.5}
            onValueChange={(v) => { if (isHost) { setCurrentTime(v[0]); setIsSeeking(true); } }}
            onValueCommit={handleSeek}
            disabled={!isHost}
            className={cn("w-full", !isHost && "opacity-60 cursor-not-allowed")}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Skip back */}
            {isHost && (
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-white hover:text-gold hover:bg-white/10"
                onClick={() => onSeek(Math.max(0, currentTime - 10))}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
            )}

            {/* Play/Pause */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-9 h-9 text-white hover:bg-white/10",
                isHost ? "hover:text-gold" : "cursor-not-allowed opacity-60"
              )}
              onClick={handlePlayPause}
              disabled={!isHost}
            >
              {videoState === "playing" ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </Button>

            {/* Skip forward */}
            {isHost && (
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-white hover:text-gold hover:bg-white/10"
                onClick={() => onSeek(Math.min(duration, currentTime + 10))}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            )}

            {/* Volume */}
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-white hover:text-gold hover:bg-white/10"
              onClick={toggleMute}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <div className="w-20 hidden sm:block">
              <Slider
                value={[muted ? 0 : volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-full"
              />
            </div>

            {/* Time */}
            <span className="text-white/70 text-xs tabular-nums hidden sm:block">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Fullscreen */}
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-white hover:text-gold hover:bg-white/10"
            onClick={handleFullscreen}
          >
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
