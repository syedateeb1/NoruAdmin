"use client"
import { useAuth } from '@/context/AuthContext';
import { Chat, ChatRoom, Message } from '@/types/chat';
import { Search } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type Props = {
    chats: ChatRoom[];
    onSelect: (id: string) => void;
    activeId: string;
};

const ChatSideBar = ({ chats, onSelect, activeId }: Props) => {
    const [search, setSearch] = useState('')
    const [filteredChats, setFilteredChats] = useState<ChatRoom[]>(chats);
    const { user } = useAuth()

    // Helper function to get the other user (not the current user)
    const getOtherUser = (chat: ChatRoom) => {
        return chat.members.find(member => member._id !== user?._id) ?? chat.members[0];
    };

    // Helper function to get the other user's name
    const getOtherUserName = (chat: ChatRoom) => {
        const otherUser = getOtherUser(chat);
        return otherUser
            ? `${otherUser.first_name} ${otherUser.last_name}`
            : 'Unknown User';
    };

    // Helper function to get the other user's profile image
    const getOtherUserImage = (chat: ChatRoom) => {
        const otherUser = getOtherUser(chat);
        return otherUser?.profile_image || '/images/default-avatar.png'; // fallback image
    };
    // ✅ handle click - reset unread count for selected chat
    const handleChatClick = (chatId: string) => {
        setFilteredChats(prev =>
            prev.map(chat =>
                chat._id === chatId
                    ? { ...chat, unread_count: 0 } // reset unread count
                    : chat
            )
        );
        onSelect(chatId);
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search === '') {
                setFilteredChats(chats);
            } else {
                const filtered = chats.filter((chat) => {
                    const otherUserName = getOtherUserName(chat).toLowerCase();
                    return otherUserName.includes(search.toLowerCase());
                });
                setFilteredChats(filtered);
            }
        }, 300); // debounce

        return () => clearTimeout(timer);
    }, [search, chats, user?._id]); // Add user._id to dependencies

    return (
        <div className="w-80 flex flex-col h-full bg-white border-r">
            <div className='mx-6 space-y-4'>
                <h3 className='text-xl font-bold text-black mt-2'>Chats</h3>
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
                {filteredChats.map((chat) => {
                    const otherUser = getOtherUser(chat);
                    const otherUserName = getOtherUserName(chat);
                    const otherUserImage = getOtherUserImage(chat);

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