"use client";

import { ChevronRight, Home, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { t } from "@/config/languages";

interface SidebarNavigationProps {
    onNavigate?: () => void;
}

export function SidebarNavigation({ onNavigate }: SidebarNavigationProps) {
    const pathname = usePathname();

    // Define navigation items with their paths and icons
    const navItems = [
        { name: t.dashboard.navigation.dashboard, path: "/dashboard", icon: Home },
        { name: t.dashboard.navigation.settings, path: "/dashboard/settings", icon: Settings }
    ];

    const handleClick = () => {
        if (onNavigate) {
            onNavigate();
        }
    };

    return (
        <nav className="space-y-1 px-2">
            {navItems.map((item) => {
                const Icon = item.icon;
                // Check if the current path matches this item's path
                // For the dashboard item, check for exact match or if it's a subpath
                const isActive =
                    item.path === "/dashboard"
                        ? pathname === "/dashboard" ||
                          (pathname.startsWith("/dashboard/") && pathname !== "/dashboard/settings")
                        : pathname === item.path || pathname.startsWith(`${item.path}/`);

                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        onClick={handleClick}
                        className={`
                            flex items-center justify-between px-3 py-2.5 text-sm rounded-md transition-all
                            ${
                                isActive
                                    ? "bg-primary/10 text-primary font-medium shadow-sm"
                                    : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
                            }
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                            <span className={isActive ? "font-medium" : ""}>{item.name}</span>
                        </div>
                        {isActive && <ChevronRight className="h-4 w-4 text-primary opacity-70" />}
                    </Link>
                );
            })}
        </nav>
    );
}
