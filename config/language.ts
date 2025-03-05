import { info } from "console";
import { title } from "process";

export const L = {
    common: {
        titleEnglish: "Milgapo",
        titleHebrew: "מלגפו"
    },
    auth: {
        orContinueWith: "או המשך באמצעות",
        loginFormSubTitle: "התחברות לחשבון האישי",
        LoginButtonText: "התחבר",
        LoginButtonPendingText: "מתחבר...",
        logoutButtonText: "התנתק",
        greeting: "שלום",
        phone: "טלפון",
        email: "אימייל",
        providers: {
            google: "Google",
            facebook: "Facebook"
        },
        otp: {
            title: "אימות קוד",
            enterOtp: "הכנס קוד",
            OtpButtonText: "אימות",
            OtpButtonPendingText: "מאמת..."
        }
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

export type CommonConfig = typeof L;
