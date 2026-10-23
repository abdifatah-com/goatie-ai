"use client";

import "./user-menu.css";
import React, { useState, useRef, useEffect, useMemo } from "react";
import type { User } from "@supabase/supabase-js";
import {
    ChevronRight,
    ChevronDown,
    SlidersHorizontal,
    User as UserIcon,
    Settings,
    HelpCircle,
    LogOut,
    ShieldCheck,
    PenLine,
    Download,
    Zap,
    FileText,
    Info,
    Bug,
    X,
    Check,
    Plus,
    CircleUser,
    ArrowLeft,
    PanelLeft,
    Search,
    Sun,
    Bell,
    ExternalLink,
    Lock,
    Archive,
    UserCheck,
    Mic,
    HardDrive,
    Sparkles,
    Keyboard,
    CheckCircle2,
    CreditCard,
    Disc,
    Plug,
    KeyRound,
    GitPullRequest,
    Globe,
    Pencil,
    Share2,
    Shield,
    Eye,
    AtSign,
    Trash2,
    Volume2,
    Moon,
    Laptop,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface UserMenuProps {
    user: User | null;
    onSignOut: () => void;
    currentTheme?: "dark" | "light" | "system";
    resolvedTheme?: "dark" | "light";
    onThemeChange?: (theme: "dark" | "light" | "system") => void;
    isDemo?: boolean;
}

export function UserMenu({
    user,
    onSignOut,
    currentTheme = "dark",
    resolvedTheme,
    onThemeChange,
    isDemo = false,
}: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);
    const [activeModal, setActiveModal] = useState<string | null>(null);

    // Profile state
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [newName, setNewName] = useState("");
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [profileSaved, setProfileSaved] = useState(false);
    const [activityFilter, setActivityFilter] = useState<"daily" | "weekly" | "cumulative">("daily");

    // Settings state
    const [activeSettingsTab, setActiveSettingsTab] = useState("general");
    const [settingsSearch, setSettingsSearch] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("Auto detect");
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState<"dark" | "light" | "system">(currentTheme);

    // Sync theme state when currentTheme prop changes
    useEffect(() => {
        if (currentTheme) {
            setSelectedTheme(currentTheme);
        }
    }, [currentTheme]);

    const handleSelectTheme = (theme: "dark" | "light" | "system") => {
        setSelectedTheme(theme);
        if (onThemeChange) {
            onThemeChange(theme);
        } else {
            const root = document.documentElement;
            if (theme === "system") {
                const systemDark =
                    typeof window !== "undefined" &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches;
                root.setAttribute("data-openui-theme", systemDark ? "dark" : "light");
                root.style.colorScheme = systemDark ? "dark" : "light";
                localStorage.removeItem("openui-theme-mode");
            } else {
                root.setAttribute("data-openui-theme", theme);
                root.style.colorScheme = theme;
                localStorage.setItem("openui-theme-mode", theme);
            }
        }
    };

    const [enableNotifications, setEnableNotifications] = useState(true);
    const [enableSound, setEnableSound] = useState(true);
    const [customInstructions, setCustomInstructions] = useState("");
    const [petCompanion, setPetCompanion] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const accountSwitcherTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Close popovers when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setIsHelpOpen(false);
                setIsAccountSwitcherOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Global keyboard shortcut: Ctrl+/ to open shortcuts modal
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if ((e.ctrlKey || e.metaKey) && e.key === "/") {
                e.preventDefault();
                setActiveModal("shortcuts");
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Derive display name, initials, and handle
    const rawEmail = user?.email || "abdifatahmarketing@gmail.com";
    const emailPrefix = rawEmail.split("@")[0];

    const rawName =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        (emailPrefix ? emailPrefix.replace(/[._-]/g, " ") : "ABDIFATAH FAISAL");

    const displayName = rawName.toUpperCase();
    const handleName = `@${emailPrefix || "abdifatahmarketing"}`;

    const getInitials = (name: string) => {
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const initials = getInitials(rawName) || "AF";

    const handleSaveProfile = async () => {
        if (!newName.trim() || !user) return;
        setIsSavingProfile(true);
        try {
            const supabase = createClient();
            await supabase.auth.updateUser({
                data: { full_name: newName.trim(), name: newName.trim() },
            });
            setProfileSaved(true);
            setTimeout(() => {
                setProfileSaved(false);
                setIsEditingProfile(false);
            }, 1000);
        } finally {
            setIsSavingProfile(false);
        }
    };

    // Account switcher hover handlers
    const handleAccountHoverEnter = () => {
        if (accountSwitcherTimeoutRef.current) {
            clearTimeout(accountSwitcherTimeoutRef.current);
            accountSwitcherTimeoutRef.current = null;
        }
        setIsAccountSwitcherOpen(true);
    };

    const handleAccountHoverLeave = () => {
        accountSwitcherTimeoutRef.current = setTimeout(() => {
            setIsAccountSwitcherOpen(false);
        }, 250);
    };

    // Grid of contribution dots (Nov to Oct: 42 weeks x 7 days)
    const contributionMatrix = useMemo(() => {
        const weeks = 42;
        const days = 7;
        const matrix: { week: number; day: number; count: number; isBlue: boolean }[][] = [];

        for (let w = 0; w < weeks; w++) {
            const col = [];
            for (let d = 0; d < days; d++) {
                // In September (around week 35-36), highlight vertical streak of blue dots as in screenshot
                const isBlue = (w === 35 && d >= 1 && d <= 5) || (w === 36 && d === 2);
                col.push({
                    week: w,
                    day: d,
                    count: isBlue ? 12450 : 0,
                    isBlue,
                });
            }
            matrix.push(col);
        }
        return matrix;
    }, []);

    // Settings navigation items
    const settingsCategories = [
        {
            category: "Personal",
            items: [
                { id: "general", label: "General", icon: Settings },
                { id: "appearance", label: "Appearance", icon: Sun },
                { id: "notifications", label: "Notifications", icon: Bell },
                { id: "profile_link", label: "Profile", icon: UserIcon, isExternal: true },
                { id: "security", label: "Security and login", icon: Lock },
                { id: "account", label: "Account", icon: CircleUser },
                { id: "archived", label: "Archived chats", icon: Archive },
                { id: "parental", label: "Parental controls", icon: UserCheck },
                { id: "trusted", label: "Trusted contact", icon: ShieldCheck },
                { id: "voice", label: "Voice", icon: Mic },
                { id: "storage", label: "Storage", icon: HardDrive },
                { id: "personalization", label: "Personalization", icon: SlidersHorizontal },
                { id: "pets", label: "Pets", icon: Sparkles },
                { id: "keyboard", label: "Keyboard", icon: Keyboard },
                { id: "usage", label: "Usage", icon: CheckCircle2 },
                { id: "billing", label: "Billing", icon: CreditCard },
                { id: "data", label: "Data controls", icon: Disc },
            ],
        },
        {
            category: "Integrations",
            items: [
                { id: "plugins", label: "Plugins", icon: Plug },
                { id: "passwords", label: "Passwords", icon: KeyRound },
            ],
        },
        {
            category: "Coding",
            items: [
                { id: "codereview", label: "Code Review", icon: GitPullRequest },
            ],
        },
    ];

    const filteredSettingsCategories = settingsCategories
        .map((cat) => ({
            ...cat,
            items: cat.items.filter((item) =>
                item.label.toLowerCase().includes(settingsSearch.toLowerCase())
            ),
        }))
        .filter((cat) => cat.items.length > 0);

    if (!user) {
        return null;
    }

    return (
        <div className="user-menu-container" ref={containerRef}>
            {/* Trigger Button */}
            <button
                type="button"
                className="user-menu-trigger"
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (isOpen) {
                        setIsHelpOpen(false);
                        setIsAccountSwitcherOpen(false);
                    }
                }}
                aria-expanded={isOpen}
                title={rawEmail}
            >
                <div className="user-avatar-badge">{initials}</div>
                <div className="user-info-text">
                    <span className="user-display-name">{displayName}</span>
                    <span className="user-plan-label">Free</span>
                </div>
                <ChevronRight size={15} className="menu-arrow-icon" style={{ opacity: 0.6 }} />
            </button>

            {/* Main Menu Popover */}
            {isOpen && (
                <div className="user-popover-menu" role="menu">
                    {/* Header Row: Hover or Click pops out Account Switcher */}
                    <div
                        className="user-menu-header"
                        onMouseEnter={handleAccountHoverEnter}
                        onMouseLeave={handleAccountHoverLeave}
                        onClick={() => setIsAccountSwitcherOpen(!isAccountSwitcherOpen)}
                    >
                        <div className="user-avatar-badge">{initials}</div>
                        <div className="user-info-text">
                            <span className="user-display-name">{displayName}</span>
                            <span className="user-plan-label">{isDemo ? "Demo Trial (1 min)" : "Free"}</span>
                        </div>
                        <ChevronRight size={16} className="menu-arrow-icon" />
                    </div>

                    {isDemo && (
                        <div style={{ padding: "6px 8px 8px" }}>
                            <a
                                href="/signup"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "6px",
                                    background: "#ffffff",
                                    color: "#000000",
                                    fontWeight: 600,
                                    fontSize: "12px",
                                    padding: "7px 12px",
                                    borderRadius: "8px",
                                    textDecoration: "none",
                                    width: "100%",
                                    boxSizing: "border-box",
                                    boxShadow: "0 2px 8px rgba(255,255,255,0.15)",
                                }}
                            >
                                <Sparkles size={13} />
                                Unlock Unlimited Access
                            </a>
                        </div>
                    )}

                    <div className="user-menu-divider" />

                    {/* Personalization */}
                    <button
                        type="button"
                        className="user-menu-item"
                        onClick={() => {
                            setActiveModal("personalization");
                            setIsOpen(false);
                            setIsHelpOpen(false);
                            setIsAccountSwitcherOpen(false);
                        }}
                    >
                        <SlidersHorizontal size={17} className="user-menu-item-icon" />
                        <span className="user-menu-item-text">Personalization</span>
                    </button>

                    {/* Profile -> Opens Full Profile View (Screenshot 1) */}
                    <button
                        type="button"
                        className="user-menu-item"
                        onClick={() => {
                            setNewName(rawName);
                            setActiveModal("profile");
                            setIsOpen(false);
                            setIsHelpOpen(false);
                            setIsAccountSwitcherOpen(false);
                        }}
                    >
                        <UserIcon size={17} className="user-menu-item-icon" />
                        <span className="user-menu-item-text">Profile</span>
                    </button>

                    {/* Settings -> Opens Full Settings View (Screenshot 3) */}
                    <button
                        type="button"
                        className="user-menu-item"
                        onClick={() => {
                            setActiveModal("settings");
                            setActiveSettingsTab("general");
                            setIsOpen(false);
                            setIsHelpOpen(false);
                            setIsAccountSwitcherOpen(false);
                        }}
                    >
                        <Settings size={17} className="user-menu-item-icon" />
                        <span className="user-menu-item-text">Settings</span>
                    </button>

                    <div className="user-menu-divider" />

                    {/* Help (Opens Submenu) */}
                    <button
                        type="button"
                        className={`user-menu-item ${isHelpOpen ? "active" : ""}`}
                        onClick={() => {
                            setIsHelpOpen(!isHelpOpen);
                            setIsAccountSwitcherOpen(false);
                        }}
                    >
                        <HelpCircle size={17} className="user-menu-item-icon" />
                        <span className="user-menu-item-text">Help</span>
                        <ChevronRight size={15} className="menu-arrow-icon" />
                    </button>

                    {/* Log out */}
                    <button
                        type="button"
                        className="user-menu-item user-menu-item-logout"
                        onClick={() => {
                            setIsOpen(false);
                            setIsHelpOpen(false);
                            setIsAccountSwitcherOpen(false);
                            onSignOut();
                        }}
                    >
                        <LogOut size={17} className="user-menu-item-icon" />
                        <span className="user-menu-item-text">Log out</span>
                    </button>
                </div>
            )}

            {/* Account Switcher Popout Window (Screenshot 2) */}
            {isOpen && isAccountSwitcherOpen && (
                <div
                    className="account-switcher-popover"
                    onMouseEnter={handleAccountHoverEnter}
                    onMouseLeave={handleAccountHoverLeave}
                    role="menu"
                >
                    {/* Top Row: User email with CircleUser icon */}
                    <div className="account-switcher-row email-row">
                        <CircleUser size={19} className="account-icon-muted" />
                        <span className="account-email-text">{rawEmail}</span>
                    </div>

                    {/* Middle Row: Active Personal account with avatar & checkmark */}
                    <div className="account-switcher-row active-account-row">
                        <div className="user-avatar-badge small-avatar">{initials}</div>
                        <span className="account-name-text">Personal account</span>
                        <Check size={16} className="account-check-icon" />
                    </div>

                    <div className="account-divider" />

                    {/* Bottom Row: + Add account button */}
                    <button
                        type="button"
                        className="account-switcher-row add-account-btn"
                        onClick={() => {
                            setActiveModal("addAccount");
                            setIsOpen(false);
                            setIsAccountSwitcherOpen(false);
                        }}
                    >
                        <Plus size={18} className="account-plus-icon" />
                        <span className="add-account-text">Add account</span>
                    </button>
                </div>
            )}

            {/* Help Submenu Popover */}
            {isOpen && isHelpOpen && (
                <div className="help-popover-menu" role="menu">
                    <button
                        type="button"
                        className="user-menu-item"
                        onClick={() => {
                            setActiveModal("helpCenter");
                            setIsOpen(false);
                            setIsHelpOpen(false);
                        }}
                    >
                        <HelpCircle size={17} className="user-menu-item-icon" />
                        <span className="user-menu-item-text">Help center</span>
                    </button>

                    <button
                        type="button"
                        className="user-menu-item"
                        onClick={() => {
                            setActiveModal("privacyCenter");
                            setIsOpen(false);
                            setIsHelpOpen(false);
                        }}
                    >
                        <ShieldCheck size={17} className="user-menu-item-icon" />
                        <span className="user-menu-item-text">Privacy center</span>
                    </button>

                    <button
                        type="button"
                        className="user-menu-item"
                        onClick={() => {
                            setActiveModal("releaseNotes");
                            setIsOpen(false);
                            setIsHelpOpen(false);
                        }}
                    >
                        <PenLine size={17} className="user-menu-item-icon" />
                        <span className="user-menu-item-text">Release notes</span>
                    </button>

                    <button
                        type="button"
                        className="user-menu-item"
                        onClick={() => {
                            setActiveModal("downloadApps");
                            setIsOpen(false);
                            setIsHelpOpen(false);
                        }}
                    >
                        <Download size={17} className="user-menu-item-icon" />
                        <span className="user-menu-item-text">Download apps</span>
                    </button>

                    <button
                        type="button"
                        className="user-menu-item"
                        onClick={() => {
                            setActiveModal("shortcuts");
                            setIsOpen(false);
                            setIsHelpOpen(false);
                        }}
                    >
                        <Zap size={17} className="user-menu-item-icon" />
                        <span className="user-menu-item-text">Keyboard shortcuts</span>
                        <span className="user-menu-item-shortcut">Ctrl+/</span>
                    </button>

                    <div className="user-menu-divider" />

                    <button
                        type="button"
                        className="user-menu-item"
                        onClick={() => {
                            setActiveModal("terms");
                            setIsOpen(false);
                            setIsHelpOpen(false);
                        }}
                    >
                        <FileText size={17} className="user-menu-item-icon" />
                        <span className="user-menu-item-text">Terms of Service</span>
                    </button>

                    <button
                        type="button"
                        className="user-menu-item"
                        onClick={() => {
                            setActiveModal("privacy");
                            setIsOpen(false);
                            setIsHelpOpen(false);
                        }}
                    >
                        <Info size={17} className="user-menu-item-icon" />
                        <span className="user-menu-item-text">Privacy Policy</span>
                    </button>

                    <button
                        type="button"
                        className="user-menu-item"
                        onClick={() => {
                            setActiveModal("reportBug");
                            setIsOpen(false);
                            setIsHelpOpen(false);
                        }}
                    >
                        <Bug size={17} className="user-menu-item-icon" />
                        <span className="user-menu-item-text">Report a bug</span>
                    </button>
                </div>
            )}

            {/* ── FULL PROFILE VIEW (Screenshot 1) ─────────────────────── */}
            {activeModal === "profile" && (
                <div className="full-screen-profile-overlay" role="dialog" aria-label="User Profile">
                    {/* Top Action Bar */}
                    <div className="profile-top-bar">
                        <button
                            type="button"
                            className="profile-back-btn"
                            onClick={() => setActiveModal(null)}
                            title="Back to chat"
                        >
                            <ArrowLeft size={16} />
                            <span>Back to app</span>
                        </button>

                        <div className="profile-action-links">
                            <button
                                type="button"
                                className="profile-header-action-btn"
                                onClick={() => setIsEditingProfile(!isEditingProfile)}
                            >
                                <Pencil size={15} />
                                <span>Edit</span>
                            </button>
                            <button type="button" className="profile-header-action-btn">
                                <Shield size={15} />
                                <span>Private</span>
                            </button>
                            <button
                                type="button"
                                className="profile-header-action-btn"
                                onClick={() => {
                                    if (typeof navigator !== "undefined" && navigator.clipboard) {
                                        navigator.clipboard.writeText(window.location.href);
                                    }
                                }}
                            >
                                <Share2 size={15} />
                                <span>Share</span>
                            </button>
                            <button
                                type="button"
                                className="profile-close-icon-btn"
                                onClick={() => setActiveModal(null)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Main Scrollable Profile Content */}
                    <div className="profile-scroll-container">
                        <div className="profile-inner-content">
                            {/* Avatar & Header */}
                            <div className="profile-identity-section">
                                <div className="profile-large-avatar">{initials}</div>
                                <h1 className="profile-display-name">{displayName}</h1>
                                <p className="profile-handle">{handleName}</p>
                            </div>

                            {/* Optional Edit Profile Box */}
                            {isEditingProfile && (
                                <div className="profile-edit-box">
                                    <h4 style={{ margin: "0 0 10px", fontSize: "14px" }}>Edit Display Name</h4>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            placeholder="Your full name"
                                            className="profile-edit-input"
                                        />
                                        <button
                                            type="button"
                                            className="profile-save-btn"
                                            onClick={handleSaveProfile}
                                            disabled={isSavingProfile}
                                        >
                                            {profileSaved ? "Saved!" : isSavingProfile ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Stats Capsule Row */}
                            <div className="profile-stats-capsule">
                                <div className="profile-stat-item">
                                    <div className="profile-stat-value">2.8M</div>
                                    <div className="profile-stat-label">Lifetime tokens</div>
                                </div>
                                <div className="profile-stat-item">
                                    <div className="profile-stat-value">1.3M</div>
                                    <div className="profile-stat-label">Peak tokens</div>
                                </div>
                                <div className="profile-stat-item">
                                    <div className="profile-stat-value">6m 12s</div>
                                    <div className="profile-stat-label">Longest task</div>
                                </div>
                                <div className="profile-stat-item">
                                    <div className="profile-stat-value">5 days</div>
                                    <div className="profile-stat-label">Longest streak</div>
                                </div>
                                <div className="profile-stat-item">
                                    <div className="profile-stat-value">0 days</div>
                                    <div className="profile-stat-label">Current streak</div>
                                </div>
                            </div>

                            {/* Showcase Section */}
                            <div className="profile-section">
                                <h3 className="profile-section-title">Showcase</h3>
                                <div className="profile-showcase-card">
                                    {/* Fanned out card illustration */}
                                    <div className="showcase-card-illustration">
                                        <div className="showcase-fanned-card card-left" />
                                        <div className="showcase-fanned-card card-right" />
                                        <div className="showcase-fanned-card card-center">
                                            <Globe size={18} className="showcase-globe-icon" />
                                            <span className="showcase-www-text">www</span>
                                        </div>
                                    </div>

                                    <div className="showcase-subtext">Feature sites on your profile</div>
                                    <button type="button" className="showcase-upgrade-btn">
                                        Upgrade to edit your showcase
                                    </button>
                                </div>
                            </div>

                            {/* Token Activity Section */}
                            <div className="profile-section">
                                <div className="token-activity-header">
                                    <h3 className="profile-section-title">Token activity</h3>
                                    <div className="token-activity-filters">
                                        {(["daily", "weekly", "cumulative"] as const).map((filter) => (
                                            <button
                                                key={filter}
                                                type="button"
                                                className={`token-filter-btn ${
                                                    activityFilter === filter ? "active" : ""
                                                }`}
                                                onClick={() => setActivityFilter(filter)}
                                            >
                                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Matrix Contribution Grid */}
                                <div className="activity-matrix-container">
                                    <div className="activity-grid">
                                        {contributionMatrix.map((col, colIdx) => (
                                            <div key={colIdx} className="activity-grid-col">
                                                {col.map((cell, rowIdx) => (
                                                    <div
                                                        key={rowIdx}
                                                        className={`activity-grid-dot ${
                                                            cell.isBlue ? "dot-blue" : ""
                                                        }`}
                                                        title={
                                                            cell.isBlue
                                                                ? `${cell.count.toLocaleString()} tokens`
                                                                : "0 tokens"
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Month Labels along bottom */}
                                    <div className="activity-months-row">
                                        {[
                                            "Nov",
                                            "Dec",
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                        ].map((month, idx) => (
                                            <span key={idx} className="activity-month-label">
                                                {month}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Top Plugins Section */}
                            <div className="profile-section">
                                <h3 className="profile-section-title">Top plugins</h3>
                                <div className="profile-plugins-card">
                                    <div className="plugins-icon-badge">
                                        <AtSign size={16} />
                                    </div>
                                    <div className="plugins-text">
                                        No plugins used yet ·{" "}
                                        <button
                                            type="button"
                                            className="plugins-browse-link"
                                            onClick={() => {
                                                setActiveModal("settings");
                                                setActiveSettingsTab("plugins");
                                            }}
                                        >
                                            Browse
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── FULL SETTINGS VIEW (Screenshot 3) ────────────────────── */}
            {activeModal === "settings" && (
                <div className="full-screen-settings-overlay" role="dialog" aria-label="Settings">
                    {/* Left Sidebar */}
                    <div className="settings-sidebar">
                        {/* Top Back Action */}
                        <div className="settings-top-actions">
                            <button
                                type="button"
                                className="settings-sidebar-toggle-btn"
                                title="Toggle sidebar"
                            >
                                <PanelLeft size={16} />
                            </button>
                            <button
                                type="button"
                                className="settings-back-btn"
                                onClick={() => setActiveModal(null)}
                            >
                                <ArrowLeft size={16} />
                                <span>Back to app</span>
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="settings-search-wrapper">
                            <Search size={15} className="settings-search-icon" />
                            <input
                                type="text"
                                value={settingsSearch}
                                onChange={(e) => setSettingsSearch(e.target.value)}
                                placeholder="Search"
                                className="settings-search-input"
                            />
                        </div>

                        {/* Navigation Categories */}
                        <div className="settings-nav-scroll">
                            {filteredSettingsCategories.map((group) => (
                                <div key={group.category} className="settings-nav-group">
                                    <div className="settings-group-title">{group.category}</div>
                                    {group.items.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = activeSettingsTab === item.id;
                                        return (
                                            <button
                                                key={item.id}
                                                type="button"
                                                className={`settings-nav-item ${isActive ? "active" : ""}`}
                                                onClick={() => {
                                                    if (item.id === "profile_link") {
                                                        setActiveModal("profile");
                                                    } else {
                                                        setActiveSettingsTab(item.id);
                                                    }
                                                }}
                                            >
                                                <Icon size={16} className="settings-nav-icon" />
                                                <span className="settings-nav-text">{item.label}</span>
                                                {item.isExternal && (
                                                    <ExternalLink size={14} className="settings-external-icon" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Content Pane */}
                    <div className="settings-content-pane">
                        {/* General Tab */}
                        {activeSettingsTab === "general" && (
                            <div className="settings-tab-panel">
                                <h2 className="settings-pane-title">General</h2>

                                {/* Language Setting Row */}
                                <div className="settings-row">
                                    <div className="settings-row-info">
                                        <div className="settings-row-label">Language</div>
                                        <div className="settings-row-subtext">Language for the app UI</div>
                                    </div>
                                    <div className="settings-row-control">
                                        <div className="settings-dropdown-wrapper">
                                            <button
                                                type="button"
                                                className="settings-dropdown-pill"
                                                onClick={() =>
                                                    setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                                                }
                                            >
                                                <span>{selectedLanguage}</span>
                                                <ChevronDown size={14} />
                                            </button>
                                            {isLanguageDropdownOpen && (
                                                <div className="settings-dropdown-menu">
                                                    {[
                                                        "Auto detect",
                                                        "English (US)",
                                                        "Spanish (Español)",
                                                        "French (Français)",
                                                        "German (Deutsch)",
                                                        "Japanese (日本語)",
                                                        "Chinese (简体中文)",
                                                        "Somali (Soomaali)",
                                                        "Arabic (العربية)",
                                                    ].map((lang) => (
                                                        <button
                                                            key={lang}
                                                            type="button"
                                                            className={`settings-dropdown-option ${
                                                                selectedLanguage === lang ? "active" : ""
                                                            }`}
                                                            onClick={() => {
                                                                setSelectedLanguage(lang);
                                                                setIsLanguageDropdownOpen(false);
                                                            }}
                                                        >
                                                            <span>{lang}</span>
                                                            {selectedLanguage === lang && <Check size={14} />}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Appearance Tab */}
                        {activeSettingsTab === "appearance" && (
                            <div className="settings-tab-panel">
                                <h2 className="settings-pane-title">Appearance</h2>
                                <div className="settings-row">
                                    <div className="settings-row-info">
                                        <div className="settings-row-label">Theme Mode</div>
                                        <div className="settings-row-subtext">Choose your interface theme</div>
                                    </div>
                                    <div className="settings-row-control">
                                        <div className="theme-toggle-group">
                                            <button
                                                type="button"
                                                className={`theme-toggle-btn ${selectedTheme === "dark" ? "active" : ""}`}
                                                onClick={() => handleSelectTheme("dark")}
                                                title="Dark Theme"
                                            >
                                                <Moon size={14} /> Dark
                                            </button>
                                            <button
                                                type="button"
                                                className={`theme-toggle-btn ${selectedTheme === "light" ? "active" : ""}`}
                                                onClick={() => handleSelectTheme("light")}
                                                title="Light Theme"
                                            >
                                                <Sun size={14} /> Light
                                            </button>
                                            <button
                                                type="button"
                                                className={`theme-toggle-btn ${selectedTheme === "system" ? "active" : ""}`}
                                                onClick={() => handleSelectTheme("system")}
                                                title="Match System Theme"
                                            >
                                                <Laptop size={14} /> System
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeSettingsTab === "notifications" && (
                            <div className="settings-tab-panel">
                                <h2 className="settings-pane-title">Notifications</h2>
                                <div className="settings-row">
                                    <div className="settings-row-info">
                                        <div className="settings-row-label">Desktop Notifications</div>
                                        <div className="settings-row-subtext">Notify when tasks and code reviews finish</div>
                                    </div>
                                    <div className="settings-row-control">
                                        <input
                                            type="checkbox"
                                            className="settings-toggle"
                                            checked={enableNotifications}
                                            onChange={(e) => setEnableNotifications(e.target.checked)}
                                        />
                                    </div>
                                </div>
                                <div className="settings-row">
                                    <div className="settings-row-info">
                                        <div className="settings-row-label">Sound Effects</div>
                                        <div className="settings-row-subtext">Play subtle sound on agent completion</div>
                                    </div>
                                    <div className="settings-row-control">
                                        <input
                                            type="checkbox"
                                            className="settings-toggle"
                                            checked={enableSound}
                                            onChange={(e) => setEnableSound(e.target.checked)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeSettingsTab === "security" && (
                            <div className="settings-tab-panel">
                                <h2 className="settings-pane-title">Security and login</h2>
                                <div className="settings-row">
                                    <div className="settings-row-info">
                                        <div className="settings-row-label">Authentication Provider</div>
                                        <div className="settings-row-subtext">Connected via Supabase Auth</div>
                                    </div>
                                    <div className="settings-row-control">
                                        <span className="settings-badge-green">Protected with RLS</span>
                                    </div>
                                </div>
                                <div className="settings-row">
                                    <div className="settings-row-info">
                                        <div className="settings-row-label">Account Email</div>
                                        <div className="settings-row-subtext">{rawEmail}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Account Tab */}
                        {activeSettingsTab === "account" && (
                            <div className="settings-tab-panel">
                                <h2 className="settings-pane-title">Account</h2>
                                <div className="settings-row">
                                    <div className="settings-row-info">
                                        <div className="settings-row-label">Display Name</div>
                                        <div className="settings-row-subtext">{displayName}</div>
                                    </div>
                                    <div className="settings-row-control">
                                        <button
                                            type="button"
                                            className="settings-outline-btn"
                                            onClick={() => setActiveModal("profile")}
                                        >
                                            Edit in profile
                                        </button>
                                    </div>
                                </div>
                                <div className="settings-row">
                                    <div className="settings-row-info">
                                        <div className="settings-row-label">User ID</div>
                                        <div className="settings-row-subtext" style={{ fontFamily: "monospace" }}>
                                            {user.id}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Personalization Tab */}
                        {activeSettingsTab === "personalization" && (
                            <div className="settings-tab-panel">
                                <h2 className="settings-pane-title">Personalization</h2>
                                <div className="settings-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: "12px" }}>
                                    <div className="settings-row-info">
                                        <div className="settings-row-label">Custom AI Instructions</div>
                                        <div className="settings-row-subtext">
                                            What would you like Goatie AI to know about you to provide better responses?
                                        </div>
                                    </div>
                                    <textarea
                                        rows={4}
                                        value={customInstructions}
                                        onChange={(e) => setCustomInstructions(e.target.value)}
                                        placeholder="e.g. Always generate modern dark mode UI components with clean aesthetics..."
                                        className="settings-textarea"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Pets Tab */}
                        {activeSettingsTab === "pets" && (
                            <div className="settings-tab-panel">
                                <h2 className="settings-pane-title">Pets & Companions</h2>
                                <div className="settings-row">
                                    <div className="settings-row-info">
                                        <div className="settings-row-label">Shiro Mascot Companion</div>
                                        <div className="settings-row-subtext">Display animated Shiro face companion during generation</div>
                                    </div>
                                    <div className="settings-row-control">
                                        <input
                                            type="checkbox"
                                            className="settings-toggle"
                                            checked={petCompanion}
                                            onChange={(e) => setPetCompanion(e.target.checked)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Keyboard Shortcuts Tab */}
                        {activeSettingsTab === "keyboard" && (
                            <div className="settings-tab-panel">
                                <h2 className="settings-pane-title">Keyboard Shortcuts</h2>
                                <div className="settings-shortcuts-list">
                                    {[
                                        { label: "Open Shortcuts", key: "Ctrl + /" },
                                        { label: "Send Message", key: "Enter" },
                                        { label: "New Line", key: "Shift + Enter" },
                                        { label: "Toggle Theme", key: "Alt + T" },
                                        { label: "Close Window", key: "Esc" },
                                    ].map((sc, i) => (
                                        <div key={i} className="settings-shortcut-row">
                                            <span>{sc.label}</span>
                                            <kbd className="settings-kbd">{sc.key}</kbd>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Usage Tab */}
                        {activeSettingsTab === "usage" && (
                            <div className="settings-tab-panel">
                                <h2 className="settings-pane-title">Usage & Quotas</h2>
                                <div className="settings-row">
                                    <div className="settings-row-info">
                                        <div className="settings-row-label">Lifetime Tokens</div>
                                        <div className="settings-row-subtext">Total tokens generated across all threads</div>
                                    </div>
                                    <div className="settings-row-control">
                                        <span className="settings-stat-highlight">2.8M tokens</span>
                                    </div>
                                </div>
                                <div className="settings-row">
                                    <div className="settings-row-info">
                                        <div className="settings-row-label">Free Tier Quota</div>
                                        <div className="settings-row-subtext">Resets monthly</div>
                                    </div>
                                    <div className="settings-row-control">
                                        <span className="settings-stat-highlight">Unlimited</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Billing Tab */}
                        {activeSettingsTab === "billing" && (
                            <div className="settings-tab-panel">
                                <h2 className="settings-pane-title">Billing</h2>
                                <div className="settings-row">
                                    <div className="settings-row-info">
                                        <div className="settings-row-label">Current Plan</div>
                                        <div className="settings-row-subtext">Free Community Edition</div>
                                    </div>
                                    <div className="settings-row-control">
                                        <span className="settings-badge-free">Active</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Plugins Tab */}
                        {activeSettingsTab === "plugins" && (
                            <div className="settings-tab-panel">
                                <h2 className="settings-pane-title">Plugins</h2>
                                <div className="profile-plugins-card" style={{ maxWidth: "500px" }}>
                                    <div className="plugins-icon-badge">
                                        <Plug size={16} />
                                    </div>
                                    <div className="plugins-text">No active third-party plugins installed</div>
                                </div>
                            </div>
                        )}

                        {/* Code Review Tab */}
                        {activeSettingsTab === "codereview" && (
                            <div className="settings-tab-panel">
                                <h2 className="settings-pane-title">Code Review</h2>
                                <div className="settings-row">
                                    <div className="settings-row-info">
                                        <div className="settings-row-label">Automated Linter Integration</div>
                                        <div className="settings-row-subtext">Review Generative UI code blocks before rendering</div>
                                    </div>
                                    <div className="settings-row-control">
                                        <span className="settings-badge-green">Enabled</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Default fallback for other tabs */}
                        {activeSettingsTab !== "general" &&
                            activeSettingsTab !== "appearance" &&
                            activeSettingsTab !== "notifications" &&
                            activeSettingsTab !== "security" &&
                            activeSettingsTab !== "account" &&
                            activeSettingsTab !== "personalization" &&
                            activeSettingsTab !== "pets" &&
                            activeSettingsTab !== "keyboard" &&
                            activeSettingsTab !== "usage" &&
                            activeSettingsTab !== "billing" &&
                            activeSettingsTab !== "plugins" &&
                            activeSettingsTab !== "codereview" && (
                                <div className="settings-tab-panel">
                                    <h2 className="settings-pane-title">
                                        {activeSettingsTab.charAt(0).toUpperCase() + activeSettingsTab.slice(1)}
                                    </h2>
                                    <div className="settings-row">
                                        <div className="settings-row-info">
                                            <div className="settings-row-label">Status</div>
                                            <div className="settings-row-subtext">Configured with Goatie AI default profile</div>
                                        </div>
                                        <div className="settings-row-control">
                                            <span className="settings-badge-green">Standard</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            )}

            {/* ── Add Account Modal (from Screenshot 2) ────────────────── */}
            {activeModal === "addAccount" && (
                <div
                    className="user-modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setActiveModal(null);
                    }}
                >
                    <div className="user-modal-card">
                        <div className="user-modal-header">
                            <h3 className="user-modal-title">
                                <Plus size={18} /> Add Account
                            </h3>
                            <button
                                type="button"
                                className="user-modal-close"
                                onClick={() => setActiveModal(null)}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="user-modal-body">
                            <p style={{ marginBottom: "16px", fontSize: "13.5px" }}>
                                Connect another account or switch workspaces. You are currently logged in as:
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    background: "#09090b",
                                    padding: "10px 14px",
                                    borderRadius: "10px",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    marginBottom: "16px",
                                }}
                            >
                                <div className="user-avatar-badge">{initials}</div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: "14px" }}>{displayName}</div>
                                    <div style={{ color: "#9ca3af", fontSize: "12px" }}>{rawEmail}</div>
                                </div>
                            </div>
                        </div>
                        <div className="user-modal-footer">
                            <button
                                type="button"
                                className="user-modal-btn-secondary"
                                onClick={() => setActiveModal(null)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="user-modal-btn-primary"
                                onClick={() => {
                                    setActiveModal(null);
                                    window.location.href = "/login";
                                }}
                            >
                                Switch or Log in
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Keyboard Shortcuts Modal ─────────────────────────────── */}
            {activeModal === "shortcuts" && (
                <div
                    className="user-modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setActiveModal(null);
                    }}
                >
                    <div className="user-modal-card">
                        <div className="user-modal-header">
                            <h3 className="user-modal-title">
                                <Zap size={18} /> Keyboard Shortcuts
                            </h3>
                            <button
                                type="button"
                                className="user-modal-close"
                                onClick={() => setActiveModal(null)}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="user-modal-body">
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {[
                                    { label: "Open Keyboard Shortcuts", key: "Ctrl + /" },
                                    { label: "Send Message", key: "Enter" },
                                    { label: "New Line in Chat", key: "Shift + Enter" },
                                    { label: "Toggle Dark / Light Theme", key: "Alt + T" },
                                    { label: "Return to Home", key: "Alt + H" },
                                ].map((sc, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "8px 0",
                                            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                                        }}
                                    >
                                        <span style={{ fontSize: "13.5px" }}>{sc.label}</span>
                                        <span className="user-menu-item-shortcut" style={{ fontSize: "12px", padding: "3px 8px" }}>
                                            {sc.key}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="user-modal-footer">
                            <button
                                type="button"
                                className="user-modal-btn-primary"
                                onClick={() => setActiveModal(null)}
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Personalization Modal (if triggered directly) ────────── */}
            {activeModal === "personalization" && (
                <div
                    className="user-modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setActiveModal(null);
                    }}
                >
                    <div className="user-modal-card">
                        <div className="user-modal-header">
                            <h3 className="user-modal-title">
                                <SlidersHorizontal size={18} /> Personalization
                            </h3>
                            <button
                                type="button"
                                className="user-modal-close"
                                onClick={() => setActiveModal(null)}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="user-modal-body">
                            <p style={{ marginBottom: "14px", fontSize: "13.5px" }}>
                                Customize how Goatie AI responds to your prompts and builds Generative UI components.
                            </p>
                            <textarea
                                rows={4}
                                value={customInstructions}
                                onChange={(e) => setCustomInstructions(e.target.value)}
                                placeholder="e.g. Prefer concise answers, include generative UI tables, default to dark themes..."
                                style={{
                                    width: "100%",
                                    padding: "10px 14px",
                                    background: "#09090b",
                                    border: "1px solid rgba(255, 255, 255, 0.15)",
                                    borderRadius: "8px",
                                    color: "#fff",
                                    fontSize: "13.5px",
                                    outline: "none",
                                    resize: "vertical",
                                }}
                            />
                        </div>
                        <div className="user-modal-footer">
                            <button
                                type="button"
                                className="user-modal-btn-primary"
                                onClick={() => setActiveModal(null)}
                            >
                                Save preferences
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Help Submenu Modals ──────────────────────────────────── */}
            {(activeModal === "helpCenter" ||
                activeModal === "privacyCenter" ||
                activeModal === "releaseNotes" ||
                activeModal === "downloadApps" ||
                activeModal === "terms" ||
                activeModal === "privacy" ||
                activeModal === "reportBug") && (
                <div
                    className="user-modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setActiveModal(null);
                    }}
                >
                    <div className="user-modal-card">
                        <div className="user-modal-header">
                            <h3 className="user-modal-title">
                                {activeModal === "reportBug" && <Bug size={18} />}
                                {activeModal === "releaseNotes" && <PenLine size={18} />}
                                {activeModal === "downloadApps" && <Download size={18} />}
                                {activeModal === "privacyCenter" && <ShieldCheck size={18} />}
                                {activeModal === "privacy" && <Info size={18} />}
                                {activeModal === "terms" && <FileText size={18} />}
                                {activeModal === "helpCenter" && <HelpCircle size={18} />}
                                {activeModal === "reportBug"
                                    ? "Report an Issue"
                                    : activeModal === "releaseNotes"
                                    ? "Goatie AI Release Notes"
                                    : activeModal === "downloadApps"
                                    ? "Download Goatie AI Apps"
                                    : activeModal === "privacyCenter" || activeModal === "privacy"
                                    ? "Privacy Policy"
                                    : activeModal === "terms"
                                    ? "Terms of Service"
                                    : "Help & Support"}
                            </h3>
                            <button
                                type="button"
                                className="user-modal-close"
                                onClick={() => setActiveModal(null)}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="user-modal-body">
                            {activeModal === "reportBug" ? (
                                <div>
                                    <p style={{ marginBottom: "12px" }}>
                                        Found a bug or have feedback? Let us know:
                                    </p>
                                    <textarea
                                        rows={4}
                                        placeholder="Describe what happened..."
                                        style={{
                                            width: "100%",
                                            padding: "10px 14px",
                                            background: "#09090b",
                                            border: "1px solid rgba(255, 255, 255, 0.15)",
                                            borderRadius: "8px",
                                            color: "#fff",
                                            fontSize: "13.5px",
                                            outline: "none",
                                        }}
                                    />
                                </div>
                            ) : activeModal === "releaseNotes" ? (
                                <div>
                                    <h4 style={{ color: "#38bdf8", marginBottom: "6px" }}>v0.1.1 — Goatie AI Release</h4>
                                    <ul style={{ paddingLeft: "20px", fontSize: "13.5px", lineHeight: "1.8" }}>
                                        <li>Next.js security patch upgrade to 16.4.2</li>
                                        <li>Full Supabase Auth & PostgreSQL schema integration</li>
                                        <li>Shiro Face animated loading icon integration</li>
                                        <li>Complete Generative UI suite with OpenUI</li>
                                    </ul>
                                </div>
                            ) : activeModal === "downloadApps" ? (
                                <p>
                                    Goatie AI is a Progressive Web App (PWA). You can install it on macOS, Windows, iOS, and Android directly from your browser&apos;s address bar.
                                </p>
                            ) : (
                                <p>
                                    Goatie AI is committed to your privacy and security. Conversations are stored securely in your private Supabase database protected with Row Level Security (RLS).
                                </p>
                            )}
                        </div>
                        <div className="user-modal-footer">
                            <button
                                type="button"
                                className="user-modal-btn-primary"
                                onClick={() => setActiveModal(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
