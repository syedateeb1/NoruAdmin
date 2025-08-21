"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
    socket: Socket | null;
    isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Connect socket (you can replace base URL with env)
        const socketInstance = io(process.env.NEXT_PUBLIC_API_PUBLIC_URL as string, {
            transports: ["websocket"],
            withCredentials: true,
        });

        setSocket(socketInstance);

        socketInstance.on("connect", () => {
            setIsConnected(true);
            console.log("✅ Socket connected:", socketInstance.id);
        });

        socketInstance.on("disconnect", () => {
            setIsConnected(false);
            console.log("❌ Socket disconnected");
        });

        // Cleanup on unmount
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

// Custom hook
export const useSocket = () => useContext(SocketContext);
