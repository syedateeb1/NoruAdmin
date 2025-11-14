"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getGroups } from "@/services/chatService";
import { scrollDiv } from "@/utils/constants";
import { Loader2, User, Pencil } from "lucide-react";
import { GroupEditModal, resolveImageUrl } from "../modal/GroupEditModal";
import { AdminChatContainer } from "../AdminChat";
// import { GroupEditModal } from "../modal/GroupEditModal";

export const GroupsList = () => {
    const [group, setGroup] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const getGroup = async () => {
        try {
            const groups = await getGroups("group=true");
            if (groups?.length) setGroup(groups[0]);
        } catch (error) {
            console.error("Failed to load group:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getGroup();
    }, []);

    if (loading)
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin text-gray-500" size={28} />
            </div>
        );

    if (!group)
        return <p className="text-gray-500 text-center">No groups found.</p>;

    return (
        <div className="flex flex-col mt-6 space-y-6">
            <h1 className="text-heading-6 font-bold text-black">Group Details</h1>

            {/* Group Info */}
            <div className="bg-white p-4 rounded-2xl shadow relative">
                <button
                    onClick={() => setIsEditOpen(true)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-blue-600"
                >
                    <Pencil size={20} />
                </button>

                <div className="flex items-center space-x-4">
                    {group.group_image ? (
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">

                            <Image
                                src={resolveImageUrl(group.group_image)}

                                alt={group.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                        // <></>
                    ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="text-gray-500" size={28} />
                        </div>
                    )}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">{group.name}</h2>
                        <p className="text-sm text-gray-500">
                            Type: {group.type} {group.is_group && "(Group Chat)"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Members List */}
            <div>
                <h3 className="text-base font-semibold text-gray-700 mb-2">Chats</h3>
                <AdminChatContainer id={group._id} />
                {/* <div className={`${scrollDiv} bg-white rounded-2xl p-3 shadow`}>
                    {group.members?.length ? (
                        group.members.map((member: any) => (
                            <div
                                key={member._id}
                                className="flex items-center space-x-3 border-b last:border-none border-gray-100 py-2"
                            >
                                {member.profile_image ? (
                                    <Image
                                        // src={`/${member.profile_image}`}
                                        src={resolveImageUrl(member.profile_image)}
                                        alt={member.first_name}
                                        width={40}
                                        height={40}
                                        className="rounded-full object-cover"
                                    />
                                    // <></>
                                ) : (
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                        <User className="text-gray-500" size={20} />
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-gray-800">
                                        {member.first_name} {member.last_name}
                                        {group.admins?.includes(member._id) && (
                                            <span className="ml-2 text-xs text-blue-600 font-semibold">
                                                (Admin)
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-xs text-gray-500">{member.phone_number}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm text-center">No members found.</p>
                    )}
                </div> */}
            </div>

            {/* Edit Modal */}
            {isEditOpen && (
                <GroupEditModal
                    group={group}
                    onClose={() => setIsEditOpen(false)}
                    onUpdated={getGroup}
                />
            )}
        </div>
    );
};
