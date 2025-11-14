"use client"
import OptimizedImage from '@/components/OtimizedImage';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { deleteChat, getMessages, sendMessage } from '@/services/chatService';
import { ChatRoom } from '@/types/chat';
import { Trash } from 'lucide-react';
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';

export const AdminChatContainer = ({ id }: { id: string }) => {
    const { user } = useAuth()
    const { socket, isConnected } = useSocket(); // 👈 use socket

    const [message, setMessage] = useState(''); // track input
    const [messages, setMessages] = useState<any[]>([]); // chat messages list
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);


    // Scroll to bottom for new messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };



    // Fetch messages
    const fetchMessages = React.useCallback(async (pageNum: number) => {
        try {
            setLoading(true);
            const query = `chatroom_id=${id}&page=${pageNum}&limit=10`;
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
    }, []);



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
            // formData.append('is_support', 'true');
            formData.append("chatroom_ids[]", id);

            const res = await sendMessage(formData);

            // Optimistically add message to UI
            setMessages((prev) => [...prev, res]);
            setMessage('');

            // Immediately mark as read so unread_count stays 0 on server
            socket?.emit("read", { user_id: user?._id, message_id: res._id });
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
    }, [fetchMessages]);

    useEffect(() => {
        if (!socket || !user?._id) return;
        // ✅ Join the current room
        // socket.emit("join-room", chat._id);

        // ✅ Mark as read when chat opens
        // socket.emit("read", chat._id);

        const handleNewMessage = (data: any) => {
            const roomId = data.chatroom_id || data.chatroom?._id || data.room_id;

            // Ignore if not the current chat
            // if (roomId !== chat._id) return;

            // ✅ Append only if not already added
            setMessages((prev) => {
                if (prev.some((m) => m._id === data._id)) return prev;
                return [...prev, data];
            });

            scrollToBottom();

            // ✅ Mark message as read immediately
            // socket.emit("read", chat._id);

            // ✅ Update sidebar’s unread counter
            // chat.onReadChat?.(chat._id);
        };

        // Listen for new messages
        socket.on("messages", handleNewMessage);

        return () => {
            socket.off("messages", handleNewMessage);
            // socket.emit("leave-room", chat._id); // optional
        };
    }, [socket, user?._id]);


    // OPTIONAL: whenever the last message in this chat changes (e.g., page fetch),
    // send a read ack (covers initial fetch and edge cases)
    useEffect(() => {
        if (!socket || !user?._id) return;
        const last = messages[messages.length - 1];
        if (last?._id) {
            socket.emit("read", { user_id: user._id, message_id: last._id });
        }
    }, [messages, socket, user?._id]);
    // Sort messages by time (ascending)
    const sortedMessages = [...messages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const deleteFn = async () => {
        const query = `fromDate=${startDate}&toDate=${endDate}`;
        const data = await deleteChat(query);
        console.log({ data })
        if (data.status === "200" || data.status === 200 || data.status === "success") {
            toast.success(data.message);
            setMessages([]);
            setPage(1);
            setHasMore(true);
            fetchMessages(1);

        } else {
            toast.error(data.message);
        }

    };
    const isImage = (url: string) => {
        if (!url) return false;
        return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
    };

    return (
        <div className="relative flex-1 flex flex-col h-full w-full overflow-hidden  bg-white">
            {/* Header */}
            <div className='flex items-center  m-4 gap-4'>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border border-gray-300 rounded-md px-2 py-1" />
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border border-gray-300 rounded-md px-2 py-1" />
                <div className='flex items-center'>
                    <button
                        className="   "
                        onClick={deleteFn}
                    >
                        <Trash className="h-6 w-6 text-red-500" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={containerRef}
                className="flex-1 flex flex-col px-4 mt-4 max-h-110 overflow-y-auto scrollbar-hide bg-white min-h-40  pb-24"
            >
                {/* Show spinner at top when fetching older messages */}
                {loading && messages.length > 0 && (
                    <div className='flex flex-col items-center h-full'>

                        <p className="text-center text-gray-400 text-xs my-2">Loading...</p>
                    </div>
                )}



                {/* Sorted messages (oldest → newest) */}
                {sortedMessages.map((msg, key) => {
                    const isOwnMessage = msg.sender_id?._id === user?._id;
                    const hasImage = msg?.media || msg?.media?.[0];
                    // Normalize media (can be string or array)
                    const mediaList = Array.isArray(msg.media)
                        ? msg.media
                        : msg.media
                            ? [msg.media]
                            : [];

                    return (
                        <div className="flex flex-col" key={key}>

                            {/* MESSAGE BUBBLE */}
                            <div
                                key={key}
                                className={`p-2 rounded-2xl mb-1 max-w-xs break-words ${isOwnMessage
                                    ? "bg-blue-500 text-white self-end"
                                    : "bg-gray-200 text-black self-start"
                                    }`}
                            >
                                {/* SHOW IMAGE IF EXISTS */}
                                {mediaList.length > 0 &&
                                    mediaList.map((item: string, i: number) => {
                                        const fileUrl = item;
                                        const fileName = fileUrl.split("/").pop();

                                        return isImage(fileUrl) ? (
                                            /* IMAGE PREVIEW */
                                            <div key={i} className="mb-2">
                                                <OptimizedImage
                                                    src={fileUrl}
                                                    alt="Image"
                                                    width={200}
                                                    height={200}
                                                    className="rounded-2xl object-cover cursor-pointer"
                                                />
                                            </div>
                                        ) : (
                                            /* FILE DOWNLOAD BOX */
                                            <a
                                                key={i}
                                                href={fileUrl}
                                                target="_blank"
                                                className="flex items-center gap-2 bg-white text-black p-2 rounded-lg mb-2"
                                            >
                                                📄 <span className="font-semibold">{fileName}</span>
                                            </a>
                                        );
                                    })}


                                {/* SHOW TEXT IF EXISTS */}
                                {msg.text && <div>{msg.text}</div>}
                            </div>

                            {/* TIME + SENDER INFO */}
                            <div
                                className={`text-[10px] mt-1 flex items-center gap-1 ${isOwnMessage ? "self-end text-gray-400" : "self-start text-gray-600"
                                    }`}
                            >
                                {/* Sender Name (only for your messages unless you want for both) */}
                                {msg.sender_id?._id !== user?._id && (
                                    <span className='text-gray-600 font-bold'>{msg.sender_id?.first_name + " " + msg.sender_id?.last_name}</span>
                                )}

                                {/* Date & Time */}
                                <span>
                                    {new Date(msg.createdAt).toLocaleString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>

                        </div>

                    );
                })}
                {loading && messages.length === 0 && (
                    <p className="text-center text-gray-400">Loading...</p>
                )}
                {!hasMore && (
                    <div className='flex justify-center items-center h-100'>
                        <p className="text-center text-gray-400 text-xs my-2">
                            No more messages
                        </p>
                    </div>
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