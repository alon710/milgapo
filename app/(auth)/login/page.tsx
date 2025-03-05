import { redirect } from "next/navigation";

import LoginForm from "@/components/auth/login-form";
import { L } from "@/config/language";
import { createClient } from "@/utils/supabase/server";

export default async function Login(props: { searchParams: Promise<{ message: string }> }) {
    const supabase = await createClient();

    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (user) {
        return redirect("/dashboard");
    }

    const searchParams = await props.searchParams;
    const description = <div>{L.auth.loginFormSubTitle}</div>;

    return (
        <div className="flex flex-col gap-8">
            <LoginForm description={description} error={searchParams.message} />
        </div>
    );
}
