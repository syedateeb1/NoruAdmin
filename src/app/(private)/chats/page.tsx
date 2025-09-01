"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import ChatSideBar from "./_components/chat/ChatSideBar";
import { ChatContainer } from "./_components/chat/ChatContainer";
import { useEffect, useState } from "react";
import { ChatRoom } from "@/types/chat";
import { getChatRooms } from "@/services/chatService";
import { Menu } from "lucide-react";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/20/solid";


export default function Home() {

  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [allChats, setAllChats] = useState<ChatRoom[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 👈 sidebar toggle state

  const handleMarkAsRead = (chatId: string) => {

    setAllChats((prev) =>
      prev.map((c) =>
        c._id === chatId ? { ...c, unread_count: 0 } : c
      )
    );

  };
  useEffect(() => {
    console.log("✅ allChats updated:", allChats);
  }, [allChats]);
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


  const setSideBar = (status: boolean) => {
    setIsSidebarOpen(status)
    console.log("🚀 ~ file: page.tsx:68 ~ setSideBar ~ isSidebarOpen:", isSidebarOpen)
  }
  return (
    <>
      <ProtectedRoute>
        <div className="flex h-screen relative">
          {/* Sidebar (mobile toggle handled inside component) */}
          <ChatSideBar
            chats={allChats}
            onSelect={handleSelectChat}
            activeId={selectedChat?._id ?? ""}
            isOpen={isSidebarOpen}
            onClose={() => setSideBar(false)}
          />

          {/* Mobile top bar */}
          {!isSidebarOpen && (

            <div className="absolute top-3 left-3 z-50 md:hidden">
              <button
                onClick={() => setSideBar(true)}
                className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                <ChatBubbleBottomCenterIcon className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Chat container */}
          <div className="flex-1">
            {selectedChat && (
              <ChatContainer {...selectedChat} onReadChat={handleMarkAsRead} />
            )}
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
}
