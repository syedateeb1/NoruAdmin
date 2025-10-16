"use client"
import { fetchRides } from "@/services/ridesService";
import { useCallback, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { scrollDiv } from "@/utils/constants";
import { ViewRideModal } from "@/app/(private)/(home)/_components/recent-rides/_components/modal/ViewRideModal";
import { RidesDetail } from "@/app/(private)/(home)/_components/recent-rides/rides-detail";
const innerData = [
    {
        details: [
            { heading: 'Pickup Location', name: 'Johannesburg' },
            { heading: 'Drop Location', name: 'Cape Town' },
            { heading: 'Driver', name: 'John Doe' },
        ],
        _id: "1",
        status: 'completed',

    },
    {
        details: [
            { heading: 'Pickup Location', name: 'Pretoria' },
            { heading: 'Drop Location', name: 'Durban' },
            { heading: 'Driver', name: 'Jane Smith' },
        ],
        _id: "2",
        status: 'inprogress',

    },
    {
        details: [
            { heading: 'Pickup Location', name: 'Bloemfontein' },
            { heading: 'Drop Location', name: 'Port Elizabeth' },
            { heading: 'Driver', name: 'Mike Johnson' },
        ],
        _id: "3",
        status: 'completed',

    },
    {
        details: [
            { heading: 'Pickup Location', name: 'East London' },
            { heading: 'Drop Location', name: 'Soweto' },
            { heading: 'Driver', name: 'Sarah Brown' },
        ],
        _id: "4",
        status: 'pending',

    },
];
const options = [
    { id: 'view', label: 'View' },
    // { id: 'edit', label: 'Edit' },
    // { id: 'cancel', label: 'Cancel' },
]
interface Location {
    address: string;
}

interface Driver {
    first_name: string;
    last_name: string;
}

interface ApiRide {
    pickup_location: Location;
    dropoff_location: Location;
    price: number;
    assigned_driver: Driver;
    _id: string;
    status?: string;
}

interface DetailItem {
    heading: string;
    name: string;
}

interface TransformedRide {
    details: DetailItem[];
    _id: string;
    status: string;
}

const transformRideData = (rides: ApiRide[]): TransformedRide[] => {
    if (!rides) {
        // console.warn('transformRideData: rides parameter is null or undefined');
        return [];
    }
    // Handle non-array input
    if (!Array.isArray(rides)) {
        // console.error('transformRideData: Expected array but received', typeof rides);
        return [];
    }
    return rides.map(ride => ({
        details: [
            {
                heading: 'Driver',
                name: `${ride.assigned_driver?.first_name || ''} ${ride.assigned_driver?.last_name || ''}`.trim() || 'Not assigned'
            },
            { heading: 'Pickup Location', name: ride.pickup_location?.address || 'Not specified' },
            { heading: 'Drop Location', name: ride.dropoff_location?.address || 'Not specified' },
            { heading: 'Fare', name: ride.price ? `$${ride.price.toFixed(2)}` : '$0.00' },
        ],
        _id: ride._id || 'unknown-id',
        status: ride.status || 'pending'
    }));
};
const ITEMS_PER_PAGE = 8;

export const RidesList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rides, setRides] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedride, setSelectedRide] = useState<any>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [rideOriginal, setrRidesOriginal] = useState<any[]>([]);
    const loadRides = useCallback(
        async (query: string, page = 1) => {
            setLoading(true);
            try {
                const response: any = await fetchRides({ query, page });

                const result = Array.isArray(response)
                    ? response
                    : response.data
                        ? response.data
                        : [];
                setrRidesOriginal(result);
                const transformed = transformRideData(result);

                // HasMore logic
                if (page === 1 && transformed.length < ITEMS_PER_PAGE) {
                    setHasMore(false);
                } else if (page > 1 && transformed.length === 0) {
                    setHasMore(false);
                } else if (transformed.length < ITEMS_PER_PAGE) {
                    setHasMore(false);
                }

                return transformed;
            } catch (err) {
                console.error("❌ Failed to fetch rides:", err);
                return [];
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Initial Fetch
    useEffect(() => {
        const fetchInitial = async () => {
            const data = await loadRides(searchQuery, 1);
            setRides(data);
            setCurrentPage(1);
        };
        fetchInitial();
    }, [searchQuery, loadRides]);
    // if (loading) return <OverviewCardsSkeleton />;


    // Scroll listener
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = async () => {
            const { scrollTop, clientHeight, scrollHeight } = container;
            const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

            if (isNearBottom && hasMore && !isLoadingMore) {
                setIsLoadingMore(true);
                const nextPage = currentPage + 1;
                const newData = await loadRides(searchQuery, nextPage);

                if (newData.length < ITEMS_PER_PAGE) setHasMore(false);

                setRides(prev => [...prev, ...newData]);
                setCurrentPage(nextPage);
                setIsLoadingMore(false);
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [scrollContainerRef, currentPage, hasMore, isLoadingMore, searchQuery, loadRides]);

    const onClickHandle = async (name: string, id: string) => {
        switch (name) {
            case "delete":
                const confirmDelete = await Swal.fire({
                    title: "Are you sure?",
                    text: "You won’t be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Yes, delete it!",
                });
            case "view":

                const rideData = rideOriginal.find(ride => ride._id === id);
                if (rideData) {
                    setSelectedRide(rideData);
                    setIsViewModalOpen(true);
                }
                break;
                // if (confirmDelete.isConfirmed) {
                //     await deleteCustomer(id);
                //     Swal.fire({
                //         title: "Deleted!",
                //         text: "The ride/customer has been deleted.",
                //         icon: "success",
                //         timer: 1500,
                //         showConfirmButton: false,
                //     });

                //     const updatedData = await loadRides(searchQuery, 1);
                //     setRides(updatedData);
                //     setCurrentPage(1);
                //     setHasMore(true);
                // }
                break;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col mt-6 space-y-6">
                <h1 className="text-heading-6 font-bold text-black">Recent Rides</h1>
                <div className="flex flex-col gap-4 h-[650px] overflow-y-auto no-scrollbar">
                    {/* Loading skeletons or spinner */}
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }
    return (
        <>
            <div className="flex flex-col mt-6 space-y-6">
                <h1 className="text-heading-6 font-bold text-black">Recent Rides</h1>
                <div
                    ref={scrollContainerRef}
                    className={scrollDiv}

                >

                    {rides.length > 0 ? (
                        rides.map((item, index) => (
                            <div key={index} className="">
                                <div className="min-w-[800px] ">
                                    <RidesDetail
                                        key={index}
                                        _id={item._id}
                                        innerData={item.details}
                                        status={item.status}
                                        option={true}
                                        options={options}
                                        onClick={onClickHandle}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">No rides found</p>
                        </div>
                    )}

                </div>
            </div>
            {isViewModalOpen && (
                <ViewRideModal
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                    ride={selectedride}
                // onClickHandle={onClickHandle}
                />
            )}
        </>
    )
} 