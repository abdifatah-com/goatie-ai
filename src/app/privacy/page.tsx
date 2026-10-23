"use client";

import "../landing.css";
import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Database, EyeOff, FileText, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="landing-page" style={{ height: "auto", minHeight: "100vh" }}>
      {/* ── Subpage Header ── */}
      <div style={{ width: "100%", maxWidth: "1200px", padding: "20px 24px 0", display: "flex", justifyContent: "center" }}>
        <header className="header" style={{ position: "relative", animation: "none" }}>
          <Link href="/" className="logo-btn" aria-label="Goatie AI">
            <img src="/goat.png" alt="Goatie AI" width={52} height={52} />
          </Link>

          <nav className="nav-pill">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/product" className="nav-link">Product</Link>
            <Link href="/chat?demo=true" className="nav-link">Live Studio</Link>
            <Link href="/cases" className="nav-link">Case Studies</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </nav>

          <Link href="/login" className="sign-in-btn desktop-only">
            Sign in
          </Link>
        </header>
      </div>

      <div className="landing-content-wrapper" style={{ marginTop: "40px" }}>
        <section className="landing-section" style={{ paddingTop: "40px", paddingBottom: "80px", maxWidth: "860px" }}>
          <div style={{ marginBottom: "32px" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#94a3b8", fontSize: "14px", textDecoration: "none", marginBottom: "20px" }}>
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <div className="section-badge">
              <ShieldCheck size={14} />
              <span>Security & Privacy First</span>
            </div>
            <h1 className="section-title">Privacy Policy</h1>
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>
              Last updated: October 23, 2026 • Effective Date: October 2026
            </p>
          </div>

          <div
            style={{
              background: "rgba(24, 24, 27, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              padding: "clamp(24px, 4vw, 40px)",
              color: "#cbd5e1",
              fontSize: "14.5px",
              lineHeight: "1.75",
              display: "flex",
              flexDirection: "column",
              gap: "28px",
            }}
          >
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#fff", marginBottom: "10px" }}>
                1. Overview & Commitment
              </h3>
              <p>
                At Goatie AI Technologies (&ldquo;Goatie AI&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), founded by Abdifatah Faisal, we believe privacy is a fundamental right. This Privacy Policy describes how we collect, store, protect, and handle your data when you use our generative interface applications, chat workspace, APIs, and websites.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#fff", marginBottom: "10px" }}>
                2. Information We Collect
              </h3>
              <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <li>
                  <strong style={{ color: "#fff" }}>Account Credentials:</strong> When you register, we collect your email address, name, and encrypted auth credentials managed securely through Supabase Auth.
                </li>
                <li>
                  <strong style={{ color: "#fff" }}>Conversations & Prompts:</strong> Messages, prompts, generative UI interactions, and threads created in your personal workspace.
                </li>
                <li>
                  <strong style={{ color: "#fff" }}>Technical Logs:</strong> Device type, browser environment, approximate geographic region, and performance error logs to maintain system health.
                </li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#fff", marginBottom: "10px" }}>
                3. Row Level Security & Data Isolation
              </h3>
              <p>
                All user data in Goatie AI is stored in a private PostgreSQL database protected by PostgreSQL <strong>Row Level Security (RLS)</strong> policies. Your records, messages, and profiles are cryptographically partitioned; no other user or organization can query or access your private workspace data.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#fff", marginBottom: "10px" }}>
                4. Zero Data Selling & AI Training Protection
              </h3>
              <p>
                We <strong>do not sell, rent, or monetize</strong> your personal data or conversation records. Furthermore, your private conversations and generative UI inputs are not used to train global public models without your explicit, opt-in consent.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#fff", marginBottom: "10px" }}>
                5. Data Retention & Deletion
              </h3>
              <p>
                You retain complete ownership of your data. You may export or permanently delete your account, threads, and stored tokens at any time through the Goatie AI Settings screen or by contacting our data protection officer at <a href="mailto:abdifatahmarketing@gmail.com" style={{ color: "#34d399", textDecoration: "underline" }}>abdifatahmarketing@gmail.com</a>.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#fff", marginBottom: "10px" }}>
                6. Contact Information
              </h3>
              <p>
                For privacy inquiries, audit requests, or questions regarding this policy, reach out to our team at:
              </p>
              <div style={{ marginTop: "10px", padding: "16px", background: "rgba(0,0,0,0.3)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div><strong>Goatie AI Technologies</strong></div>
                <div>Attn: Abdifatah Faisal, Founder</div>
                <div>Email: <a href="mailto:abdifatahmarketing@gmail.com" style={{ color: "#34d399" }}>abdifatahmarketing@gmail.com</a></div>
                <div>Direct Phone / WhatsApp: <a href="tel:+252636472317" style={{ color: "#34d399" }}>+252 63 6472317</a></div>
                <div>Headquarters &amp; Address: 150 st, Hargeisa, Somaliland</div>
                <div>Handle: @abdifatahmarketing</div>
              </div>
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
            </div>

            <div>
              <div className="footer-col-title">Product</div>
              <ul className="footer-links-list">
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
