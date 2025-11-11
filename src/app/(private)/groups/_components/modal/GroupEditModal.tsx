"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Edit, X } from "lucide-react";
import { GetUser } from "@/services/userService";
import { addUserToGroup, removeUserFromGroup, updateGroupInfo } from "@/services/groupService";
import toast from "react-hot-toast";

// import {
//     addUserToGroup,
//     removeUserFromGroup,
//     updateGroupInfo,
// } from "@/services/chatService"; // 👈 import all three

export const GroupEditModal = ({ group, onClose, onUpdated }: any) => {
    const [name, setName] = useState(group.name);
    const [image, setImage] = useState(group.group_image);
    const [members, setMembers] = useState<any[]>(group.members || []);
    const [originalMembers, setOriginalMembers] = useState<any[]>(group.members || []);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const listRef = useRef<HTMLDivElement>(null);
    const [loadingUsers, setLoadingUsers] = useState(false);

    // ✅ Fetch all users for selection list
    const fetchUsers = async (pageNumber = 1) => {
        try {
            setLoadingUsers(true);
            const res = await GetUser(pageNumber, 20);
            const newUsers = res.data;

            if (pageNumber === 1) {
                setAllUsers(newUsers);
            } else {
                setAllUsers((prev) => [...prev, ...newUsers]);
            }

            if (newUsers.length === 0 || newUsers.length < 20) {
                setHasMore(false);
            }
        } catch (err) {
            toast.error("Failed to load users");
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchUsers(1);
    }, []);

    // ✅ Scroll pagination
    useEffect(() => {
        const div = listRef.current;
        if (!div) return;

        const handleScroll = () => {
            if (!hasMore || loadingUsers) return;
            const bottom = div.scrollHeight - div.scrollTop <= div.clientHeight + 20;
            if (bottom) {
                setPage((prev) => prev + 1);
            }
        };

        div.addEventListener("scroll", handleScroll);
        return () => div.removeEventListener("scroll", handleScroll);
    }, [hasMore, loadingUsers]);

    // ✅ Fetch more users when page changes
    useEffect(() => {
        if (page > 1) fetchUsers(page);
    }, [page]);

    // ✅ Toggle member selection
    const handleSelect = (user: any) => {
        const exists = members.find((m) => m._id === user._id);
        if (exists) {
            setMembers(members.filter((m) => m._id !== user._id));
        } else {
            setMembers([...members, user]);
        }
    };

    // ✅ Save handler (handles name/image + adds/removes members)
    const handleSave = async () => {
        setSaving(true);
        try {
            // 1️⃣ Update group name/image
            if (name !== group.name || imageFile) {
                const formData = new FormData();
                formData.append("name", name);

                // Only append the image file if it exists
                if (imageFile) {
                    formData.append("group_image", imageFile);
                }

                await updateGroupInfo(group._id, formData); // Make sure your API supports multipart/form-data
                toast.success("Group info updated successfully!");

            }

            // 2️⃣ Handle members (compare current vs original)
            const originalIds = originalMembers.map((m) => m._id);
            const newIds = members.map((m) => m._id);

            // Added users
            const addedUsers = newIds.filter((id) => !originalIds.includes(id));
            // Removed users
            const removedUsers = originalIds.filter((id) => !newIds.includes(id));

            // 3️⃣ Add new users  
            // for (const userId of addedUsers) {
            if (addedUsers.length > 0) {

                await addUserToGroup(group._id, addedUsers);
                toast.success(`${addedUsers.length} member(s) added`);

            }
            // }

            // 4️⃣ Remove users
            // for (const userId of removedUsers) {
            if (removedUsers.length > 0) {

                await removeUserFromGroup(group._id, removedUsers);
                toast.success(`${removedUsers.length} member(s) removed`);

            }

            // ✅ Refresh parent data
            await onUpdated();
            onClose();
        } catch (err) {
            console.error("Error updating group:", err);
            toast.error("Something went wrong while updating group");

        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">
            <div className="bg-white w-[480px] rounded-xl p-6 shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                >
                    <X size={20} />
                </button>

                <h2 className="text-lg font-semibold mb-4">Edit Group</h2>

                {/* Group Name */}
                <div className="mb-3">
                    <label className="text-sm text-gray-600">Group Name</label>
                    <input
                        type="text"
                        className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Group Image */}
                <div className="mb-6">
                    <label className="text-sm text-gray-600">Group Image</label>
                    <div className="relative w-[60px] h-[60px] my-2 ">
                        {image ? (
                            <Image
                                src={resolveImageUrl(image)}
                                alt="group"
                                width={60}
                                height={60}
                                className="rounded-full object-cover"
                                onError={(e) => {
                                    // Optional fallback if the image fails to load
                                    (e.target as HTMLImageElement).src = "/default-group.png";
                                }}
                            />
                        ) : (
                            <div className="w-[60px] h-[60px] bg-gray-200 rounded-full" />
                        )}


                        {/* Pencil icon overlay */}
                        <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full border cursor-pointer hover:bg-gray-100">
                            <Edit size={12} />
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setImage(URL.createObjectURL(file));
                                        setImageFile(file);
                                    }
                                }}
                            />
                        </label>
                    </div>
                </div>

                {/* Members Selection */}
                <div
                    ref={listRef}
                    className="mb-4 max-h-[200px] overflow-y-auto border rounded-md p-2"
                >
                    <p className="text-sm text-gray-600 mb-2">Select Members</p>
                    {allUsers
                        .filter((u) => u.user_type === "Driver" || u.user_type === "Agency")
                        .map((user) => {
                            const isSelected = members.some((m) => m._id === user._id);
                            return (
                                <label
                                    key={user._id}
                                    className="flex items-center space-x-2 py-1 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleSelect(user)}
                                    />
                                    <span className="text-sm">
                                        {user.first_name} {user.last_name}
                                    </span>
                                </label>
                            );
                        })}

                    {loadingUsers && (
                        <p className="text-center text-sm text-gray-500 py-2">
                            Loading more users...
                        </p>
                    )}
                    {!hasMore && (
                        <p className="text-center text-sm text-gray-400 py-2">
                            No more users
                        </p>
                    )}
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-primary text-white rounded-md py-2 hover:bg-primary[30%] hover:scale-[1.01] transition disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
};

export const resolveImageUrl = (src?: string) => {
    if (!src) return "";

    // ✅ Handle blob URLs for local preview
    if (src.startsWith("blob:")) return src;

    // ✅ Already absolute URL
    if (src.startsWith("http")) return src;

    // ✅ Handle relative paths that are missing the leading slash
    if (!src.startsWith("/")) {
        src = "/" + src;
    }

    // ✅ Combine with backend domain
    return `https://getnoru.com${src}`;
};
