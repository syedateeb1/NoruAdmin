"use client"
import { Header } from '@/components/Layouts/header'
import { Sidebar } from '@/components/Layouts/sidebar'
import { useSidebarContext } from '@/components/Layouts/sidebar/sidebar-context';
import { Menu } from 'lucide-react';
import React from 'react'


const Layout = ({ children }: { children: React.ReactNode }) => {
    const { toggleSidebar, isMobile } = useSidebarContext();

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="w-full bg-pink-50">
                {/* Mobile Menu Button (since no header exists) */}
                {isMobile && (
                    <div className="p-3 border-b border-gray-200 bg-white sticky top-0 z-30 flex items-center">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <Menu className="h-6 w-6" />

                        </button>

                    </div>
                )}

                <main className="isolate mx-auto w-full overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default Layout 