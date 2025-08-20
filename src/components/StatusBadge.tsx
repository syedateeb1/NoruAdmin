"use client";

import React from "react";

type StatusType = "active" | "approve" | "blocked" | "assigned" | "open" | "completed" | "cancelled" | string;

interface StatusBadgeProps {
    status?: StatusType;
    customLabels?: {
        [key in StatusType]?: string;
    };
    className?: string;
    onClick?: () => void;
}

const statusStyles: { [key in StatusType]?: string } = {
    active: "bg-green-200 text-green-700",
    approve: "bg-green-200 text-green-700",
    blocked: "bg-red-200 text-red-700",
    assigned: "bg-green-200 text-green-700",
    open: "bg-blue-200 text-blue-700",
    completed: "bg-purple-200 text-purple-700",
    cancelled: "bg-red-200 text-red-700",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    status = "active", // default fallback
    customLabels = {},
    className,
    onClick
}) => {
    const style = statusStyles[status] || "bg-gray-200 text-gray-700";
    const label = customLabels[status] || status.charAt(0).toUpperCase() + status.slice(1);

    return (
        <div className={`inline-block px-5 py-2 rounded-full font-sans text-body-lg font-semibold ${style} ${className}`} onClick={onClick}>
            <p>{label}</p>
        </div>
    );
};
