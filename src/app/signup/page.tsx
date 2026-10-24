"use client";

import "../auth.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient, getSupabaseConfig } from "@/utils/supabase/client";

export default function SignupPage() {
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const config = getSupabaseConfig();
        if (!config.isConfigured) return;

        try {
            const supabase = createClient();
            supabase.auth.getUser().then(({ data }) => {
                if (data?.user) {
                    router.replace("/chat");
                }
            }).catch(() => {});
        } catch {
            // Ignore during initial hydration check
        }
    }, [router]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const config = getSupabaseConfig();
        if (!config.isConfigured) {
            setError(config.error || "Supabase authentication is not configured.");
            return;
        }

        if (!email.trim() || !password) {
            setError("Please fill in both email and password.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);

        try {
            const supabase = createClient();
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: {
                    data: {
                        full_name: fullName.trim(),
                        name: fullName.trim(),
                    },
                    emailRedirectTo: typeof window !== "undefined"
                        ? `${window.location.origin}/auth/callback`
                        : undefined,
                },
            });

            if (signUpError) {
                setError(signUpError.message);
                return;
            }

            if (data?.session) {
                // Immediate session (email confirmation off)
                router.push("/chat");
                router.refresh();
            } else {
                // Email confirmation required
                setSuccess(
                    "Registration successful! Please check your inbox at " +
                    email +
                    " to confirm your email and activate your account."
                );
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An unexpected error occurred.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = async (provider: "google" | "github") => {
        setError(null);
        const config = getSupabaseConfig();
        if (!config.isConfigured) {
            setError(config.error || "Supabase authentication is not configured.");
            return;
        }
        setSocialLoading(provider);
        try {
            const supabase = createClient();
            const { error: oAuthError } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: typeof window !== "undefined"
                        ? `${window.location.origin}/auth/callback`
                        : undefined,
                },
            });
            if (oAuthError) {
                setError(oAuthError.message);
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to initiate social login.";
            setError(message);
        } finally {
            setSocialLoading(null);
        }
    };

    return (
        <div className="auth-page">
            {/* Left — Branding */}
            <div className="auth-brand">
                <img src="/goat.png" alt="Goatie AI" className="auth-brand-logo" />
                <div className="auth-brand-name">Goatie AI</div>
                <p className="auth-brand-tagline">
                    Join thousands of developers building the future of intelligent applications.
                </p>
            </div>

            {/* Right — Form */}
            <div className="auth-form-panel">
                <Link href="/" className="auth-back">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
                    </svg>
                    Back
                </Link>

                <div className="auth-card">
                    <h1>Create your account</h1>
                    <p className="auth-subtitle">Get started with Goatie AI for free</p>

                    {error && (
                        <div className="auth-alert auth-alert-error" role="alert">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="auth-alert auth-alert-success" role="status">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            <span>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSignup}>
                        <div className="auth-field">
                            <label htmlFor="signup-name">Full name</label>
                            <input
                                id="signup-name"
                                type="text"
                                placeholder="John Doe"
                                autoComplete="name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="signup-email">Email</label>
                            <input
                                id="signup-email"
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="signup-password">Password</label>
                            <input
                                id="signup-password"
                                type="password"
                                placeholder="At least 6 characters"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" className="auth-submit" disabled={loading || !!socialLoading}>
                            {loading ? (
                                <>
                                    <span className="auth-btn-spinner" />
                                    Creating account...
                                </>
                            ) : (
                                "Create account"
                            )}
                        </button>
                    </form>

                    <div className="auth-divider">or continue with</div>

                    <div className="auth-socials">
                        <button
                            type="button"
                            className="auth-social-btn"
                            onClick={() => handleOAuth("google")}
                            disabled={loading || !!socialLoading}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            {socialLoading === "google" ? "Connecting..." : "Google"}
                        </button>
                        <button
                            type="button"
                            className="auth-social-btn"
                            onClick={() => handleOAuth("github")}
                            disabled={loading || !!socialLoading}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            {socialLoading === "github" ? "Connecting..." : "GitHub"}
                        </button>
                    </div>

                    <p className="auth-footer">
                        Already have an account?{" "}
                        <Link href="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
