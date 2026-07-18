import React, { useEffect, useState } from "react";
import axios from "axios";

const FEATURED_COUNT = 3;

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get("/api/menuitems")
      .then(res => {
        if (!mounted) return;
        const items = res.data || [];
        // Randomize, pick top FEATURED_COUNT
        const shuffled = items.slice().sort(() => Math.random() - 0.5);
        setFeatured(shuffled.slice(0, FEATURED_COUNT));
        setError(null);
      })
      .catch(err => {
        setError(
          err.response?.data?.error ||
          err.message ||
          "Failed to load featured dishes."
        );
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  // Restaurant details
  const name = "Abdul's Restaurant";
  const intro =
    "Welcome to Abdul's Restaurant, where authentic flavors meet modern comfort. Enjoy our curated menu and warm hospitality!";
  const address = "123 Flavor St, Foodville, 12345";
  const hours = [
    { day: "Monday", open: "11:00 AM", close: "10:00 PM" },
    { day: "Tuesday", open: "11:00 AM", close: "10:00 PM" },
    { day: "Wednesday", open: "11:00 AM", close: "10:00 PM" },
    { day: "Thursday", open: "11:00 AM", close: "10:00 PM" },
    { day: "Friday", open: "11:00 AM", close: "11:00 PM" },
    { day: "Saturday", open: "11:00 AM", close: "11:00 PM" },
    { day: "Sunday", open: "Closed", close: "" },
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-bg">
          <img
            src="https://picsum.photos/800/500?random=1"
            alt="Restaurant interior"
            className="hero-img"
          />
        </div>
        <div className="hero-content">
          <h1 className="restaurant-name">{name}</h1>
          <p className="restaurant-intro">{intro}</p>
        </div>
      </section>

      <section className="featured-section">
        <h2 className="section-title">Featured Dishes</h2>
        {loading ? (
          <div className="state-box loading">Loading featured dishes...</div>
        ) : error ? (
          <div className="state-box error">{error}</div>
        ) : featured.length === 0 ? (
          <div className="state-box empty">No featured dishes available.</div>
        ) : (
          <div className="featured-list">
            {featured.map(item => (
              <div className="featured-card" key={item._id}>
                <div className="featured-img-wrap">
                  <img
                    src={item.imageUrl || "https://picsum.photos/400/300?random=2"}
                    alt={item.title}
                    className="featured-img"
                  />
                </div>
                <div className="featured-info">
                  <div className="featured-title">{item.title}</div>
                  <div className="featured-desc">{item.description}</div>
                  <div className="featured-price">
                    ${item.price ? item.price.toFixed(2) : "-"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="details-section">
        <div className="location-hours">
          <div className="location">
            <h3 className="details-title">Find Us</h3>
            <div className="address">
              <svg
                className="address-icon"
                width={18}
                height={18}
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="9" cy="9" r="8" stroke="#9F5529" strokeWidth="2" fill="#fff"/>
                <ellipse cx="9" cy="9" rx="4" ry="5" fill="#FFD6BA"/>
                <circle cx="9" cy="9" r="2" fill="#E0763A"/>
              </svg>
              <span>{address}</span>
            </div>
            <div className="map-wrap">
              <iframe
                title="Restaurant map"
                className="map-iframe"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=10.744%2C59.913%2C10.754%2C59.923&layer=mapnik`}
                style={{ border: 0 }}
                allowFullScreen=""
                width="100%"
                height="160"
              ></iframe>
            </div>
          </div>

          <div className="hours">
            <h3 className="details-title">Hours</h3>
            <table className="hours-table">
              <tbody>
                {hours.map(h => (
                  <tr
                    key={h.day}
                    className={h.day === "Sunday" ? "closed-row" : ""}
                  >
                    <td className="hours-day">{h.day}</td>
                    <td className="hours-time">
                      {h.open === "Closed"
                        ? <span className="closed-label">Closed</span>
                        : `${h.open} – ${h.close}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Style */}
      <style>{`
        .home-page {
          padding: 0;
          background: var(--bg, #f9f6f3);
          color: var(--fg, #2A2A2A);
        }
        .hero {
          position: relative;
          min-height: 340px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(157,85,43,0.12);
          margin: 2rem auto 1.5rem;
          width: 95%;
          max-width: 900px;
        }
        .hero-bg {
          flex: 1;
          min-width: 0;
        }
        .hero-img {
          width: 100%;
          height: 340px;
          object-fit: cover;
          filter: brightness(85%) saturate(1.1);
          border-radius: 24px 0 0 24px;
        }
        .hero-content {
          z-index: 2;
          flex: 0 0 330px;
          background: rgba(255,255,255,0.92);
          padding: 2.5rem 2rem;
          border-radius: 0 24px 24px 0;
          box-shadow: 0 4px 24px rgba(157,85,43,0.15);
          margin-left: -10px;
        }
        .restaurant-name {
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--accent, #9F5529);
          margin-bottom: 1rem;
        }
        .restaurant-intro {
          font-size: 1.18rem;
          margin-bottom: 0.5rem;
          color: #474747;
        }
        @media (max-width: 800px) {
          .hero {
            flex-direction: column;
            min-height: 220px;
            border-radius: 18px;
          }
          .hero-img {
            height: 180px;
            border-radius: 18px 18px 0 0;
          }
          .hero-content {
            padding: 1.5rem 1.3rem;
            border-radius: 0 0 18px 18px;
            margin-left: 0;
          }
        }

        .section-title {
          font-size: 1.7rem;
          font-weight: 500;
          color: var(--accent, #9F5529);
          margin: 2.2rem 0 1rem 0;
          text-align: center;
        }
        .featured-section {
          background: #fff;
          margin: 0 auto 2rem;
          padding: 2rem 1rem 1.2rem;
          border-radius: 18px;
          box-shadow: 0 4px 16px rgba(157,85,43,0.08);
          max-width: 900px;
        }
        .state-box {
          text-align: center;
          margin: 1.7rem auto;
          color: #E0763A;
          font-size: 1.13rem;
          opacity: 0.8;
        }
        .featured-list {
          display: flex;
          gap: 2rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .featured-card {
          display: flex;
          flex-direction: column;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 2px 10px rgba(157,85,43,0.09);
          max-width: 260px;
          margin-bottom: 1.5rem;
          padding: 0;
          transition: transform 0.17s, box-shadow 0.17s;
        }
        .featured-card:hover, .featured-card:focus-within {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 8px 24px rgba(157,85,43,0.15);
        }
        .featured-img-wrap {
          border-radius: 14px 14px 0 0;
          overflow: hidden;
        }
        .featured-img {
          width: 100%;
          height: 155px;
          object-fit: cover;
          border-radius: 14px 14px 0 0;
          display: block;
        }
        .featured-info {
          padding: 1.15rem 1rem 1rem;
        }
        .featured-title {
          font-size: 1.09rem;
          font-weight: 600;
          margin-bottom: 0.55em;
          color: #4B2C14;
        }
        .featured-desc {
          font-size: 0.97rem;
          color: #6A4747;
          margin-bottom: 0.66em;
        }
        .featured-price {
          font-weight: 700;
          font-size: 1.07rem;
          color: #E0763A;
          letter-spacing: 0.02em;
        }
        @media (max-width: 700px) {
          .featured-list {
            flex-direction: column;
            align-items: center;
            gap: 1.2rem;
          }
          .featured-section {
            padding: 1rem 0.5rem;
          }
        }
        .details-section {
          background: #f7eee7;
          max-width: 900px;
          margin: 0 auto 2.2rem;
          padding: 1.7rem 1rem;
          border-radius: 18px;
          box-shadow: 0 2px 10px rgba(157,85,43,0.07);
        }
        .location-hours {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.1rem;
        }
        @media (max-width: 800px) {
          .location-hours {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
        .location {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .details-title {
          font-size: 1.18rem;
          font-weight: 600;
          color: var(--accent, #E0763A);
          margin-bottom: 0.6rem;
        }
        .address {
          display: flex;
          align-items: center;
          font-size: 1.01rem;
          color: #77431F;
          gap: 0.35em;
        }
        .address-icon {
          vertical-align: middle;
        }
        .map-wrap {
          margin-top: 0.2rem;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(157,85,43,0.09);
        }
        .map-iframe {
          border-radius: 8px;
          border: none;
          min-width: 120px;
          min-height: 120px;
          width: 100%;
        }
        .hours {
          margin-left: 1.2rem;
        }
        @media (max-width: 800px) {
          .hours {
            margin-left: 0;
          }
        }
        .hours-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.98rem;
        }
        .hours-day, .hours-time {
          padding: 0.3rem 0.6rem;
          color: #544A4A;
        }
        .hours-table tr.closed-row .hours-time .closed-label {
          color: #E0763A;
          font-weight: 700;
          letter-spacing: 0.01em;
        }
        .hours-table tr.closed-row {
          opacity: 0.72;
        }
        .hours-table tr:not(.closed-row) {
          background: #fff;
        }
        .hours-table tr {
          border-radius: 7px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}