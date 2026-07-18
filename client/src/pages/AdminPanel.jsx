import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPanel.css";

function useAuth() {
  // Auth token in localStorage: "adminToken"
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setAuthenticated(!!token);
  }, []);

  return authenticated;
}

function validateMenuItem(item) {
  const errors = {};
  if (!item.title || item.title.length < 2) errors.title = "Title is required (min 2 chars).";
  if (!item.description || item.description.length < 5)
    errors.description = "Description must be at least 5 characters.";
  if (typeof item.price !== "number" || item.price < 1)
    errors.price = "Price must be greater than $1.";
  if (!item.imageUrl || !/^https?:\/\/.+/.test(item.imageUrl))
    errors.imageUrl = "Valid image URL required.";
  return errors;
}

function validateGalleryImage(img) {
  const errors = {};
  if (!img.imageUrl || !/^https?:\/\/.+/.test(img.imageUrl))
    errors.imageUrl = "Valid image URL required.";
  if (!img.caption || img.caption.length < 2) errors.caption = "Caption is required (min 2 chars).";
  return errors;
}

function AdminMenuSection() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch MenuItems
  useEffect(() => {
    async function fetchMenu() {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get("/api/menuitems");
        setMenuItems(data);
      } catch (err) {
        setError("Failed to load menu items.");
      }
      setLoading(false);
    }
    fetchMenu();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "price" ? Number(value) : value }));
  };

  // Start edit mode
  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
    });
    setFormErrors({});
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setForm({ title: "", description: "", price: "", imageUrl: "" });
    setFormErrors({});
  };

  // Submit new or updated item
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateMenuItem(form);
    setFormErrors(errors);
    if (Object.keys(errors).length) return;

    try {
      if (editingId) {
        await axios.put(`/api/menuitems/${editingId}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        });
        setMenuItems((items) =>
          items.map((item) =>
            item._id === editingId ? { ...item, ...form } : item
          )
        );
      } else {
        const { data } = await axios.post("/api/menuitems", form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        });
        setMenuItems((items) => [...items, data]);
      }
      handleCancel();
    } catch (err) {
      setError("Save failed. Please check your inputs.");
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this menu item?")) return;
    try {
      await axios.delete(`/api/menuitems/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      setMenuItems((items) => items.filter((i) => i._id !== id));
      if (editingId === id) handleCancel();
    } catch (err) {
      setError("Delete failed.");
    }
  };

  return (
    <section className="admin-section">
      <h2>Menu Management</h2>
      <div className="admin-form-wrapper">
        <form className="admin-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="admin-form-fields">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Dish Title"
              className={formErrors.title ? "input-error" : ""}
              maxLength={50}
              autoFocus
            />
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price ($)"
              type="number"
              min={1}
              className={formErrors.price ? "input-error" : ""}
              step="0.01"
            />
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="Image URL"
              className={formErrors.imageUrl ? "input-error" : ""}
              maxLength={200}
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              rows={2}
              className={formErrors.description ? "input-error" : ""}
              maxLength={150}
            />
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn-primary">
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button type="button" className="admin-btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
          {Object.values(formErrors).length > 0 && (
            <div className="form-errors">
              {Object.values(formErrors).map((err, i) => (
                <span key={i}>{err}</span>
              ))}
            </div>
          )}
        </form>
      </div>

      <div className="admin-list">
        {loading ? (
          <div className="admin-loading">Loading menu items...</div>
        ) : error ? (
          <div className="admin-error">{error}</div>
        ) : menuItems.length === 0 ? (
          <div className="admin-empty">No menu items found.</div>
        ) : (
          <ul className="admin-list-ul">
            {menuItems.map((item) => (
              <li key={item._id} className="admin-list-li">
                <div className="admin-list-img">
                  <img src={item.imageUrl} alt={item.title} />
                </div>
                <div className="admin-list-content">
                  <h3>{item.title}</h3>
                  <span className="admin-list-price">${item.price.toFixed(2)}</span>
                  <p>{item.description}</p>
                  <div className="admin-list-actions">
                    <button
                      type="button"
                      className="admin-btn-small"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn-small admin-btn-danger"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function AdminGallerySection() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    imageUrl: "",
    caption: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch GalleryImages
  useEffect(() => {
    async function fetchGallery() {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get("/api/galleryimages");
        setGallery(data);
      } catch (err) {
        setError("Failed to load gallery images.");
      }
      setLoading(false);
    }
    fetchGallery();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Start edit mode
  const handleEdit = (img) => {
    setEditingId(img._id);
    setForm({
      imageUrl: img.imageUrl,
      caption: img.caption,
    });
    setFormErrors({});
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setForm({ imageUrl: "", caption: "" });
    setFormErrors({});
  };

  // Submit new or updated image
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateGalleryImage(form);
    setFormErrors(errors);
    if (Object.keys(errors).length) return;

    try {
      if (editingId) {
        await axios.put(`/api/galleryimages/${editingId}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        });
        setGallery((imgs) =>
          imgs.map((img) => (img._id === editingId ? { ...img, ...form } : img))
        );
      } else {
        const { data } = await axios.post("/api/galleryimages", form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        });
        setGallery((imgs) => [...imgs, data]);
      }
      handleCancel();
    } catch (err) {
      setError("Save failed. Please check your inputs.");
    }
  };

  // Delete image
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this gallery image?")) return;
    try {
      await axios.delete(`/api/galleryimages/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      setGallery((imgs) => imgs.filter((g) => g._id !== id));
      if (editingId === id) handleCancel();
    } catch (err) {
      setError("Delete failed.");
    }
  };

  return (
    <section className="admin-section">
      <h2>Gallery Management</h2>
      <div className="admin-form-wrapper">
        <form className="admin-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="admin-form-fields">
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="Image URL"
              className={formErrors.imageUrl ? "input-error" : ""}
              maxLength={200}
            />
            <input
              name="caption"
              value={form.caption}
              onChange={handleChange}
              placeholder="Caption"
              className={formErrors.caption ? "input-error" : ""}
              maxLength={100}
            />
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn-primary">
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button type="button" className="admin-btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
          {Object.values(formErrors).length > 0 && (
            <div className="form-errors">
              {Object.values(formErrors).map((err, i) => (
                <span key={i}>{err}</span>
              ))}
            </div>
          )}
        </form>
      </div>

      <div className="admin-list admin-gallery-list">
        {loading ? (
          <div className="admin-loading">Loading images...</div>
        ) : error ? (
          <div className="admin-error">{error}</div>
        ) : gallery.length === 0 ? (
          <div className="admin-empty">No gallery images found.</div>
        ) : (
          <ul className="admin-list-ul admin-gallery-ul">
            {gallery.map((img) => (
              <li key={img._id} className="admin-list-li admin-gallery-li">
                <div className="admin-gallery-img">
                  <img src={img.imageUrl} alt={img.caption} />
                </div>
                <div className="admin-gallery-content">
                  <span>{img.caption}</span>
                  <div className="admin-list-actions">
                    <button
                      type="button"
                      className="admin-btn-small"
                      onClick={() => handleEdit(img)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn-small admin-btn-danger"
                      onClick={() => handleDelete(img._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default function AdminPanel() {
  const authenticated = useAuth();
  const [logoutMsg, setLogoutMsg] = useState("");
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLogoutMsg("You have been logged out.");
    setTimeout(() => {
      window.location.href = "/admin/login";
    }, 1300);
  };

  if (!authenticated) {
    return (
      <div className="admin-locked">
        <div className="admin-locked-icon">
          <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
            <rect x="12" y="28" width="40" height="24" rx="6" fill="#dedede" />
            <rect
              x="16"
              y="24"
              width="32"
              height="12"
              rx="5"
              fill="#7c8ae7"
              stroke="#4c59a4"
              strokeWidth="1"
            />
            <circle cx="32" cy="44" r="5" fill="#4c59a4" />
          </svg>
        </div>
        <div className="admin-locked-text">
          <h2>Access Restricted</h2>
          <p>Please login as Abdul to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel-container">
      <div className="admin-panel-header">
        <h1>
          <span role="img" aria-label="chef">
            👨‍🍳
          </span>{" "}
          Admin Panel - Abdul
        </h1>
        <button className="admin-btn-logout" onClick={handleLogout} title="Logout">
          Logout
        </button>
      </div>
      {logoutMsg && <div className="admin-logout-message">{logoutMsg}</div>}
      <div className="admin-panel-sections">
        <AdminMenuSection />
        <AdminGallerySection />
      </div>
    </div>
  );
}

/* Inline CSS for this file: */
const css = `
.admin-panel-container {
  max-width: 1000px;
  margin: 2.5rem auto 0 auto;
  padding: 2rem;
  background: var(--admin-panel-bg, #fbfbfe);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(80, 100, 150, 0.11);
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
.admin-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.admin-panel-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--admin-title, #2a2949);
}
.admin-btn-logout {
  background: #fa5050;
  color: white;
  border: none;
  padding: 0.8rem 1.7rem;
  font-size: 1rem;
  border-radius: 18px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(250,80,80,0.12);
  transition: background 0.16s;
}
.admin-btn-logout:hover, .admin-btn-logout:focus {
  background: #c82f3f;
}
.admin-logout-message {
  background: #4754a0;
  color: white;
  border-radius: 10px;
  text-align: center;
  padding: 0.7rem 0;
  margin-bottom: 1.2rem;
  font-size: 1.1rem;
}
.admin-panel-sections {
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
}
.admin-section {
  flex: 1 1 400px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 1px 12px rgba(80, 120, 220, 0.08);
  padding: 1.6rem;
  margin-bottom: 2rem;
  min-width: 320px;
}
.admin-section h2 {
  font-size: 1.35rem;
  margin-bottom: 1.2rem;
  color: #464671;
  font-weight: 600;
}
.admin-form-wrapper {
  margin-bottom: 0.8rem;
}
.admin-form {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  background: #f5f7fb;
  border-radius: 12px;
  padding: 1rem 1.2rem;
  box-shadow: 0 1px 4px rgba(97,110,170,0.07);
}
.admin-form-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.7rem;
  margin-bottom: 0.2rem;
}
.admin-form textarea, .admin-form input {
  padding: 0.6rem;
  font-size: 1rem;
  border: 1.2px solid #dbe1ec;
  border-radius: 8px;
  background: white;
  transition: border-color 0.18s;
}
.admin-form textarea:focus, .admin-form input:focus {
  border-color: #7387e5;
  outline: none;
}
.input-error {
  border-color: #fa5050;
  background: #fff4f4;
}
.admin-form-actions {
  display: flex;
  gap: 1rem;
}
.admin-btn-primary {
  background: #4754a0;
  color: white;
  border: none;
  padding: 0.6rem 1.4rem;
  border-radius: 14px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.15s;
}
.admin-btn-primary:hover, .admin-btn-primary:focus {
  background: #3640a0;
}
.admin-btn-secondary {
  background: #dedede;
  color: #575252;
  border: none;
  padding: 0.6rem 1.1rem;
  border-radius: 14px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.14s;
}
.admin-btn-secondary:hover, .admin-btn-secondary:focus {
  background: #bababa;
}
.admin-btn-small {
  background: #7c8ae7;
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  font-size: 0.93rem;
  border-radius: 12px;
  margin-right: 0.7rem;
  cursor: pointer;
  transition: background 0.14s;
  box-shadow: 0 1px 3px rgba(97,110,170,0.07);
}
.admin-btn-small:hover, .admin-btn-small:focus {
  background: #4754a0;
}
.admin-btn-danger {
  background: #fa5050;
}
.admin-btn-danger:hover, .admin-btn-danger:focus {
  background: #c82f3f;
}
.form-errors {
  color: #fa5050;
  font-size: 0.95rem;
  margin-top: 0.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
}
.admin-list {
  margin-top: 1.3rem;
}
.admin-list-ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 1.2rem;
}
.admin-list-li {
  display: flex;
  gap: 1.1rem;
  background: #f7f8fa;
  border-radius: 14px;
  box-shadow: 0 1px 8px rgba(130,140,190,0.06);
  padding: 1.1rem;
  align-items: flex-start;
}
.admin-list-img img {
  width: 110px;
  height: 72px;
  border-radius: 9px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(32,30,70,0.12);
}
.admin-list-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.admin-list-content h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #392c7b;
  font-weight: 500;
}
.admin-list-price {
  font-weight: 600;
  color: #4754a0;
}
.admin-list-actions {
  margin-top: 0.4rem;
}
.admin-loading, .admin-error, .admin-empty {
  font-size: 1rem;
  color: #4754a0;
  margin: 1.2rem 0;
  background: #edf0fa;
  padding: 0.6rem 1.1rem;
  border-radius: 12px;
}
.admin-gallery-ul {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
.admin-gallery-li {
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  min-width: 180px;
}
.admin-gallery-img img {
  width: 90%;
  max-width: 250px;
  height: 120px;
  object-fit: cover;
  border-radius: 9px;
  box-shadow: 0 2px 8px rgba(130,140,190,0.09);
}
.admin-gallery-content {
  text-align: center;
  color: #4754a0;
  font-size: 1rem;
  font-weight: 500;
}
.admin-locked {
  max-width: 420px;
  margin: 6rem auto;
  background: #f9faff;
  border-radius: 18px;
  padding: 2.2rem;
  text-align: center;
  box-shadow: 0 12px 28px rgba(100,130,220,0.10);
}
.admin-locked-icon {
  margin-bottom: 1.2rem;
}
.admin-locked-text h2 {
  color: #4754a0;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}
.admin-locked-text p {
  color: #2d2d3f;
  font-size: 1rem;
  margin: 0;
}
/* Responsive */
@media (max-width: 1100px) {
  .admin-panel-container {
    max-width: 98vw;
    padding: 1.2rem;
  }
  .admin-panel-sections {
    flex-direction: column;
    gap: 2rem;
  }
}
@media (max-width: 600px) {
  .admin-panel-container {
    padding: 0.25rem;
    border-radius: 0;
    box-shadow: none;
  }
  .admin-section {
    padding: 0.8rem;
    border-radius: 8px;
  }
}
`;

if (typeof window !== "undefined" && !document.getElementById("admin-panel-css")) {
  const style = document.createElement("style");
  style.id = "admin-panel-css";
  style.textContent = css;
  document.head.appendChild(style);
}