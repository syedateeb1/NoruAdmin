"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
    placeholder = "Search...",
    value,
    onChange,
    className = "",
}) => {
    return (
        <div className={`h-10 relative w-full px-2 ${className}`}>
            <input
                type="text"
                placeholder={placeholder}
                className="w-full h-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={value}
                onChange={onChange}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
    );
};

export default SearchInput;
