import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { L } from "@/config/language";

import { Logo } from "../logo";

// Define footer categories and links
const footerLinks = [
    {
        title: L.footer.contact.title,
        items: [
            {
                title: L.footer.contact.email.title,
                link: `mailto:${L.footer.contact.email.address}`,
                target: "_blank"
            },
            {
                title: L.footer.contact.facebook.title,
                link: L.footer.contact.facebook.link,
                target: "_blank"
            },
            {
                title: L.footer.contact.instagram.title,
                link: L.footer.contact.instagram.link,
                target: "_blank"
            }
        ]
    },
    {
        title: L.footer.information.title,
        items: [
            {
                title: L.footer.information.terms.title,
                link: L.footer.information.privacyPolicy.link,
                target: "_self"
            },
            {
                title: L.footer.information.privacyPolicy.title,
                link: L.footer.information.terms.link,
                target: "_self"
            }
        ]
    },
    {
        title: L.footer.quickNavigation.title,
        items: [
            {
                title: L.footer.quickNavigation.home.title,
                link: L.footer.quickNavigation.home.link,
                target: "_self"
            },
            {
                title: L.footer.quickNavigation.about.title,
                link: L.footer.quickNavigation.about.link,
                target: "_self"
            },
            {
                title: L.footer.quickNavigation.privacyPolicy.title,
                link: L.footer.quickNavigation.privacyPolicy.link,
                target: "_self"
            }
        ]
    }
];

export const FooterSection = () => {
    return (
        <footer id="footer" className="container py-24 sm:py-32">
            <div className="p-10 bg-card border border-secondary rounded-2xl">
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
                    <div className="col-span-full xl:col-span-2">
                        <Logo href="/" />
                    </div>

                    {footerLinks.map((category, index) => (
                        <div key={index} className="flex flex-col gap-2">
                            <h3 className="font-bold text-lg">{category.title}</h3>
                            {category.items.map((item, idx) => (
                                <div key={idx}>
                                    <Link
                                        href={item.link}
                                        target={item.target}
                                        className="opacity-60 hover:opacity-100"
                                    >
                                        {item.title}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <Separator className="my-6" />
                <section>
                    <h3>
                        &copy; {new Date().getFullYear()} {L.common.titleHebrew} - {L.footer.allRightsReserved}
                    </h3>
                </section>
            </div>
        </footer>
    );
};
