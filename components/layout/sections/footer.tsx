import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { Language } from "@/config/language";

import { Logo } from "../logo";

// Define footer categories and links
const footerLinks = [
    {
        title: Language.footer.contact.title,
        items: [
            {
                title: Language.footer.contact.email.title,
                link: `mailto:${Language.footer.contact.email.address}`,
                target: "_blank"
            },
            {
                title: Language.footer.contact.facebook.title,
                link: Language.footer.contact.facebook.link,
                target: "_blank"
            },
            {
                title: Language.footer.contact.instagram.title,
                link: Language.footer.contact.instagram.link,
                target: "_blank"
            }
        ]
    },
    {
        title: Language.footer.information.title,
        items: [
            {
                title: Language.footer.information.terms.title,
                link: Language.footer.information.privacyPolicy.link
            },
            {
                title: Language.footer.information.privacyPolicy.title,
                link: Language.footer.information.terms.link
            }
        ]
    },
    {
        title: Language.footer.quickNavigation.title,
        items: [
            {
                title: Language.footer.quickNavigation.home.title,
                link: Language.footer.quickNavigation.home.link
            },
            {
                title: Language.footer.quickNavigation.about.title,
                link: Language.footer.quickNavigation.about.link
            },
            {
                title: Language.footer.quickNavigation.privacyPolicy.title,
                link: Language.footer.quickNavigation.privacyPolicy.link
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
                        &copy; {new Date().getFullYear()} {Language.common.titleHebrew} -{" "}
                        {Language.footer.allRightsReserved}
                    </h3>
                </section>
            </div>
        </footer>
    );
};
