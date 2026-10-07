"use client";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "home", label: "Home" },
  { href: "services", label: "Services" },
  { href: "portfolio", label: "Portfolio" },
  { href: "pricing", label: "Packages" },
  { href: "booking", label: "Booking" },
  { href: "calendar", label: "Availability" },
  { href: "contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 w-full z-10 bg-[rgba(9,9,9,0.9)] backdrop-blur-md border-b border-[#222]">
      <div className="container-x h-[74px] flex items-center justify-between">
        <Link
          href="home"
          className="text-[1.35rem] font-extrabold tracking-[2px]"
        >
          FEDDY <span className="text-gold">STUDIO</span>
        </Link>
        <button
          className="md:hidden text-white text-[1.7rem]"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <nav
          className={`${
            open ? "flex" : "hidden"
          } md:flex absolute md:static top-[74px] left-0 w-full md:w-auto bg-[rgba(9,9,9,0.98)] md:bg-transparent flex-col md:flex-row gap-5 md:gap-[25px] p-5 md:p-0 text-[0.92rem]`}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="hover:text-gold transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}