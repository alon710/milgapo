import "../globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist } from "next/font/google";

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
                {children}
                <SpeedInsights />
                <Analytics />
            </body>
        </html>
    );
}
