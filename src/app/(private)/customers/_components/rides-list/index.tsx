"use client"
import { Search, Loader2 } from "lucide-react";
import { RidesDetail } from "./rides-detail"
import { useEffect, useRef, useState } from "react";
import data from "../../fetch.json"
import { customersList, deleteCustomer } from "@/services/customerService";
import { inputCss, scrollDiv } from "@/utils/constants";
import SearchInput from "@/components/SearchComponent";
const image = "https://media.istockphoto.com/id/1809645289/photo/sports-car-driving-at-on-a-road-on-high-speed-racing-through-the-colorful-dark-tunnel-with.webp?a=1&b=1&s=612x612&w=0&k=20&c=LxcEDz82h45rRZWmdIUqMSSQGHdoKWbm_NAmvSei_hU=";

const options = [
    { id: 'delete', label: 'Delete Account' },
    // { id: 'block', label: 'Traveller' },
]

interface ApiUser {
    _id: string;
    first_name: string;
    full_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    profile_image?: string;
    total_reviews?: number;
    approved?: boolean;
    is_online?: boolean;
    average_rating?: number;
    registration_status?: number;
    role?: string
    // ... other fields
}

interface TransformedUser {
    _id: string;
    image: string;
    email: string;
    phone: string;
    name: string;
    rides: string;
    rating: string;
    status: "active" | "block";
    role?: string
}

const transformRideData = (apiResponse: { data?: ApiUser[] }): TransformedUser[] => {
    // console.log({ apiResponse });
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
        image: user.profile_image
            ? `${process.env.NEXT_PUBLIC_API_URL}/${user.profile_image}`
            : "https://media.istockphoto.com/id/1809645289/photo/sports-car-driving-at-on-a-road-on-high-speed-racing-through-the-colorful-dark-tunnel-with.webp?a=1&b=1&s=612x612&w=0&k=20&c=LxcEDz82h45rRZWmdIUqMSSQGHdoKWbm_NAmvSei_hU=",
        email: user.email,
        phone: user.phone_number,
        name: user.full_name || `${user.first_name} ${user.last_name}`,
        rides: user.total_reviews?.toString() || "0",
        rating: user.average_rating?.toFixed(1)?.toString() || "0",
        status: user.registration_status === 4 ? "active" : "block",
        blocked: user.approved ? "active" : "block",
        is_online: user.is_online ? "active" : "block",
        role: user.role
    }));
};
const ITEMS_PER_PAGE = 4;
export const CustomersList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState(data.data);
    const [currentPage, setCurrentPage] = useState(1);
    const [displayedData, setDisplayedData] = useState<any[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const observerRef = useRef<HTMLDivElement | null>(null);

    const onClickHandle = (name: string, id: string, status?: string) => {
        switch (name) {

            case "delete":
                deleteCustomer(id);
                loadCustomers(searchQuery);
                break;
        }

    };
    const loadCustomers = async (searchQuery: string) => {
        try {
            const response: any = await customersList(searchQuery);
            // console.log('API Response:', response); // Debugging

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
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers(searchQuery);
    }, [searchQuery]);
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            // Simulate API call with client-side filtering
            const lowerQuery = searchQuery.toLowerCase();
            const filtered = data.data.filter(
                (item) =>
                    item.name.toLowerCase().includes(lowerQuery) ||
                    item.email.toLowerCase().includes(lowerQuery) ||
                    item.phone.toLowerCase().includes(lowerQuery)
            );
            setFilteredData(filtered);
            setDisplayedData(filtered.slice(0, ITEMS_PER_PAGE));
            setCurrentPage(1);
            setHasMore(filtered.length > ITEMS_PER_PAGE);
            loadCustomers(searchQuery);

        }, 300); // Debounce for 300ms

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);
    useEffect(() => {
        if (!observerRef.current || !hasMore || searchQuery) return
        // console.log("observerRef.current", observerRef.current);
        const obersver = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting) {
                const nextPage = currentPage + 1;
                const nextItems = filteredData.slice(0, nextPage * ITEMS_PER_PAGE);
                setDisplayedData(nextItems);
                setCurrentPage(nextPage);
                setIsLoadingMore(false);

                if (nextItems.length >= filteredData.length) {
                    setHasMore(false);
                }
            }
        },
            { threshold: 1.0 }
        );
        obersver.observe(observerRef.current);
        return () => obersver.disconnect();
    }, [filteredData, currentPage, searchQuery, hasMore]);

    return (
        <div className="flex flex-col mt-6 space-y-6">
            <h1 className="text-heading-6 font-bold text-black">Customers</h1>
            <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
            />
            <div className={scrollDiv}>
                {customers.map((item, index) => {
                    return (
                        item.role !== 1 && ( // 👈 check role here
                            <div key={index}>
                                <div className="min-w-[1200px]">
                                    <RidesDetail
                                        _id={item._id}
                                        innerData={item}
                                        status={item.status}
                                        option={true}
                                        options={options}
                                        onClick={onClickHandle}
                                    />
                                </div>
                            </div>
                        )
                    );
                })}

                {/* 🧲 Infinite Scroll Trigger */}
                {!searchQuery && hasMore && (
                    <div ref={observerRef} className="w-full h-12 flex justify-center items-center">
                        {isLoadingMore && (
                            <Loader2 className="animate-spin text-gray-500 w-5 h-5" />
                        )}
                    </div>
                )}
            </div>
        </div>
    )
} 