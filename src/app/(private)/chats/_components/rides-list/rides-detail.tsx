

import React, { useEffect, useRef, useState } from 'react';
import { EllipsisVertical } from 'lucide-react';
import { TableCellSkeleton } from '@/components/noru/TableCellSkeleton';

interface OptionType {
    id: string;
    label: string;
}

interface PropType {
    innerData: propDataType;
    _id: string;
    status: string;
    option?: boolean; // Kept as string to match usage: option="asd"
    options?: OptionType[];
    onClick?: (id: string, name: string, status?: string) => void;
}

interface propDataType {
    _id: string,
    image: string,
    email: string,
    phone: string,
    name: string,
    rides: string,
    rating: string,
    status: string,
    drivers: string,
    vehicles: string,
    income: string,
    jobs: string
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
        <div className="grid grid-cols-10  w-full bg-white py-2 px-4 rounded-2xl relative min-h-[60px]">
            <div className=" flex col-span-2 items-center justify-start">
                <TableCellSkeleton image={props.innerData.image} heading={"Name"} name={props.innerData.name} />
            </div>
            <div className=" flex col-span-2 items-center justify-start">
                <TableCellSkeleton heading={"Email"} name={props.innerData.email} />
            </div>
            <div className=" flex items-center justify-start">

                <TableCellSkeleton heading={"Phone"} name={props.innerData.phone} />
            </div>

            <div className=" flex items-center justify-start">

                <TableCellSkeleton heading={"Rides"} name={props.innerData.rides} />
            </div>
            <div className=" flex items-center justify-start">

                <TableCellSkeleton heading={"Rating"} name={props.innerData.rating} />
            </div>
            <div className=" flex items-center justify-center">

                <TableCellSkeleton heading={"Income"} name={props.innerData.income} />
            </div>

            <div className=" flex items-center justify-end">

                <div
                    className={`inline-block px-3 py-1 rounded-full ${props.status === 'active'
                        ? 'bg-green-200 text-green-700'

                        : 'bg-red-200 text-red-700'
                        }`}
                >
                    <p className="font-sans text-caption font-semibold">{props.innerData.status.toLocaleUpperCase()}</p>
                </div>

            </div>
            {props.option && (<div className=" flex items-center justify-end">



                <button ref={buttonRef} onClick={handleIconClick} aria-label="More options">
                    <EllipsisVertical className="w-5 h-5 text-dark-4 hover:text-primary cursor-pointer" />
                </button>

            </div>
            )}
            {isMenuOpen && props.options && (
                <div ref={menuRef} className="absolute right-4 top-12 bg-white shadow-lg rounded-lg p-2 z-10 flex-1">
                    {props.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleOptionClick(option.id, props._id, props.status == "block" ? "active" : "block")}
                            className="block w-full text-left px-4 py-2 text-body-sm font-sans font-medium text-dark-4 hover:bg-gray-1 rounded"
                        >
                            {option.label === "Traveller" ? props.status == "block" ? "Unblock" : "Block" : ""}   {option.label}
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