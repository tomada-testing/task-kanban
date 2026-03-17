export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error(
      "[Supabase] Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
    return;
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.auth.getSession();

    if (error) {
      console.error(`[Supabase] Connection failed: ${error.message}`);
    } else {
      console.log(`[Supabase] Connected successfully (${supabaseUrl})`);
    }
  } catch (error) {
    console.error("[Supabase] Connection failed:", error);
  }
}
