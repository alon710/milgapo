import "../globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist } from "next/font/google";

import HeaderAuth from "@/components/header-auth";
import { SiteLogo } from "@/components/layout/site-logo";

const geistSans = Geist({
    display: "swap",
    subsets: ["latin"]
});

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="he" dir="rtl" className={geistSans.className} suppressHydrationWarning>
            <body className="bg-background text-foreground">
                <div className="w-full flex flex-col gap-20 items-center pb-20">
                    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                            <SiteLogo href="/" />
                            <HeaderAuth />
                        </div>
                    </nav>
                    <div className="flex flex-col gap-20 max-w-5xl p-5">
                        {children}
                        <SpeedInsights />
                        <Analytics />
                    </div>
                </div>
            </body>
        </html>
    );
}
