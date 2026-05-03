import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function sendNotification(
  title: string,
  message: string,
  type: "info" | "success" | "warning" | "error" = "info"
) {
  await supabase.from("notifications").insert({ title, message, type });
}
