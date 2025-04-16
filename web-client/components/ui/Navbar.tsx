// components/ui/Navbar.tsx
"use client";

import Link from "next/link";
import { TagIcon, MailIcon, InfoIcon, MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Forside" },
    { href: "#features", label: "Funksjoner" },
    { href: "#kontakt", label: "Kontakt oss" },
    { href: "#omoss", label: "Om oss" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-md z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <TagIcon className="h-6 w-6 text-primary" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            Dishcount
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 dark:text-gray-200 hover:text-primary transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={() => setOpen(!open)}
          aria-label="Meny"
        >
          {open ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <ul className="flex flex-col space-y-2 px-6 py-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-gray-700 dark:text-gray-200 hover:text-primary transition"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
