import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EllipsisVertical } from "lucide-react";
import { RidesDetailSkeleton } from "./rids-skelton";

interface OptionType {
    id: string;
    label: string;
}

interface PropType {
    innerData: propDataType[];
    _id: string;
    status: string;
    option?: boolean;
    options?: OptionType[];
    onClick?: (id: string, name: string) => void;
}

interface propDataType {
    heading: string;
    name: string;
}

export const RidesDetail = (props: PropType) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const scrollParentsRef = useRef<(Element | Window)[]>([]);

    const handleIconClick = () => setIsMenuOpen((prev) => !prev);

    const handleOptionClick = (name: string, id: string) => {
        props.onClick?.(name, id);
        setIsMenuOpen(false);
    };

    // Get scrollable ancestors
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

    // Update dropdown position relative to button
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

        let left = rect.right - menuWidth;
        let top = rect.bottom + gutter;

        if (top + menuHeight > vh) top = rect.top - menuHeight - gutter;
        if (left + menuWidth > vw - gutter) left = vw - menuWidth - gutter;
        if (left < gutter) left = gutter;

        setPos({ top, left });
    };

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

        updatePosition();

        return () => {
            parents.forEach((p) =>
                (p as Element).removeEventListener?.("scroll", onScroll)
            );
            window.removeEventListener("resize", onResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMenuOpen]);

    useLayoutEffect(() => {
        if (isMenuOpen) requestAnimationFrame(updatePosition);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMenuOpen]);

    // Close menu on outside click
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
        <div className="w-full overflow-x-auto">
            <div className="flex flex-row items-center justify-between min-w-max bg-white py-2 px-4 rounded-2xl relative">
                {props.innerData.map((item, index) => (
                    <div
                        key={index}
                        className={`flex-1 px-1 flex items-end ${item.heading === "Fare"
                            ? "justify-center"
                            : "justify-start"
                            }`}
                    >
                        <RidesDetailSkeleton heading={item.heading} name={item.name} />
                    </div>
                ))}

                {/* Status badge */}
                <div className="flex items-end justify-center gap-2 flex-1">
                    <div
                        className={`inline-block px-5 py-2 rounded-full font-sans text-body-lg font-semibold ${props.status === "assigned"
                            ? "bg-green-200 text-green-700"
                            : props.status === "open"
                                ? "bg-blue-200 text-blue-700"
                                : props.status === "completed"
                                    ? "bg-purple-200 text-purple-700"
                                    : "bg-red-200 text-red-700"
                            }`}
                    >
                        <p>{props.status}</p>
                    </div>
                </div>

                {/* Three-dot button */}
                {props.option && (
                    <div className="flex items-end justify-center flex-1">
                        <button ref={buttonRef} onClick={handleIconClick} aria-label="More options">
                            <EllipsisVertical className="w-5 h-5 text-dark-4 hover:text-primary cursor-pointer" />
                        </button>
                    </div>
                )}
            </div>

            {/* Floating menu rendered in portal */}
            {isMenuOpen &&
                props.options &&
                createPortal(
                    <div
                        ref={menuRef}
                        className="fixed z-[10000] bg-white shadow-lg rounded-lg p-2 min-w-[180px]"
                        style={{ top: pos.top, left: pos.left }}
                    >
                        {props.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(option.id, props._id)}
                                className="block w-full text-left px-4 py-2 text-sm font-medium text-dark-4 hover:bg-gray-100 rounded"
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>,
                    document.body
                )}
        </div>
    );
};
