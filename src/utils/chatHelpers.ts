import { ChatRoom } from "@/types/chat";

export const getOtherUser = (chat: ChatRoom, currentUserId?: string) => {
  if (Array.isArray(chat?.members)) {
    return (
      chat.members.find((m: any) => m?._id !== currentUserId) ?? chat.members[0]
    );
  }
  if (typeof chat?.members === "string") {
    return { _id: chat.members };
  }
  return null;
};

export const getOtherUserName = (chat: ChatRoom, currentUserId?: string) => {
  const otherUser = getOtherUser(chat, currentUserId);
  if (otherUser && "first_name" in otherUser) {
    return `${otherUser.first_name} ${otherUser.last_name ?? ""}`.trim();
  }
  return chat?.lastMessage?.sender_name || "Unknown User";
};

export const getOtherUserImage = (chat: ChatRoom, currentUserId?: string) => {
  const otherUser = getOtherUser(chat, currentUserId);
  return otherUser && "profile_image" in otherUser && otherUser.profile_image
    ? otherUser.profile_image
    : "/images/default-avatar.png";
};
