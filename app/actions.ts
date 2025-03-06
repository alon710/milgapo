"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

type SignInData = {
    contact: string;
    method: "email" | "phone";
};

export const signInAction = async ({ contact, method }: SignInData) => {
    const supabase = await createClient();
    let error;

    if (method === "email") {
        ({ error } = await supabase.auth.signInWithOtp({ email: contact }));
    } else if (method === "phone") {
        ({ error } = await supabase.auth.signInWithOtp({ phone: contact }));
    }

    if (error) {
        return redirect(`/login?message=${encodeURIComponent(error.message)}`);
    }

    return redirect(`/otp?contact=${encodeURIComponent(contact)}&method=${method}`);
};

export const signOutAction = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/");
};
