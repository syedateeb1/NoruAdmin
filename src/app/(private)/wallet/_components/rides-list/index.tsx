"use client"
import { Search, Loader2 } from "lucide-react";
import { RidesDetail } from "./rides-detail"
import { useCallback, useEffect, useRef, useState } from "react";
import data from "../../fetch.json"
import { customersList, deleteCustomer, updateDriver } from "@/services/customerService";
import Swal from "sweetalert2";
import { inputCss, scrollDiv } from "@/utils/constants";
import SearchInput from "@/components/SearchComponent";
import { ViewTravellerModal } from "../view-traveller-detail";
import { makePayment } from "@/services/ridesService";

const image = "https://media.istockphoto.com/id/1809645289/photo/sports-car-driving-at-on-a-road-on-high-speed-racing-through-the-colorful-dark-tunnel-with.webp?a=1&b=1&s=612x612&w=0&k=20&c=LxcEDz82h45rRZWmdIUqMSSQGHdoKWbm_NAmvSei_hU=";

const options = [
    { id: 'view', label: 'View Detail' },
    { id: 'delete', label: 'Delete Traveller' },
    { id: 'block', label: 'Traveller' },
]


const transformRideData = (apiResponse: { data?: any[] }): any[] => {
    const users = apiResponse.data || [];
    return users.map(user => ({
        _id: user._id,
        agency_id: user.agency_id,
        email: user.email,
        phone: user.phone_number,
        name: user.full_name || `${user.first_name} ${user.last_name}`,
        rating: user.average_rating?.toFixed(1)?.toString() || "0",
        amount: user.wallet.balance || 0,
        user_type: user.user_type || "Driver",
        currency: user.wallet.currency || "USD"
    }));
};
const ITEMS_PER_PAGE = 8;
export const Wallet = () => {
    const [selectedTab, setSelectedTab] = useState("payable");
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    let buttonTabCss = "p-4 w-50 rounded-t-lg text-center cursor-pointer hover:text-primary hover:bg-[rgba(255,248,229,1)]"
    const handleTab = (tab: "payable" | "earning") => {
        setSelectedTab(tab);
    };
    // Example driver data
    const drivers = [
        { id: 1, name: "John Doe", amount: 500, type: "driver" },
        { id: 2, name: "Jane Smith", amount: 350, type: "driver" },
        { id: 3, name: "Alex Johnson", amount: 200, type: "driver" },
    ];
    const loadCustomers = async (searchQuery: string) => {
        try {
            setLoading(true); // 🔄 Start loader

            const response: any = await customersList(searchQuery);
            console.log('API Response:', response); // Debugging

            // Handle different response formats
            const result = Array.isArray(response) ? response :
                response.data ? response.data :
                    [];

            if (!Array.isArray(result)) {
                console.error('Unexpected response format:', response);
                setCustomers([]);
                return;
            }
            const transformedData = transformRideData(response);
            setCustomers(transformedData);
        } catch (err) {
            console.error("Failed to fetch rides:", err);
            setCustomers([]);
        } finally {
            setLoading(false); // ✅ Stop loader
        }
    };

    useEffect(() => {
        let queryParam = "";

        if (selectedTab == "earning") {
            queryParam = "&oweing_users=true";
        } else if (selectedTab === "payable") {
            queryParam = "&outstanding_dues=true";
        }

        loadCustomers(queryParam);
    }, [selectedTab]); // <-- re-run when tab changes

    // This function will handle the payment action
    const handlePayment = async (driver: any) => {
        try {
            const { value: amount } = await Swal.fire({
                title: `Enter Amount`,
                input: "number",
                inputLabel: `Enter the amount to ${selectedTab === "payable" ? "Pay" : "Receive"} for ${driver.name}`,
                inputPlaceholder: "Enter amount",
                showCancelButton: true,
                confirmButtonText: "Yes",
                cancelButtonText: "Cancel",
                inputValidator: (value) => {
                    if (!value || Number(value) <= 0) {
                        return "Please enter a valid amount!";
                    }
                    return null;
                },
            });

            if (amount) {
                const paymentObject: any = {
                    amount: Number(amount),
                    type: selectedTab === "payable" ? "driver_payout" : "admin_payout",
                    payment_method: "cash"
                };

                // For admin_payout → attach driver_id
                if (selectedTab === "earning") {
                    paymentObject.driver_id = driver._id;
                } else {
                    paymentObject.receiver_id = driver._id;
                }

                console.log("Final Payment Object:", paymentObject);

                // Call your function here
                await makePayment(paymentObject);
                // 🔄 Refresh list after success
                let queryParam = selectedTab === "earning"
                    ? "&oweing_users=true"
                    : "&outstanding_dues=true";

                loadCustomers(queryParam);
                Swal.fire("Success!", "Payment processed successfully.", "success");
            }
        } catch (error) {
            console.error("Payment failed:", error);
            Swal.fire("Error!", "Something went wrong while processing payment.", "error");
        }
    };
    return (
        <div className="flex flex-col mt-6 space-y-6">
            <h1 className="text-heading-6 font-bold text-black">Wallet</h1>


            <div className="flex flex-col mt-6">
                <div className="flex space-x-2">
                    <div
                        className={`${buttonTabCss} ${selectedTab === "payable" ? "bg-primary" : "bg-gray-200"
                            }`}
                        onClick={() => handleTab("payable")}
                    >
                        Payable
                    </div>
                    <div
                        className={`${buttonTabCss} ${selectedTab === "earning" ? "bg-primary" : "bg-gray-200"
                            }`}
                        onClick={() => handleTab("earning")}
                    >
                        Earning
                    </div>
                </div>
                {/* Driver List */}
                <div className="flex flex-col w-full border rounded-md p-4 space-y-4 bg-white shadow-sm">
                    {loading ? (
                        <div className="flex items-center justify-center h-[200px]">
                            <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
                        </div>
                    ) : customers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 mb-2 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6M9 7h.01M15 7h.01M21 12c0 4.418-3.582 8-8 8H11a8 8 0 110-16h2c4.418 0 8 3.582 8 8z"
                                />
                            </svg>
                            <span className="text-sm">No users found for this tab.</span>
                        </div>
                    ) : (customers.map((driver, inndex) => (
                        <div
                            key={inndex}
                            className="flex items-center justify-between border-b pb-2 last:border-none"
                        >
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-800 capitalize">{driver.name}<span className="text-gray-500 capitalize">( {driver.user_type})</span></span>
                                <span className="text-sm text-gray-500">
                                    {selectedTab === "payable" ? "Amount to Pay" : "Amount to Receive"}: ${driver.amount}
                                </span>
                            </div>
                            <button
                                onClick={() => handlePayment(driver)}
                                className={`px-6 py-2 rounded-lg text-white text-md font-semibold ${selectedTab === "payable" ? "bg-red-500" : "bg-green-500"
                                    }`}
                            >
                                {selectedTab === "payable" ? "Pay" : "Receive"}
                            </button>
                        </div>
                    ))
                    )}
                </div>
            </div>


        </div >
    )
} 