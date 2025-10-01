"use client"
import { Search, Loader2 } from "lucide-react";
import { ComplaintDetail } from "./rides-detail"
import { useCallback, useEffect, useRef, useState } from "react";
import data from "../../fetch.json"
import { inputCss } from "@/utils/constants";
import SearchInput from "@/components/SearchComponent";
import { complaintList, updateComplaint } from "@/services/complaintService";
import Swal from "sweetalert2";

const options = [
    { id: 'delete', label: 'Delete Traveller' },
    { id: 'block', label: 'Traveller' },
]

const ITEMS_PER_PAGE = 4;

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
    return users.map(user => ({
        _id: user._id,
        ride_id: user.ride_id?._id,
        title: user.title,
        status: user.status,
        description: user.description || 0,
        complaint_gainst: user?.against_user_id,
        complaint_from: user?.complainer_id,
    }));
};

export const RidesList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState(data.data);
    const [currentPage, setCurrentPage] = useState(1);
    const [displayedData, setDisplayedData] = useState<any[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [complaints, setComplaints] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const warnDriver = async (name: string, id: string) => {
        // Add your logic here for warning the driver
        const warnDriver = await updateComplaint(id, "We have warned the driver. Thank you for your feedback.");
        if (warnDriver.status === 200) {

            const initialData = await loadCustomers(searchQuery, 1);
            setComplaints(initialData);
            setCurrentPage(1);
            Swal.fire({
                title: warnDriver.message,
                text: warnDriver.message,
                icon: 'success',
                confirmButtonColor: '#3085d6'
            });

        }
    }
    const onClickHandle = (name: string, id: string, status?: string) => {
        // setIsMenuOpen(false);
        Swal.fire({
            title: 'Are you sure?',
            text: "You are about to  take action against this driver. Proceed?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, take action against driver!'
        }).then(async (result) => {
            if (result.isConfirmed) {

                await warnDriver(name, id);
            }
        })
    };

    const loadCustomers = useCallback(
        async (query: string, page = 1) => {
            setLoading(true);
            try {
                const response: any = await complaintList(query, "Driver", page);
                const result = Array.isArray(response)
                    ? response
                    : response.data
                        ? response.data
                        : [];

                const transformedData = transformRideData({ data: result });

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
            setComplaints(initialData);
            setCurrentPage(1);
            // setHasMore(initialData.length === ITEMS_PER_PAGE);
        };
        fetchInitialData();
    }, [searchQuery, loadCustomers]);
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = async () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            // console.log("📏 scrollTop:", scrollTop, "clientHeight:", clientHeight, "scrollHeight:", scrollHeight);

            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

            if (isNearBottom) {
                // console.log("🧲 Near bottom");
                // console.log("🧲 " + isNearBottom, hasMore, !isLoadingMore);
            }

            if (isNearBottom && hasMore && !isLoadingMore) {
                // console.log("🧲 Scrolled to bottom. Loading more...");

                setIsLoadingMore(true);
                const nextPage = currentPage + 1;
                const newRides = await loadCustomers(searchQuery, nextPage);
                // console.log("📦 newRides.length:", newRides.length);
                // console.log("📄 currentPage:", currentPage, "ITEMS_PER_PAGE:", ITEMS_PER_PAGE);
                // console.log(newRides.length < ITEMS_PER_PAGE)
                if (newRides.length < ITEMS_PER_PAGE) {
                    setHasMore(false);
                    // console.log("🚫 No more data to load.");
                }


                setComplaints((prev: any) => [...prev, ...newRides]);
                setCurrentPage(nextPage);
                setIsLoadingMore(false);
            }
        };

        // console.log("✅ Attaching scroll listener");

        container.addEventListener("scroll", handleScroll);
        return () => {
            container.removeEventListener("scroll", handleScroll);
            console.log("🧹 Cleaned up scroll listener");
        };
    }, [scrollContainerRef, currentPage, hasMore, isLoadingMore, searchQuery, loadCustomers]);

    return (
        <div className="flex flex-col mt-6 space-y-6">
            <h1 className="text-heading-6 font-bold text-black">Complaints</h1>
            <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
            />
            <div ref={scrollContainerRef} className="flex flex-col gap-4 h-[650px] overflow-y-auto no-scrollbar overflow-x-auto">
                {complaints.map((item: any, index: number) => {
                    return (
                        <div key={index} className="">
                            <div className="min-w-[1200px]">
                                <ComplaintDetail
                                    key={index}
                                    _id={item._id}
                                    innerData={item}
                                    status={item.status}
                                    option={true} // Matches usage: option="asd"
                                    options={options}
                                    onClick={onClickHandle}
                                />
                            </div>
                        </div>
                    )
                })}
                {/* 🧲 Infinite Scroll Trigger */}
                {isLoadingMore && !searchQuery && hasMore && (
                    <div className="w-full py-4 flex justify-center items-center">
                        <Loader2 className="animate-spin text-gray-500 w-5 h-5" />
                    </div>
                )}
            </div>
        </div>
    )
} 