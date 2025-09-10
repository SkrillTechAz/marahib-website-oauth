// hooks/useSocket.ts
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

interface Message {
  id: string;
  consultation_id: string;
  sender_id: string;
  sender_type: "client" | "designer";
  message: string;
  created_at: string;
  sender_name?: string;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (messageData: any) => void;
  joinConsultation: (consultationId: string) => void;
  leaveConsultation: (consultationId: string) => void;
  startTyping: (consultationId: string, userName: string) => void;
  stopTyping: (consultationId: string) => void;
}

export const useSocket = (
  onNewMessage?: (message: Message) => void,
  onMessageSent?: (message: any) => void,
  onMessageError?: (error: any) => void,
  onUserTyping?: (data: any) => void,
  onUserStoppedTyping?: (data: any) => void
): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Use refs to store the latest callbacks without triggering re-renders
  const callbackRefs = useRef({
    onNewMessage,
    onMessageSent,
    onMessageError,
    onUserTyping,
    onUserStoppedTyping,
  });

  // Update callback refs when callbacks change
  useEffect(() => {
    callbackRefs.current = {
      onNewMessage,
      onMessageSent,
      onMessageError,
      onUserTyping,
      onUserStoppedTyping,
    };
  });

  useEffect(() => {
    // Connect to the SEPARATE Socket.IO server (port 3001)
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
    
    console.log('🔌 Attempting to connect to Socket.IO server:', socketUrl);

    // Initialize socket connection - NO PATH needed for separate server
    socketRef.current = io(socketUrl, {
      // Remove path since we're connecting to root of socket server
      transports: ['polling', 'websocket'], // Start with polling, then upgrade
      autoConnect: true,
      forceNew: true,
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      upgrade: true,
      // Add extra headers for CORS if needed
      extraHeaders: {
        "Access-Control-Allow-Origin": "https://marahib-website-nine.vercel.app",
        "Access-Control-Allow-Credentials": "true"
      }
    });

    const socket = socketRef.current;

    // Connection events with detailed logging
    socket.on("connect", () => {
      console.log("✅ Socket connected successfully:", socket.id);
      console.log("🚀 Transport:", socket.io.engine?.transport?.name);
      console.log("🌐 Connected to:", socketUrl);
      setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
      console.error("Error details:", {
        message: error.message,
        type: error.type,
        description: error.description,
        url: socketUrl
      });
      setIsConnected(false);
    });

    // Reconnection events
    socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
      setIsConnected(true);
    });

    socket.on("reconnect_attempt", (attemptNumber) => {
      console.log("🔄 Socket reconnection attempt:", attemptNumber);
    });

    socket.on("reconnect_error", (error) => {
      console.error("❌ Socket reconnection error:", error);
    });

    // Message events - using callback refs to avoid dependency issues
    socket.on("new-message", (message: Message) => {
      console.log("📨 Received new message:", message);
      callbackRefs.current.onNewMessage?.(message);
    });

    socket.on("message-sent", (data: any) => {
      console.log("✅ Message sent confirmation:", data);
      callbackRefs.current.onMessageSent?.(data);
    });

    socket.on("message-error", (error: any) => {
      console.error("❌ Message error:", error);
      callbackRefs.current.onMessageError?.(error);
    });

    // Room events
    socket.on("joined-consultation", (data: any) => {
      console.log("👥 Joined consultation:", data);
    });

    socket.on("left-consultation", (data: any) => {
      console.log("👋 Left consultation:", data);
    });

    // Typing events - using callback refs
    socket.on("user-typing", (data: any) => {
      console.log("⌨️ User typing:", data);
      callbackRefs.current.onUserTyping?.(data);
    });

    socket.on("user-stopped-typing", (data: any) => {
      console.log("⌨️ User stopped typing:", data);
      callbackRefs.current.onUserStoppedTyping?.(data);
    });

    // Error events
    socket.on("error", (error: any) => {
      console.error("❌ Socket error:", error);
    });

    // Test the connection after a short delay
    setTimeout(() => {
      console.log("🔍 Socket status check:", {
        connected: socket.connected,
        id: socket.id,
        transport: socket.io.engine?.transport?.name,
        url: socketUrl
      });
    }, 2000);

    // Cleanup on unmount
    return () => {
      console.log("🧹 Cleaning up socket connection");
      socket.disconnect();
    };
  }, []); // Empty dependency array - only run once on mount

  const sendMessage = (messageData: any) => {
    if (socketRef.current && isConnected) {
      console.log("📤 Sending message via socket:", messageData);
      socketRef.current.emit("send-message", messageData);
    } else {
      console.error("❌ Socket not connected, cannot send message");
      callbackRefs.current.onMessageError?.({ error: "Not connected to server" });
    }
  };

  const joinConsultation = (consultationId: string) => {
    if (socketRef.current && isConnected) {
      console.log("👥 Joining consultation:", consultationId);
      socketRef.current.emit("join-consultation", consultationId);
    } else {
      console.error("❌ Socket not connected, cannot join consultation");
    }
  };

  const leaveConsultation = (consultationId: string) => {
    if (socketRef.current && isConnected) {
      console.log("👋 Leaving consultation:", consultationId);
      socketRef.current.emit("leave-consultation", consultationId);
    } else {
      console.error("❌ Socket not connected, cannot leave consultation");
    }
  };

  const startTyping = (consultationId: string, userName: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("typing-start", {
        consultation_id: consultationId,
        user_name: userName,
      });
    }
  };

  const stopTyping = (consultationId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("typing-stop", {
        consultation_id: consultationId,
      });
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    sendMessage,
    joinConsultation,
    leaveConsultation,
    startTyping,
    stopTyping,
  };
};