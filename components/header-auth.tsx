import { User } from "@supabase/supabase-js";
import Link from "next/link";

import { signOutAction } from "@/app/actions";
import { authConfig } from "@/config/auth";
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
            {authConfig.greeting} {getUserGreetingName(user)}
            <form action={signOutAction}>
                <Button type="submit" variant={"default"} size="sm">
                    {authConfig.logoutButtonText}
                </Button>
            </form>
        </div>
    ) : (
        <div className="flex gap-2">
            <Button asChild size="sm" variant={"default"}>
                <Link href="/login">{authConfig.LoginButtonText}</Link>
            </Button>
        </div>
    );
}
