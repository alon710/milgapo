import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  return (
    <>
      <div>
        <h1>Home</h1>
      </div>
    </>
  );
}
