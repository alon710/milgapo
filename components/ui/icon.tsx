import * as icons from "lucide-react";
import { LucideProps } from "lucide-react";

export const Icon = ({
    name,
    color,
    size,
    className
}: {
    name: keyof typeof icons;
    color: string;
    size: number;
    className?: string;
}) => {
    const LucideIcon = icons[name] as React.ComponentType<LucideProps>;

    if (!LucideIcon) {
        console.error(`Icon "${name}" not found in lucide-react.`);
        return null;
    }

    return <LucideIcon color={color} size={size} className={className} />;
};
