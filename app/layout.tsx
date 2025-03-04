import HeaderAuth from "@/components/header-auth";
import { Geist } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteLogo } from "@/components/layout/site-logo";
import { SiteFooter } from "@/components/layout/footer";
import { commonConfig } from "@/config/common";
import { Analytics } from "@vercel/analytics/react";

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: commonConfig.titleHebrew,
    description: commonConfig.description
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
        <html lang="he" dir="rtl" className={geistSans.className} suppressHydrationWarning>
            <body className="bg-background text-foreground">
                <main className="min-h-screen flex flex-col items-center">
                    <div className="flex-1 w-full flex flex-col gap-20 items-center">
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
                        <SiteFooter />
                    </div>
                </main>
            </body>
        </html>
    );
}
