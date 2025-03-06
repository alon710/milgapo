"use client";

import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { JSX } from "react/jsx-runtime";

import { t } from "@/config/languages";

type SiteLogoProps = {
    href: string;
};

export const SiteLogo = (props: SiteLogoProps): JSX.Element => {
    return (
        <Link
            href={props.href}
            className="inline-flex items-center transition-all duration-200 hover:scale-105 hover:opacity-95"
        >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-primary" />
            </div>
            <div className="mr-3 flex flex-col items-start">
                <span className="text-xl font-medium tracking-tight text-foreground">{t.common.titleEnglish}</span>
                <span className="text-sm text-muted-foreground">{t.common.logoSubtitle}</span>
            </div>
        </Link>
    );
};
