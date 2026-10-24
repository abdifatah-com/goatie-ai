"use client";
import "./landing.css";
import React, { useEffect, useRef, useCallback, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import GoatieRunner from "./goatie-runner";
import {
  Sparkles,
  Layers,
  Database,
  Zap,
  ShieldCheck,
  Cpu,
  ArrowRight,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Globe,
  CheckCircle2,
  Send,
  User as UserIcon,
  Play,
  Terminal,
  Sliders,
  Gamepad2,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Star,
  Activity,
  Code2,
} from "lucide-react";

/* ── Stats data ── */
const stats = [
  { icon: "<", target: 120, suffix: "ms", decimals: 0, label: "Inference Time" },
  { icon: "%", target: 99.99, suffix: "%", decimals: 2, label: "Platform Uptime" },
  { icon: "*", target: 24, suffix: "/7", decimals: 0, label: "Autonomous Runtime" },
  { icon: "#", target: 2.4, suffix: "M", decimals: 1, label: "Context Windows" },
];

/* ── Partner Logos ── */
const partners = [
  { name: "Microsoft Azure", icon: "fa-brands fa-microsoft" },
  { name: "Amazon AWS", icon: "fa-brands fa-amazon" },
  { name: "Google Cloud", icon: "fa-brands fa-google" },
  { name: "NVIDIA Inception", icon: "fa-solid fa-microchip" },
  { name: "Supabase PostgreSQL", icon: "fa-solid fa-database" },
  { name: "Next.js 16", icon: "fa-brands fa-react" },
  { name: "OpenUI Spec", icon: "fa-solid fa-layer-group" },
  { name: "OpenAI GPT-4o", icon: "fa-solid fa-bolt" },
];

/* ── FAQ Items ── */
const faqs = [
  {
    q: "How does Goatie AI generate live UI instead of just text?",
    a: "Unlike legacy chatbots that only output markdown, Goatie AI outputs structured OpenUI Lang specifications. Our runtime compiler transforms these specifications on the fly into native, sandboxed, interactive React components with zero manual glue code.",
  },
  {
    q: "How does the 1-minute live demo work?",
    a: "Clicking 'View Demo' puts you straight into an active guest workspace with 3 free trial prompts and 60 seconds of live execution. You can generate real calculators, games, and dashboards with no sign-up or credit card required.",
  },
  {
    q: "Can I connect my own models or run locally with Ollama?",
    a: "Yes! Goatie AI supports any OpenAI-compatible Chat Completions endpoint, including local Ollama (e.g. Qwen 2.5, Llama 3.3) and cloud gateways. Simply configure LLM_BASE_URL and LLM_MODEL in your environment.",
  },
  {
    q: "How is my workspace and chat data protected?",
    a: "Every user account is secured through Supabase PostgreSQL Row Level Security (RLS). Your threads, preferences, and session tokens remain private to your authenticated user ID with enterprise-grade AES encryption.",
  },
  {
    q: "Can I export or embed generated UI components into my own apps?",
    a: "Yes! All components adhere to the open OpenUI specification and can be exported as standalone React JSX code, HTML/CSS bundles, or integrated into existing design systems.",
  },
];

/* ── Customer Testimonials (Poker Deck) ── */
const testimonials = [
  {
    id: 1,
    name: "Elena Rostova",
    role: "VP of Engineering at FinScale",
    avatar: "ER",
    suit: "♠",
    rank: "A",
    color: "#38bdf8",
    accentBg: "rgba(56, 189, 248, 0.12)",
    accentBorder: "rgba(56, 189, 248, 0.35)",
    metric: "+340% Dev Velocity",
    badge: "Enterprise FinTech",
    text: "Goatie AI completely changed how our analytics team operates. We went from writing mockups in Figma to having our AI generate fully functional scenario modeling dashboards during stakeholder calls.",
  },
  {
    id: 2,
    name: "Marcus Vance",
    role: "Head of AI Architecture at DevSphere",
    avatar: "MV",
    suit: "♦",
    rank: "K",
    color: "#f59e0b",
    accentBg: "rgba(245, 158, 11, 0.12)",
    accentBorder: "rgba(245, 158, 11, 0.35)",
    metric: "Sub-120ms AST Compiler",
    badge: "AI Platforms",
    text: "The combination of the Shiro reasoning companion and real-time OpenUI component generation is phenomenal. It is miles ahead of standard static chat interfaces.",
  },
  {
    id: 3,
    name: "Sophia Chen",
    role: "Founding Engineer at Synthetix Labs",
    avatar: "SC",
    suit: "♥",
    rank: "Q",
    color: "#ec4899",
    accentBg: "rgba(236, 72, 153, 0.12)",
    accentBorder: "rgba(236, 72, 153, 0.35)",
    metric: "100% Air-Gapped",
    badge: "Autonomous Systems",
    text: "Running Goatie AI with local Ollama models gave our enterprise air-gapped security with sub-100ms response times. It has become our daily pair-programming partner.",
  },
  {
    id: 4,
    name: "David K. Sterling",
    role: "Chief Product Officer at ApexCloud",
    avatar: "DS",
    suit: "♣",
    rank: "J",
    color: "#10b981",
    accentBg: "rgba(16, 185, 129, 0.12)",
    accentBorder: "rgba(16, 185, 129, 0.35)",
    metric: "4.8x Conversion Rate",
    badge: "SaaS Infrastructure",
    text: "We replaced static onboarding surveys with Goatie AI's adaptive UI builders. Users configure real calculators and live dashboards in seconds — it feels like magic.",
  },
  {
    id: 5,
    name: "Amina Al-Mansoor",
    role: "Lead Full-Stack Architect at NexusBio",
    avatar: "AM",
    suit: "★",
    rank: "10",
    color: "#a855f7",
    accentBg: "rgba(168, 85, 247, 0.12)",
    accentBorder: "rgba(168, 85, 247, 0.35)",
    metric: "0 Hydration Mismatches",
    badge: "Bioinformatics",
    text: "Building dynamic KaTeX scientific math solvers and vector charts on the fly inside customer conversations saved our engineering team 6 months of custom frontend development.",
  },
];

/* ── Easing ── */
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const countedRef = useRef(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // ── Interactive Studio / Playground State ──
  const [activeTab, setActiveTab] = useState<"dash" | "game" | "calc" | "shiro">("dash");
  const [dashRange, setDashRange] = useState<"Today" | "7D" | "30D" | "YTD">("7D");
  const [calcTeamSize, setCalcTeamSize] = useState<number>(18);
  const [calcPrompts, setCalcPrompts] = useState<number>(250);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // ── Poker Deck Testimonials State ──
  const [pokerCardIndex, setPokerCardIndex] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDraggingCard, setIsDraggingCard] = useState<boolean>(false);
  const dragStartX = useRef<number>(0);

  const nextPokerCard = useCallback(() => {
    setPokerCardIndex((prev) => (prev + 1) % testimonials.length);
    setDragOffset(0);
  }, []);

  const prevPokerCard = useCallback(() => {
    setPokerCardIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setDragOffset(0);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    setIsDraggingCard(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingCard) return;
    setDragOffset(e.touches[0].clientX - dragStartX.current);
  };

  const handleTouchEnd = () => {
    if (!isDraggingCard) return;
    if (dragOffset < -50) {
      nextPokerCard();
    } else if (dragOffset > 50) {
      prevPokerCard();
    } else {
      setDragOffset(0);
    }
    setIsDraggingCard(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartX.current = e.clientX;
    setIsDraggingCard(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingCard) return;
    setDragOffset(e.clientX - dragStartX.current);
  };

  const handleMouseUp = () => {
    if (!isDraggingCard) return;
    if (dragOffset < -50) {
      nextPokerCard();
    } else if (dragOffset > 50) {
      prevPokerCard();
    } else {
      setDragOffset(0);
    }
    setIsDraggingCard(false);
  };

  const handleMouseLeave = () => {
    if (isDraggingCard) {
      if (dragOffset < -50) {
        nextPokerCard();
      } else if (dragOffset > 50) {
        prevPokerCard();
      } else {
        setDragOffset(0);
      }
      setIsDraggingCard(false);
    }
  };

  const getCardPositionClass = (index: number) => {
    let diff = (index - pokerCardIndex) % testimonials.length;
    if (diff > testimonials.length / 2) diff -= testimonials.length;
    if (diff < -testimonials.length / 2) diff += testimonials.length;

    if (diff === 0) return "pos-center";
    if (diff === 1) return "pos-right-1";
    if (diff === -1) return "pos-left-1";
    if (diff === 2) return "pos-right-2";
    if (diff === -2) return "pos-left-2";
    return "pos-hidden";
  };

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) setIsAuthenticated(true);
      }).catch(() => {});
    } catch {
      // Supabase is unconfigured or unavailable
    }
  }, []);

  /* ── Count-up animation ── */
  const startCounting = useCallback(() => {
    if (countedRef.current) return;
    countedRef.current = true;
    const els = statsRef.current?.querySelectorAll("[data-target]");
    if (!els) return;
    els.forEach((el, i) => {
      const target = parseFloat(el.getAttribute("data-target") || "0");
      const decimals = parseInt(el.getAttribute("data-decimals") || "0");
      const suffix = el.getAttribute("data-suffix") || "";
      const duration = 1500 + i * 80;
      const startOffset = 480 + i * 90;
      setTimeout(() => {
        const start = performance.now();
        function tick(now: number) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const value = target * easeOutCubic(progress);
          el.textContent = value.toFixed(decimals) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }, startOffset);
    });
  }, []);

  useEffect(() => {
    const node = statsRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) startCounting();
      },
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [startCounting]);

  // ── Micro-Scroll Reveal Observer & Floating Header Scroll State ──
  useEffect(() => {
    // 1. Floating header dynamic glass elevation on scroll
    const handleScroll = () => {
      const header = document.querySelector<HTMLElement>(".header");
      if (header) {
        if (window.scrollY > 30) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // 2. Micro-scroll reveal observer
    const targets = document.querySelectorAll<HTMLElement>(".reveal-on-scroll");
    if (!targets.length) {
      return () => window.removeEventListener("scroll", handleScroll);
    }

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-revealed"));
      return () => window.removeEventListener("scroll", handleScroll);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    targets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // Only immediately reveal if already well above the fold (top 60% of viewport)
      if (rect.top < window.innerHeight * 0.6 && rect.bottom > 0) {
        el.classList.add("is-revealed");
      } else {
        observer.observe(el);
      }
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  /* ── Mobile menu ── */
  const toggleMenu = useCallback(() => {
    const menu = menuRef.current;
    const burger = burgerRef.current;
    const overlay = overlayRef.current;
    if (!menu || !burger || !overlay) return;

    const willOpen = menu.hidden;
    menu.hidden = !willOpen;
    overlay.hidden = !willOpen;
    burger.classList.toggle("open", willOpen);
    burger.setAttribute("aria-expanded", String(willOpen));
    document.body.classList.toggle("menu-open", willOpen);
  }, []);

  const closeMenu = useCallback(() => {
    const menu = menuRef.current;
    const burger = burgerRef.current;
    const overlay = overlayRef.current;
    if (!menu || !burger || !overlay) return;

    menu.hidden = true;
    overlay.hidden = true;
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeMenu();
    }
    function handleResize() {
      if (window.innerWidth > 820) closeMenu();
    }
    window.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleResize);
    };
  }, [closeMenu]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim() || !contactMessage.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      setContactName("");
      setContactEmail("");
      setContactSubject("");
      setContactMessage("");
    }, 800);
  };

  // Dynamic bar data based on range
  const barHeights = {
    Today: [45, 65, 80, 50, 95, 70, 88],
    "7D": [60, 85, 45, 92, 75, 100, 84],
    "30D": [75, 90, 82, 68, 88, 96, 90],
    YTD: [50, 68, 74, 85, 90, 95, 100],
  }[dashRange];

  const daysLabel = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <>
      {/* CDN fonts */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://db.onlinewebfonts.com/c/8cb707a9b8a73f8a7403336b861c3074?family=BubbledotICG-FinePos"
        rel="stylesheet"
      />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />

      <div className="landing-page">
        {/* Background video & ambient glow - persistent across whole page */}
        <div className="bg">
          <video className="bg-video" autoPlay muted loop playsInline>
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4"
              type="video/mp4"
            />
          </video>
          <div className="bg-overlay" />
        </div>

        {/* Ambient Aurora Orbs */}
        <div className="ambient-glow-wrap">
          <div className="ambient-orb ambient-orb-teal" />
          <div className="ambient-orb ambient-orb-indigo" />
          <div className="ambient-orb ambient-orb-rose" />
        </div>

        {/* ── Viewport 1: Hero Section ── */}
        <div className="landing-hero-wrapper">
          {/* ── Header ── */}
          <header className="header">
            <Link href="/" className="logo-btn" aria-label="Goatie AI">
              <img src="/goat.png" alt="Goatie AI" width={52} height={52} />
            </Link>

            <nav className="nav-pill">
              <Link href="/" className="nav-link active">Home</Link>
              <Link href="/product" className="nav-link">Product</Link>
              <Link href="/chat?demo=true" className="nav-link">Live Studio</Link>
              <Link href="/cases" className="nav-link">Case Studies</Link>
              <Link href="/contact" className="nav-link">Contact</Link>
            </nav>

            <Link href="/login" className="sign-in-btn desktop-only">
              Sign in
            </Link>

            {/* Mobile burger */}
            <button
              className="burger"
              ref={burgerRef}
              aria-expanded="false"
              aria-label="Menu"
              onClick={toggleMenu}
            >
              <span className="burger-bar" />
              <span className="burger-bar" />
              <span className="burger-bar" />
            </button>
          </header>

          {/* ── Hero Center ── */}
          <main className="hero">
            {/* Shimmer Announcement Pill */}
            <Link href="/chat?demo=true" className="announcement-pill anim" style={{ "--d": "0.02s" } as React.CSSProperties}>
              <span className="announcement-dot" />
              <span className="announcement-tag">NEW</span>
              <span>Goatie AI 2.0 • Real-Time Generative UI Engine</span>
              <ArrowRight size={13} style={{ opacity: 0.7 }} />
            </Link>

            {/* Trust row */}
            <div className="trust-row anim" style={{ "--d": "0.08s" } as React.CSSProperties}>
              <div className="trust-avatar">
                <div className="avatar-inner">
                  <i className="fa-brands fa-microsoft" />
                </div>
              </div>
              <div className="trust-avatar">
                <div className="avatar-inner">
                  <i className="fa-brands fa-amazon" />
                </div>
              </div>
              <div className="trust-avatar">
                <div className="avatar-inner">
                  <i className="fa-brands fa-google" />
                </div>
              </div>
              <div className="trust-pill">
                <span>Trusted by 2,000+ High-Growth Teams</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="headline anim">
              <span>Intelligence</span>
              <span>Designed To Evolve</span>
            </h1>

            {/* Subhead */}
            <p className="subhead anim" style={{ "--d": "0.28s" } as React.CSSProperties}>
              Transform conversational thoughts into reactive, playable, and production-ready applications. Don&apos;t just chat — build.
            </p>

            {/* CTA */}
            <div style={{ display: "flex", gap: "14px", alignItems: "center", position: "relative", zIndex: 2 }}>
              <Link href="/chat?demo=true" className="cta-btn" style={{ "--d": "0.38s" } as React.CSSProperties}>
                <Sparkles size={16} />
                <span>View Demo</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/login"
                className="sign-in-btn"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  height: "clamp(46px, 5.2vw, 50px)",
                  padding: "0 22px",
                }}
              >
                <UserIcon size={14} />
                <span>Sign In</span>
              </Link>
            </div>
          </main>

          {/* ── Stats ── */}
          <div className="stats" ref={statsRef}>
            {stats.map((s, i) => (
              <div
                className="stat anim"
                key={s.label}
                style={{ "--d": `${0.45 + i * 0.08}s` } as React.CSSProperties}
              >
                <span className="stat-icon">{s.icon}</span>
                <span
                  className="stat-value"
                  data-target={s.target}
                  data-suffix={s.suffix}
                  data-decimals={s.decimals}
                >
                  0{s.suffix}
                </span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Infinite Partner Logo Marquee ── */}
        <section className="partner-marquee-wrap reveal-on-scroll" aria-label="Enterprise Ecosystem">
          <div className="partner-marquee-track">
            {[...partners, ...partners].map((p, idx) => (
              <div className="partner-logo-item" key={`${p.name}-${idx}`}>
                <i className={p.icon} />
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Mobile menu ── */}
        <div className="mobile-overlay" ref={overlayRef} hidden onClick={closeMenu} />
        <div className="mobile-menu" ref={menuRef} hidden>
          <div className="mobile-menu-links">
            <Link href="/" className="mobile-menu-link active" style={{ "--d": "0.05s" } as React.CSSProperties} onClick={closeMenu}>
              Home
            </Link>
            <Link href="/product" className="mobile-menu-link" style={{ "--d": "0.1s" } as React.CSSProperties} onClick={closeMenu}>
              Product
            </Link>
            <Link href="/chat?demo=true" className="mobile-menu-link" style={{ "--d": "0.12s" } as React.CSSProperties} onClick={closeMenu}>
              Live Studio
            </Link>
            <Link href="/cases" className="mobile-menu-link" style={{ "--d": "0.15s" } as React.CSSProperties} onClick={closeMenu}>
              Case Studies
            </Link>
            <Link href="/contact" className="mobile-menu-link" style={{ "--d": "0.2s" } as React.CSSProperties} onClick={closeMenu}>
              Contact
            </Link>
            <Link href="/chat?demo=true" className="mobile-sign-in" style={{ "--d": "0.22s", background: "#ffffff", color: "#000000" } as React.CSSProperties} onClick={closeMenu}>
              View Demo (1 Min)
            </Link>
            <Link href="/login" className="mobile-sign-in" style={{ "--d": "0.26s" } as React.CSSProperties} onClick={closeMenu}>
              Sign in
            </Link>
          </div>
        </div>

        {/* ── Content Sections ── */}
        <div className="landing-content-wrapper">
          {/* ── Interactive Live Studio Section ── */}
          <section id="studio" className="landing-section" style={{ paddingBottom: "40px" }}>
            <div className="section-header-center reveal-on-scroll">
              <div className="section-badge">
                <Sparkles size={14} />
                <span>Real-Time Interactive Playground</span>
              </div>
              <h2 className="section-title">See Generative UI In Action</h2>
              <p className="section-desc">
                Don&apos;t just imagine what live generative software looks like. Test these interactive components compiled from OpenUI specs right on this page:
              </p>
            </div>

            <div className="studio-container">
              <div className="studio-window reveal-on-scroll">
                <div className="studio-titlebar">
                  <div className="studio-mac-dots">
                    <span className="mac-dot red" />
                    <span className="mac-dot yellow" />
                    <span className="mac-dot green" />
                  </div>
                  <div className="studio-window-title">
                    <Code2 size={13} />
                    <span>Goatie AI Studio • OpenUI AST Engine v2.0</span>
                  </div>
                  <div className="studio-live-badge">
                    <span className="status-dot-ping" />
                    <span>Interactive Preview</span>
                  </div>
                </div>

                <div className="studio-tab-bar">
                  <button
                    type="button"
                    onClick={() => setActiveTab("dash")}
                    className={`studio-tab-btn ${activeTab === "dash" ? "active" : ""}`}
                  >
                    <TrendingUp size={14} />
                    <span>Live Financial Dash</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("game")}
                    className={`studio-tab-btn ${activeTab === "game" ? "active" : ""}`}
                  >
                    <Gamepad2 size={14} />
                    <span>Playable Mini Game</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("calc")}
                    className={`studio-tab-btn ${activeTab === "calc" ? "active" : ""}`}
                  >
                    <Sliders size={14} />
                    <span>Dynamic ROI Calculator</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("shiro")}
                    className={`studio-tab-btn ${activeTab === "shiro" ? "active" : ""}`}
                  >
                    <Cpu size={14} />
                    <span>Shiro Autonomous Reasoning</span>
                  </button>
                </div>

                <div className="studio-body">
                  {/* Tab 1: Financial Dashboard */}
                  {activeTab === "dash" && (
                    <div>
                      <div className="studio-dash-grid">
                        <div className="dash-metric-card">
                          <div className="dash-metric-label">
                            <span>Total Platform Revenue</span>
                            <span className="dash-metric-growth">+28.4%</span>
                          </div>
                          <div className="dash-metric-value">$148,290</div>
                        </div>

                        <div className="dash-metric-card">
                          <div className="dash-metric-label">
                            <span>Sub-Token Latency</span>
                            <span className="dash-metric-growth" style={{ color: "#38bdf8" }}>92ms avg</span>
                          </div>
                          <div className="dash-metric-value">0.12s</div>
                        </div>

                        <div className="dash-metric-card">
                          <div className="dash-metric-label">
                            <span>Active GenUI Workspaces</span>
                            <span className="dash-metric-growth">Live</span>
                          </div>
                          <div className="dash-metric-value">1,420</div>
                        </div>
                      </div>

                      <div className="studio-chart-wrapper">
                        <div className="chart-header-row">
                          <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                            Inference Volume & Component Renders
                          </div>
                          <div className="chart-pills">
                            {(["Today", "7D", "30D", "YTD"] as const).map((r) => (
                              <button
                                key={r}
                                type="button"
                                onClick={() => setDashRange(r)}
                                className={`chart-pill-btn ${dashRange === r ? "active" : ""}`}
                              >
                                {r}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="chart-bars-row">
                          {barHeights.map((h, i) => (
                            <div className="chart-bar-col" key={i}>
                              <div
                                className={`chart-bar-fill ${i === 5 ? "highlight" : ""}`}
                                style={{ height: `${h}%` }}
                              />
                              <span className="chart-bar-day">{daysLabel[i]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Fully Playable Goatie Runner 2.0 Arcade */}
                  {activeTab === "game" && <GoatieRunner />}

                  {/* Tab 3: ROI Calculator */}
                  {activeTab === "calc" && (
                    <div className="calc-grid">
                      <div>
                        <div className="calc-slider-card">
                          <div className="calc-slider-header">
                            <span>Engineering Team Size</span>
                            <span style={{ fontWeight: 700, color: "#38bdf8" }}>{calcTeamSize} Developers</span>
                          </div>
                          <input
                            type="range"
                            min="2"
                            max="100"
                            value={calcTeamSize}
                            onChange={(e) => setCalcTeamSize(parseInt(e.target.value, 10))}
                            className="calc-range-input"
                          />
                        </div>

                        <div className="calc-slider-card">
                          <div className="calc-slider-header">
                            <span>Generative UI Prompts / Day</span>
                            <span style={{ fontWeight: 700, color: "#34d399" }}>{calcPrompts} Workflows</span>
                          </div>
                          <input
                            type="range"
                            min="20"
                            max="1000"
                            step="10"
                            value={calcPrompts}
                            onChange={(e) => setCalcPrompts(parseInt(e.target.value, 10))}
                            className="calc-range-input"
                          />
                        </div>
                      </div>

                      <div className="calc-result-box">
                        <div style={{ fontSize: "13px", color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Estimated Monthly Engineering Savings
                        </div>
                        <div className="calc-result-number">
                          ${(calcTeamSize * 1650).toLocaleString()}
                        </div>
                        <div style={{ fontSize: "13px", color: "#94a3b8" }}>
                          Equivalent to ~{Math.round(calcTeamSize * 32)} hours of boilerplate UI engineering saved per month.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 4: Shiro Autonomous Reasoning */}
                  {activeTab === "shiro" && (
                    <div className="shiro-terminal">
                      <div className="shiro-log-line" style={{ color: "#34d399", marginBottom: "8px" }}>
                        <span>● [SHIRO RUNTIME INITIALIZED]</span>
                        <span style={{ color: "#64748b" }}>session_id: openui_live_7728</span>
                      </div>
                      <div className="shiro-log-line">
                        <span className="shiro-log-badge plan">PLAN</span>
                        <span>User prompt: &quot;Build an interactive data visualizer with dynamic filters&quot;</span>
                      </div>
                      <div className="shiro-log-line">
                        <span className="shiro-log-badge gen">GEN-UI</span>
                        <span>Streaming OpenUI AST node: &lt;AreaChart data=dataset variant=&quot;condensed&quot; /&gt;</span>
                      </div>
                      <div className="shiro-log-line">
                        <span className="shiro-log-badge check">VERIFY</span>
                        <span>PostgreSQL Row Level Security context verified. RLS policies active.</span>
                      </div>
                      <div className="shiro-log-line" style={{ color: "#38bdf8", marginTop: "10px" }}>
                        <span>⚡ Component compiled & rendered in 98ms with zero client hydration drift.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ── Product Bento Grid Section ── */}
          <section id="product" className="landing-section">
            <div className="section-header-center reveal-on-scroll">
              <div className="section-badge">
                <Layers size={14} />
                <span>Next-Gen Architecture</span>
              </div>
              <h2 className="section-title">Built For The Future of Software</h2>
              <p className="section-desc">
                Goatie AI transforms plain-text prompts into live, interactive application interfaces. Don&apos;t just read responses — collaborate with an evolving workspace.
              </p>
            </div>

            <div className="bento-grid">
              {/* Bento 1: Large Span 2 */}
              <div className="bento-card bento-span-2 reveal-on-scroll" data-delay="1">
                <div className="bento-icon">
                  <Layers size={26} />
                </div>
                <h3 className="bento-title">OpenUI Reactive Generative Engine</h3>
                <p className="bento-desc">
                  Live data tables, visual charts, forms, calculators, and playable apps rendered in milliseconds using OpenUI standard specifications. Full state persistence across conversation threads.
                </p>
                <div className="bento-preview-pill">
                  <Sparkles size={13} />
                  <span>Sub-120ms Client-Side Hydration</span>
                </div>
              </div>

              {/* Bento 2: Shiro Companion */}
              <div className="bento-card reveal-on-scroll" data-delay="2">
                <div className="bento-icon" style={{ color: "#c084fc" }}>
                  <Cpu size={26} />
                </div>
                <h3 className="bento-title">Shiro AI Mascot</h3>
                <p className="bento-desc">
                  An autonomous thought companion showing real-time multi-step reasoning, tool executions, and step verification as they happen.
                </p>
                <div className="bento-preview-pill" style={{ color: "#c084fc" }}>
                  <Activity size={13} />
                  <span>Real-time Thought Stream</span>
                </div>
              </div>

              {/* Bento 3: Supabase Vault */}
              <div className="bento-card reveal-on-scroll" data-delay="3">
                <div className="bento-icon" style={{ color: "#34d399" }}>
                  <Database size={26} />
                </div>
                <h3 className="bento-title">PostgreSQL RLS Vault</h3>
                <p className="bento-desc">
                  Military-grade Row Level Security with Supabase SSR session validation. Every message, user setting, and custom thread is encrypted at rest.
                </p>
                <div className="bento-preview-pill" style={{ color: "#34d399" }}>
                  <ShieldCheck size={13} />
                  <span>256-Bit AES Encryption</span>
                </div>
              </div>

              {/* Bento 4: Large Span 2 */}
              <div className="bento-card bento-span-2 reveal-on-scroll" data-delay="4">
                <div className="bento-icon" style={{ color: "#fbbf24" }}>
                  <Zap size={26} />
                </div>
                <h3 className="bento-title">Hybrid Local & Cloud Gateway Inference</h3>
                <p className="bento-desc">
                  Connect locally with private Ollama models or route through low-effort cloud streaming gateway adapters. Zero vendor lock-in architecture ensures you always own your compute.
                </p>
                <div className="bento-preview-pill" style={{ color: "#fbbf24" }}>
                  <Zap size={13} />
                  <span>Zero Vendor Lock-in</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Case Studies Section ── */}
          <section id="cases" className="landing-section">
            <div className="section-header-center reveal-on-scroll">
              <div className="section-badge">
                <ShieldCheck size={14} />
                <span>Enterprise Case Studies</span>
              </div>
              <h2 className="section-title">Empowering High-Velocity Teams</h2>
              <p className="section-desc">
                From autonomous development workflows to enterprise data dashboards, see how organizations evolve with Goatie AI.
              </p>
            </div>

            <div className="case-studies-grid">
              <div className="case-card reveal-on-scroll" data-delay="1">
                <span className="case-tag">Fintech & Analytics</span>
                <div className="case-metric-highlight">+340%</div>
                <div className="case-metric-label">Analyst Velocity</div>
                <h4 className="case-title">Global Portfolio Rebalancing</h4>
                <p className="case-desc">
                  A leading wealth management team deployed Goatie AI to generate real-time risk assessment widgets and interactive scenario modeling tools in seconds.
                </p>
              </div>

              <div className="case-card reveal-on-scroll" data-delay="2">
                <span className="case-tag">Autonomous Engineering</span>
                <div className="case-metric-highlight">99.4%</div>
                <div className="case-metric-label">Vulnerability Detection</div>
                <h4 className="case-title">Automated Code Reviews & AST Audits</h4>
                <p className="case-desc">
                  An engineering team of 250+ developers integrated Goatie AI into their pull request workflows, automatically flagging security regressions and testing generative UI blocks.
                </p>
              </div>

              <div className="case-card reveal-on-scroll" data-delay="3">
                <span className="case-tag">Next-Gen SaaS</span>
                <div className="case-metric-highlight">4.8x</div>
                <div className="case-metric-label">Conversion Rate</div>
                <h4 className="case-title">Dynamic Generative Onboarding</h4>
                <p className="case-desc">
                  A modern B2B platform replaced static onboarding checklists with Goatie AI&apos;s adaptive UI builders, creating custom user workspaces tailored to individual customer needs.
                </p>
              </div>
            </div>
          </section>

          {/* ── Customer Testimonials / Poker Card Deck Carousel ── */}
          <section className="landing-section" style={{ paddingTop: "20px" }}>
            <div className="section-header-center reveal-on-scroll">
              <div className="section-badge">
                <Star size={14} />
                <span>Customer Reviews</span>
              </div>
              <h2 className="section-title">Loved By Builders Everywhere</h2>
              <p className="section-desc">
                Discover why architects, founders, and engineers choose Goatie AI. Slide or swipe through our deck of verified testimonials.
              </p>
            </div>

            <div className="poker-testimonials-wrap reveal-on-scroll">
              {/* Stacked Poker Cards Stage */}
              <div
                className="poker-deck-stage"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") prevPokerCard();
                  if (e.key === "ArrowRight") nextPokerCard();
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                {testimonials.map((t, index) => {
                  const posClass = getCardPositionClass(index);
                  const isTop = posClass === "pos-center";

                  return (
                    <div
                      key={t.id}
                      className={`poker-card ${posClass} ${isTop && isDraggingCard ? "is-dragging" : ""}`}
                      style={
                        isTop
                          ? {
                              transform: isDraggingCard
                                ? `translate3d(${dragOffset}px, 0px, 0px) rotate(${dragOffset * 0.05}deg)`
                                : undefined,
                              cursor: isDraggingCard ? "grabbing" : "grab",
                              boxShadow: `0 25px 60px -10px rgba(0, 0, 0, 0.9), 0 0 35px ${t.accentBg}`,
                              borderColor: t.accentBorder,
                            }
                          : undefined
                      }
                      onClick={() => {
                        if (!isTop) {
                          setPokerCardIndex(index);
                          setDragOffset(0);
                        }
                      }}
                    >
                      {/* Background Watermark Suit */}
                      <span className="poker-card-watermark" style={{ color: t.color }}>
                        {t.suit}
                      </span>

                      {/* Top-Left Playing Card Corner */}
                      <div className="poker-corner top-left">
                        <span className="poker-corner-rank">{t.rank}</span>
                        <span className="poker-corner-suit" style={{ color: t.color }}>
                          {t.suit}
                        </span>
                      </div>

                      {/* Bottom-Right Playing Card Corner */}
                      <div className="poker-corner bottom-right">
                        <span className="poker-corner-rank">{t.rank}</span>
                        <span className="poker-corner-suit" style={{ color: t.color }}>
                          {t.suit}
                        </span>
                      </div>

                      {/* Card Header */}
                      <div className="poker-card-header">
                        <div className="poker-stars-row">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                          ))}
                        </div>
                        <div className="poker-card-badges">
                          <span
                            className="poker-badge-category"
                            style={{
                              color: t.color,
                              background: t.accentBg,
                              borderColor: t.accentBorder,
                            }}
                          >
                            {t.badge}
                          </span>
                          <span className="poker-badge-metric">{t.metric}</span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="poker-card-body">
                        <p className="poker-card-quote">&ldquo;{t.text}&rdquo;</p>
                      </div>

                      {/* Card Author Footer */}
                      <div className="poker-card-author-row">
                        <div className="poker-author-identity">
                          <div
                            className="poker-author-avatar"
                            style={{ border: `2px solid ${t.color}` }}
                          >
                            {t.avatar}
                          </div>
                          <div>
                            <div className="poker-author-name">
                              <span>{t.name}</span>
                            </div>
                            <div className="poker-author-role">{t.role}</div>
                          </div>
                        </div>

                        <div className="poker-verified-pill">
                          <CheckCircle2 size={13} />
                          <span>Verified User</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Deck Navigation Controls */}
              <div className="poker-controls-bar">
                <button
                  type="button"
                  className="poker-slide-btn"
                  onClick={prevPokerCard}
                  aria-label="Previous testimonial card"
                  title="Previous card (or slide left)"
                >
                  <ChevronLeft size={22} />
                </button>

                {/* Card Pips Selector */}
                <div className="poker-deck-pips">
                  {testimonials.map((t, idx) => {
                    const isActive = idx === pokerCardIndex;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        className={`poker-pip-btn ${isActive ? "active" : ""}`}
                        onClick={() => {
                          setPokerCardIndex(idx);
                          setDragOffset(0);
                        }}
                        style={
                          isActive
                            ? {
                                color: t.color,
                                borderColor: t.color,
                                background: t.accentBg,
                              }
                            : {}
                        }
                        title={`View ${t.name}'s card (${t.rank}${t.suit})`}
                      >
                        <span>{t.rank}</span>
                        <span style={{ color: t.color }}>{t.suit}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="poker-slide-btn"
                  onClick={nextPokerCard}
                  aria-label="Next testimonial card"
                  title="Next card (or slide right)"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              <div className="poker-deck-hint">
                <span>♠ Slide or drag cards left &amp; right • Click any card or arrows</span>
              </div>
            </div>
          </section>

          {/* ── FAQ Section ── */}
          <section className="landing-section">
            <div className="section-header-center reveal-on-scroll">
              <div className="section-badge">
                <MessageSquare size={14} />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="section-title">Everything You Need to Know</h2>
              <p className="section-desc">
                Have questions before trying Goatie AI? Here are common inquiries answered.
              </p>
            </div>

            <div className="faq-list reveal-on-scroll">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div className="faq-card" key={i}>
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {isOpen && (
                      <div className="faq-answer-body">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Founder Spotlight ── */}
          <section className="landing-section" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
            <div className="founder-card reveal-on-scroll">
              <div className="founder-avatar-wrap">
                <img
                  src="/abdifatah.png"
                  alt="Abdifatah Faisal — Founder & Lead Architect"
                  className="founder-avatar-photo"
                />
                <span className="founder-verified-badge" title="Verified Founder">
                  <CheckCircle2 size={16} />
                </span>
              </div>
              <div className="founder-info">
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px", flexWrap: "wrap" }}>
                  <h3>Abdifatah Faisal</h3>
                  <span className="founder-badge-pill">FOUNDER &amp; LEAD ARCHITECT</span>
                </div>
                <div className="founder-role">Founder &amp; Chief Architect — Goatie AI</div>
                <p className="founder-quote">
                  &ldquo;We built Goatie AI to evolve beyond static chat text. Our mission is to provide every creator, developer, and enterprise an autonomous partner that doesn&apos;t just chat, but builds, analyzes, and evolves reactive software on the fly.&rdquo;
                </p>
                <div className="founder-links">
                  <a href="mailto:abdifatahmarketing@gmail.com" className="founder-link-item">
                    <Mail size={15} /> abdifatahmarketing@gmail.com
                  </a>
                  <span style={{ opacity: 0.3 }}>•</span>
                  <a href="tel:+252636472317" className="founder-link-item">
                    <Phone size={15} /> +252 63 6472317
                  </a>
                  <span style={{ opacity: 0.3 }}>•</span>
                  <span className="founder-link-item">
                    <MapPin size={15} /> 150 st Hargeisa Somaliland
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Contact Section ── */}
          <section id="contact" className="landing-section">
            <div className="section-header-center reveal-on-scroll">
              <div className="section-badge">
                <Mail size={14} />
                <span>Get in Touch</span>
              </div>
              <h2 className="section-title">Let&apos;s Build Together</h2>
              <p className="section-desc">
                Have a project in mind, need custom enterprise solutions, or want to explore partnerships? Send us a message or reach out directly.
              </p>
            </div>

            <div className="contact-wrapper reveal-on-scroll">
              {/* Contact Info List */}
              <div className="contact-info-list">
                <a href="mailto:abdifatahmarketing@gmail.com" className="contact-info-card">
                  <div className="contact-icon-box">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="contact-card-label">Direct Email</div>
                    <div className="contact-card-value">abdifatahmarketing@gmail.com</div>
                  </div>
                </a>

                <a href="tel:+252636472317" className="contact-info-card">
                  <div className="contact-icon-box">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="contact-card-label">Direct Phone / WhatsApp</div>
                    <div className="contact-card-value">+252 63 6472317</div>
                  </div>
                </a>

                <div className="contact-info-card">
                  <div className="contact-icon-box">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="contact-card-label">Office &amp; Headquarters</div>
                    <div className="contact-card-value">150 st, Hargeisa, Somaliland</div>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-icon-box">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <div className="contact-card-label">Official Handle</div>
                    <div className="contact-card-value">@abdifatahmarketing</div>
                  </div>
                </div>
              </div>

              {/* Interactive Contact Form */}
              <div className="contact-form-card">
                <h3 className="contact-form-title">Send Us an Inquiry</h3>
                <p className="contact-form-sub">We usually respond within a few hours.</p>

                <form onSubmit={handleContactSubmit}>
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Abdifatah Faisal"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="Enterprise Demo / Partnership"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Tell us about your team, use cases, or requirements..."
                      className="form-textarea"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="form-submit-btn"
                  >
                    {isSubmitting ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                  {formSubmitted && (
                    <div className="form-success-alert">
                      <CheckCircle2 size={18} />
                      <span>Thank you! Your message has been received. We will contact you at {contactEmail || "your email"} shortly.</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </section>

          {/* ── Cosmic Nebula Pre-Footer CTA Portal ── */}
          <section className="landing-section" style={{ paddingTop: "0" }}>
            <div className="cosmic-cta-card reveal-on-scroll">
              <h2>Ready to Experience Generative Intelligence?</h2>
              <p>
                Experience live generative software in action with our 1-minute demo, or create your free account to unlock unlimited tokens, saved cloud threads, and full customization.
              </p>
              <div className="cosmic-cta-actions">
                <Link href="/chat?demo=true" className="cta-btn">
                  <Sparkles size={16} />
                  <span>Launch 1-Minute Live Demo</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/signup"
                  className="sign-in-btn"
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(14px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "#fff",
                    height: "48px",
                    padding: "0 24px",
                  }}
                >
                  <span>Create Free Account</span>
                  <ArrowRight size={14} style={{ marginLeft: "4px" }} />
                </Link>
              </div>
            </div>
          </section>

          {/* ── Footer ── */}
          <footer className="landing-footer">
            <div className="footer-top">
              <div className="footer-brand">
                <h4>
                  <img src="/goat.png" alt="Goatie AI" width={28} height={28} style={{ borderRadius: "50%" }} />
                  Goatie AI
                </h4>
                <p>
                  Intelligence designed to evolve. Transforming conversational prompts into interactive generative workspaces.
                </p>
                <div style={{ marginTop: "14px" }}>
                  <span className="system-status-indicator">
                    <span className="status-dot-ping" />
                    <span>All Systems Operational</span>
                  </span>
                </div>
              </div>

              <div>
                <div className="footer-col-title">Product</div>
                <ul className="footer-links-list">
                  <li><Link href="/chat?demo=true" className="footer-link">Live 1-Min Demo</Link></li>
                  <li><Link href="/login" className="footer-link">Chat Workspace</Link></li>
                  <li><Link href="/product" className="footer-link">Product Overview</Link></li>
                  <li><Link href="/gallery" className="footer-link">Component Gallery</Link></li>
                  <li><Link href="/cases" className="footer-link">Case Studies</Link></li>
                </ul>
              </div>

              <div>
                <div className="footer-col-title">Company</div>
                <ul className="footer-links-list">
                  <li><Link href="/contact" className="footer-link">Contact Us</Link></li>
                  <li><a href="mailto:abdifatahmarketing@gmail.com" className="footer-link">Email Founder</a></li>
                  <li><Link href="/product#architecture" className="footer-link">Architecture</Link></li>
                  <li><Link href="/cases" className="footer-link">Enterprise</Link></li>
                </ul>
              </div>

              <div>
                <div className="footer-col-title">Legal & Security</div>
                <ul className="footer-links-list">
                  <li><Link href="/privacy" className="footer-link">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="footer-link">Terms of Service</Link></li>
                  <li><Link href="/product#security" className="footer-link">PostgreSQL RLS</Link></li>
                  <li><Link href="/chat?demo=true" className="footer-link">Status: Online</Link></li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom">
              <div>
                © {new Date().getFullYear()} Goatie AI Technologies by Abdifatah Faisal. All rights reserved.
              </div>
              <div className="footer-legal-row">
                <Link href="/privacy" className="footer-legal-link">Privacy</Link>
                <Link href="/terms" className="footer-legal-link">Terms</Link>
                <Link href="/contact" className="footer-legal-link">Contact</Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
