"use client";

import { StatusBadge } from "@/components/StatusBadge";
import { approveDriver } from "@/services/customerService";
import React from "react";

interface ViewDriverModalProps {
    isOpen: boolean;
    onClose: () => void;
    driver?: any; // ideally, type this better if you have types
    onClickHandle?: (name: string, id: string, status?: string) => Promise<any>;
}
const pCss = "flex items-center gap-2"
export const ViewDriverModal: React.FC<ViewDriverModalProps> = ({
    isOpen,
    onClose,
    driver,
    onClickHandle
}) => {
    if (!isOpen || !driver) return null;
    console.log({ driver })
    const publicUrl = process.env.NEXT_PUBLIC_API_PUBLIC_URL || "";

    const getFullUrl = (url?: string) => {
        if (!url) return "";
        return url.startsWith("http") ? url : `${publicUrl}/${url}`;
    };
    const approveFn = async () => {
        if (onClickHandle) {
            const resp = await onClickHandle(driver._id, "approve", driver.approved ? "approve" : "block");
            console.log(resp.approved);
            driver.approved = resp.approved
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center overflow-auto px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Driver Detail</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500 text-3xl font-light px-2  rounded-full bg-gray-100"
                    >
                        &times;
                    </button>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            <img
                                src={getFullUrl(driver?.image)}
                                alt="Driver"
                                className="w-24 h-24 rounded-full border object-cover shadow"
                                onError={(e) => (e.currentTarget.src = "/fallback.png")}
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
                            <p><strong>Rides:</strong> {driver?.rides ?? 0}</p>
                            <p><strong>Rating:</strong> {driver?.rating ?? "N/A"}</p>
                            <p><strong>Income:</strong> ${driver?.income ?? 0}</p>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-700">
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
                    </div>
                </div>

                <div className="my-6 border-t" />

                {/* License Images */}
                {driver?.driver_info?.driving_licence_media?.length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Driving License Images</h4>
                        <div className="flex flex-wrap gap-3">
                            {driver.driver_info.driving_licence_media.map((img: string, i: number) => (
                                <img
                                    key={i}
                                    src={getFullUrl(img)}
                                    alt={`License ${i + 1}`}
                                    className="w-40 h-28 object-cover rounded-lg shadow border"
                                    onError={(e) => (e.currentTarget.src = "/fallback.png")}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Driver ID Images */}
                {driver?.driver_info?.driver_id_media?.length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Driver ID Images</h4>
                        <div className="flex flex-wrap gap-3">
                            {driver.driver_info.driver_id_media.map((img: string, i: number) => (
                                <img
                                    key={i}
                                    src={getFullUrl(img)}
                                    alt={`ID ${i + 1}`}
                                    className="w-40 h-28 object-cover rounded-lg shadow border"
                                    onError={(e) => (e.currentTarget.src = "/fallback.png")}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Vehicle Info */}
                {driver?.driver_vehicle && (
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Vehicle Information</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
                            <p className={pCss}><strong>Brand:</strong> {driver.driver_vehicle.brand || "N/A"}</p>
                            <p className={pCss}><strong>Model:</strong> {driver.driver_vehicle.model || "N/A"}</p>
                            <p className={pCss}><strong>Color:</strong>
                                {driver.driver_vehicle.color ? (
                                    <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: driver.driver_vehicle.color }}></span>
                                ) : "N/A"}
                            </p>
                            <p className={pCss}><strong>Plate:</strong> {driver.driver_vehicle.plate_number || "N/A"}</p>
                            <p className={pCss}><strong>Reg #:</strong> {driver.driver_vehicle.registration_number || "N/A"}</p>
                            <p className={pCss}><strong>Status:</strong> {driver.driver_vehicle.status || "N/A"}</p>
                        </div>
                    </div>
                )}

                {/* Vehicle Images */}
                {driver?.driver_vehicle?.vehicle_media?.length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Vehicle Images</h4>
                        <div className="flex flex-wrap gap-3">
                            {driver.driver_vehicle.vehicle_media.map((img: string, i: number) => (
                                <img
                                    key={i}
                                    src={getFullUrl(img)}
                                    alt={`Vehicle ${i + 1}`}
                                    className="w-40 h-28 object-cover rounded-lg shadow border"
                                    onError={(e) => (e.currentTarget.src = "/fallback.png")}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Registration Document */}
                {driver?.driver_vehicle?.registration_doc_url && (
                    <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Registration Document</h4>
                        <img
                            src={getFullUrl(driver.driver_vehicle.registration_doc_url)}
                            alt="Registration Document"
                            className="w-72 object-contain border rounded-lg shadow"
                            onError={(e) => (e.currentTarget.src = "/fallback.png")}
                        />
                    </div>
                )}
                <div className="flex justify-end">
                    <StatusBadge status={driver?.approved ? "blocked" : "approve"} className="cursor-pointer" onClick={approveFn} />
                </div>
            </div>
        </div>
    );
};
