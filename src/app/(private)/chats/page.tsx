"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import ChatSideBar from "./_components/chat/ChatSideBar";
import { ChatContainer } from "./_components/chat/ChatContainer";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChatRoom } from "@/types/chat";
import { getChatRooms } from "@/services/chatService";
import { Menu } from "lucide-react";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/20/solid";


export default function Home() {

  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [allChats, setAllChats] = useState<ChatRoom[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 👈 sidebar toggle state
  const [loading, setLoading] = useState(true);


  // ✅ Fetch chats (memoized to prevent unnecessary re-creation)
  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getChatRooms("is_support=true");
      setAllChats(response || []);
    } catch (error) {
      console.error("❌ Failed to fetch chat rooms:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Initial fetch on mount
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleMarkAsRead = useCallback((chatId: string) => {

    setAllChats((prev) =>
      prev.map((c) =>
        c._id === chatId ? { ...c, unread_count: 0 } : c
      )
    );

  }, []);

  const handleSelectChat = useCallback((id: string) => {
    // console.log({ id })
    const chat = allChats.find((c) => c._id === id);
    // console.log({ chat })
    if (chat) setSelectedChat(chat);
  },
    [allChats]
  );


  const setSideBar = (status: boolean) => {
    // setIsSidebarOpen(status)
    console.log("🚀 ~ file: page.tsx:68 ~ setSideBar ~ isSidebarOpen:", isSidebarOpen)
  }

  const chatList = useMemo(() => allChats, [allChats]);

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
            loading={loading}
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
            {selectedChat ? (
              <ChatContainer
                {...selectedChat}
                onReadChat={handleMarkAsRead}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                {loading ? "Loading chats..." : "Select a chat to start messaging"}
              </div>
            )}

          </div>
        </div>
      </ProtectedRoute>
    </>
  );
}
