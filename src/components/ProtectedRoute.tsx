"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/auth/sign-in"); // where your login page is
        }
    }, [loading, user, router]);

    // Show a loader or placeholder while auth is being checked
    if (loading) {
        return <p>Loading...</p>;
    }

    // If user is not logged in, don't render children until router finishes
    if (!user) {
        return null;
    }

    return <>{children}</>;
}
