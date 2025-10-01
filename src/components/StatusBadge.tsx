"use client";

import React from "react";

type StatusType = "active" | "online"
    | "offline" | "approve" | "blocked" | "assigned" | "open" | "completed" | "cancelled" | string;

interface StatusBadgeProps {
    status?: StatusType;
    customLabels?: {
        [key in StatusType]?: string;
    };
    className?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset" | "link" | "badge";
    name?: string
    value?: string
}

const statusStyles: { [key in StatusType]?: string } = {
    active: "bg-green-200 text-green-700  rounded-full",
    approve: "bg-green-200 text-green-700 hover:bg-green-300 hover:shadow-md rounded-lg",
    blocked: "bg-red-200 text-red-700 hover:bg-red-300 hover:shadow-md  rounded-lg",
    blockedBadge: "bg-red-200 text-red-700  rounded-full",
    assigned: "bg-green-200 text-green-700 rounded-full",
    open: "bg-blue-200 text-blue-700 rounded-full",
    completed: "bg-purple-200 text-purple-700 rounded-full",
    cancelled: "bg-red-200 text-red-700 rounded-full",
    online: "bg-green-300 text-green-800 rounded-full",
    offline: "bg-gray-300 text-gray-700 rounded-full",
};


export const StatusBadge: React.FC<StatusBadgeProps> = ({
    status = "active", // default fallback
    customLabels = {},
    className,
    onClick,
    type = "button",
    name = "",
    value = ""
}) => {
    const style = statusStyles[status] || "bg-gray-200 text-gray-700";
    const label = customLabels[status] || status.charAt(0).toUpperCase() + status.slice(1);
    const badgeType = type === "badge" ? status === "blocked" ? statusStyles['blockedBadge'] : style : style;
    return (

        <div
            className={`flex flex-col gap-2 py-2 overflow-hidden `}
        >
            {name && (

                <h5 className="font-sans text-heading-7 font-bold text-dark-4 truncate ml-1">
                    {name || "Status"}
                </h5>
            )}
            <div className="flex justify-center items-center">

                <div className={` inline-block px-5 py-2 font-sans text-body-lg font-semibold ${badgeType} ${className}`} onClick={onClick}>
                    <p>{value || label}</p>
                </div>
            </div>
        </div>

    );
};
