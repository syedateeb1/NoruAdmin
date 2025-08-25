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
    active: "bg-green-200 text-green-700  rounded-full",
    approve: "bg-green-200 text-green-700 hover:bg-green-300 hover:shadow-md rounded-lg",
    blocked: "bg-red-200 text-red-700 hover:bg-red-300 hover:shadow-md  rounded-lg",
    assigned: "bg-green-200 text-green-700 rounded-full",
    open: "bg-blue-200 text-blue-700 rounded-full",
    completed: "bg-purple-200 text-purple-700 rounded-full",
    cancelled: "bg-red-200 text-red-700 rounded-full",
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
        <div className={`inline-block px-5 py-2 font-sans text-body-lg font-semibold ${style} ${className}`} onClick={onClick}>
            <p>{label}</p>
        </div>
    );
};
