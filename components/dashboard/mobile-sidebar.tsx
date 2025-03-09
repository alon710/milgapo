"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

import { SidebarContent, UserWithMetadata } from "@/components/dashboard/sidebar-content";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface MobileSidebarProps {
    user: UserWithMetadata;
}

export function MobileSidebar({ user }: MobileSidebarProps) {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 flex flex-col w-64">
                <SidebarContent user={user} onNavigate={handleClose} isMobile={true} />
            </SheetContent>
        </Sheet>
    );
}
