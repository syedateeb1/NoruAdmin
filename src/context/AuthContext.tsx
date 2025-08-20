"use client";

import Cookies from "js-cookie"; // Import js-cookie
import { createContext, useContext, useState, useEffect, PropsWithChildren } from "react";

interface User {
    _id: string;
    email: string;
    name: string;
    profile_image?: string;
    role: number;
    // ...other fields
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: { user: User; token: string }) => void;
    logout: () => void;
    token: string | null; // Add token to context
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null); // New state for token
    useEffect(() => {
        const savedUserLocal = localStorage.getItem("user_data");
        const savedTokenLocal = localStorage.getItem("auth_token") || "";
        const savedUserCookie = Cookies.get("user_data");
        const savedTokenCookie = Cookies.get("auth_token") || "";

        if (savedUserLocal) {
            setUser(JSON.parse(savedUserLocal));
        } else if (savedUserCookie) {
            setUser(JSON.parse(savedUserCookie));
        }
        if (savedTokenLocal || savedTokenCookie) {
            setToken(savedTokenLocal || savedTokenCookie);
        }
        setLoading(false);
    }, []);
    // AuthProvider snippet
    function login({ user, token }: { user: User; token: string }) {
        Cookies.set("auth_token", token, {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });
        localStorage.setItem("auth_token", token); // Ensure this is also set
        Cookies.set("user_data", JSON.stringify(user), {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });
        localStorage.setItem("user_data", JSON.stringify(user));
        setUser(user);
    }

    function logout() {
        Cookies.remove("auth_token");
        Cookies.remove("user_data");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
}

// Helper hook
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
