import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-grid border-t py-6 md:py-0">
      <div className="container-wrapper">
        <div className="container py-4">
          <div className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {currentYear} | {siteConfig.title} | All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
