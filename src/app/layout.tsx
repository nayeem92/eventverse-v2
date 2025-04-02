"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaSearch, FaMoon, FaSun, FaBell, FaHome, FaUser, FaTicketAlt, FaStar } from "react-icons/fa";
import './globals.css'; // ✅ Import global styles

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState("dark");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      setIsLoading(false);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    router.refresh();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    router.refresh();
    router.push("http://localhost:3000/");
  };

  return (
    <html lang="en">
      <body className={`${inter.className} app-body`}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-lg p-3">
          <div className="container">
            <Link href="/" className="navbar-brand">
              <Image src="/Logo.png" alt="Logo" width={100} height={60} />
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                {/* If not logged in */}
                {!isLoggedIn && (
                  <>
                    <li className="nav-item">
                      <Link href="/login" className="nav-link">
                        Login
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/signup" className="nav-link">
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}

                {/* If logged in */}
                {isLoggedIn && !isLoading && (
                  <>
                  <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Events
                      </a>
                      <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li>
                          <Link href="/events" className="dropdown-item">
                            View Events
                          </Link>
                        </li>
                        <li>
                          <Link href="/event" className="dropdown-item">
                            Add Event
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <Link href="/home" className="nav-link">
                        <FaHome /> Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/tickets" className="nav-link">
                        <FaTicketAlt /> Tickets
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/notifications" className="nav-link position-relative">
                        <FaBell /> Notifications
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          5
                        </span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link href="/review/user" className="nav-link">
                        <FaStar /> Reviews
                      </Link>
                    </li>
                  </>
                )}
              </ul>

              {/* Right-aligned section for profile, admin, and logout */}
              <ul className="navbar-nav ms-auto">
                {/* Profile and Admin Section */}
                {isLoggedIn && !isLoading && (
                  <>
                    <li className="nav-item">
                      <Link href="/profile" className="nav-link">
                        <FaUser /> Profile
                      </Link>
                    </li>

                    {/* Admin Section */}
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        id="adminDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Admin
                      </a>
                      <ul className="dropdown-menu" aria-labelledby="adminDropdown">
                        <li>
                          <Link href="/admin/users" className="dropdown-item">
                            Admin Users
                          </Link>
                        </li>
                        <li>
                          <Link href="/admin/dashboard" className="dropdown-item">
                            Admin Dashboard
                          </Link>
                        </li>
                      </ul>
                    </li>

                    {/* Logout Button */}
                    <li className="nav-item">
                      <button onClick={handleLogout} className="btn btn-danger ms-2">
                        Logout
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        {children}
      </body>
    </html>
  );
}