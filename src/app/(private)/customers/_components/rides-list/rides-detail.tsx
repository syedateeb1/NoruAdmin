

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { EllipsisVertical } from 'lucide-react';
import { TableCellSkeleton } from '@/components/noru/TableCellSkeleton';
import { StatusBadge } from '@/components/StatusBadge';
import { createPortal } from 'react-dom';
import Swal from 'sweetalert2';

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
    role?: string,
    jobs: string
}


export const RidesDetail = (props: PropType) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const scrollParentsRef = useRef<(Element | Window)[]>([]);

    const handleIconClick = () => setIsMenuOpen((p) => !p);
    const handleOptionClick = (name: string, id: string, status?: string, role?: string | number) => {
        if (role === 1) {
            Swal.fire("Error", "You can't delete Admin", "error");
            return
        }
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                // ✅ Only run when user confirms
                props.onClick?.(name, id, status);

                Swal.fire("Deleted!", "The account has been deleted.", "success");
            }
            setIsMenuOpen(false);
        });
    };
    const getScrollParents = (el: HTMLElement | null) => {
        const parents: (Element | Window)[] = [];
        if (!el) return parents;
        let p: HTMLElement | null = el.parentElement;
        const re = /(auto|scroll|overlay)/;
        while (p && p !== document.body) {
            const cs = getComputedStyle(p);
            if (re.test(cs.overflow + cs.overflowX + cs.overflowY)) parents.push(p);
            p = p.parentElement;
        }
        parents.push(window);
        return parents;
    };
    // Compute & clamp menu position
    const updatePosition = () => {
        const btn = buttonRef.current;
        const menu = menuRef.current;
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const menuWidth = menu?.offsetWidth ?? 180;
        const menuHeight = menu?.offsetHeight ?? 160;
        const gutter = 8;

        // Right-align to the button
        let left = rect.right - menuWidth;
        let top = rect.bottom + gutter;

        // Flip up if not enough space below
        if (top + menuHeight > vh) {
            top = rect.top - menuHeight - gutter;
        }

        // Clamp within viewport
        if (left + menuWidth > vw - gutter) left = vw - menuWidth - gutter;
        if (left < gutter) left = gutter;
        if (top < gutter) top = Math.max(gutter, rect.bottom + gutter); // fallback to below if both tight

        setPos({ top, left });
    };

    // Open/close: register listeners on all scroll parents + window resize
    useEffect(() => {
        if (!isMenuOpen) return;

        scrollParentsRef.current = getScrollParents(buttonRef.current);
        const parents = scrollParentsRef.current;

        const onScroll = () => updatePosition();
        const onResize = () => updatePosition();

        parents.forEach((p) =>
            (p as Element).addEventListener?.("scroll", onScroll, { passive: true })
        );
        window.addEventListener("resize", onResize);

        // First compute immediately
        updatePosition();

        return () => {
            parents.forEach((p) =>
                (p as Element).removeEventListener?.("scroll", onScroll)
            );
            window.removeEventListener("resize", onResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMenuOpen]);
    // After the menu mounts/size is known, re-position once more
    useLayoutEffect(() => {
        if (isMenuOpen) requestAnimationFrame(updatePosition);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMenuOpen]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                isMenuOpen &&
                !menuRef.current?.contains(e.target as Node) &&
                !buttonRef.current?.contains(e.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen]);
    return (
        <div className="grid grid-cols-9  w-full bg-white py-2 px-4 rounded-2xl relative min-h-[60px]">
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
            <div className=" flex items-center justify-end">

                <StatusBadge status={props.status === "block" ? "blocked" : "active"} type='badge' />

            </div>
            {props.option && (
                <div className=" flex items-center justify-end">

                    <button ref={buttonRef} onClick={handleIconClick} aria-label="More options">
                        <EllipsisVertical className="w-5 h-5 text-dark-4 hover:text-primary cursor-pointer" />
                    </button>

                </div>
            )}
            {/* {isMenuOpen && props.options && (
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
            )} */}
            {isMenuOpen && props.options &&
                createPortal(
                    <div
                        ref={menuRef}
                        className="fixed z-[10000] bg-white shadow-lg rounded-lg p-2 min-w-[180px] pointer-events-auto"
                        style={{ top: pos.top, left: pos.left }}
                    >
                        {props.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(option.id, props._id, props.status == "block" ? "active" : "block", props.innerData?.role)}
                                className="block w-full text-left px-4 py-2 text-body-sm font-sans font-medium text-dark-4 hover:bg-gray-1 rounded"
                            >
                                {option.label === "Traveller" ? props.status == "block" ? "Unblock" : "Block" : ""}   {option.label}
                            </button>
                        ))}
                    </div>,
                    document.body
                )}

        </div>
    );
};