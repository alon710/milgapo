// app/layout.tsx or app/layout.js
import "../globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist } from "next/font/google";
import { redirect } from "next/navigation";

import HeaderAuth from "@/components/header-auth";
import { SiteLogo } from "@/components/layout/site-logo";
import { DirectionProviderRTL } from "@/components/providers";
import { UserProvider } from "@/context/user-context";
import { createClient } from "@/utils/supabase/server";

const geistSans = Geist({
    display: "swap",
    subsets: ["latin"]
});

export default async function RootLayout({
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
            <html className={geistSans.className} suppressHydrationWarning>
                <body className="bg-background text-foreground" suppressHydrationWarning>
                    <div className="w-full flex flex-col gap-20 items-center pb-20">
                        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                                <SiteLogo href="/" />
                                <HeaderAuth />
                            </div>
                        </nav>
                        <div className="flex flex-col gap-20 max-w-5xl p-5">
                            <UserProvider user={user}>{children}</UserProvider>
                            <SpeedInsights />
                            <Analytics />
                        </div>
                    </div>
                </body>
            </html>
        </DirectionProviderRTL>
    );
}
