"use client"
import { Search, Loader2 } from "lucide-react";
import { RidesDetail } from "./rides-detail"
import { useCallback, useEffect, useRef, useState } from "react";
import data from "../../fetch.json"
import { approveDriver, customersList, deleteCustomer, updateDriver } from "@/services/customerService";
import Swal from "sweetalert2";
import { inputCss, scrollDiv } from "@/utils/constants";
import SearchInput from "@/components/SearchComponent";
import { ViewTravellerModal } from "../view-traveller-detail";

export const userImage = "https://media.istockphoto.com/id/1809645289/photo/sports-car-driving-at-on-a-road-on-high-speed-racing-through-the-colorful-dark-tunnel-with.webp?a=1&b=1&s=612x612&w=0&k=20&c=LxcEDz82h45rRZWmdIUqMSSQGHdoKWbm_NAmvSei_hU=";

const options = [
    { id: 'view', label: 'View Detail' },
    { id: 'delete', label: 'Delete Traveller' },
    { id: 'block', label: 'Traveller' },
]


const transformRideData = (apiResponse: { data?: any[] }): any[] => {
    if (!apiResponse.data) {
        // console.warn('transformRideData: apiResponse.dat parameter is null or undefined');
        return [];
    }
    // Handle non-array input
    if (!Array.isArray(apiResponse.data)) {
        // console.error('transformRideData: Expected array but received', typeof rides);
        return [];
    }
    const users = apiResponse.data || [];
    console.log({ users })
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
        status: user.approved,
        is_online: user.is_online,
        income: user.wallet.balance || 0,
        drivers: user.drivers || 0,
        jobs: user.jobs || 0,
        vehicles: user?.vehicles || "0"
    }));
};
const ITEMS_PER_PAGE = 8;
export const RidesList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [selectedDriver, setSelectedDriver] = useState<any>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [driverCompleteData, setDriverCompleteData] = useState([])

    const loadCustomers = useCallback(
        async (query: string, page = 1) => {
            console.log(`🔍 Fetching customers for query "${query}", page ${page}`);
            setLoading(true);
            try {
                const response: any = await customersList(query, "Agency", page);
                const result = Array.isArray(response)
                    ? response
                    : response.data
                        ? response.data
                        : [];
                console.log({ result })
                const transformedData = transformRideData({ data: result });
                setDriverCompleteData(result)
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
        []
    );

    // Initial fetch
    useEffect(() => {
        const fetchInitialData = async () => {
            const initialData = await loadCustomers(searchQuery, 1);
            setDrivers(initialData);
            setCurrentPage(1);
            // setHasMore(initialData.length === ITEMS_PER_PAGE);
        };
        fetchInitialData();
    }, [searchQuery, loadCustomers]);

    // Infinite Scroll Observer
    // Infinite Scroll Observer
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = async () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            // console.log("📏 scrollTop:", scrollTop, "clientHeight:", clientHeight, "scrollHeight:", scrollHeight);

            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

            if (isNearBottom) {
                console.log("🧲 Near bottom");
                console.log("🧲 " + isNearBottom, hasMore, !isLoadingMore);
            }

            if (isNearBottom && hasMore && !isLoadingMore) {
                // console.log("🧲 Scrolled to bottom. Loading more...");

                setIsLoadingMore(true);
                const nextPage = currentPage + 1;
                const newRides = await loadCustomers(searchQuery, nextPage);
                if (newRides.length < ITEMS_PER_PAGE) {
                    setHasMore(false);
                    console.log("🚫 No more data to load.");
                }


                setDrivers((prev) => [...prev, ...newRides]);
                setCurrentPage(nextPage);
                setIsLoadingMore(false);
            }
        };

        console.log("✅ Attaching scroll listener");

        container.addEventListener("scroll", handleScroll);
        return () => {
            container.removeEventListener("scroll", handleScroll);
            console.log("🧹 Cleaned up scroll listener");
        };
    }, [scrollContainerRef, currentPage, hasMore, isLoadingMore, searchQuery, loadCustomers]);

    const onClickHandle = async (name: string, id: string, status?: string) => {
        console.log(name, "name");
        switch (name) {
            case "block":
                await updateDriver(id, status !== "block");
                const initialData = await loadCustomers(searchQuery);
                setDrivers(initialData);
                break;

            case "delete":
                const confirmDelete = await Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Yes, delete it!",
                });

                if (confirmDelete.isConfirmed) {
                    await deleteCustomer(id);
                    Swal.fire({
                        title: "Deleted!",
                        text: "The customer has been deleted.",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });

                    const initialData1 = await loadCustomers(searchQuery);
                    setDrivers(initialData1);
                }
                break;
            case "view":

                const driverData = drivers.find(driver => driver._id === id);
                if (driverData) {
                    console.log({ driverData })
                    setSelectedDriver(driverData);
                    setIsViewModalOpen(true);
                }
                break;
            case "approve":

                console.log("🚀 ~ file: index.tsx ~ line 94 ~ onClickHandle ~ status", status)
                const confirmApprove = await Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Yes, Approve it!",
                });

                if (confirmApprove.isConfirmed) {
                    let statusMessage = status === "block" ? "The Traveller has been Blocked" : "The Traveller has been Approved";
                    const resp = await approveDriver(id, status === "block" ? false : true);
                    let statusTitle = status === "block" ? "Blocked" : "Approved";
                    const initialData2 = await loadCustomers(searchQuery);
                    setDrivers(initialData2);
                    if (resp.status === 200) {
                        Swal.fire({
                            title: statusTitle,
                            text: statusMessage,
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                        });
                        return resp.data
                    }


                }
        }

    };
    console.log(drivers, "drivers");
    return (
        <div className="flex flex-col mt-6 space-y-6">
            <h1 className="text-heading-6 font-bold text-black">Agencies</h1>

            <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
            />
            <div
                ref={scrollContainerRef}
                className={scrollDiv}
            >
                {drivers.map((item, index) => (
                    <div key={item._id} className="min-w-[1200px]  ">
                        <RidesDetail
                            _id={item._id}
                            innerData={item}
                            status={item.status}
                            option={true}
                            options={options}
                            onClick={onClickHandle}
                        />
                    </div>
                ))}

                {isLoadingMore && !searchQuery && hasMore && (
                    <div className="w-full py-4 flex justify-center items-center">
                        <Loader2 className="animate-spin text-gray-500 w-5 h-5" />
                    </div>
                )}
                {selectedDriver && (
                    <ViewTravellerModal
                        isOpen={isViewModalOpen}
                        onClose={() => setIsViewModalOpen(false)}
                        driver={selectedDriver}
                        driverCompleteData={driverCompleteData}
                        onClickHandle={onClickHandle}

                    />
                )}
            </div>
        </div>
    )
} 