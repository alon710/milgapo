"use client";

import { DirectionProvider } from "@radix-ui/react-direction";

export const DirectionProviderRTL = ({ children }: { children: React.ReactNode }) => {
    return <DirectionProvider dir="rtl">{children}</DirectionProvider>;
};
