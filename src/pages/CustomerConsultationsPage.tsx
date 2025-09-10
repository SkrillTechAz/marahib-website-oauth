import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Send,
  Clock,
  User,
  DollarSign,
  ArrowLeft,
  Home,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Wifi,
  WifiOff,
} from "lucide-react";

// Import the socket hook
import { useSocket } from "../hooks/useSocket";

interface Consultation {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  status: string;
  preferred_date: string;
  preferred_time: string;
  project_type: string;
  budget: string;
  timeline: string;
  message: string;
  created_at: string;
  designer_name?: string;
  designer_id?: string;
}

interface Message {
  id: string;
  consultation_id: string;
  sender_id: string;
  sender_type: "client" | "designer";
  message: string;
  created_at: string;
  sender_name?: string;
}

const CustomerConsultationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [consultationsLoading, setConsultationsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Socket.IO setup
  // CustomerConsultationsPage.tsx - Updated onNewMessage handler
  const {
    socket,
    isConnected,
    sendMessage,
    joinConsultation,
    leaveConsultation,
    startTyping,
    stopTyping,
  } = useSocket(
    // onNewMessage - Updated to handle optimistic message replacement
    (message: Message) => {
      console.log("📨 [Customer] New message received via socket:", message);
      setMessages((prev) => {
        // Check if this is replacing an optimistic message
        const tempMessageIndex = prev.findIndex(
          (msg) =>
            msg.id.startsWith("temp-") &&
            msg.message === message.message &&
            msg.sender_id === message.sender_id &&
            Math.abs(
              new Date(msg.created_at).getTime() -
                new Date(message.created_at).getTime()
            ) < 5000 // Within 5 seconds
        );

        if (tempMessageIndex !== -1) {
          // Replace the temporary message with the real one
          console.log(
            "🔄 [Customer] Replacing optimistic message with real message"
          );
          const newMessages = [...prev];
          newMessages[tempMessageIndex] = message;
          return newMessages.sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );
        }

        // Check if message already exists (by real ID)
        const existingIds = prev.map((msg) => msg.id);
        if (!existingIds.includes(message.id)) {
          console.log("✅ [Customer] Adding new message to UI");
          return [...prev, message].sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );
        }

        console.log("ℹ️ [Customer] Message already exists in UI");
        return prev;
      });
    },
    // onMessageSent
    (data: any) => {
      console.log("✅ [Customer] Message sent confirmation:", data);
      setSendingMessage(false);
    },
    // onMessageError
    (error: any) => {
      console.error("❌ [Customer] Socket message error:", error);
      setSendingMessage(false);
      alert(`Failed to send message: ${error.error || "Unknown error"}`);
    },
    // onUserTyping
    (data: any) => {
      if (data.consultation_id === selectedConsultation?.id) {
        setTypingUsers((prev) =>
          prev.includes(data.user_name) ? prev : [...prev, data.user_name]
        );
      }
    },
    // onUserStoppedTyping
    (data: any) => {
      if (data.consultation_id === selectedConsultation?.id) {
        setTypingUsers((prev) =>
          prev.filter((user) => user !== data.user_name)
        );
      }
    }
  );

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Join/leave consultation rooms when selection changes
  useEffect(() => {
    if (selectedConsultation && isConnected) {
      joinConsultation(selectedConsultation.id);

      return () => {
        leaveConsultation(selectedConsultation.id);
      };
    }
  }, [selectedConsultation, isConnected, joinConsultation, leaveConsultation]);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/signin", {
          state: { message: "Please sign in to access your consultations." },
        });
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData.user);
        } else {
          localStorage.removeItem("access_token");
          navigate("/signin", {
            state: { message: "Session expired. Please sign in again." },
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.removeItem("access_token");
        navigate("/signin", {
          state: { message: "An error occurred. Please sign in again." },
        });
      }
    };

    checkAuth();
  }, [navigate]);

  // Fetch consultations for the current user
  const fetchConsultations = useCallback(async () => {
    if (!currentUser?.id) return;

    try {
      setConsultationsLoading(true);
      console.log("Fetching consultations for user:", currentUser.id);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/consultations?userId=${
          currentUser.id
        }`
      );
      console.log("Consultations API response status:", response.status);

      const result = await response.json();
      console.log("Consultations API result:", result);

      if (result.result === "success") {
        setConsultations(result.data || []);
        console.log("Set consultations:", result.data);

        // Auto-select first consultation if none selected
        if (result.data && result.data.length > 0 && !selectedConsultation) {
          setSelectedConsultation(result.data[0]);
          console.log("Auto-selected consultation:", result.data[0]);
        }
      } else {
        console.error("Failed to fetch consultations:", result);
      }
    } catch (error) {
      console.error("Error fetching consultations:", error);
    } finally {
      setConsultationsLoading(false);
    }
  }, [currentUser, selectedConsultation]);

  // Fetch messages for selected consultation
  const fetchMessages = useCallback(async () => {
    if (!selectedConsultation) {
      setMessages([]);
      return;
    }

    try {
      console.log(
        "Fetching messages for consultation:",
        selectedConsultation.id
      );
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/consultations/${
          selectedConsultation.id
        }/messages`
      );
      console.log("Messages API response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        const fetchedMessages = data.messages || [];
        console.log("Fetched messages from API:", fetchedMessages);

        // Create initial message from consultation.message
        const initialMessage: Message = {
          id: "initial",
          consultation_id: selectedConsultation.id,
          sender_id: selectedConsultation.client_email, // Use email as identifier for initial message
          sender_type: "client",
          message: selectedConsultation.message,
          created_at: selectedConsultation.created_at,
          sender_name: selectedConsultation.client_name,
        };

        // Add sender names to real messages and ensure proper typing
        const messagesWithNames = fetchedMessages.map((msg: any) => ({
          id: msg.id,
          consultation_id: msg.consultation_id,
          sender_id: msg.sender_id,
          sender_type: msg.sender_type as "client" | "designer",
          message: msg.message,
          created_at: msg.created_at,
          sender_name:
            msg.sender_type === "client"
              ? selectedConsultation.client_name
              : selectedConsultation.designer_name || "Designer",
        }));

        // Combine initial message with real messages, sorted by date
        const allMessages = [initialMessage, ...messagesWithNames].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        console.log("Setting combined messages:", allMessages);
        console.log("Total messages count:", allMessages.length);
        setMessages(allMessages);
      } else {
        console.error("Failed to fetch messages:", response.status);
        const errorData = await response.text();
        console.error("Error details:", errorData);

        // If API fails, still show the initial message
        const initialMessage: Message = {
          id: "initial",
          consultation_id: selectedConsultation.id,
          sender_id: selectedConsultation.client_email,
          sender_type: "client",
          message: selectedConsultation.message,
          created_at: selectedConsultation.created_at,
          sender_name: selectedConsultation.client_name,
        };
        setMessages([initialMessage]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      // If there's an error, still show the initial message
      const initialMessage: Message = {
        id: "initial",
        consultation_id: selectedConsultation.id,
        sender_id: selectedConsultation.client_email,
        sender_type: "client",
        message: selectedConsultation.message,
        created_at: selectedConsultation.created_at,
        sender_name: selectedConsultation.client_name,
      };
      setMessages([initialMessage]);
    }
  }, [selectedConsultation]);

  // Debug: Log messages when they change
  useEffect(() => {
    console.log("Messages state updated:", messages);
  }, [messages]);

  // Fetch consultations when component mounts
  useEffect(() => {
    if (currentUser) {
      fetchConsultations();
    }
  }, [currentUser, fetchConsultations]);

  // Fetch messages when consultation changes
  useEffect(() => {
    fetchMessages();
  }, [selectedConsultation, fetchMessages]);

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        localStorage.removeItem("access_token");
        navigate("/signin", {
          state: { message: "You have been successfully logged out." },
        });
      } else {
        console.error("Logout failed");
        localStorage.removeItem("access_token");
        navigate("/signin");
      }
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("access_token");
      navigate("/signin");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConsultation || !currentUser) return;

    setSendingMessage(true);
    const messageText = newMessage.trim();
    setNewMessage(""); // Clear input immediately for better UX

    try {
      console.log("📤 [Customer] Sending message via Socket.IO:", {
        consultationId: selectedConsultation.id,
        userId: currentUser.id,
        message: messageText,
        socketConnected: isConnected,
      });

      // Send message via Socket.IO for real-time communication
      if (isConnected) {
        // Add message to UI immediately (optimistic update)
        const optimisticMessage: Message = {
          id: `temp-${Date.now()}`, // Temporary ID
          consultation_id: selectedConsultation.id,
          sender_id: currentUser.id,
          sender_type: "client",
          message: messageText,
          created_at: new Date().toISOString(),
          sender_name: selectedConsultation.client_name,
        };

        console.log(
          "✨ [Customer] Adding optimistic message to UI:",
          optimisticMessage
        );
        setMessages((prev) => {
          const existingIds = prev.map((msg) => msg.id);
          if (!existingIds.includes(optimisticMessage.id)) {
            return [...prev, optimisticMessage].sort(
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            );
          }
          return prev;
        });

        // Send via Socket.IO
        sendMessage({
          consultation_id: selectedConsultation.id,
          sender_id: currentUser.id,
          sender_type: "client",
          message: messageText,
          sender_name: selectedConsultation.client_name,
        });

        // Don't set setSendingMessage(false) here - wait for confirmation
      } else {
        // Fallback: If socket not connected, use direct API call
        console.warn(
          "⚠️ [Customer] Socket not connected, using direct API call"
        );

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/consultations/${
            selectedConsultation.id
          }/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: messageText,
              sender_id: currentUser.id,
              sender_type: "client",
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("📡 [Customer] Message sent via API fallback:", result);

          // Add message to UI immediately
          const sentMessage: Message = {
            id: result.message?.id || `temp-${Date.now()}`,
            consultation_id: selectedConsultation.id,
            sender_id: currentUser.id,
            sender_type: "client",
            message: messageText,
            created_at: result.message?.created_at || new Date().toISOString(),
            sender_name: selectedConsultation.client_name,
          };

          setMessages((prev) => {
            const existingIds = prev.map((msg) => msg.id);
            if (!existingIds.includes(sentMessage.id)) {
              return [...prev, sentMessage].sort(
                (a, b) =>
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime()
              );
            }
            return prev;
          });
        } else {
          const errorResult = await response.json();
          console.error(
            "❌ [Customer] Failed to send message via API:",
            errorResult
          );
          alert(
            `Failed to send message: ${errorResult.error || "Unknown error"}`
          );
          setNewMessage(messageText); // Restore message on error
        }
        setSendingMessage(false);
      }
    } catch (error) {
      console.error("❌ [Customer] Error sending message:", error);
      alert("Error sending message. Please check your connection.");
      setNewMessage(messageText); // Restore message on error
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConsultationSelect = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setMessages([]);
  };

  // Helper functions
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get user info
  const user = {
    name: currentUser?.user_metadata?.first_name
      ? `${currentUser.user_metadata.first_name} ${
          currentUser.user_metadata.last_name || ""
        }`.trim()
      : currentUser?.email?.split("@")[0] || "User",
    email: currentUser?.email || "user@example.com",
    avatar:
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=150&h=150",
    tier: "Gold",
  };

  // If user is not loaded yet, show loading
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading consultations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  My Consultations
                </h1>
                <p className="text-gray-600">
                  Chat with designers about your projects
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Connection Status Indicator */}
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600 font-medium">Offline Mode</span>
                  </>
                )}
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {consultations.length} total consultations
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="hidden md:block">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.tier} Member</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Logout"
              >
                {isLoggingOut ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogOut className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - My Consultations */}
          <div className="col-span-4">
            <div className="bg-white rounded-lg shadow-sm h-full">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">
                    My Consultation Requests
                  </h3>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {consultations.length}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-0">
                <div 
                  className={`space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 ${
                    consultations.length > 10 ? 'max-h-[calc(100vh-320px)]' : 'max-h-full'
                  }`}
                >
                  {consultationsLoading ? (
                    <div className="p-6 text-center text-gray-500">
                      <div className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-2"></div>
                      <p>Loading consultations...</p>
                    </div>
                  ) : consultations.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No consultations yet</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Your consultation requests will appear here
                      </p>
                    </div>
                  ) : (
                    consultations.map((consultation) => (
                      <div
                        key={consultation.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                          selectedConsultation?.id === consultation.id
                            ? "bg-blue-50 border-l-4 border-l-blue-500"
                            : ""
                        }`}
                        onClick={() => handleConsultationSelect(consultation)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-gray-900 truncate">
                                {consultation.designer_name || "Designer"}
                              </p>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  consultation.status
                                )}`}
                              >
                                {consultation.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate mb-2">
                              {consultation.project_type} • {consultation.budget}
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDate(consultation.preferred_date)} at{" "}
                              {consultation.preferred_time}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Chat */}
          <div className="col-span-8">
            <div className="bg-white rounded-lg shadow-lg h-full border-0 flex flex-col">
              {selectedConsultation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {selectedConsultation.designer_name || "Designer"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Interior Designer
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          selectedConsultation.status
                        )}`}
                      >
                        {selectedConsultation.status}
                      </span>
                    </div>

                    {/* Consultation Details */}
                    <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <User className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Project Type</p>
                        <p className="text-sm font-semibold">
                          {selectedConsultation.project_type}
                        </p>
                      </div>
                      <div className="text-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Budget</p>
                        <p className="text-sm font-semibold">
                          {selectedConsultation.budget}
                        </p>
                      </div>
                      <div className="text-center">
                        <Clock className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Timeline</p>
                        <p className="text-sm font-semibold">
                          {selectedConsultation.timeline}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 flex flex-col p-0">
                    <div 
                      className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 p-6 space-y-4 max-h-[calc(100vh-200px)]"
                    >
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No messages in this conversation yet</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Start the conversation by sending a message!
                        </p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isClient = message.sender_type === "client";
                        const isInitialMessage = message.id === "initial";

                        return (
                          <div key={message.id}>
                            {isInitialMessage ? (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <h4 className="font-semibold text-blue-800 mb-2">
                                  Your Consultation Request
                                </h4>
                                <p className="text-sm text-blue-700">
                                  {message.message}
                                </p>
                                <p className="text-xs text-blue-600 mt-2">
                                  Submitted on {formatDate(message.created_at)}
                                </p>
                              </div>
                            ) : (
                              <div
                                className={`flex ${
                                  isClient ? "justify-end" : "justify-start"
                                } mb-4`}
                              >
                                <div
                                  className={`max-w-md ${
                                    isClient ? "order-2" : "order-1"
                                  }`}
                                >
                                  <div className="flex items-center space-x-2 mb-1">
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                        isClient
                                          ? "bg-blue-100 text-blue-600"
                                          : "bg-purple-100 text-purple-600"
                                      }`}
                                    >
                                      {getInitials(
                                        message.sender_name || "Unknown"
                                      )}
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {message.sender_name} •{" "}
                                      {formatTime(message.created_at)}
                                    </span>
                                  </div>
                                  <div
                                    className={`rounded-lg p-3 ${
                                      isClient
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 text-gray-900"
                                    }`}
                                  >
                                    <p className="text-sm">{message.message}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                    {/* Chat Input */}
                    <div className="border-t border-gray-200 p-6 flex-shrink-0">
                      <div className="flex items-center space-x-3">
                        <input
                          type="text"
                          placeholder="Write a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12"
                          disabled={sendingMessage}
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || sendingMessage}
                          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors h-12"
                        >
                          {sendingMessage ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 mb-2">
                      Select a consultation to start chatting
                    </p>
                    <p className="text-sm text-gray-500">
                      Choose a consultation from the list to begin your conversation
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerConsultationsPage;