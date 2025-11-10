import { useEffect, useState } from "react";
import { ChatRoom } from "@/types/chat";
import { getOtherUserName } from "@/utils/chatHelpers";

export const useFilteredChats = (
  chats: ChatRoom[],
  search: string,
  currentUserId?: string,
) => {
  const [filtered, setFiltered] = useState<ChatRoom[]>(chats);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!search) return setFiltered(chats);

      const lower = search.toLowerCase();
      setFiltered(
        chats.filter((chat) =>
          getOtherUserName(chat, currentUserId).toLowerCase().includes(lower),
        ),
      );
    }, 300);

    return () => clearTimeout(handler);
  }, [search, chats, currentUserId]);

  return filtered;
};
