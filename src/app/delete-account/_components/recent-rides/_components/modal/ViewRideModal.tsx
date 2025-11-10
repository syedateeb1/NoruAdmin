"use client";

import React from "react";
import OptimizedImage from "@/components/OtimizedImage";
import { StatusBadge } from "@/components/StatusBadge";

interface ViewRideModalProps {
    isOpen: boolean;
    onClose: () => void;
    ride?: any;
}

export const ViewRideModal: React.FC<ViewRideModalProps> = ({
    isOpen,
    onClose,
    ride
}) => {
    if (!isOpen || !ride) return null;

    const publicUrl = process.env.NEXT_PUBLIC_API_PUBLIC_URL || "";
    const getFullUrl = (url?: string) => (url ? (url.startsWith("http") ? url : `${publicUrl}/${url}`) : "");

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center overflow-auto px-4 py-6">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto p-8">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Ride Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500 text-3xl font-light px-2 rounded-full bg-gray-100"
                    >
                        &times;
                    </button>
                </div>

                {/* Top Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Ride Info</h4>
                        <p><strong>Ride ID:</strong> {ride._id}</p>
                        <div className="flex items-center gap-2">
                            <strong>Status:</strong> <StatusBadge status={ride.status} />
                        </div>
                        <p><strong>Price:</strong> ${ride.price ?? ride.estimated_price}</p>
                        <p><strong>Created At:</strong> {new Date(ride.createdAt).toLocaleString()}</p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Pickup Location</h4>
                        <p>{ride.pickup_location?.address || "N/A"}</p>
                        <p>{ride.pickup_location?.city || ""}</p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Dropoff Location</h4>
                        <p>{ride.dropoff_location?.address || "N/A"}</p>
                        <p>{ride.dropoff_location?.city || ""}</p>
                    </div>
                </div>

                {/* Customer & Driver Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Customer Info */}
                    <div className="bg-gray-50 p-4 rounded-xl border">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Customer Details</h4>
                        <p><strong>Name:</strong> {ride.customer_id?.first_name} {ride.customer_id?.last_name}</p>
                        <p><strong>Phone:</strong> {ride.customer_id?.phone_number}</p>
                    </div>

                    {/* Driver Info */}
                    {ride.assigned_driver && (
                        <div className="bg-gray-50 p-4 rounded-xl border flex items-center gap-4">
                            <OptimizedImage
                                src={getFullUrl(ride.assigned_driver.profile_image)}
                                alt="Driver"
                                width={120}
                                height={120}
                            />
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-1">Driver Details</h4>
                                <p><strong>Name:</strong> {ride.assigned_driver.first_name} {ride.assigned_driver.last_name}</p>
                                <p><strong>Phone:</strong> {ride.assigned_driver.phone_number}</p>
                                <p><strong>Status:</strong> {ride.assigned_driver.driver_vehicle?.status || "N/A"}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Vehicle Information */}
                {ride.assigned_driver?.driver_vehicle && (
                    <div className="mb-8">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Vehicle Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <p><strong>Type:</strong> {ride.assigned_driver.driver_vehicle.vehicle_type?.name}</p>
                            <p><strong>Brand:</strong> {ride.assigned_driver.driver_vehicle.brand}</p>
                            <p><strong>Model:</strong> {ride.assigned_driver.driver_vehicle.model}</p>
                            <p><strong>Color:</strong>
                                <span className="inline-block w-5 h-5 rounded-full ml-2 border"
                                    style={{ backgroundColor: ride.assigned_driver.driver_vehicle.color }} />
                            </p>
                            <p><strong>Plate #:</strong> {ride.assigned_driver.driver_vehicle.plate_number}</p>
                            <p><strong>Reg #:</strong> {ride.assigned_driver.driver_vehicle.registration_number}</p>
                            <p><strong>Status:</strong> {ride.assigned_driver.driver_vehicle.status}</p>
                        </div>
                    </div>
                )}

                {/* Vehicle Images */}
                {ride.assigned_driver?.driver_vehicle?.vehicle_media?.length > 0 && (
                    <div className="mb-8">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Vehicle Images</h4>
                        <div className="flex flex-wrap gap-4">
                            {ride.assigned_driver.driver_vehicle.vehicle_media.map((img: string, i: number) => (
                                <OptimizedImage
                                    key={i}
                                    src={getFullUrl(img)}
                                    alt={`Vehicle ${i + 1}`}
                                    width={200}
                                    height={140}
                                    className="object-cover rounded-lg border shadow-sm"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Registration Document */}
                {ride.assigned_driver?.driver_vehicle?.registration_doc_url && (
                    <div className="mb-8">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Registration Document</h4>
                        <OptimizedImage
                            src={getFullUrl(ride.assigned_driver.driver_vehicle.registration_doc_url)}
                            alt="Registration Doc"
                            width={320}
                            height={220}
                            className="object-contain rounded-lg border shadow-sm"
                        />
                    </div>
                )}

                {/* Review Section */}
                {ride.review && (
                    <div className="bg-gray-50 p-4 rounded-xl border mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Ride Review</h4>
                        <p><strong>Rating:</strong> ⭐ {ride.review.rating}/5</p>
                        <p><strong>Comment:</strong> {ride.review.comment || "No comment left."}</p>
                    </div>
                )}

                {/* Chat Info */}
                {ride.chatroom?.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-xl border mb-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Chatroom</h4>
                        <p><strong>Chat ID:</strong> {ride.chatroom[0]._id}</p>
                        <p><strong>Members:</strong> {ride.chatroom[0].members.join(", ")}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
