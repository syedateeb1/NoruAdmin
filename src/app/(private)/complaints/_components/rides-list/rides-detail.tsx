

import React, { useEffect, useRef, useState } from 'react';
import { EllipsisVertical } from 'lucide-react';
import { TableCellSkeleton } from '@/components/noru/TableCellSkeleton';
import Swal from 'sweetalert2';
import { updateComplaint } from '@/services/complaintService';

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
    complaint_from: userDetail,
    complaint_gainst: userDetail,
    title: string,
    description: string
}
interface userDetail {
    image?: string,
    name?: string,
    first_name?: string,
    last_name?: string,
    phone_number: string,
    _id: string
}

export const ComplaintDetail = (props: PropType) => {
    console.log({ props });
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
        <div className="flex flex-col  w-full bg-white py-2 px-4 rounded-2xl relative min-h-[300px]">
            <div className='flex flex-col  mt-2' key={props.innerData?.complaint_from?._id}>
                <h5 className="font-sans text-heading-8  font-bold text-dark-6 ">Complaing From:</h5>
                <span className='flex gap-2 items-center'>
                    {props?.innerData?.complaint_from?.image && (<img className='w-8 h-8 rounded-full' src={props?.innerData?.complaint_from?.image} alt={props.innerData?.complaint_from?.name} />)}
                    <span className='flex flex-col '>
                        <span className='font-sans text-heading-8 font-bold text-black '>
                            {props.innerData?.complaint_from?.first_name || props.innerData?.complaint_from?.last_name
                                ? `${props.innerData?.complaint_from?.first_name || ''} ${props.innerData?.complaint_from?.last_name || ''}`.trim()
                                : 'N/A'}
                        </span>                        <span className='font-sans text-heading-8 font-bold text-dark-6 '>{props.innerData?.complaint_from?.phone_number}</span>
                    </span>
                </span>
            </div>
            <div className='flex flex-col  mt-2'>
                <h5 className="font-sans text-heading-8  font-bold text-dark-6 ">Against:</h5>
                <span className='flex gap-2 items-center'>
                    {props.innerData?.complaint_gainst?.image && (<img className='w-8 h-8 rounded-full' src={props.innerData?.complaint_gainst?.image} alt={props.innerData?.complaint_gainst?.name} />)}
                    <span className='flex flex-col '>
                        <span className='font-sans text-heading-8 font-bold text-black '>
                            {props.innerData?.complaint_gainst?.first_name || props.innerData?.complaint_gainst?.last_name
                                ? `${props.innerData?.complaint_gainst?.first_name || ''} ${props.innerData?.complaint_gainst?.last_name || ''}`.trim()
                                : 'N/A'}
                        </span>

                        <span className='font-sans text-heading-8 font-bold text-dark-6 '>{props.innerData?.complaint_gainst?.phone_number}</span>
                    </span>
                </span>
            </div>
            <div className='flex mt-2 gap-2'>
                <span className='font-sans text-heading-8 font-bold text-dark-2 '>Reason:</span> <span className='font-sans text-heading-8 font-medium text-dark-2'>{props.innerData?.title}</span>
            </div>
            <div className='flex mt-2 gap-2'>
                <span className='font-sans text-heading-8 font-medium text-dark-2'>{props.innerData.description}</span>
            </div>
            <div className='flex items-end justify-end'>
                <button className='bg-blue-button py-1 px-4 font-sans text-heading-8 font-medium text-white rounded-lg'
                    onClick={() => handleOptionClick('Take Action', props._id)}
                >Take Action</button>
            </div>
        </div>
    );
};