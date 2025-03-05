"use client";

import { InfoIcon } from "lucide-react";

import { useUser } from "@/context/user-context";

export default function DashboardPage() {
    const user = useUser();

    return (
        <div className="flex-1 w-full flex flex-col gap-12">
            <div className="w-full">
                <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
                    <InfoIcon size="16" strokeWidth={2} /> This is a dashboard page that you can only see as an
                    authenticated user
                </div>
            </div>
            <div className="flex flex-col gap-2 items-start">
                <h2 className="font-bold text-2xl mb-4">Your user details</h2>
                <pre className="text-xs font-mono p-3 rounded border max-h-128 overflow-auto">
                    {JSON.stringify(user, null, 2)}
                </pre>
            </div>
        </div>
    );
}
