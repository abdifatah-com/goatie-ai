import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  let isValidUrl = false;
  if (supabaseUrl) {
    try {
      const parsed = new URL(supabaseUrl);
      isValidUrl = parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      isValidUrl = false;
    }
  }

  if (!supabaseUrl || !supabaseKey || !isValidUrl) {
    throw new Error(
      !supabaseUrl
        ? "NEXT_PUBLIC_SUPABASE_URL is missing. Please set it in your environment variables."
        : !isValidUrl
        ? "NEXT_PUBLIC_SUPABASE_URL is not a valid HTTP or HTTPS URL. Please include the protocol (e.g. https://your-project.supabase.co)."
        : "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is missing. Please set it in your environment variables."
    );
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};
