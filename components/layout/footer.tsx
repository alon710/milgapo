import { commonConfig } from "@/config/common";

export function SiteFooter() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="border-grid border-t py-6 md:py-0">
            <div className="container-wrapper">
                <div className="container py-4">
                    <div className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                        {currentYear} | {commonConfig.titleHebrew} | {commonConfig.allRightsReserved} &copy;
                    </div>
                </div>
            </div>
        </footer>
    );
}
