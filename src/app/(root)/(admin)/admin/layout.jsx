'use client'
import AppSidebar from '@/components/Application/Admin/AppSidebar'
import Topbar from '@/components/Application/Admin/Topbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import ThemeProvider from "@/components/Application/Admin/ThemeProvider"
const layout = ({ children }) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange>
            <SidebarProvider>
                <AppSidebar />
                <main className="md:w-[calc(100vw-16rem)]">
                    <div className='px-8 pt-[70px] min-h-[calc(100vh-40px)]  pb-10'>
                        <Topbar />
                        {children}
                    </div>
                    <div className='border-t h-[40px] flex justify-center items-center bg-gray-50 dark:bg-background text-sm'>
                        © 2025   Compnay All Rights Reserved
                    </div>
                </main>
            </SidebarProvider>
        </ThemeProvider >

    )
}

export default layout
