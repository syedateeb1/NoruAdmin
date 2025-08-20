"use client"
import { Search, Loader2 } from "lucide-react";
import { RidesDetail } from "./rides-detail"
import { useEffect, useRef, useState } from "react";
import data from "../../fetch.json"
import { inputCss } from "@/utils/constants";
const image = "https://media.istockphoto.com/id/1809645289/photo/sports-car-driving-at-on-a-road-on-high-speed-racing-through-the-colorful-dark-tunnel-with.webp?a=1&b=1&s=612x612&w=0&k=20&c=LxcEDz82h45rRZWmdIUqMSSQGHdoKWbm_NAmvSei_hU=";

const options = [
    { id: 'delete', label: 'Delete Traveller' },
    { id: 'block', label: 'Traveller' },
]

const ITEMS_PER_PAGE = 4;
export const RidesList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState(data.data);
    const [currentPage, setCurrentPage] = useState(1);
    const [displayedData, setDisplayedData] = useState<any[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const observerRef = useRef<HTMLDivElement | null>(null);
    const onClickHandle = (name: string, id: string, status?: string) => {
        console.log(name, id, status, "name");
        if (status) {
            const updatedData = filteredData.map((item) => {
                if (item._id === id) {
                    return { ...item, status: status };
                }
                return item;
            });
            setFilteredData(updatedData);
            setDisplayedData((prev) =>
                prev.map((item) => (item._id === id ? { ...item, status } : item))
            );
        }
    };
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
            // Real API call example (uncomment and replace with your endpoint)
            /*
            async function fetchData() {
              try {
                const response = await fetch(`/api/rides?search=${encodeURIComponent(searchQuery)}`);
                const data = await response.json();
                setFilteredData(data);
              } catch (error) {
                console.error('Error fetching data:', error);
              }
            }
            fetchData();
            */
        }, 300); // Debounce for 300ms

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);
    useEffect(() => {
        if (!observerRef.current || !hasMore || searchQuery) return
        console.log("observerRef.current", observerRef.current);
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

    const formattedData = filteredData.map((item) => ({
        _id: item._id,
        image: item.image,
        email: item.email,
        phone: item.phone,
        name: item.name,
        rides: item.rides,
        rating: item.rating,
        status: item.status,
        drivers: item.drivers,
        vehicles: item.vehicles,
        jobs: item.jobs
    }));
    console.log(formattedData, "formattedData");
    return (
        <div className="flex flex-col mt-6 space-y-6 w-full">
            <h1 className="text-heading-6 font-bold text-black">Drivers</h1>
            <div className='h-10 relative w-full px-2'>
                <input
                    type="text"
                    placeholder="Search..."
                    className={inputCss}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2" />

            </div>
            <div className="flex flex-col gap-4 h-[650px] overflow-y-auto no-scrollbar overflow-x-auto">
                {displayedData.map((item, index) => {
                    return (
                        <div key={index} className="">
                            <div className="min-w-[1200px]">
                                <RidesDetail
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