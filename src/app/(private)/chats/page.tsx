"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import ChatSideBar from "./_components/chat/ChatSideBar";
import { ChatContainer } from "./_components/chat/ChatContainer";
import { useEffect, useState } from "react";
import { ChatRoom } from "@/types/chat";
import { getChatRooms } from "@/services/chatService";


export default function Home() {
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [allChats, setAllChats] = useState<ChatRoom[]>([]);

  const handleSelectChat = (id: string) => {
    const chat = allChats.find((c) => c._id === id);

    if (chat) setSelectedChat(chat);
  };
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await getChatRooms('is_support=true'); // 👈 call your service

        // Access the data array from the response 

        setAllChats(res); // update state with the array
        // if (chatRooms.length > 0) setSelectedChat(chatRooms[0]); // default to first chat
      } catch (err) {
        console.error("Failed to fetch chat rooms", err);
      }
    };
    fetchChats();
  }, []);
  return (
    <>
      <ProtectedRoute>
        <div className='flex h-screen'>
          <ChatSideBar
            chats={allChats}
            onSelect={handleSelectChat}
            activeId={selectedChat?._id ?? ''}
          />
          {selectedChat && <ChatContainer {...selectedChat} />}
        </div>
      </ProtectedRoute>
    </>
  );
}
