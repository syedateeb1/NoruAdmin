import { useEffect } from "react";
import { ChatRoom } from "@/types/chat";
import { Socket } from "socket.io-client";

export const useSocketChats = (
  socket: Socket | null,
  userId?: string,
  activeId?: string,
  onUpdate?: (chat: ChatRoom) => void,
) => {
  useEffect(() => {
    if (!socket || !userId) return;

    const handleConnect = () => {
      socket.emit("join-room", userId);
    };

    const handleChatUpdate = (updatedChat: ChatRoom) => {
      if (onUpdate) onUpdate(updatedChat);
    };

    socket.on("connect", handleConnect);
    socket.on("chatUpdate", handleChatUpdate);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("chatUpdate", handleChatUpdate);
    };
  }, [socket, userId, activeId, onUpdate]);
};
