import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get("/api/menuitems")
      .then((res) => {
        if (mounted) {
          setMenuItems(Array.isArray(res.data) ? res.data : []);
          setError("");
        }
      })
      .catch((err) => {
        setError(
          err?.response?.data?.error ||
            "Failed to load menu. Please try again later."
        );
      })
      .finally(() => {
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="menu-page">
      <div className="menu-header">
        <h1 className="menu-title">Our Menu</h1>
        <p className="menu-subtitle">
          Discover the flavors of Abdul's Restaurant. Crafted fresh, served with love.
        </p>
      </div>
      <div className="menu-content">
        {loading ? (
          <div className="menu-loader">Loading menu...</div>
        ) : error ? (
          <div className="menu-error">{error}</div>
        ) : menuItems.length === 0 ? (
          <div className="menu-empty">
            <svg width="48" height="48" fill="none">
              <circle cx="24" cy="24" r="23" stroke="#b51313" strokeWidth="2" />
              <path d="M16 32h16M18 26v4m12-4v4" stroke="#b51313" strokeWidth="2" strokeLinecap="round"/>
              <ellipse cx="24" cy="19" rx="10" ry="7" fill="#f3dca6" stroke="#e3c57b" strokeWidth="1.5"/>
            </svg>
            <div>No menu items found.</div>
          </div>
        ) : (
          <div className="menu-grid">
            {menuItems.map((item) => (
              <div className="menu-card" key={item._id}>
                <div className="menu-card-img-wrap">
                  <img
                    src={item.imageUrl || `https://picsum.photos/800/500?random=${item._id}`}
                    alt={item.title}
                    className="menu-card-img"
                  />
                </div>
                <div className="menu-card-content">
                  <h2 className="menu-card-title">{item.title}</h2>
                  <p className="menu-card-desc">{item.description}</p>
                  <div className="menu-card-bottom">
                    <span className="menu-card-price">
                      ${item.price?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        :root {
          --res-main-bg: #fff8f3;
          --res-accent: #b51313;
          --res-dark: #23181b;
          --res-gold: #e3c57b;
          --res-card-bg: #ffffff;
          --res-card-shadow: 0 2px 14px 0 rgba(168,36,36,0.08), 0 1.5px 4px 0 rgba(180,19,19,0.07);
          --res-radius: 20px;
          --res-space: 24px;
        }
        .menu-page {
          background: var(--res-main-bg);
          min-height: 100vh;
          padding: 0;
        }
        .menu-header {
          text-align: center;
          padding: 3rem 1rem 1.5rem 1rem;
        }
        .menu-title {
          font-size: clamp(2.2rem, 4vw, 3rem);
          font-weight: 800;
          letter-spacing: 0.04em;
          color: var(--res-accent);
          margin-bottom: 0.5rem;
        }
        .menu-subtitle {
          color: var(--res-dark);
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
        }
        .menu-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem 3rem 1rem;
        }
        .menu-loader,
        .menu-error,
        .menu-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 1.2rem;
          color: var(--res-accent);
          margin-top: 3rem;
        }
        .menu-grid {
          display: grid;
          gap: var(--res-space);
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          margin-top: 2rem;
        }
        .menu-card {
          background: var(--res-card-bg);
          border-radius: var(--res-radius);
          box-shadow: var(--res-card-shadow);
          border: 1px solid #f6e6e3;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.18s, transform 0.15s;
          position: relative;
          overflow: hidden;
        }
        .menu-card:hover,
        .menu-card:focus-within {
          box-shadow: 0 5px 22px 0 rgba(180,19,19,0.16), 0 1.5px 9px 0 rgba(180,19,19,0.08);
          transform: translateY(-5px) scale(1.012);
        }
        .menu-card-img-wrap {
          width: 100%;
          aspect-ratio: 4/3;
          background: #f3dca6;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-top-left-radius: var(--res-radius);
          border-top-right-radius: var(--res-radius);
        }
        .menu-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: filter 0.2s;
        }
        .menu-card-content {
          padding: 1.5rem 1.2rem 1rem 1.2rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .menu-card-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--res-accent);
          margin-bottom: 0.7rem;
        }
        .menu-card-desc {
          font-size: 1rem;
          color: var(--res-dark);
          margin-bottom: 1rem;
          line-height: 1.45;
          min-height: 48px;
        }
        .menu-card-bottom {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .menu-card-price {
          font-size: 1.13rem;
          font-weight: 600;
          color: var(--res-gold);
          background: var(--res-accent);
          border-radius: 18px;
          padding: 0.4em 1.2em;
          box-shadow: 0 1.5px 6px 0 rgba(180,19,19,0.09);
        }
        @media (max-width: 768px) {
          .menu-header { padding: 2rem 0.4rem 1.2rem 0.4rem; }
          .menu-grid { gap: 16px; }
        }
        @media (max-width: 540px) {
          .menu-header { padding: 1.5rem 0 1rem 0; }
          .menu-title { font-size: 1.4rem; }
          .menu-grid { grid-template-columns: 1fr; gap: 14px; }
          .menu-card-content { padding: 1rem 0.5rem 0.7rem 0.7rem; }
        }
      `}</style>
    </section>
  );
}