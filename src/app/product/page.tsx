"use client";

import "../landing.css";
import React, { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  Cpu,
  Database,
  Zap,
  Check,
  ArrowRight,
  Code2,
  Terminal,
  Activity,
  Sliders,
  ShieldCheck,
  ChevronRight,
  Workflow,
  Eye,
  Rocket,
  Flame,
} from "lucide-react";

export default function ProductPage() {
  // Mobile drawer menu state
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && menuOpen) closeMenu();
    }
    function handleResize() {
      if (window.innerWidth > 768 && menuOpen) closeMenu();
    }
    window.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleResize);
    };
  }, [menuOpen, closeMenu]);

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

  return (
    <div className="landing-page" style={{ height: "auto", minHeight: "100vh" }}>
      {/* ── Persistent Cinematic Video Background ── */}
      <div className="bg">
        <video className="bg-video" autoPlay muted loop playsInline>
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4"
            type="video/mp4"
          />
        </video>
        <div className="bg-overlay" />
      </div>

      {/* ── Ambient Aurora Glow Orbs ── */}
      <div className="ambient-glow-wrap">
        <div className="ambient-orb ambient-orb-teal" />
        <div className="ambient-orb ambient-orb-indigo" />
        <div className="ambient-orb ambient-orb-rose" />
      </div>

      {/* ── Mobile Menu Overlay & Drawer ── */}
      <div
        className={`menu-overlay ${menuOpen ? "open" : ""}`}
        ref={overlayRef}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      />
      <div
        className={`drawer-menu ${menuOpen ? "open" : ""}`}
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        <div className="drawer-header">
          <span className="drawer-title">Goatie AI</span>
          <button
            className="drawer-close"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <nav className="drawer-nav">
          <Link href="/" className="drawer-link" onClick={closeMenu}>
            Home
          </Link>
          <Link href="/product" className="drawer-link active" onClick={closeMenu}>
            Product
          </Link>
          <Link href="/chat?demo=true" className="drawer-link" onClick={closeMenu}>
            Live Studio
          </Link>
          <Link href="/cases" className="drawer-link" onClick={closeMenu}>
            Case Studies
          </Link>
          <Link href="/contact" className="drawer-link" onClick={closeMenu}>
            Contact
          </Link>
          <Link href="/login" className="drawer-cta" onClick={closeMenu}>
            Sign in
          </Link>
        </nav>
      </div>

      {/* ── Top Navigation Dock ── */}
      <div className="subpage-header-wrapper">
        <header className="header">
          <Link href="/" className="logo-btn" aria-label="Goatie AI">
            <img src="/goat.png" alt="Goatie AI" width={52} height={52} />
          </Link>

          <nav className="nav-pill">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/product" className="nav-link active">Product</Link>
            <Link href="/chat?demo=true" className="nav-link">Live Studio</Link>
            <Link href="/cases" className="nav-link">Case Studies</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </nav>

          <Link href="/login" className="sign-in-btn desktop-only">
            Sign in
          </Link>

          <button
            className="burger"
            ref={burgerRef}
            aria-expanded={menuOpen}
            aria-label="Menu"
            onClick={toggleMenu}
          >
            <span className="burger-bar" />
            <span className="burger-bar" />
            <span className="burger-bar" />
          </button>
        </header>
      </div>

      {/* ── Main Subpage Content ── */}
      <div className="landing-content-wrapper" style={{ marginTop: "32px" }}>
        {/* ── Product Hero Header ── */}
        <section className="landing-section" style={{ paddingTop: "20px", paddingBottom: "40px" }}>
          <div className="subpage-hero-center reveal-on-scroll">
            <div className="section-badge">
              <Sparkles size={14} />
              <span>Full System Architecture • OpenUI v2.0</span>
            </div>
            <h1 className="subpage-hero-title">
              The Generative UI Platform For Evolving Intelligence
            </h1>
            <p className="subpage-hero-desc">
              Goatie AI combines state-of-the-art language reasoning with real-time UI synthesis, Supabase PostgreSQL data persistence, and zero-latency local execution.
            </p>
          </div>

          {/* Architecture 4-Pillar Grid */}
          <div className="features-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            <div className="feature-card reveal-on-scroll" data-delay="1">
              <div className="feature-icon-wrapper">
                <Code2 size={22} />
              </div>
              <h3 className="feature-card-title">1. OpenUI Component Schema</h3>
              <p className="feature-card-desc">
                Converts natural language instructions into strict, declarative JSON AST specifications that compile into accessible, interactive React components instantaneously.
              </p>
            </div>

            <div className="feature-card reveal-on-scroll" data-delay="2">
              <div className="feature-icon-wrapper">
                <Cpu size={22} />
              </div>
              <h3 className="feature-card-title">2. Shiro Mascot Engine</h3>
              <p className="feature-card-desc">
                An expressive, animated assistant companion powered by SVG stroke morphing that visually communicates agent reasoning, tool invocations, and autonomous tasks.
              </p>
            </div>

            <div className="feature-card reveal-on-scroll" data-delay="3">
              <div className="feature-icon-wrapper">
                <Database size={22} />
              </div>
              <h3 className="feature-card-title">3. Supabase Postgres Vault</h3>
              <p className="feature-card-desc">
                Persistent storage backed by relational PostgreSQL schemas, strict Row Level Security (RLS) policies, JWT session auth, and real-time thread synchronization.
              </p>
            </div>

            <div className="feature-card reveal-on-scroll" data-delay="4">
              <div className="feature-icon-wrapper">
                <Zap size={22} />
              </div>
              <h3 className="feature-card-title">4. Edge Inference & Local Ollama</h3>
              <p className="feature-card-desc">
                Support for both local Ollama models and cloud reasoning gateways, ensuring complete data privacy, zero API vendor lock-in, and sub-120ms token responses.
              </p>
            </div>
          </div>
        </section>

        {/* ── Architecture Pipeline Spotlight Card ── */}
        <section className="landing-section" style={{ paddingTop: "10px", paddingBottom: "50px" }}>
          <div className="studio-window reveal-on-scroll" style={{ maxWidth: "100%", margin: "0 auto" }}>
            <div className="studio-titlebar">
              <div className="studio-mac-dots">
                <span className="mac-dot red" />
                <span className="mac-dot yellow" />
                <span className="mac-dot green" />
              </div>
              <div className="studio-window-title">
                <Workflow size={13} />
                <span>Goatie AI Generative Pipeline • Natural Language to Reactive DOM</span>
              </div>
              <div className="studio-live-badge">
                <span className="status-dot-ping" />
                <span>Production Ready</span>
              </div>
            </div>

            <div style={{ padding: "clamp(24px, 4vw, 40px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
              <div style={{ background: "rgba(10, 10, 14, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "18px", padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", color: "#38bdf8" }}>
                  <Terminal size={18} />
                  <span style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.02em" }}>STAGE 1: PROMPT INGESTION</span>
                </div>
                <p style={{ fontSize: "13.5px", color: "#94a3b8", lineHeight: 1.6 }}>
                  User enters intent in natural English (e.g. &quot;Build an interactive loan calculator with amortization schedules&quot;).
                </p>
              </div>

              <div style={{ background: "rgba(10, 10, 14, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "18px", padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", color: "#a855f7" }}>
                  <Code2 size={18} />
                  <span style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.02em" }}>STAGE 2: OPENUI AST COMPILATION</span>
                </div>
                <p style={{ fontSize: "13.5px", color: "#94a3b8", lineHeight: 1.6 }}>
                  Deep reasoning models synthesize structured schema trees defining state, validation hooks, layout containers, and events.
                </p>
              </div>

              <div style={{ background: "rgba(10, 10, 14, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "18px", padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", color: "#34d399" }}>
                  <Eye size={18} />
                  <span style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.02em" }}>STAGE 3: INSTANT REACT RENDER</span>
                </div>
                <p style={{ fontSize: "13.5px", color: "#94a3b8", lineHeight: 1.6 }}>
                  The client engine mounts live components directly into the chat stream with full keyboard navigation and touch feedback.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Direct Comparison Section ── */}
        <section className="landing-section" style={{ paddingTop: "10px", paddingBottom: "60px" }}>
          <div className="section-header-center reveal-on-scroll">
            <div className="section-badge">
              <Layers size={14} />
              <span>Direct Capability Matrix</span>
            </div>
            <h2 className="section-title">Why Teams Choose Goatie AI</h2>
            <p className="section-desc">
              See how Goatie AI revolutionizes interaction compared to traditional text-only chat assistants.
            </p>
          </div>

          <div className="product-compare-wrapper reveal-on-scroll">
            <div className="product-compare-header">
              <div>Capability</div>
              <div>Traditional LLM Chat</div>
              <div style={{ color: "#34d399", display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={14} />
                <span>Goatie AI Platform</span>
              </div>
            </div>

            {[
              {
                feature: "UI Generation",
                traditional: "Static Markdown & text blocks",
                goatie: "Interactive, live React components (OpenUI)",
              },
              {
                feature: "Data Persistence",
                traditional: "Ephemeral memory or third-party cookies",
                goatie: "Hardened Supabase PostgreSQL with RLS",
              },
              {
                feature: "Visual Feedback",
                traditional: "Static spinning circles",
                goatie: "Animated Shiro companion & ambient states",
              },
              {
                feature: "Customization & Theme",
                traditional: "Fixed browser default",
                goatie: "Dark, Light, System themes & full Profile view",
              },
              {
                feature: "Multi-Account Switcher",
                traditional: "Manual logout & re-auth",
                goatie: "Instant hover/click account switcher window",
              },
              {
                feature: "Inference Deployment",
                traditional: "Proprietary cloud only",
                goatie: "Local Ollama + OpenUI Gateway streaming",
              },
              {
                feature: "Embedded Playground",
                traditional: "External iframe or sandbox link",
                goatie: "Native 60 FPS Goatie Runner & live ROI widgets",
              },
            ].map((row, idx) => (
              <div key={idx} className="product-compare-row">
                <div style={{ fontWeight: 600, color: "#ffffff" }}>{row.feature}</div>
                <div style={{ color: "#94a3b8" }}>{row.traditional}</div>
                <div style={{ color: "#34d399", display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                  <Check size={16} />
                  <span>{row.goatie}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Cosmic Pre-Footer CTA Portal ── */}
        <section className="landing-section" style={{ paddingTop: "0", paddingBottom: "70px" }}>
          <div className="cosmic-cta-card reveal-on-scroll">
            <h2>Experience The Future of Generative UI</h2>
            <p>
              Start generating live application widgets, automated workflows, and interactive dashboards today with Goatie AI.
            </p>
            <div className="cosmic-cta-actions">
              <Link href="/login" className="cta-btn" style={{ padding: "14px 30px", fontSize: "15px" }}>
                Launch Goatie AI Chat
              </Link>
              <Link
                href="/chat?demo=true"
                className="sign-in-btn"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  color: "#ffffff",
                  height: "48px",
                  padding: "0 24px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>View Live Demo</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Modern Unified Footer ── */}
        <footer className="landing-footer">
          <div className="footer-top">
            <div className="footer-brand">
              <h4>
                <img src="/goat.png" alt="Goatie AI" width={28} height={28} style={{ borderRadius: "50%" }} />
                Goatie AI
              </h4>
              <p>
                Intelligence designed to evolve. Transforming conversational prompts into interactive generative workspaces. Founded by Abdifatah Faisal.
              </p>
              <div style={{ marginTop: "14px" }}>
                <span className="system-status-indicator">
                  <span className="status-dot-ping" />
                  <span>All Systems Operational • Supabase Connected</span>
                </span>
              </div>
            </div>

            <div>
              <div className="footer-col-title">Product</div>
              <ul className="footer-links-list">
                <li><Link href="/login" className="footer-link">Chat Workspace</Link></li>
                <li><Link href="/product" className="footer-link">Product Overview</Link></li>
                <li><Link href="/chat?demo=true" className="footer-link">Live Studio</Link></li>
                <li><Link href="/cases" className="footer-link">Case Studies</Link></li>
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Company</div>
              <ul className="footer-links-list">
                <li><Link href="/contact" className="footer-link">Contact Us</Link></li>
                <li><a href="mailto:abdifatahmarketing@gmail.com" className="footer-link">Email Founder</a></li>
                <li><Link href="/product" className="footer-link">Architecture</Link></li>
                <li><Link href="/cases" className="footer-link">Enterprise</Link></li>
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Legal & Security</div>
              <ul className="footer-links-list">
                <li><Link href="/privacy" className="footer-link">Privacy Policy</Link></li>
                <li><Link href="/terms" className="footer-link">Terms of Service</Link></li>
                <li><Link href="/chat" className="footer-link">Status: Online</Link></li>
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
  );
}
