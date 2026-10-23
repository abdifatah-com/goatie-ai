"use client";

import "../landing.css";
import React, { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  Code2,
  Users,
  CheckCircle2,
  Quote,
  Sparkles,
  BarChart3,
  Award,
} from "lucide-react";

export default function CasesPage() {
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

  const cases = [
    {
      category: "Fintech & Quantitative Analytics",
      title: "Global Wealth Fund Automates Real-Time Scenario Dashboards",
      metric: "+340%",
      metricLabel: "Analyst Velocity",
      description:
        "By integrating Goatie AI's generative UI tables and dynamic portfolio rebalancers, financial analysts generate complex multi-variable Monte Carlo simulations and visual charts in seconds instead of waiting days for engineering support.",
      results: [
        "Interactive scenario modeling generated in < 12 seconds",
        "Direct export of PostgreSQL relational datasets with full audit trails",
        "Zero data leakage via strict Supabase Row Level Security (RLS)",
      ],
      quote:
        "Goatie AI transformed how our portfolio managers interact with real-time financial models. What used to take hours of custom code is now rendered instantly in the chat.",
      author: "Marcus Vance",
      role: "Head of Quantitative Strategy",
    },
    {
      category: "Autonomous Software Engineering",
      title: "Hyper-Growth Scaleup Accelerates PR Reviews with AI Audits",
      metric: "99.4%",
      metricLabel: "Vulnerability & Regression Detection",
      description:
        "With 250+ engineers shipping multiple daily microservices, the team deployed Goatie AI to autonomously review pull requests, scan AST syntax trees, check linter conformity, and test generative UI components before merging.",
      results: [
        "Autonomous code review completed within 45 seconds per PR",
        "Over 1,200 critical regressions caught prior to production deployment",
        "Developer satisfaction increased by 68% across all engineering squads",
      ],
      quote:
        "The automated code review and AST verification gave our senior engineers peace of mind. Goatie AI is the ultimate pair programmer.",
      author: "Elena Rostova",
      role: "VP of Engineering",
    },
    {
      category: "B2B SaaS & Enterprise Platforms",
      title: "Next-Gen SaaS Platform Converts Static Checklists into Dynamic Workspaces",
      metric: "4.8x",
      metricLabel: "Onboarding Conversion Rate",
      description:
        "Static onboarding workflows were replaced by Goatie AI's adaptive user workspace builders. Each new enterprise client receives a personalized, generative interactive setup interface tailored directly to their team's specific requirements.",
      results: [
        "Time-to-first-value dropped from 14 days down to 45 minutes",
        "Support tickets during onboarding decreased by 74%",
        "Over 85% of users completed custom workspace setups on day one",
      ],
      quote:
        "Our customers were amazed when Goatie AI built their entire workspace layout live in front of their eyes. It redefined our user activation experience.",
      author: "David Chen",
      role: "Chief Product Officer",
    },
  ];

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
          <Link href="/product" className="drawer-link" onClick={closeMenu}>
            Product
          </Link>
          <Link href="/chat?demo=true" className="drawer-link" onClick={closeMenu}>
            Live Studio
          </Link>
          <Link href="/cases" className="drawer-link active" onClick={closeMenu}>
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
            <Link href="/product" className="nav-link">Product</Link>
            <Link href="/chat?demo=true" className="nav-link">Live Studio</Link>
            <Link href="/cases" className="nav-link active">Case Studies</Link>
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
        {/* ── Cases Hero Header ── */}
        <section className="landing-section" style={{ paddingTop: "20px", paddingBottom: "30px" }}>
          <div className="subpage-hero-center reveal-on-scroll">
            <div className="section-badge">
              <Layers size={14} />
              <span>Proven Enterprise Deployments</span>
            </div>
            <h1 className="subpage-hero-title">
              Case Studies & Customer Impact
            </h1>
            <p className="subpage-hero-desc">
              Discover how leading engineering teams, quantitative hedge funds, and modern SaaS enterprises scale productivity with Goatie AI.
            </p>
          </div>

          {/* Executive Metrics Strip */}
          <div className="cases-metric-strip">
            <div className="cases-stat-box reveal-on-scroll" data-delay="1">
              <div className="cases-stat-value">+340%</div>
              <div className="cases-stat-label">Analyst Workflow Speed</div>
            </div>
            <div className="cases-stat-box reveal-on-scroll" data-delay="2">
              <div className="cases-stat-value">99.4%</div>
              <div className="cases-stat-label">Regression Interception</div>
            </div>
            <div className="cases-stat-box reveal-on-scroll" data-delay="3">
              <div className="cases-stat-value">4.8x</div>
              <div className="cases-stat-label">User Activation Rate</div>
            </div>
            <div className="cases-stat-box reveal-on-scroll" data-delay="4">
              <div className="cases-stat-value">100%</div>
              <div className="cases-stat-label">Supabase RLS Isolation</div>
            </div>
          </div>

          {/* Detailed Frosted Glass Case Study Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "32px", marginBottom: "50px" }}>
            {cases.map((c, i) => (
              <div key={i} className="case-study-hero-card reveal-on-scroll">
                <div>
                  <span className="case-tag">{c.category}</span>
                  <h2 style={{ fontSize: "clamp(22px, 2.5vw, 28px)", fontWeight: 700, color: "#ffffff", margin: "14px 0 16px", lineHeight: 1.25, letterSpacing: "-0.01em" }}>
                    {c.title}
                  </h2>
                  <p style={{ fontSize: "14.5px", color: "#94a3b8", lineHeight: 1.65, marginBottom: "22px" }}>
                    {c.description}
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {c.results.map((res, rIdx) => (
                      <div key={rIdx} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#e2e8f0" }}>
                        <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0 }} />
                        <span>{res}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right highlight & quote box */}
                <div className="case-study-quote-box">
                  <div>
                    <div className="case-study-metric-pill">{c.metric}</div>
                    <div style={{ fontSize: "12.5px", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                      {c.metricLabel}
                    </div>
                  </div>

                  <div style={{ position: "relative", paddingLeft: "2px" }}>
                    <Quote size={20} style={{ color: "rgba(255, 255, 255, 0.2)", marginBottom: "8px" }} />
                    <p style={{ fontSize: "14px", color: "#e2e8f0", fontStyle: "italic", lineHeight: 1.6 }}>
                      &ldquo;{c.quote}&rdquo;
                    </p>
                  </div>

                  <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "14px" }}>
                    <div style={{ fontWeight: 600, fontSize: "14px", color: "#ffffff" }}>{c.author}</div>
                    <div style={{ fontSize: "12.5px", color: "#94a3b8" }}>{c.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Cosmic Pre-Footer CTA Portal ── */}
        <section className="landing-section" style={{ paddingTop: "0", paddingBottom: "70px" }}>
          <div className="cosmic-cta-card reveal-on-scroll">
            <h2>Ready to Deploy Generative UI to Your Squad?</h2>
            <p>
              Experience faster time-to-market with real-time UI synthesis and hardened Supabase storage.
            </p>
            <div className="cosmic-cta-actions">
              <Link href="/login" className="cta-btn" style={{ padding: "14px 30px", fontSize: "15px" }}>
                Launch Goatie AI Chat
              </Link>
              <Link
                href="/contact"
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
                <span>Contact Founder</span>
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
