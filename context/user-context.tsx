"use client";

import { User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

interface UserContextType {
    user: User;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ user, children }: { user: User; children: React.ReactNode }) {
    return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context.user;
}
