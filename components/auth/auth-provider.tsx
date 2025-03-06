"use client";

import { ReactNode } from "react";

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    return <div className="flex-grow flex flex-col justify-center items-center px-4 py-8">{children}</div>;
}
