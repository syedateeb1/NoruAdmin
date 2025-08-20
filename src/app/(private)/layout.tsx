import { Header } from '@/components/Layouts/header'
import { Sidebar } from '@/components/Layouts/sidebar'
import React from 'react'


const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <div className="w-full bg-pink-50">
                {/* <Header /> */}

                <main className="isolate mx-auto w-full overflow-hidden ">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default layout