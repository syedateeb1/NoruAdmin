

import React, { useState } from 'react';
import { EllipsisVertical } from 'lucide-react';
import { RidesDetailSkeleton } from './rids-skelton';

interface OptionType {
    id: string;
    label: string;
}

interface PropType {
    innerData: propDataType[];
    _id: string;
    status: string;
    option?: boolean; // Kept as string to match usage: option="asd"
    options?: OptionType[];
    onClick?: (id: string, name: string) => void;
}

interface propDataType {
    heading: string;
    name: string;
}

export const RidesDetail = (props: PropType) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleIconClick = () => {
        setIsMenuOpen(prev => !prev);
    };

    const handleOptionClick = (name: string, id: string) => {
        const pickup = props.innerData.find((item) => item.heading === 'Pickup Location')?.name || '';
        const drop = props.innerData.find((item) => item.heading === 'Drop Location')?.name || '';

        if (props.onClick) {
            props.onClick(name, id);
        }
        setIsMenuOpen(false);
    };

    return (
        <div className="flex flex-row items-center justify-between w-full bg-white py-2 px-4 rounded-2xl relative">
            {props.innerData.map((item, index) => (
                <div key={index} className={`flex-1 flex items-end justify-start`}>
                    <RidesDetailSkeleton heading={item.heading} name={item.name} />
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
            )}
        </div>
    );
};