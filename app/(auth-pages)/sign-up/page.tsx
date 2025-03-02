import { signUpAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AuthFormLayout } from "@/components/auth/auth-form-layout";
import { CredentialFields } from "@/components/auth/credential-fields";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import { FormMessage, Message } from "@/components/form-message";

export default async function Signup(props: { searchParams: Promise<Message> }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/dashboard");
  }

  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  const description = (
    <>
      Already have an account?{" "}
      <Link className="text-primary font-medium underline" href="/sign-in">
        Sign in
      </Link>
    </>
  );

  return (
    <div className="flex flex-col gap-8 max-w-md mx-auto">
      <AuthFormLayout
        title="Sign up"
        description={description}
        submitAction={signUpAction}
        buttonText="Sign up"
        pendingText="Signing up..."
        message={searchParams}
        containerClassName="flex flex-col min-w-64 mx-auto"
      >
        <CredentialFields includeForgotPassword={false} minPasswordLength={6} />
      </AuthFormLayout>
      <SocialLoginButtons />
    </div>
  );
}
