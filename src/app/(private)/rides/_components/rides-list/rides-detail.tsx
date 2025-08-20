

import React, { useEffect, useRef, useState } from 'react';
import { EllipsisVertical } from 'lucide-react';
import { TableCellSkeleton } from '@/components/noru/TableCellSkeleton';
import { StatusBadge } from '@/components/StatusBadge';

interface OptionType {
    id: string;
    label: string;
}

interface PropType {
    innerData: propDataType;
    _id: string;
    status: string;
    option?: boolean; // Kept as string to match usage: option="asd"
    options?: OptionType[] | null;
    onClick?: (id: string, name: string, status?: string) => void;
}

interface propDataType {
    _id: string,
    name: string,
    first_name?: string,
    last_name?: string,
    status: "assigned" | "open" | "cancelled" | "completed",
    pickup: string,
    dropoff: string,
    fare: string,
    // drivers: string,

}


export const RidesDetail = (props: PropType) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const handleIconClick = () => {
        setIsMenuOpen(prev => !prev);
    };

    const handleOptionClick = (name: string, id: string, status?: string) => {
        if (props.onClick) {
            props.onClick(name, id, status);
        }
        setIsMenuOpen(false);
    };
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isMenuOpen &&
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMenuOpen]);
    return (
        <div className="grid grid-cols-8  w-full bg-white py-2 px-4 rounded-2xl relative min-h-[60px]">
            <div className=" flex  items-center justify-start">
                <TableCellSkeleton heading={"Id"} name={props.innerData._id} />
            </div>
            <div className=" flex  items-center justify-start">
                {/* <TableCellSkeleton heading={"Driver"} name={props.innerData.drivers} /> */}
            </div>
            <div className=" flex col-span-2 items-center justify-start">

                <TableCellSkeleton heading={"Pickup"} name={props.innerData.pickup} />
            </div>
            <div className=" flex col-span-2 px-2 items-center justify-start">

                <TableCellSkeleton heading={"Drop-off"} name={props.innerData.dropoff} />
            </div>
            <div className=" flex ml-2 items-center justify-start">

                <TableCellSkeleton heading={"Fare"} name={props.innerData.fare} />
            </div>

            <div className=" flex items-center justify-end">
                <StatusBadge status={props?.status} />



            </div>
            {/* {props.option && (<div className=" flex items-center justify-end">



                <button ref={buttonRef} onClick={handleIconClick} aria-label="More options">
                    <EllipsisVertical className="w-5 h-5 text-dark-4 hover:text-primary cursor-pointer" />
                </button>

            </div>
            )} */}
            {isMenuOpen && props.options && (
                <div ref={menuRef} className="absolute right-4 top-12 bg-white shadow-lg rounded-lg p-2 z-10 flex-1">
                    {props.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleOptionClick(option.id, props._id, !props.status ? "active" : "block")}
                            className="block w-full text-left px-4 py-2 text-body-sm font-sans font-medium text-dark-4 hover:bg-gray-1 rounded"
                        >
                            {option.label === "Traveller" ? !props.status ? "Unblock" : "Block" : ""}   {option.label}
                        </button>
                    ))}
                </div>
            )}
            {/* {props.innerData.map((item, index) => (
                    <div key={index} className={`flex-1 flex items-end justify-start`}>
                        <RidesDetailSkeleton image={item.image} heading={item.heading} name={item.name} />
                    </div>
                ))}
                <div className="flex  items-end justify-center gap-2 flex-1  ">
                    <div
                        className={`inline-block px-3 py-1 rounded-full ${props.status === 'completed'
                            ? 'bg-green-200 text-green-700'
                            : props.status === 'inprogress'
                                ? 'bg-yellow-200 text-yellow-700'
                                : 'bg-red-200 text-red-700'
                            }`}
                    >
                        <p className="font-sans text-caption font-semibold">{props.status}</p>
                    </div>

                </div>
                {props.option && (<div className="flex items-end justify-center ga  -2 flex-1">


                    <button onClick={handleIconClick} aria-label="More options">
                        <EllipsisVertical className="w-5 h-5 text-dark-4 hover:text-primary cursor-pointer" />
                    </button>

                </div>
                )}
                {isMenuOpen && props.options && (
                    <div className="absolute right-4 top-12 bg-white shadow-lg rounded-lg p-2 z-10 flex-1">
                        {props.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(option.id, props._id)}
                                className="block w-full text-left px-4 py-2 text-body-sm font-sans font-medium text-dark-4 hover:bg-gray-1 rounded"
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )} */}
        </div>
    );
};