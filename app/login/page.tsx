import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Message } from "@/components/form-message";
import LoginForm from "@/components/auth/login-form";
import { authConfig } from "@/config/auth";
export default async function Login(props: { searchParams: Promise<Message> }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/dashboard");
  }

  const searchParams = await props.searchParams;
  const description = <div>{authConfig.loginFormSubTitle}</div>;

  return (
    <div className="flex flex-col gap-8">
      <LoginForm description={description} searchParams={searchParams} />
    </div>
  );
}
