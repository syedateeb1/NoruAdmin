"use client"
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { getMessages, sendMessage } from '@/services/chatService';
import { ChatRoom } from '@/types/chat';
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

export const ChatContainer = (
    chat: ChatRoom & { onReadChat?: (id: string) => void }
) => {
    const { user } = useAuth()
    const { socket, isConnected } = useSocket(); // 👈 use socket

    const [message, setMessage] = useState(''); // track input
    const [messages, setMessages] = useState<any[]>([]); // chat messages list
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);


    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);


    // Scroll to bottom for new messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

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
    const userData = getOtherUser(chat);
    const userName = getOtherUserName(chat);
    const userImage = getOtherUserImage(chat);



    // Fetch messages
    const fetchMessages = React.useCallback(async (pageNum: number) => {
        try {
            setLoading(true);
            const query = `chatroom_id=${chat._id}&page=${pageNum}&limit=10`;
            const resMessages = await getMessages(query);

            if (resMessages?.length > 0) {
                if (pageNum === 1) {
                    setMessages(resMessages);
                    scrollToBottom();
                } else {
                    setMessages((prev) => [...resMessages, ...prev]);
                }
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error('Failed to fetch messages', err);
        } finally {
            setLoading(false);
        }
    }, [chat._id]);



    // Infinite scroll (load older msgs when scroll top)
    const handleScroll = () => {
        if (!containerRef.current || loading || !hasMore) return;

        if (containerRef.current.scrollTop === 0) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchMessages(nextPage);
        }
    };

    // Check if user is near bottom
    const isUserNearBottom = () => {
        if (!containerRef.current) return false;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        return scrollHeight - scrollTop - clientHeight < 100; // within 100px
    };
    // Send message handler
    const handleSend = async () => {
        if (!message.trim()) return; // prevent empty message
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('text', message);
            formData.append('is_support', 'true');
            formData.append("chatroom_ids[]", chat._id);

            const res = await sendMessage(formData);

            // Optimistically add message to UI
            // setMessages((prev) => [...prev, res]);
            setMessage('');

            // Immediately mark as read so unread_count stays 0 on server
            socket?.emit("read", { chatroom_id: chat._id, user_id: user?._id, message_id: res._id });
        } catch (err) {
            console.error('Failed to send message', err);
        } finally {
            setLoading(false);
        }
    };

    // After new messages are loaded, check if container still doesn’t scroll
    useEffect(() => {
        if (!containerRef.current || loading || !hasMore) return;

        const container = containerRef.current;
        // If content height <= container height => fetch more automatically
        if (container.scrollHeight <= container.clientHeight) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchMessages(nextPage);
        }
    }, [messages, hasMore, loading, page, fetchMessages]);
    // Attach scroll listener
    useEffect(() => {
        const div = containerRef.current;
        if (!div) return;

        div.addEventListener("scroll", handleScroll);
        return () => div.removeEventListener("scroll", handleScroll);
    });
    useEffect(() => {
        if (isUserNearBottom()) {
            scrollToBottom();
        }
    }, [messages]);
    // Fetch old messages
    useEffect(() => {
        setMessages([]);
        setPage(1);
        setHasMore(true);
        fetchMessages(1);
    }, [chat._id, fetchMessages]);

    useEffect(() => {
        if (!socket || !chat?._id || !user?._id) return;
        // ✅ Join the current room
        socket.emit("join-room", chat._id);

        // ✅ Mark as read when chat opens
        socket.emit("read", chat._id);
        chat.onReadChat?.(chat._id); // update sidebar badge

        const handleNewMessage = (data: any) => {
            const roomId = data.chatroom_id || data.chatroom?._id || data.room_id;

            // Ignore if not the current chat
            if (roomId !== chat._id) return;

            // ✅ Append only if not already added
            setMessages((prev) => {
                if (prev.some((m) => m._id === data._id)) return prev;
                return [...prev, data];
            });

            scrollToBottom();

            // ✅ Mark message as read immediately
            socket.emit("read", chat._id);

            // ✅ Update sidebar’s unread counter
            chat.onReadChat?.(chat._id);
        };

        // Listen for new messages
        socket.on("messages", handleNewMessage);

        return () => {
            socket.off("messages", handleNewMessage);
            socket.emit("leave-room", chat._id); // optional
        };
    }, [socket, chat, user?._id]);


    // OPTIONAL: whenever the last message in this chat changes (e.g., page fetch),
    // send a read ack (covers initial fetch and edge cases)
    useEffect(() => {
        if (!socket || !chat?._id || !user?._id) return;
        const last = messages[messages.length - 1];
        if (last?._id) {
            socket.emit("read", { chatroom_id: chat._id, user_id: user._id, message_id: last._id });
        }
    }, [messages, socket, chat._id, user?._id]);
    // Sort messages by time (ascending)
    const sortedMessages = [...messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return (
        <div className="relative flex-1 flex flex-col h-full w-full overflow-hidden">
            {/* Header */}
            <div className="w-full py-4 px-4 bg-white flex">
                <div className="flex flex-col ml-3 mt-1">
                    <h3 className="text-base font-bold text-black">{userName}</h3>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={containerRef}
                className="flex-1 flex flex-col px-4 mt-4 overflow-y-auto scrollbar-hide pb-24"
            >
                {/* Show spinner at top when fetching older messages */}
                {loading && messages.length > 0 && (
                    <p className="text-center text-gray-400 text-xs my-2">Loading...</p>
                )}



                {/* Sorted messages (oldest → newest) */}
                {sortedMessages.map((msg, key) => {
                    const isOwnMessage = msg.sender_id?._id === user?._id;
                    return (
                        <div
                            key={key}
                            className={`p-2 rounded-2xl mb-2 max-w-xs break-words ${isOwnMessage
                                ? "bg-blue-500 text-white self-end"
                                : "bg-gray-200 text-black self-start"
                                }`}
                        >
                            {msg.text}
                            {/* <div className="text-[10px] text-gray-200 mt-1 text-right">
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </div> */}
                        </div>
                    );
                })}
                {loading && messages.length === 0 && (
                    <p className="text-center text-gray-400">Loading...</p>
                )}
                {!hasMore && (
                    <p className="text-center text-gray-400 text-xs my-2">
                        No more messages
                    </p>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Bottom Bar */}
            <div className="absolute bottom-0 left-0 w-full bg-white h-20 p-4 border-t border-gray-200">
                <div className="flex gap-2 h-full items-center">
                    <div className="relative bg-gray-100 rounded-full flex-1 h-full flex items-center px-3">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="w-full bg-transparent outline-none text-black placeholder:text-gray-400 placeholder:font-semibold placeholder:text-lg"
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="relative bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer disabled:opacity-50"
                    >
                        <span className="text-white font-bold">➤</span>
                    </button>
                </div>
            </div>
        </div>
    )
}