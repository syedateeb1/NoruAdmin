"use client"
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { Chat, ChatRoom, Message } from '@/types/chat';
import { getOtherUser, getOtherUserImage, getOtherUserName } from '@/utils/chatHelpers';
import { useFilteredChats } from '@/utils/useFilteredChats';
import { Search, X } from 'lucide-react'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'

type Props = {
    chats: ChatRoom[];
    onSelect: (id: string) => void;
    activeId: string;
    isOpen: boolean;   // 👈 new prop
    onClose: () => void; // 👈 new prop
    loading?: boolean
};

const ChatSideBar = ({ chats, onSelect, activeId, isOpen, onClose, loading }: Props) => {
    const { socket } = useSocket(); // 👈 use socket

    const [search, setSearch] = useState('')
    const { user } = useAuth()


    const filteredChats = useFilteredChats(chats, search, user?._id);


    // ✅ handle click - reset unread count for selected chat
    const handleChatClick = useCallback(
        (chatId: string) => {
            socket?.emit("read", { chatroom_id: chatId, user_id: user?._id });
            onSelect(chatId);
            onClose();
        },
        [socket, user?._id, onSelect, onClose]
    );


    return (
        <div
            className={`  z-50 h-full transition-transform duration-300 
            ${isOpen ? "translate-x-0" : "-translate-x-full"} 
            w-80 flex flex-col bg-white border-r`}
        >
            <div className='mx-6 space-y-4'>
                <div className='flex items-center justify-between py-4 px-2 '>

                    <h3 className='text-xl font-bold text-black mt-2'>Chats</h3>
                    {/* <X className='cursor-pointer mt-2' onClick={onClose} /> */}
                </div>
                <div className='relative bg-pink-50 rounded-xl h-12 items-center'>
                    <input type="text" placeholder='Search users...'
                        value={search}
                        className='w-full py-2.5 px-4 ml-8  border-none bg-transparent focus:outline-none '
                        onChange={(e) => setSearch(e.target.value)} />
                    <Search className='absolute left-3 top-2.5 text-black' />
                </div>

            </div>
            <div className='bg-gray-200 h-0.5 mt-3'></div>
            <div className='flex flex-col flex-grow  overflow-y-auto scrollbar-hide mt-2'>
                {filteredChats.length === 0 && (
                    <p className="text-sm text-gray-500 px-4 py-2">No chats found.</p>
                )}
                {loading ? [...Array(5)].map((_, i) => (
                    <div key={i} className="px-4 py-3 mx-2 mb-2 h-16 flex bg-gray-50/50 flex-col gap-2">
                        <span className='px-2 py-1 animate-pulse bg-gray-100 rounded w-1/2'></span>
                        <span className='px-2 py-1 animate-pulse bg-gray-100 rounded w-1/3'></span>
                    </div>
                )) : filteredChats.map((chat) => {
                    const otherUserName = getOtherUserName(chat);

                    return (
                        <div
                            key={chat._id}
                            onClick={() => handleChatClick(chat._id)}
                            className={`flex items-center px-4 py-3 cursor-pointer ${activeId === chat._id ? "bg-cyan-50" : ""
                                }`}
                        >
                            <div className='relative'>
                                {/* <Image
                                    src={otherUserImage}
                                    width={55}
                                    height={55}
                                    alt={otherUserName}
                                    className="rounded-full"
                                /> */}
                                {/* <span className={`absolute bottom-0 right-0 w-3 h-3 ${otherUser?.status === "Online" ? "bg-green-500" : "bg-gray-500"}  border-2 border-white rounded-full`}></span> */}
                            </div>
                            <div className="ml-3 relative w-full">
                                <h3 className="text-base font-bold text-black">{otherUserName}</h3>
                                <p className="text-sm font-medium text-gray-500">
                                    {chat.lastMessage?.text || "No messages yet"}
                                </p>
                                {chat.unread_count > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {chat.unread_count}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default ChatSideBar

type ChatItemProps = {
    message: Message;
    isActive: boolean;
    onSelect: (msg: Message) => void;
};
const ChatItem = ({ message, isActive, onSelect }: ChatItemProps) => {
    return (
        <div key={message.id} className={`flex cursor-pointer ${isActive ? 'bg-cyan-50' : ''}`} onClick={() => onSelect(message)}>
            <div className='flex px-4 py-3 '>
                <Image src={'/images/user/user-03.png'} width={55} height={55} alt="User" className="size-14 rounded-full object-cover" quality={90} />
                <div className='flex flex-col ml-3 space-y-1 mt-1   '>
                    <h3 className='text-base font-bold text-black'>{message.name}</h3>
                    <p className='text-sm font-medium text-gray-500'>{message.message}</p>
                </div>
            </div>
        </div>)
}