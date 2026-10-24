import { createBrowserClient } from "@supabase/ssr";

export function getSupabaseConfig() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  let isValidUrl = false;
  if (rawUrl) {
    try {
      const parsed = new URL(rawUrl);
      isValidUrl = parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      isValidUrl = false;
    }
  }

  return {
    url: rawUrl,
    key: rawKey,
    isConfigured: Boolean(rawUrl && rawKey && isValidUrl),
    error: !rawUrl
      ? "NEXT_PUBLIC_SUPABASE_URL is missing. Please set it in your environment variables."
      : !isValidUrl
      ? "NEXT_PUBLIC_SUPABASE_URL is not a valid HTTP or HTTPS URL. Please include the protocol (e.g. https://your-project.supabase.co)."
      : !rawKey
      ? "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is missing. Please set it in your environment variables."
      : null,
  };
}

export const isSupabaseConfigured = (): boolean => {
  return getSupabaseConfig().isConfigured;
};

export const createClient = () => {
  const { url, key, error } = getSupabaseConfig();
  if (error || !url || !key) {
    throw new Error(`Cannot initialize Supabase client: ${error}`);
  }
  return createBrowserClient(url, key);
};


