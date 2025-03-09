"use client";

import { usePathname } from "next/navigation";

import { t } from "@/config/languages";

export function PageTitle() {
    const pathname = usePathname();

    let title = t.dashboard.header.title; // Default title

    // Check current route and set appropriate title
    if (pathname === "/dashboard") {
        title = t.dashboard.navigation.dashboard;
    } else if (pathname === "/dashboard/settings") {
        title = t.dashboard.navigation.settings;
    } else if (pathname.startsWith("/dashboard/")) {
        // Extract the last part of the path for other dashboard pages
        const segment = pathname.split("/").pop();
        if (segment) {
            // Capitalize the first letter and replace dashes with spaces
            title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
        }
    }

    return <h1 className="text-lg font-semibold">{title}</h1>;
}
