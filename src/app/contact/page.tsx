"use client";

import "../landing.css";
import React, { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  User as UserIcon,
  HelpCircle,
  ShieldCheck,
  Globe,
  ArrowRight,
  MessageSquare,
  Building,
  Phone,
  MapPin,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 750);
  };

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
          <Link href="/cases" className="drawer-link" onClick={closeMenu}>
            Case Studies
          </Link>
          <Link href="/contact" className="drawer-link active" onClick={closeMenu}>
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
            <Link href="/cases" className="nav-link">Case Studies</Link>
            <Link href="/contact" className="nav-link active">Contact</Link>
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
        {/* ── Contact Hero Header ── */}
        <section className="landing-section" style={{ paddingTop: "20px", paddingBottom: "50px" }}>
          <div className="subpage-hero-center reveal-on-scroll">
            <div className="section-badge">
              <Mail size={14} />
              <span>Direct Communication • Priority Support</span>
            </div>
            <h1 className="subpage-hero-title">
              Get In Touch With The Goatie AI Team
            </h1>
            <p className="subpage-hero-desc">
              Have technical questions, need enterprise custom integrations, or want to speak directly with founder Abdifatah Faisal? We are ready to assist.
            </p>
          </div>

          <div className="contact-wrapper reveal-on-scroll">
            {/* Left Column: Direct Contact Info Cards */}
            <div className="contact-info-list">
              <a href="mailto:abdifatahmarketing@gmail.com" className="contact-info-card">
                <div className="contact-icon-box">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="contact-card-label">Direct Founder Email</div>
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
                  <UserIcon size={20} />
                </div>
                <div>
                  <div className="contact-card-label">Founder &amp; Lead Architect</div>
                  <div className="contact-card-value">Abdifatah Faisal (@abdifatahmarketing)</div>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-icon-box">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="contact-card-label">Response Time</div>
                  <div className="contact-card-value">&lt; 2 Hours for Priority Inquiries</div>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-icon-box">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="contact-card-label">Enterprise Security</div>
                  <div className="contact-card-value">Custom SLAs &amp; Dedicated Supabase Postgres</div>
                </div>
              </div>
            </div>

            {/* Right Column: Frosted Glass Interactive Form */}
            <div className="contact-form-card">
              <h3 className="contact-form-title">Send a Direct Message</h3>
              <p className="contact-form-sub">
                Fill out the form below and founder Abdifatah Faisal will reply personally.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Henderson"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Business or Personal Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Inquiry Topic</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enterprise Deployment / Partnership / Custom Agent"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you are building and how Goatie AI can accelerate your workflow..."
                    className="form-textarea"
                  />
                </div>

                <button
                  type="submit"
                  className="form-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Sending message...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send Direct Message</span>
                    </>
                  )}
                </button>

                {submitted && (
                  <div className="form-success-alert">
                    <CheckCircle2 size={18} />
                    <span>Your message has been sent successfully. Thank you for reaching out to Goatie AI!</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section className="landing-section" style={{ paddingTop: "0", paddingBottom: "70px" }}>
          <div className="section-header-center">
            <div className="section-badge">
              <HelpCircle size={14} />
              <span>Direct Knowledge Base</span>
            </div>
            <h2 className="section-title">Common Inquiries</h2>
            <p className="section-desc">
              Quick answers about Goatie AI, founder background, and technology integrations.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "22px" }}>
            {[
              {
                q: "What makes Goatie AI different from standard chat apps?",
                a: "Goatie AI produces generative interactive interfaces on the fly using OpenUI standards rather than just returning raw text. It renders interactive tools, financial charts, and playable mini-games in the chat stream.",
              },
              {
                q: "How is my data stored and protected?",
                a: "All conversation threads and profiles are stored securely in PostgreSQL backed by Supabase with Row Level Security (RLS) policies. Only authenticated owners can read or modify their data.",
              },
              {
                q: "Can I run Goatie AI locally with Ollama?",
                a: "Yes! Goatie AI supports local model execution via Ollama as well as cloud-based reasoning gateways for zero latency and complete privacy.",
              },
              {
                q: "Who is behind Goatie AI?",
                a: "Goatie AI was created and architected from scratch by Abdifatah Faisal (@abdifatahmarketing) with the vision of making Generative UI the default interface for AI applications.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="faq-card"
                style={{ padding: "26px" }}
              >
                <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#ffffff", marginBottom: "10px" }}>
                  {faq.q}
                </h4>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.6 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Cosmic Pre-Footer CTA Portal ── */}
        <section className="landing-section" style={{ paddingTop: "0", paddingBottom: "70px" }}>
          <div className="cosmic-cta-card">
            <h2>Ready to Elevate Your Workflow?</h2>
            <p>
              Join hundreds of engineering squads and product leaders building with Goatie AI.
            </p>
            <div className="cosmic-cta-actions">
              <Link href="/login" className="cta-btn" style={{ padding: "14px 30px", fontSize: "15px" }}>
                Launch Goatie AI Chat
              </Link>
              <Link
                href="/cases"
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
                <span>Read Case Studies</span>
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
