import React from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import Gallery from "./pages/Gallery.jsx";
import Contact from "./pages/Contact.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
  { to: "/admin/login", label: "Admin" },
];

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <nav className="navbar">
          <div className="brand">
            <NavLink to="/" className="brand-link">
              res
            </NavLink>
          </div>
          <ul className="nav-list">
            {navItems.map(({ to, label }) => (
              <li key={to} className="nav-item">
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " nav-link-active" : "")
                  }
                  end={to === "/"}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer-content">
          <span className="footer-brand">res</span>
          <span>
            &copy; {new Date().getFullYear()} Abdul's Restaurant. Delicious food, warm hospitality.
          </span>
        </div>
      </footer>
    </div>
  );
}