// app/login/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/login-form";
import { authConfig } from "@/config/auth";

export default async function Login(props: { searchParams: Promise<{ message: string }> }) {
    const supabase = await createClient();
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (user) {
        return redirect("/dashboard");
    }

    const searchParams = await props.searchParams;
    const description = (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{authConfig.loginFormSubTitle}</div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <LoginForm description={description} error={searchParams.message} />
            </div>
        </div>
    );
}
