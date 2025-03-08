import "../globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist } from "next/font/google";

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
                <body className="bg-background text-foreground" suppressHydrationWarning>
                    {children}
                    <SpeedInsights />
                    <Analytics />
                </body>
            </html>
        </DirectionProviderRTL>
    );
}
