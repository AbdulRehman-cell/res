import React, { useEffect, useState } from "react";
import axios from "axios";

const PALETTE = {
  "--clr-bg": "#fbfaf7",
  "--clr-card-bg": "#fff",
  "--clr-primary": "#b84938",
  "--clr-secondary": "#314955",
  "--clr-text": "#1c252b",
  "--clr-border": "#eaeaea",
  "--clr-muted": "#878787",
  "--clr-accent": "#ffba49",
};

function GalleryImageCard({ imageUrl, caption, idx }) {
  return (
    <div className="gallery-image-card">
      <img
        src={imageUrl}
        alt={caption || `Gallery image ${idx + 1}`}
        className="gallery-image"
        loading="lazy"
        style={{ borderRadius: "12px 12px 0 0" }}
      />
      <div className="gallery-caption">{caption}</div>
    </div>
  );
}

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get("/api/galleryimages")
      .then(res => {
        if (mounted) {
          setImages(Array.isArray(res.data) ? res.data : []);
          setError("");
        }
      })
      .catch(err => {
        setError(
          err.response?.data?.error ||
            "Failed to load gallery images. Please try again."
        );
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="gallery-page">
      <style>{`
        :root {
          ${Object.entries(PALETTE)
            .map(([k, v]) => `${k}: ${v};`)
            .join("\n")}
        }
        .gallery-page {
          min-height: 100vh;
          background: var(--clr-bg);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px 24px 24px 24px;
        }
        .gallery-header {
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--clr-primary);
          letter-spacing: 0.06em;
          margin-bottom: 12px;
          text-align: center;
        }
        .gallery-subheader {
          font-size: 1.15rem;
          color: var(--clr-secondary);
          margin-bottom: 40px;
          text-align: center;
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(285px, 1fr));
          gap: 28px;
          width: 100%;
          max-width: 1100px;
        }
        .gallery-image-card {
          background: var(--clr-card-bg);
          border-radius: 12px;
          box-shadow: 0 2px 16px 0 rgba(60,40,30,0.09), 0 1px 2px 0 rgba(60,40,30,0.07);
          border: 1px solid var(--clr-border);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.18s, transform 0.18s;
        }
        .gallery-image-card:hover, .gallery-image-card:focus-within {
          box-shadow: 0 4px 24px 0 rgba(184,73,56,0.16), 0 2px 4px 0 rgba(49,73,85,0.11);
          transform: translateY(-3px) scale(1.02);
          outline: 1.5px solid var(--clr-accent);
        }
        .gallery-image {
          width: 100%;
          height: 220px;
          object-fit: cover;
          display: block;
          background: #f2eee9;
        }
        .gallery-caption {
          font-size: 1rem;
          font-weight: 500;
          color: var(--clr-text);
          padding: 16px;
          min-height: 40px;
          background: var(--clr-card-bg);
          border-top: 1px solid var(--clr-border);
        }
        @media (max-width: 1050px) {
          .gallery-grid { max-width: 800px;}
          .gallery-image { height: 170px;}
        }
        @media (max-width: 600px) {
          .gallery-page { padding: 24px 4vw 16px 4vw;}
          .gallery-header { font-size: 2rem;}
          .gallery-subheader { font-size: 1rem;}
          .gallery-grid { gap: 18px;}
          .gallery-image-card { border-radius: 8px;}
          .gallery-image { height: 130px; border-radius: 8px 8px 0 0;}
          .gallery-caption { padding: 12px; font-size: 0.98rem;}
        }
      `}</style>
      <h1 className="gallery-header">Gallery</h1>
      <div className="gallery-subheader">
        Explore our restaurant’s atmosphere & dishes.<br />
        Fresh food, vibrant moments, beautiful space.
      </div>
      {loading && (
        <div style={{
          color: "var(--clr-secondary)",
          fontSize: "1.18rem",
          marginTop: "60px",
          textAlign: "center"
        }}>
          Loading images...
        </div>
      )}
      {error && (
        <div style={{
          color: "var(--clr-primary)",
          background: "#ffe6e3",
          borderRadius: "9px",
          padding: "16px",
          marginTop: "32px",
          maxWidth: "400px",
          fontWeight: "600"
        }}>
          {error}
        </div>
      )}
      {!loading && !error && images.length === 0 && (
        <div style={{
          color: "var(--clr-muted)",
          fontSize: "1.12rem",
          marginTop: "60px",
          textAlign: "center"
        }}>
          No images in the gallery yet.<br/>Check back soon!
        </div>
      )}
      {!loading && !error && images.length > 0 && (
        <div className="gallery-grid">
          {images.map((img, idx) => (
            <GalleryImageCard
              key={img._id || idx}
              imageUrl={img.imageUrl || `https://picsum.photos/800/500?random=${idx+9}`}
              caption={img.caption}
              idx={idx}
            />
          ))}
        </div>
      )}
    </div>
  );
}