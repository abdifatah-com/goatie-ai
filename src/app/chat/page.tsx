"use client";
import "@/lib/devtools";
import "@openuidev/react-ui/styles/index.css";

import {
    AgentInterface,
    fetchLLM,
    openAIConversationMessageFormat,
    openAIResponsesAdapter,
    useThemeModePreference,
    useThread,
} from "@openuidev/react-ui";
import type { ActionEvent } from "@openuidev/react-lang";
import { useEffect, useState, useRef, useMemo, useCallback, Suspense } from "react";
import {
    Brain,
    Calculator,
    Compass,
    Drum,
    Gamepad2,
    MapPinned,
    TentTree,
    User as UserIcon,
    UtensilsCrossed,
    Clock,
    Sparkles,
    ArrowRight,
    CheckCircle2,
    RotateCcw,
    Zap,
    LogIn,
} from "lucide-react";
import { runLibraryAction } from "@/lib/actions";
import { withBase } from "@/lib/base-path";
import { localChatStorage, SaveMessages } from "@/lib/chat-storage";
import { webUrl } from "@/lib/components/style";
import { library } from "@/lib/library";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { UserMenu } from "./user-menu";

if (typeof window !== "undefined") {
    const open = window.open.bind(window);
    window.open = (url?: string | URL) => {
        const safe = webUrl(String(url ?? ""));
        return safe ? open(safe, "_blank", "noopener,noreferrer") : null;
    };
}

const starters = [
    { displayText: "Plan a day out", prompt: "I'm in San Francisco for a day, plan a sightseeing route for me", icon: <MapPinned size={16} /> },
    { displayText: "Explore a city", prompt: "Plan a relaxed afternoon exploring Lisbon, with three stops and a map", icon: <Compass size={16} /> },
    { displayText: "Find weekend ideas", prompt: "Help me find a weekend getaway from San Francisco. Compare three destinations", icon: <TentTree size={16} /> },
    { displayText: "Plan a meal", prompt: "Help me plan a simple vegetarian dinner for six people", icon: <UtensilsCrossed size={16} /> },
    { displayText: "Build a calculator", prompt: "Build me a working calculator app with a display and keypad", icon: <Calculator size={16} /> },
    { displayText: "Play on a Game Boy", prompt: "Make a playable Game Boy-style handheld game with a screen, D-pad and A/B buttons", icon: <Gamepad2 size={16} /> },
    { displayText: "Jam on a drum pad", prompt: "Make a drum pad I can play, with a few pads and a beat counter", icon: <Drum size={16} /> },
    { displayText: "Take a trivia quiz", prompt: "Quiz me with five fun trivia questions and keep score", icon: <Brain size={16} /> },
];

const baseLlm = fetchLLM({
    url: withBase("/api/chat"),
    streamAdapter: openAIResponsesAdapter(),
    messageFormat: openAIConversationMessageFormat,
});

function onAction(event: ActionEvent) {
    void runLibraryAction(event);
}

/** Monitors user messages during demo mode to enforce token/prompt allowance */
function DemoWatcher({
    isDemo,
    onPromptSent,
}: {
    isDemo: boolean;
    onPromptSent: () => void;
}) {
    const messages = useThread((s) => s.messages);
    const lastCountRef = useRef<number>(0);

    useEffect(() => {
        if (!isDemo) return;
        const userMsgCount = messages.filter((m) => m.role === "user").length;
        if (lastCountRef.current === 0) {
            lastCountRef.current = userMsgCount;
        } else if (userMsgCount > lastCountRef.current) {
            lastCountRef.current = userMsgCount;
            onPromptSent();
        }
    }, [messages, isDemo, onPromptSent]);

    return null;
}

function ChatPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isDemo = searchParams.get("demo") === "true";

    const { setPreference, mode, preference } = useThemeModePreference();
    const [user, setUser] = useState<User | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // ── Demo Session State ──
    const [demoSecondsLeft, setDemoSecondsLeft] = useState<number>(60);
    const [demoPromptsLeft, setDemoPromptsLeft] = useState<number>(3);
    const [isDemoExpired, setIsDemoExpired] = useState<boolean>(false);
    const [showDemoModal, setShowDemoModal] = useState<boolean>(false);

    useEffect(() => {
        document.documentElement.setAttribute("data-openui-theme", mode);
    }, [mode]);

    // Demo timer countdown (60 seconds) - restores completely fresh on every visit / reload
    useEffect(() => {
        if (!isDemo) return;

        // Reset demo state on every page load/refresh
        sessionStorage.removeItem("goatie_demo_start");
        sessionStorage.removeItem("goatie_demo_prompts_used");

        const startTime = Date.now();
        sessionStorage.setItem("goatie_demo_start", startTime.toString());
        sessionStorage.setItem("goatie_demo_prompts_used", "0");

        setDemoSecondsLeft(60);
        setDemoPromptsLeft(3);
        setIsDemoExpired(false);
        setShowDemoModal(false);

        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const remaining = Math.max(0, 60 - elapsed);
            setDemoSecondsLeft(remaining);

            if (remaining <= 0) {
                setIsDemoExpired(true);
                setShowDemoModal(true);
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isDemo]);

    // Handle user prompt sent in demo mode
    const handlePromptSent = useCallback(() => {
        if (!isDemo) return;
        const currentUsed = parseInt(sessionStorage.getItem("goatie_demo_prompts_used") || "0", 10);
        const newUsed = currentUsed + 1;
        sessionStorage.setItem("goatie_demo_prompts_used", newUsed.toString());
        const remaining = Math.max(0, 3 - newUsed);
        setDemoPromptsLeft(remaining);

        if (remaining <= 0) {
            // Give 7 seconds grace for user to see the generated UI response before prompt
            setTimeout(() => {
                setIsDemoExpired(true);
                setShowDemoModal(true);
            }, 7000);
        }
    }, [isDemo]);

    // Authenticate or initialize demo guest
    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
            if (data?.user) {
                setUser(data.user);
                setIsCheckingAuth(false);
            } else if (isDemo) {
                // In demo mode, unauthenticated guests have user = null (no fake account / no log out)
                setUser(null);
                setIsCheckingAuth(false);
            } else {
                router.replace("/login");
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user);
                setIsCheckingAuth(false);
            } else if (isDemo) {
                setUser(null);
                setIsCheckingAuth(false);
            } else {
                router.replace("/login");
            }
        });

        return () => subscription.unsubscribe();
    }, [router, isDemo]);

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        sessionStorage.removeItem("goatie_demo_start");
        sessionStorage.removeItem("goatie_demo_prompts_used");
        router.push("/login");
        router.refresh();
    };

    // LLM wrapper to prevent excess calls when demo is expired
    const activeLlm = useMemo(() => {
        return {
            ...baseLlm,
            async send(params: Parameters<typeof baseLlm.send>[0]) {
                if (isDemo && isDemoExpired) {
                    setShowDemoModal(true);
                    throw new Error("Demo trial limit reached. Sign up to continue.");
                }
                return baseLlm.send(params);
            },
        };
    }, [isDemo, isDemoExpired]);

    // User-isolated storage: Guests have ZERO history; Authenticated users have their own private storage
    const storage = useMemo(() => {
        if (typeof window === "undefined") return undefined;
        return localChatStorage(user?.id, isDemo);
    }, [user?.id, isDemo]);

    if (isCheckingAuth || (!user && !isDemo)) {
        return (
            <div
                style={{
                    height: "100vh",
                    width: "100vw",
                    background: "#000000",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "16px",
                    color: "#ffffff",
                }}
            >
                <div className="shiro-loading-icon" style={{ width: "64px", height: "64px" }} />
                <div style={{ fontSize: "14px", color: "#94a3b8", fontWeight: 500 }}>
                    {isDemo ? "Initializing Goatie AI demo..." : "Verifying authentication..."}
                </div>
            </div>
        );
    }

    return (
        <div className="chat-shell">
            {/* ── Demo Floating Countdown Pill ── */}
            {isDemo && (
                <aside aria-label="Demo Status" className="demo-top-banner">
                    <div className="demo-banner-badge">
                        <span className="demo-pulse-dot" />
                        <span>Demo Mode</span>
                    </div>

                    <div className="demo-banner-stat">
                        <Clock size={13} className={demoSecondsLeft <= 15 ? "demo-time-critical" : ""} />
                        <span className={demoSecondsLeft <= 15 ? "demo-time-critical" : ""}>
                            {Math.floor(demoSecondsLeft / 60)}:{String(demoSecondsLeft % 60).padStart(2, "0")} remaining
                        </span>
                    </div>

                    <div className="demo-banner-stat">
                        <Sparkles size={13} />
                        <span>{demoPromptsLeft} {demoPromptsLeft === 1 ? "prompt" : "prompts"} left</span>
                    </div>

                    <div className="demo-banner-token-badge">
                        ~{demoPromptsLeft * 200} tokens
                    </div>

                    <Link href="/signup" className="demo-banner-upgrade-btn">
                        Unlock Full AI <ArrowRight size={13} />
                    </Link>
                </aside>
            )}

            <AgentInterface
                llm={activeLlm}
                storage={storage}
                componentLibrary={library}
                onAction={onAction}
                agentName="Goatie AI"
                logoUrl={withBase("/goat.png")}
                theme={{ mode }}
                starters={starters}
            >
                <AgentInterface.SidebarFooter>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: "8px" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            {user ? (
                                <UserMenu
                                    user={user}
                                    onSignOut={handleSignOut}
                                    currentTheme={preference}
                                    resolvedTheme={mode}
                                    onThemeChange={setPreference}
                                    isDemo={false}
                                />
                            ) : (
                                <div className="demo-guest-footer-bar">
                                    <Link href="/login" className="demo-guest-signin-btn">
                                        <LogIn size={14} />
                                        <span>Sign in</span>
                                    </Link>
                                    <Link href="/signup" className="demo-guest-signup-btn">
                                        <Sparkles size={12} />
                                        <span>Sign up</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                        <AgentInterface.ThemeModeToggle mode={mode} onModeChange={setPreference} />
                    </div>
                </AgentInterface.SidebarFooter>
                <AgentInterface.ThreadHeader showChatTitle={false} />
                <AgentInterface.Welcome
                    image={<img src={withBase("/goat.png")} alt="Goatie AI" className="welcome-mascot" />}
                    title={isDemo ? "Welcome to the Goatie AI Demo!" : "What can I help with?"}
                    starterVariant="card"
                    glowAnimation
                />
                <SaveMessages userId={user?.id} isDemo={isDemo} />
                <DemoWatcher isDemo={isDemo} onPromptSent={handlePromptSent} />
            </AgentInterface>

            {/* ── Demo Expired Conversion Modal ── */}
            {isDemo && isDemoExpired && showDemoModal && (
                <div className="demo-modal-overlay">
                    <div className="demo-modal-card" role="dialog" aria-modal="true">
                        <div className="demo-modal-icon-wrap">
                            <img src="/goat.png" alt="Goatie AI" className="demo-modal-avatar" />
                            <div className="demo-modal-icon-badge">
                                <Zap size={13} />
                            </div>
                        </div>

                        <div className="demo-modal-badge">
                            <Clock size={12} />
                            <span>1-Minute Demo Concluded</span>
                        </div>

                        <h2 className="demo-modal-title">Experience Goatie AI Without Limits</h2>
                        <p className="demo-modal-desc">
                            You just saw our real-time Generative UI engine in action. Create your free account now to unlock unlimited AI tokens, persistent conversations, and customizable toolsets.
                        </p>

                        <div className="demo-modal-features">
                            <div className="demo-modal-feature-item">
                                <CheckCircle2 size={16} />
                                <span>Unlimited Generative UI Prompts & Workspaces</span>
                            </div>
                            <div className="demo-modal-feature-item">
                                <CheckCircle2 size={16} />
                                <span>Autonomous Shiro AI Multi-Step Reasoning</span>
                            </div>
                            <div className="demo-modal-feature-item">
                                <CheckCircle2 size={16} />
                                <span>Save, Rename & Resume Cloud Threads</span>
                            </div>
                            <div className="demo-modal-feature-item">
                                <CheckCircle2 size={16} />
                                <span>Free Instant Setup — No Credit Card Needed</span>
                            </div>
                        </div>

                        <div className="demo-modal-actions">
                            <Link href="/signup" className="demo-primary-btn">
                                Create Free Account <ArrowRight size={16} />
                            </Link>

                            <Link href="/login" className="demo-secondary-btn">
                                Sign In to Existing Account
                            </Link>
                        </div>

                        <div className="demo-footer-links">
                            <Link href="/" className="demo-text-btn">
                                Return to Home
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense
            fallback={
                <div
                    style={{
                        height: "100vh",
                        width: "100vw",
                        background: "#000000",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "16px",
                        color: "#ffffff",
                    }}
                >
                    <div className="shiro-loading-icon" style={{ width: "64px", height: "64px" }} />
                    <div style={{ fontSize: "14px", color: "#94a3b8", fontWeight: 500 }}>
                        Loading Goatie AI workspace...
                    </div>
                </div>
            }
        >
            <ChatPageContent />
        </Suspense>
    );
}
