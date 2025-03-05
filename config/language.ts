import { info } from "console";
import { title } from "process";

export const Language = {
    common: {
        titleEnglish: "Milgapo",
        titleHebrew: "מלגפו"
    },
    footer: {
        allRightsReserved: "כל הזכויות שמורות",
        contact: {
            title: "יצירת קשר",
            email: {
                title: "שליחת מייל",
                address: "contact@milgapo.co.il"
            },
            facebook: {
                title: "פייסבוק",
                link: "https://www.facebook.com/Milgapo-107203894979034"
            },
            instagram: {
                title: "אינסטגרם",
                link: "https://www.instagram.com/milgapo/"
            }
        },
        information: {
            title: "מידע",
            terms: {
                title: "תקנון ההגרלה",
                link: "/terms-and-conditions"
            },
            privacyPolicy: {
                title: "מדיניות פרטיות",
                link: "/privacy-policy"
            }
        },
        quickNavigation: {
            title: "ניווט מהיר",
            home: {
                title: "ראשי",
                link: "/"
            },
            about: {
                title: "אודות",
                link: "/about"
            },
            privacyPolicy: {
                title: "מדיניות פרטיות",
                link: "/privacy-policy"
            }
        }
    }
};

export type CommonConfig = typeof Language;
