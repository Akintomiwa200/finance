"use client";

import Link from "next/link";
import { useState } from "react";
import { SplashBlob } from "@/src/components/landing/splash-blob";

export function HomeFooter() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-[var(--lp-bg)] flex flex-col justify-center pt-16 pb-[30px] relative overflow-hidden">
      <SplashBlob className="top-8 left-10 scale-75 -rotate-12 opacity-50" />
      <SplashBlob className="bottom-8 right-8 scale-50 rotate-45 opacity-35" />
      <div className="max-w-6xl w-full mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 md:gap-10 mb-14">
          {/* Logo + Contact */}
          <div className="col-span-2 lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-8">
              <svg width="34" height="34" viewBox="0 0 22 26" fill="none">
                <path
                  d="M11 0C11 0 14 5 14 9C14 9 17 7 17 4C17 4 22 8 22 14C22 20.627 17.075 26 11 26C4.925 26 0 20.627 0 14C0 8 5 3 5 3C5 3 5 8 8 9C8 9 8 4 11 0Z"
                  fill="#FF5555"
                />
                <path
                  d="M11 14C11 14 13 16 13 18.5C13 20.433 12.105 22 11 22C9.895 22 9 20.433 9 18.5C9 16 11 14 11 14Z"
                  fill="white"
                  opacity="0.6"
                />
              </svg>
              <span className="text-[32px] font-extrabold text-[var(--lp-text)] leading-none tracking-tight">
                uifry
                <sup className="text-[9px] font-bold ml-0.5 align-super">™</sup>
              </span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 mb-5 text-[15px] font-medium text-[var(--lp-text-muted)]">
              <div className="w-9 h-9 rounded-full bg-[#ff5555] flex items-center justify-center flex-shrink-0">
                <svg width="17" height="13" viewBox="0 0 17 13" fill="none">
                  <path
                    d="M1.5 1.5L8.5 7L15.5 1.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <rect
                    x="0.75"
                    y="0.75"
                    width="15.5"
                    height="11.5"
                    rx="1.5"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <span>Help@Frybix.Com</span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 text-[15px] font-medium text-[var(--lp-text-muted)]">
              <div className="w-9 h-9 rounded-full bg-[#ff5555] flex items-center justify-center flex-shrink-0">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path
                    d="M3 1.5C3 1.5 4.2 1.5 4.8 2.9C5.4 4.3 4.5 5 5 5.8C5.6 6.7 7.1 8.1 8.1 8.7C9.1 9.3 9.7 8.4 11.1 9C12.5 9.6 12.5 11.3 12.5 11.3C12.5 11.3 10.5 13.3 7.3 10.1C4.1 6.9 1 3.8 3 1.5Z"
                    stroke="white"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
              <span>+1234 456 678 89</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-[28px] font-bold text-[var(--lp-footer-heading)] mt-0 mr-0 mb-12 ml-0 leading-tight">
              Links
            </h3>
            {["Home", "About Us", "Bookings", "Blog"].map((link) => (
              <Link
                key={link}
                href="#"
                className="block no-underline !text-[var(--lp-text-muted)] text-base font-medium mb-4 hover:!text-[#ff5555] transition-colors"
              >
                {link}
              </Link>
            ))}
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[28px] font-bold text-[var(--lp-footer-heading)] mt-0 mr-0 mb-12 ml-0 leading-tight">
              Legal
            </h3>
            {["Terms Of Use", "Privacy Policy", "Cookie Policy"].map((link) => (
              <Link
                key={link}
                href="#"
                className="block no-underline !text-[var(--lp-text-muted)] text-base font-medium mb-4 hover:!text-[#ff5555] transition-colors"
              >
                {link}
              </Link>
            ))}
          </div>

          {/* Product */}
          <div>
            <h3 className="text-[28px] font-bold text-[var(--lp-footer-heading)] mt-0 mr-0 mb-12 ml-0 leading-tight">
              Product
            </h3>
            {["Take Tour", "Live Chat", "Reviews"].map((link) => (
              <Link
                key={link}
                href="#"
                className="block no-underline !text-[var(--lp-text-muted)] text-base font-medium mb-4 hover:!text-[#ff5555] transition-colors"
              >
                {link}
              </Link>
            ))}
          </div>

          {/* Newsletter */}
          <div className="col-span-2 lg:col-span-2">
            <h3 className="text-[28px] font-bold text-[var(--lp-footer-heading)] mt-0 mr-0 mb-12 ml-0 leading-tight">
              Newsletter
            </h3>
            <p className="text-base text-[var(--lp-text)] mt-0 mb-6 font-medium">
              Stay Up To Date
            </p>
            <div className="flex items-center border border-[var(--lp-border)] rounded-lg overflow-hidden">
              <div className="flex-1 px-4">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 outline-none bg-transparent text-base text-[var(--lp-text)] placeholder-[rgba(255,255,255,0.5)] min-w-0"
                  style={{ border: "none", background: "transparent" }}
                />
              </div>
              <button className="h-14 px-8 border-none bg-[#ff5555] text-white text-base font-semibold cursor-pointer hover:brightness-110 transition-all shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-6xl w-full mx-auto px-6">
        <hr className="border-none h-px bg-white/10 mb-7" />
      </div>

      <div className="text-center text-base text-[var(--lp-text-muted)] font-medium mt-8">
        Copyright 2022 Uifry.Com | All Rights Reserved
      </div>
    </footer>
  );
}
