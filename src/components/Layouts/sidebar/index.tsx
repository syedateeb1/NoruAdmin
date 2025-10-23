"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_DATA } from "./data";
import { ArrowLeftIcon, ChevronUp } from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";
import { LogOutIcon } from "../header/user-info/icons";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));
  };

  // ✅ Collapse automatically below lg (1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* ✅ Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "overflow-hidden border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-dark",
          isMobile
            ? [
              "fixed bottom-0 top-0 z-50",
              isOpen ? "w-full max-w-[290px]" : "w-0",
            ]
            : [
              "sticky top-0 h-screen",
              isCollapsed ? "min-w-[90px]" : "min-w-[290px]",
            ]
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-full flex-col py-6 sm:pl-[10px] md:pl-[20px] pr-[7px]">
          {/* ✅ Logo + Collapse Button */}
          <div className="relative flex items-center justify-between pr-4 ">
            <Link
              href="/"
              onClick={() => isMobile && toggleSidebar()}
              className="flex items-center gap-2"
            >
              {/* Always show logo */}
              <Image
                src="/logo.svg"
                alt="Noru Logo"
                width={40}
                height={40}
                className="rounded-md"
              />
              {!isCollapsed && (
                <span className="text-lg font-semibold text-primary dark:text-white transition-all">
                  Noru Admin
                </span>
              )}
            </Link>

            {/* Toggle Button for Desktop */}
            {!isMobile && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              >
                <ArrowLeftIcon
                  className={cn(
                    "size-6 transition-transform duration-300",
                    isCollapsed && "rotate-180"
                  )}
                />
              </button>
            )}

            {/* Close Button for Mobile */}
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <span className="sr-only">Close Menu</span>
                <ArrowLeftIcon className="size-7" />
              </button>
            )}
          </div>

          {/* ✅ Navigation */}
          <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3">
            {NAV_DATA.map((section, i) => (
              <div key={i} className="mb-6">
                <nav role="navigation">
                  <ul className="space-y-2">
                    {section.items.map((item: any) => (
                      <li key={item.title}>
                        {item.items.length ? (
                          <div>
                            <MenuItem
                              isActive={item.items.some(
                                (subItem: { url?: string }) =>
                                  subItem.url === pathname
                              )}
                              onClick={() => toggleExpanded(item.title)}
                            >
                              <item.icon
                                className="size-6 shrink-0 text-gray-5"
                                aria-hidden="true"
                              />
                              {!isCollapsed && <span>{item.title}</span>}
                              {!isCollapsed && (
                                <ChevronUp
                                  className={cn(
                                    "ml-auto rotate-180 transition-transform duration-200",
                                    expandedItems.includes(item.title) &&
                                    "rotate-0"
                                  )}
                                  aria-hidden="true"
                                />
                              )}
                            </MenuItem>
                          </div>
                        ) : (
                          (() => {
                            const href =
                              "url" in item
                                ? item.url + ""
                                : "/" +
                                item.title
                                  .toLowerCase()
                                  .split(" ")
                                  .join("-");
                            return (
                              <>
                                {typeof window !== "undefined" && window.innerWidth < 768 ? (
                                  // ✅ Mobile MenuItem only
                                  <MenuItem
                                    className="flex items-center gap-3 py-3"
                                    as="link"
                                    href={href}
                                    isActive={pathname === href}
                                  >
                                    <item.icon className="size-6 shrink-0" />
                                    <span>{item.title}</span>
                                  </MenuItem>
                                ) : (
                                  // ✅ Desktop MenuItem only
                                  <MenuItem
                                    className="flex items-center gap-3 py-3"
                                    as="link"
                                    href={href}
                                    isActive={pathname === href}
                                  >
                                    <item.icon className="size-6 shrink-0" />
                                    {!isCollapsed && <span>{item.title}</span>}
                                  </MenuItem>
                                )}
                              </>
                            );
                          })()
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}

            {/* ✅ Logout */}
            <ul className="space-y-2">
              <li>
                <div className="flex items-center gap-3 py-3 px-3 hover:text-primary hover:bg-[rgba(255,248,229,1)] rounded-lg cursor-pointer">
                  <LogOutIcon className="scale-x-[-1]" />
                  {!isCollapsed && (
                    <button
                      onClick={() => {
                        logout();
                        router.push("/auth/sign-in");
                      }}
                      className="text-black-2 font-medium hover:text-primary"
                    >
                      Logout
                    </button>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}
