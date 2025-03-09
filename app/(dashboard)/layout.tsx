// app/layout.tsx or app/layout.js
import "../globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist } from "next/font/google";
import { redirect } from "next/navigation";

import { DashboardFooter } from "@/components/dashboard/dashboard-footer";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { PageTitle } from "@/components/dashboard/page-title";
import { SidebarContent } from "@/components/dashboard/sidebar-content";
import HeaderAuth from "@/components/header-auth";
import { DirectionProviderRTL } from "@/components/providers";
import { UserProvider } from "@/context/user-context";
import { createClient } from "@/utils/supabase/server";

const geistSans = Geist({
    display: "swap",
    subsets: ["latin"]
});

export default async function DashboardLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    return (
        <DirectionProviderRTL>
            <html lang="he" dir="rtl" className={geistSans.className} suppressHydrationWarning>
                <body className="bg-background text-foreground h-screen flex flex-col" suppressHydrationWarning>
                    <div className="flex h-screen overflow-hidden">
                        {/* Desktop Sidebar */}
                        <aside className="hidden md:flex flex-col w-64 border-s bg-card shadow-sm overflow-hidden">
                            <SidebarContent user={user} />
                        </aside>

                        {/* Main content */}
                        <div className="flex-1 flex flex-col h-full overflow-hidden">
                            {/* Header */}
                            <header className="border-b bg-card py-3 px-4 flex items-center justify-between h-16">
                                {/* Mobile sidebar trigger and title */}
                                <div className="flex items-center gap-4">
                                    {/* Mobile sidebar */}
                                    <MobileSidebar user={user} />

                                    <PageTitle />
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <HeaderAuth />
                                </div>
                            </header>

                            {/* Main content area */}
                            <main className="flex-1 overflow-auto p-4">
                                <div className="mx-auto max-w-7xl">
                                    <UserProvider user={user}>{children}</UserProvider>
                                </div>
                            </main>

                            {/* Footer */}
                            <DashboardFooter />
                        </div>
                    </div>
                    <SpeedInsights />
                    <Analytics />
                </body>
            </html>
        </DirectionProviderRTL>
    );
}
