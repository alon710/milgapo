import { t } from "./languages";

// This file now only contains app-wide configuration that isn't language specific
export const commonConfig = {
    appVersion: "1.0.0",
    copyrightYear: new Date().getFullYear()
};

export type CommonConfig = typeof commonConfig;
