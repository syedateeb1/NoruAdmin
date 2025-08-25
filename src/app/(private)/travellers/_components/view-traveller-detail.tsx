"use client";

import { customersList } from "@/services/customerService";
import React, { useCallback, useEffect, useState } from "react";
import { userImage } from "./rides-list";
import OptimizedImage from "@/components/OtimizedImage";
import { StatusBadge } from "@/components/StatusBadge";

interface ViewDriverModalProps {
    isOpen: boolean;
    onClose: () => void;
    driver?: any; // ideally, type this better if you have types
    driverCompleteData?: any
    onClickHandle?: (name: string, id: string, status?: string) => Promise<any>;
}
const pCss = "flex items-center gap-2"
const ITEMS_PER_PAGE = 8;

const transformRideData = (apiResponse: { data?: any[] }): any[] => {
    const users = apiResponse.data || [];
    return users.map(user => ({
        _id: user._id,
        image: user?.driver_info?.driver_id_media[0]
            ? `${process.env.NEXT_PUBLIC_API_PUBLIC_URL}/${user.driver_info.driver_id_media[0]}`
            : user?.driver_info?.driver_id_media[1]
                ? `${process.env.NEXT_PUBLIC_API_PUBLIC_URL}/${user.driver_info.driver_id_media[1]}`
                : userImage,
        email: user.email,
        phone: user.phone_number,
        name: user.full_name || `${user.first_name} ${user.last_name}`,
        rides: user.total_reviews?.toString() || "0",
        rating: user.average_rating?.toFixed(1)?.toString() || "0",
        status: user.blocked,
        income: user.wallet.balance || 0
    }));
};
export const ViewTravellerModal: React.FC<ViewDriverModalProps> = ({
    isOpen,
    onClose,
    driver,
    onClickHandle,
    driverCompleteData
}) => {
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [associatedDriver, setAssociatedDriver] = useState<any[]>([]);

    const publicUrl = process.env.NEXT_PUBLIC_API_PUBLIC_URL || "";
    const getFullUrl = (url?: string) => {
        if (!url) return "";
        return url.startsWith("http") ? url : `${publicUrl}/${url}`;
    };

    const loadCustomers = useCallback(
        async (query: string, page = 1) => {
            console.log(`🔍 Fetching customers for query "${query}", page ${page}`);
            setLoading(true);
            try {
                const response: any = await customersList(query, "", page);
                const result = Array.isArray(response)
                    ? response
                    : response.data
                        ? response.data
                        : [];

                const transformedData = transformRideData({ data: result });
                // console.log({ transformedData })
                // ✅ New logic here
                if (page === 1 && transformedData.length < ITEMS_PER_PAGE) {
                    console.log("🚫Transformed Data: No more data to load.1");
                    setHasMore(false); // first page was incomplete
                } else if (page > 1 && transformedData.length === 0) {
                    console.log("🚫Transformed Data: No more data to load.2");
                    setHasMore(false); // reached end
                } else if (transformedData.length < ITEMS_PER_PAGE) {
                    console.log("🚫Transformed Data: No more data to load.3");
                    // probably still end of data, but we leave hasMore = true
                    // to retry once more just in case
                    setHasMore(false);
                }

                return transformedData;
            } catch (err) {
                console.error("❌ Failed to fetch rides:", err);
                return [];
            } finally {
                setLoading(false);
            }
        },
        [setLoading, setHasMore]
    );
    useEffect(() => {
        if (driver) {
            let query = `&agency_drivers=true&agency_id=${driver._id}`;

            (async () => {
                const data = await loadCustomers(query);
                setAssociatedDriver(data);
                console.log("✅ Driver Associated:", data);
            })();
        }
    }, [driver, loadCustomers]);
    if (!isOpen || !driver) return null;
    const approveFn = async (status: "approve" | "block") => {
        if (onClickHandle) {
            const resp = await onClickHandle("approve", driver._id, status);
            // driver.approved = resp.approved
        }
    };
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center overflow-auto px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Agency Detail</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500 text-3xl font-light px-2  rounded-full bg-gray-100"
                    >
                        &times;
                    </button>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1   gap-6">
                    <div className="space-y-3 grid grid-cols-2">
                        <div className="flex items-center gap-4">

                            <OptimizedImage
                                src={getFullUrl(driver?.image)}
                                alt="Driver"
                                width={96}  // w-24
                                height={96} // h-24
                                className="rounded-full w-24  h-24 border object-cover shadow"
                            />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {driver?.name || "N/A"}
                                </h3>
                                <p className="text-sm text-gray-500">{driver?.email || "N/A"}</p>
                                <p className="text-sm text-gray-500">{driver?.phone || "N/A"}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mt-2">
                            <p><strong>Status:</strong> {driver?.status ? "Blocked" : "Active"}</p>
                            <p><strong>Email:</strong> {driver?.email ?? "N/A"}</p>
                            <p><strong>Rating:</strong> {driver?.rating ?? "N/A"}</p>
                            <p><strong>Income:</strong> ${driver?.income ?? 0}</p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <StatusBadge status={"approve"} className="cursor-pointer" onClick={() => approveFn("approve")} />
                        <StatusBadge status={"blocked"} className="cursor-pointer" onClick={() => approveFn("block")} />
                    </div>
                    {/* <div className="space-y-2 text-sm text-gray-700">
                        <h4 className="font-semibold text-gray-800 border-b pb-1">Emergency Contact</h4>
                        <p><strong>Name:</strong> {driver?.driver_info?.emergency_contact_name || "N/A"}</p>
                        <p><strong>Phone:</strong> {driver?.driver_info?.emergency_contact_phone || "N/A"}</p>

                        <h4 className="font-semibold text-gray-800 border-b pt-4 pb-1">License Info</h4>
                        <p><strong>Number:</strong> {driver?.driver_info?.driving_licence_number || "N/A"}</p>
                        <p><strong>Country:</strong> {driver?.driver_info?.driving_licence_country || "N/A"}</p>
                        <p><strong>Expiry:</strong>
                            {driver?.driver_info?.driving_licence_expiry
                                ? new Date(driver.driver_info.driving_licence_expiry).toDateString()
                                : "N/A"}
                        </p>
                    </div> */}
                </div>

                <div className="my-6 border-t" />
                {/* Associated Drivers Listing */}
                {associatedDriver && associatedDriver.length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Associated Drivers</h4>
                        <div className="space-y-3">
                            {associatedDriver.map((d, i) => (
                                <div
                                    key={d._id || i}
                                    className="flex items-center gap-4 p-3 border rounded-xl shadow-sm hover:bg-gray-50 transition"
                                >

                                    <OptimizedImage
                                        src={getFullUrl(d?.image)}
                                        alt={d.name}
                                        width={48}  // w-24
                                        height={48} // h-24
                                        className="rounded-full  h-24 w-24 border object-cover shadow"
                                    />
                                    {/* Driver Info */}
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold text-gray-800">{d.name}</h3>
                                        <p className="text-xs text-gray-500">{d.email}</p>
                                        <p className="text-xs text-gray-500">{d.phone}</p>
                                    </div>

                                    {/* Right Side: Rides / Income */}
                                    <div className="text-right">
                                        <p className="text-xs text-gray-600">
                                            Rides: <span className="font-medium">{d.rides}</span>
                                        </p>
                                        <p
                                            className={`text-xs font-medium ${d.income < 0 ? "text-red-600" : "text-green-600"
                                                }`}
                                        >
                                            ${d.income}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};
