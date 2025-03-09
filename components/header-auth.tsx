import { User } from "@supabase/supabase-js";
import Link from "next/link";

import { signOutAction } from "@/app/actions";
import { t } from "@/config/languages";
import { createClient } from "@/utils/supabase/server";

import { Button } from "./ui/button";

export default async function AuthButton() {
    const supabase = await createClient();
    const getUserGreetingName = (user: User) => {
        if (user?.user_metadata?.name) {
            return user.user_metadata.name;
        }
        if (user.email) {
            return user.email;
        }
        if (user.phone) {
            return user.phone;
        }
    };

    const {
        data: { user }
    } = await supabase.auth.getUser();

    return user ? (
        <div className="flex items-center gap-4">
            {t.common.greeting} {getUserGreetingName(user)}
            <form action={signOutAction}>
                <Button type="submit" variant="outline" size="sm">
                    {t.auth.logout.button}
                </Button>
            </form>
        </div>
    ) : (
        <div className="flex gap-2">
            <Button asChild size="sm" variant={"default"}>
                <Link href="/login">{t.auth.login.submitButton}</Link>
            </Button>
        </div>
    );
}
