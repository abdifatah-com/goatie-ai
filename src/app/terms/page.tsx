"use client";

import "../landing.css";
import React from "react";
import Link from "next/link";
import { FileText, CheckCircle2, Shield, ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
              <FileText size={14} />
              <span>Terms of Service</span>
            </div>
            <h1 className="section-title">Terms of Service</h1>
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
                1. Acceptance of Terms
              </h3>
              <p>
                By accessing, using, or registering for Goatie AI (the &ldquo;Service&rdquo;), operated by Goatie AI Technologies and founded by Abdifatah Faisal, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the Service.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#fff", marginBottom: "10px" }}>
                2. Use of Generative UI & Agent Services
              </h3>
              <p>
                Goatie AI provides generative user interfaces, autonomous reasoning, multi-turn AI chat, and database workspace features. You agree not to use the Service for any unlawful activities, generation of malicious code, unauthorized reverse-engineering, or activities that compromise server infrastructure or other users&apos; accounts.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#fff", marginBottom: "10px" }}>
                3. User Content & Intellectual Property
              </h3>
              <p>
                You retain all rights, title, and interest in and to the content, prompts, data, and workflows you submit to Goatie AI. You grant Goatie AI a worldwide, non-exclusive license solely as necessary to operate, host, and render your generative UI components within your authenticated workspace.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#fff", marginBottom: "10px" }}>
                4. Service Availability & Performance
              </h3>
              <p>
                While Goatie AI targets 99.99% uptime and sub-120ms inference latency, the service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We reserve the right to perform scheduled maintenance, security updates, and protocol upgrades to protect system stability.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#fff", marginBottom: "10px" }}>
                5. Governing Law & Contact
              </h3>
              <p>
                These terms shall be governed by and construed in accordance with applicable laws. If you have questions regarding these Terms of Service, contact:
              </p>
              <div style={{ marginTop: "10px", padding: "16px", background: "rgba(0,0,0,0.3)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div><strong>Goatie AI Technologies</strong></div>
                <div>Founder &amp; Architect: Abdifatah Faisal</div>
                <div>Direct Contact: <a href="mailto:abdifatahmarketing@gmail.com" style={{ color: "#34d399" }}>abdifatahmarketing@gmail.com</a></div>
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
