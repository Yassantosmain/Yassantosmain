import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

let globalSocket: Socket | null = null;

export function getSocket(): Socket {
  if (!globalSocket || !globalSocket.connected) {
    globalSocket = io(window.location.origin, {
      path: "/api/socket.io",
      transports: ["websocket", "polling"],
    });
  }
  return globalSocket;
}

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = getSocket();
    return () => {
      // Don't disconnect on unmount — keep global connection alive
    };
  }, []);

  const emit = useCallback((event: string, data: unknown) => {
    const socket = socketRef.current || getSocket();
    socket.emit(event, data);
  }, []);

  const on = useCallback((event: string, handler: (...args: unknown[]) => void) => {
    const socket = socketRef.current || getSocket();
    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, []);

  const off = useCallback((event: string, handler?: (...args: unknown[]) => void) => {
    const socket = socketRef.current || getSocket();
    if (handler) {
      socket.off(event, handler);
    } else {
      socket.off(event);
    }
  }, []);

  return { emit, on, off, socket: socketRef };
}
