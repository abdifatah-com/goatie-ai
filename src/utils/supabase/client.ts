import { createBrowserClient } from "@supabase/ssr";

// Safe fallbacks during static build & prerendering phase on CI/Vercel
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "placeholder-anon-key";

export const isSupabaseConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return Boolean(url && key && !url.includes("placeholder-project"));
};

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey
  );

