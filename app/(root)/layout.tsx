import "../globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist } from "next/font/google";

import HeaderAuth from "@/components/header-auth";
import { SiteFooter } from "@/components/layout/footer";
import { SiteLogo } from "@/components/layout/site-logo";
import { DirectionProviderRTL } from "@/components/providers";
import { t } from "@/config/languages";

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: `${t.common.title} - ${t.common.logoSubtitle}`,
    description: t.common.slogan
};

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
        <DirectionProviderRTL>
            <html className={geistSans.className} suppressHydrationWarning>
                <body className="bg-background text-foreground">
                    <div className="flex flex-col min-h-screen">
                        <main className="flex-1 flex flex-col items-center">
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
                        </main>
                        <SiteFooter />
                    </div>
                </body>
            </html>
        </DirectionProviderRTL>
    );
}
