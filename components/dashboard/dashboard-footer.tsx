import { t } from "@/config/languages";

export function DashboardFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t p-4 h-[69px]">
            <div className="flex items-center justify-end h-full">
                <div className="text-sm text-muted-foreground">
                    {currentYear} | {t.common.title} | © {t.common.allRightsReserved}
                </div>
            </div>
        </footer>
    );
}
