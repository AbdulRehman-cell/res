import React, { useState } from "react";
import axios from "axios";

const MAP_EMBED_URL =
  "https://www.openstreetmap.org/export/embed.html?bbox=10.0,50.0,10.01,50.01&layer=mapnik"; // customize for your location

export default function Contact() {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [validation, setValidation] = useState({});

  // Basic form validation
  function validate() {
    const v = {};
    if (!name.trim()) v.name = "Name is required.";
    if (!email.trim()) {
      v.email = "Email is required.";
    } else if (
      !/^.+@.+\..+$/.test(email.trim())
    ) {
      v.email = "Enter a valid email.";
    }
    if (!message.trim()) v.message = "Message required.";
    return v;
  }

  // Simulate form submission (since no API specified)
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const v = validate();
    setValidation(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 1000)); // fake async
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError("Failed to send. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="contact-page">
      <div className="contact-layout">
        <section className="contact-info">
          <h2>Contact & Location</h2>
          <div className="info-block">
            <svg
              width={22}
              height={22}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M12 2C8 2 4 6.1 4 10c0 6.2 8 12 8 12s8-5.8 8-12c0-3.9-4-8-8-8zm0 5a3 3 0 110 6 3 3 0 010-6z" />
            </svg>
            <span>
              123 Olive Street, Foodville, NY 10001 <br />
              <a
                className="contact-link"
                href="https://www.openstreetmap.org/#map=16/50.005/10.005"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on map
              </a>
            </span>
          </div>
          <div className="info-block">
            <svg
              width={22}
              height={22}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M22 16.92V17a2 2 0 01-2 2c-8.09 0-14.73-6.54-14.73-14.61A2 2 0 014 2.08V3a19.76 19.76 0 002.46 9.05c.43.86 1.31 1.43 2.3 1.43H9c.55 0 1.07-.22 1.46-.6l2.23-2.1a.94.94 0 011.26-.11l2.2 1.4c.58.36 1.37.15 1.7-.46A19.76 19.76 0 0022 3v-.08A2 2 0 0122 2z" />
            </svg>
            <span>
              <a className="contact-link" href="tel:+1234567890">
                +1 (234) 567-890
              </a>
              <br />
              <a className="contact-link" href="mailto:hello@res.com">
                hello@res.com
              </a>
            </span>
          </div>
          <div className="info-block">
            <svg
              width={22}
              height={22}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <rect x={2} y={2} width={20} height={20} rx={5} />
              <line x1={7} y1={10} x2={17} y2={10} />
              <line x1={7} y1={14} x2={13} y2={14} />
            </svg>
            <span>
              <strong>Hours</strong>:<br />
              Mon–Sat: 11am – 10pm<br />
              Sun: 12pm – 8pm
            </span>
          </div>
        </section>
        <section className="contact-form-section">
          <h2>Send Us a Message</h2>
          <form className="contact-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className={validation.name ? "input-error" : ""}
                disabled={submitting}
                autoFocus
                required
              />
              {validation.name && (
                <div className="field-error">{validation.name}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={validation.email ? "input-error" : ""}
                disabled={submitting}
                required
              />
              {validation.email && (
                <div className="field-error">{validation.email}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                className={validation.message ? "input-error" : ""}
                disabled={submitting}
                rows={5}
                required
              />
              {validation.message && (
                <div className="field-error">{validation.message}</div>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
            {success && (
              <div className="form-success">
                Thank you! Your message was sent.
              </div>
            )}
            {error && (
              <div className="form-error">{error}</div>
            )}
          </form>
        </section>
      </div>
      <section className="contact-map-section">
        <h2>Find Us</h2>
        <div className="map-embed">
          <iframe
            title="Restaurant Location"
            src={MAP_EMBED_URL}
            style={{
              border: 0,
              width: "100%",
              height: "350px",
              borderRadius: "var(--radius-lg)",
              boxShadow: "0 2px 16px var(--shadow-color)",
            }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>
      <style>{`
        .contact-page {
          padding: 2.5rem 0.8rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        .contact-layout {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          margin-bottom: 2.8rem;
        }
        .contact-info, .contact-form-section {
          flex: 1 1 320px;
          min-width: 280px;
          background: var(--panel-bg, #fff);
          border-radius: var(--radius-md, 18px);
          box-shadow: 0 2px 8px var(--shadow-color, rgba(24,32,80,0.04));
          padding: 2rem;
        }
        .contact-info h2, .contact-form-section h2 {
          margin-bottom: 1.25rem;
          color: var(--primary, #0e3a2c);
        }
        .info-block {
          display: flex;
          align-items: flex-start;
          gap: 0.7rem;
          margin-bottom: 1.2rem;
          font-size: 1rem;
          color: var(--text-secondary, #333);
        }
        .info-block svg {
          flex-shrink: 0;
          margin-top: 0.15rem;
        }
        .contact-link {
          color: var(--primary, #0e3a2c);
          text-decoration: underline;
          font-weight: 500;
          transition: color 0.15s;
        }
        .contact-link:hover, .contact-link:focus {
          color: var(--accent, #e1772f);
        }
        .contact-form-section {
          background: var(--panel-bg, #fff);
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .form-group label {
          font-weight: 600;
          color: var(--primary, #0e3a2c);
          font-size: 1rem;
        }
        .form-group input,
        .form-group textarea {
          border: 1.5px solid var(--input-border, #dde4ea);
          padding: 0.5rem 0.7rem;
          border-radius: var(--radius-md, 18px);
          font-size: 1rem;
          background: var(--input-bg, #f8fafe);
          transition: border-color 0.2s;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          border-color: var(--accent, #e1772f);
          outline: none;
        }
        .input-error {
          border-color: var(--danger, #cf4444) !important;
          background: #fff7f7;
        }
        .field-error {
          color: var(--danger, #cf4444);
          font-size: 0.96rem;
          margin-top: -0.1rem;
        }
        .btn {
          font-size: 1.07rem;
          font-weight: 600;
          background: var(--primary, #0e3a2c);
          color: #fff;
          border: none;
          border-radius: var(--radius-md, 18px);
          padding: 0.68rem 2.1rem;
          box-shadow: 0 1px 8px var(--shadow-color, rgba(24,32,80,0.08));
          transition: background 0.18s, box-shadow 0.18s;
          cursor: pointer;
          margin-top: 0.3rem;
        }
        .btn-primary:hover, .btn-primary:focus {
          background: var(--accent, #e1772f);
          box-shadow: 0 2px 14px var(--shadow-color, rgba(24,32,80,0.12));
          outline: none;
        }
        .form-success {
          color: var(--success, #18804e);
          margin-top: 1.2rem;
          font-size: 1.08rem;
          font-weight: 600;
        }
        .form-error {
          color: var(--danger, #cf4444);
          margin-top: 1.2rem;
          font-size: 1.08rem;
          font-weight: 600;
        }
        .contact-map-section {
          margin-top: 0.8rem;
        }
        .contact-map-section h2 {
          margin-bottom: 1rem;
          color: var(--primary, #0e3a2c);
        }
        .map-embed {
          border-radius: var(--radius-lg, 22px);
          overflow: hidden;
          box-shadow: 0 3px 18px var(--shadow-color, rgba(24,32,80,0.08));
        }
        @media (max-width: 900px) {
          .contact-layout {
            flex-direction: column;
            gap: 1.3rem;
          }
        }
        @media (max-width: 600px) {
          .contact-page {
            padding: 1.2rem 0.3rem;
          }
          .contact-info, .contact-form-section {
            padding: 1rem;
            min-width: 0;
          }
        }
      `}</style>
    </div>
  );
}