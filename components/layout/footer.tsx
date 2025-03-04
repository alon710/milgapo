import { commonConfig } from "@/config/common";
import { SiteLogo } from "@/components/layout/site-logo"; // Add this import

export function SiteFooter() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="border-grid border-t py-6 md:py-0">
            <div className="container-wrapper">
                <div className="container py-4">
                    <div className="flex items-center justify-between">
                        <div className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-right">
                            {currentYear} | {commonConfig.titleHebrew} | {commonConfig.allRightsReserved} ©
                        </div>
                        <SiteLogo href="/" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
