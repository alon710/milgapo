import { GraduationCapIcon } from "lucide-react";
import Link from "next/link";
import { JSX } from "react/jsx-runtime";

import { commonConfig } from "@/config/common";

type LogoProps = {
    href: string;
};

export const Logo = (props: LogoProps): JSX.Element => {
    return (
        <>
            <div className="col-span-full xl:col-span-2">
                <Link href={props.href} className="flex font-bold items-center">
                    <GraduationCapIcon className="w-9 h-9 mx-2" />
                    <h3 className="text-2xl">{commonConfig.titleEnglish}</h3>
                </Link>
            </div>
        </>
    );
};
