import React, { useState, useEffect } from "react";
import {
  Sun, Moon, Calendar, ChevronLeft, ChevronRight, MapPin, Clock,
  AlertTriangle, Compass, Sparkles, Flower2, Crown, Star, Wind, Sunrise, ArrowUp, ChevronDown, CheckCircle2
} from "lucide-react";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import MobileMenu from "../components/layout/MobileMenu";
import PopupSearch from "../components/layout/PopupSearch";
import SideMenu from "../components/layout/SideMenu";

// ==========================================
// HIGH-FIDELITY VECTOR GRAPHICS (VEDIC DESIGN)
// ==========================================

const HangingDiya = ({ height = 180, className = "" }) => {
  return (
    <svg width="40" height={height} viewBox="0 0 40 180" className={className} style={{ overflow: "visible" }}>
      {/* Chain */}
      <line x1="20" y1="0" x2="20" y2="130" stroke="#E2B765" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* Diya Hanging Loop */}
      <circle cx="20" cy="130" r="4" fill="none" stroke="#E2B765" strokeWidth="2" />
      {/* Diya Body */}
      <path
        d="M20,134 C10,134 5,145 5,152 C5,162 12,170 20,170 C28,170 35,162 35,152 C35,145 30,134 20,134 Z"
        fill="url(#diya-gold-grad)"
        stroke="#B2822A"
        strokeWidth="1.5"
      />
      {/* Inner Oil/Liquid border */}
      <path d="M5,152 Q20,158 35,152" fill="none" stroke="#B2822A" strokeWidth="1" />
      {/* Flame */}
      <path
        d="M20,134 C18,124 16,115 20,103 C24,115 22,124 20,134 Z"
        fill="url(#diya-flame-grad)"
        style={{ filter: "drop-shadow(0 0 6px #FBBF24)" }}
      />
      <defs>
        <linearGradient id="diya-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF9E6" />
          <stop offset="35%" stopColor="#E2B765" />
          <stop offset="70%" stopColor="#B2822A" />
          <stop offset="100%" stopColor="#7F5605" />
        </linearGradient>
        <linearGradient id="diya-flame-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFDF5" />
          <stop offset="30%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const LotusFlower = ({ size = 65, className = "" }) => {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 100 80" className={className} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="lotus-pink-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FDBA74" /> {/* peach tip */}
          <stop offset="30%" stopColor="#F472B6" />
          <stop offset="75%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#9D174D" />
        </linearGradient>
      </defs>
      {/* Outer back petals */}
      <path d="M50,75 C15,70 5,45 15,30 C25,25 35,40 50,75 Z" fill="url(#lotus-pink-grad)" opacity="0.7" />
      <path d="M50,75 C85,70 95,45 85,30 C75,25 65,40 50,75 Z" fill="url(#lotus-pink-grad)" opacity="0.7" />

      {/* Side petals */}
      <path d="M50,75 C20,60 10,35 25,20 C40,15 45,40 50,75 Z" fill="url(#lotus-pink-grad)" opacity="0.9" />
      <path d="M50,75 C80,60 90,35 75,20 C60,15 55,40 50,75 Z" fill="url(#lotus-pink-grad)" opacity="0.9" />

      {/* Inner petals */}
      <path d="M50,75 C30,55 32,25 45,10 C50,15 52,40 50,75 Z" fill="url(#lotus-pink-grad)" />
      <path d="M50,75 C70,55 68,25 55,10 C50,15 48,40 50,75 Z" fill="url(#lotus-pink-grad)" />

      {/* Center Main Petal */}
      <path d="M50,75 C38,55 40,15 50,0 C60,15 62,55 50,75 Z" fill="url(#lotus-pink-grad)" />

      {/* Green base leaf/sepals */}
      <path d="M25,75 C35,78 65,78 75,75 C60,82 40,82 25,75 Z" fill="#15803D" />
    </svg>
  );
};

const SunWheel = () => {
  const zodiacs = [
    { name: "Aries", symbol: "♈" },
    { name: "Taurus", symbol: "♉" },
    { name: "Gemini", symbol: "♊" },
    { name: "Cancer", symbol: "♋" },
    { name: "Leo", symbol: "♌" },
    { name: "Virgo", symbol: "♍" },
    { name: "Libra", symbol: "♎" },
    { name: "Scorpio", symbol: "♏" },
    { name: "Sagittarius", symbol: "♐" },
    { name: "Capricorn", symbol: "♑" },
    { name: "Aquarius", symbol: "♒" },
    { name: "Pisces", symbol: "♓" },
  ];

  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const R = 132;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" className="select-none" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="sun-inner-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFAE6" />
          <stop offset="55%" stopColor="#FCD34D" />
          <stop offset="90%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </radialGradient>
        <linearGradient id="gold-metallic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3C4" />
          <stop offset="45%" stopColor="#D5A93C" />
          <stop offset="70%" stopColor="#B08320" />
          <stop offset="100%" stopColor="#875B08" />
        </linearGradient>
      </defs>

      {/* Main Wheel Plate */}
      <circle cx={cx} cy={cy} r={R} fill="#271911" stroke="url(#gold-metallic)" strokeWidth="3" style={{ filter: "drop-shadow(0 6px 15px rgba(0,0,0,0.4))" }} />

      {/* Inner Concentric Rings */}
      <circle cx={cx} cy={cy} r={R - 22} fill="none" stroke="url(#gold-metallic)" strokeWidth="0.8" opacity="0.6" />
      <circle cx={cx} cy={cy} r={R - 45} fill="none" stroke="url(#gold-metallic)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
      <circle cx={cx} cy={cy} r={R - 50} fill="none" stroke="url(#gold-metallic)" strokeWidth="1.5" opacity="0.7" />

      {/* 12 Sectors with Text & Glyphs */}
      {zodiacs.map((z, i) => {
        const angleDeg = i * 30;
        const angleRad = (angleDeg * Math.PI) / 180;

        // Division lines
        const x1 = cx + (R - 50) * Math.cos(angleRad);
        const y1 = cy + (R - 50) * Math.sin(angleRad);
        const x2 = cx + R * Math.cos(angleRad);
        const y2 = cy + R * Math.sin(angleRad);

        // Label position
        const labelAngle = angleDeg + 15;
        const labelRad = (labelAngle * Math.PI) / 180;
        const tx = cx + (R - 10) * Math.cos(labelRad);
        const ty = cy + (R - 10) * Math.sin(labelRad);

        // Symbol position
        const sx = cx + (R - 33) * Math.cos(labelRad);
        const sy = cy + (R - 33) * Math.sin(labelRad);

        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#gold-metallic)" strokeWidth="1.2" opacity="0.4" />

            {/* English Zodiac Label */}
            <text
              x={tx}
              y={ty}
              fill="url(#gold-metallic)"
              fontSize="8.5"
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="middle"
              transform={`rotate(${labelAngle + 90}, ${tx}, ${ty})`}
            >
              {z.name}
            </text>

            {/* Zodiac Symbol Glyph */}
            <text
              x={sx}
              y={sy}
              fill="#FFFAF0"
              fontSize="12.5"
              textAnchor="middle"
              alignmentBaseline="middle"
              transform={`rotate(${labelAngle + 90}, ${sx}, ${sy})`}
              opacity="0.85"
            >
              {z.symbol}
            </text>
          </g>
        );
      })}

      {/* Central Glowing Sun Deity */}
      <g>
        {/* Sun Rays */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          const isWavy = i % 2 === 0;
          return (
            <path
              key={i}
              d={isWavy
                ? `M ${cx} ${cy - 40} Q ${cx - 7} ${cy - 52} ${cx} ${cy - 66} Q ${cx + 7} ${cy - 52} ${cx} ${cy - 40}`
                : `M ${cx} ${cy - 40} L ${cx - 4} ${cy - 62} L ${cx + 4} ${cy - 62} Z`
              }
              fill="url(#gold-metallic)"
              transform={`rotate(${angle}, ${cx}, ${cy})`}
            />
          );
        })}

        {/* Face circle */}
        <circle cx={cx} cy={cy} r={40} fill="url(#sun-inner-glow)" stroke="url(#gold-metallic)" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={37} fill="none" stroke="#78350F" strokeWidth="0.5" opacity="0.3" />

        {/* Tilak (Traditional Forehead Mark) */}
        <path d={`M ${cx - 2} ${cy - 22} Q ${cx} ${cy - 8} ${cx + 2} ${cy - 22} Z`} fill="#DC2626" />
        <circle cx={cx} cy={cy - 24} r="2" fill="#FBBF24" />

        {/* Eyes & Brows */}
        <path d={`M ${cx - 11} ${cy - 6} Q ${cx - 7} ${cy - 9} ${cx - 3} ${cy - 6}`} fill="none" stroke="#451A03" strokeWidth="1.8" strokeLinecap="round" />
        <path d={`M ${cx + 3} ${cy - 6} Q ${cx + 7} ${cy - 9} ${cx + 11} ${cy - 6}`} fill="none" stroke="#451A03" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx={cx - 7} cy={cy - 4} r="1.5" fill="#451A03" />
        <circle cx={cx + 7} cy={cy - 4} r="1.5" fill="#451A03" />
        <path d={`M ${cx - 13} ${cy - 10} Q ${cx - 8} ${cy - 12} ${cx - 3} ${cy - 9}`} fill="none" stroke="#451A03" strokeWidth="0.8" />
        <path d={`M ${cx + 3} ${cy - 9} Q ${cx + 8} ${cy - 12} ${cx + 13} ${cy - 10}`} fill="none" stroke="#451A03" strokeWidth="0.8" />

        {/* Nose */}
        <path d={`M ${cx} ${cy - 6} L ${cx - 1.5} ${cy + 4} L ${cx} ${cy + 5}`} fill="none" stroke="#451A03" strokeWidth="1.2" strokeLinecap="round" />

        {/* Smile */}
        <path d={`M ${cx - 9} ${cy + 8} Q ${cx} ${cy + 16} ${cx + 9} ${cy + 8}`} fill="none" stroke="#451A03" strokeWidth="1.8" strokeLinecap="round" />
        <path d={`M ${cx - 11} ${cy + 7} L ${cx - 8} ${cy + 8}`} fill="none" stroke="#451A03" strokeWidth="1" />
        <path d={`M ${cx + 8} ${cy + 8} L ${cx + 11} ${cy + 7}`} fill="none" stroke="#451A03" strokeWidth="1" />
      </g>
    </svg>
  );
};

const Kalash = ({ size = 125, className = "" }) => {
  return (
    <img
      src="/assets/img/images/kalashchadawa.png"
      alt="Kalash"
      width={size}
      height={size * 1.25}
      className={className}
      style={{
        objectFit: "contain",
        display: "block",
      }}
    />
  );
};

// ==========================================
// DYNAMIC PANCHANG DATA GENERATION
// ==========================================

const getPanchangData = (offset) => {
  const baseDate = new Date(2026, 0, 4); // Saturday, January 04, 2026
  const targetDate = new Date(baseDate);
  targetDate.setDate(baseDate.getDate() + offset);

  const formattedDate = targetDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Deterministic values wrapping monthly cycle
  const tithis = [
    { name: "Pratipada Krishna-Paksha", sub: "Till 12:31 PM", paksha: "Krishna-Paksha", month: "Magha", season: "Hemant Season" },
    { name: "Dwitiya Krishna-Paksha", sub: "Till 01:45 PM", paksha: "Krishna-Paksha", month: "Magha", season: "Hemant Season" },
    { name: "Tritiya Krishna-Paksha", sub: "Till 02:30 PM", paksha: "Krishna-Paksha", month: "Magha", season: "Hemant Season" },
    { name: "Chaturthi Krishna-Paksha", sub: "Till 03:10 PM", paksha: "Krishna-Paksha", month: "Magha", season: "Hemant Season" },
    { name: "Panchami Krishna-Paksha", sub: "Till 04:15 PM", paksha: "Krishna-Paksha", month: "Magha", season: "Hemant Season" },
    { name: "Pratipada Shukla-Paksha", sub: "Till 11:20 AM", paksha: "Shukla-Paksha", month: "Magha", season: "Hemant Season" },
    { name: "Dwitiya Shukla-Paksha", sub: "Till 12:05 PM", paksha: "Shukla-Paksha", month: "Magha", season: "Hemant Season" },
    { name: "Tritiya Shukla-Paksha", sub: "Till 01:10 PM", paksha: "Shukla-Paksha", month: "Magha", season: "Hemant Season" },
  ];

  const nakshatras = [
    { name: "Punarvasu", sub: "Till 3:12 PM" },
    { name: "Pushya", sub: "Till 4:40 PM" },
    { name: "Ashlesha", sub: "Till 5:15 PM" },
    { name: "Magha", sub: "Till 6:30 PM" },
    { name: "Purva Phalguni", sub: "Till 7:20 PM" },
  ];

  const yogas = [
    { name: "Vaidhriti", sub: "Till 1:48 AM" },
    { name: "Vishkumbha", sub: "Till 12:50 AM" },
    { name: "Preeti", sub: "Till 11:35 PM" },
    { name: "Ayushman", sub: "Till 10:12 PM" },
  ];

  const karanas = [
    { name: "Kaulav", sub: "Till 12:33 PM" },
    { name: "Taitila", sub: "Till 11:45 AM" },
    { name: "Garaja", fill: "Till 01:12 PM" },
    { name: "Vanija", sub: "Till 02:40 PM" },
  ];

  const tithiIdx = Math.abs(offset) % tithis.length;
  const nakIdx = Math.abs(offset) % nakshatras.length;
  const yogaIdx = Math.abs(offset) % yogas.length;
  const karIdx = Math.abs(offset) % karanas.length;

  const t = tithis[tithiIdx];
  const n = nakshatras[nakIdx];
  const y = yogas[yogaIdx];
  const k = karanas[karIdx];

  // Specific dates for upcoming festivals based on January 2026
  const festivals = offset === 0 ? ["Ishti", "Magha Begins * North"] : [`Sankalpa Puja Day ${Math.abs(offset)}`, `Celestial Alignment Event`];

  return {
    dateLabel: formattedDate,
    tithi: t.name,
    tithiSub: t.sub,
    paksha: t.paksha,
    month: t.month,
    season: t.season,
    nakshatra: n.name,
    nakshatraSub: n.sub,
    yoga: y.name,
    yogaSub: y.sub,
    karana: k.name,
    karanaSub: k.sub,
    festivals: festivals,
    sunrise: offset % 2 === 0 ? "6:45 AM" : "6:46 AM",
    sunset: offset % 2 === 0 ? "5:22 PM" : "5:23 PM",
    moonrise: offset % 2 === 0 ? "6:25 PM" : "6:32 PM",
    moonset: offset % 2 === 0 ? "7:36 AM" : "7:45 AM",
    sunSign: offset % 2 === 0 ? "Sagittarius" : "Capricorn",
    moonSign: offset % 2 === 0 ? "Gemini" : "Cancer",
    direction: offset % 2 === 0 ? "WEST" : "NORTH",
    abhijit: offset % 2 === 0 ? "11:43 AM - 12:25 PM" : "11:40 AM - 12:22 PM",
    rahu: offset % 2 === 0 ? "4:03 PM - 5:22 PM" : "4:05 PM - 5:25 PM",
    gulika: offset % 2 === 0 ? "2:43 PM - 4:03 PM" : "2:45 PM - 4:05 PM",
    yamaghant: offset % 2 === 0 ? "12:04 PM - 1:23 PM" : "12:06 PM - 1:25 PM",
  };
};

const STYLES = `
  .dq-root {
    --ink: #2B2340;
    --purple: #5B2A86;
    --orange: #E8703A;
    --cream: #FBF3E3;
    --line: #EDE6D8;
    font-family: 'Poppins', 'Inter', sans-serif;
    background: #FDFBF7;
    color: var(--ink);
  }
  .gold-plate-card {
    border: 2px solid #E5C38D;
background-image: url('/assets/img/bg/panchang_hero_bg.png');
    background-size: cover;
    background-position: center right;
    box-shadow: 0 12px 36px rgba(229, 195, 141, 0.16);
  }
  .serif-heading {
    font-family: 'Playfair Display', 'Georgia', 'Times New Roman', serif;
  }
  .ornament-line {
    position: relative;
    height: 16px;
    background-image: radial-gradient(circle, #D4AF37 2.5px, transparent 3.5px);
    background-size: 16px 16px;
    background-position: center;
  }
  .ornament-line::before, .ornament-line::after {
    content: "";
    position: absolute;
    top: 7px;
    height: 1px;
    width: 38%;
    background: linear-gradient(to right, transparent, #D4AF37 50%, transparent);
  }
  .ornament-line::before { left: 4%; }
  .ornament-line::after { right: 4%; }

  /* Compact Footer spacing overrides */
  .footer-diviniq-final {
    margin-top: 1.5rem !important;
    padding-top: 2.5rem !important;
    padding-bottom: 1.5rem !important;
  }
  .footer-diviniq-final .mb-80 {
    margin-bottom: 2rem !important;
  }
  .footer-diviniq-final .pb-60 {
    padding-bottom: 1.5rem !important;
  }
  .footer-diviniq-final .mt-100 {
    margin-top: 2rem !important;
  }
  .footer-diviniq-final .pt-40 {
    padding-top: 1rem !important;
  }

  /* =========================================================
     RESPONSIVE ENHANCEMENTS (added — no existing rules changed)
     ========================================================= */

  /* Prevent horizontal scroll from the decorative absolutely
     positioned diyas/lotus flowers on narrow viewports */
  .dq-root {
    overflow-x: hidden;
  }

  @media (max-width: 640px) {
    .gold-plate-card {
      background-position: center;
    }
  }

  @media (max-width: 480px) {
    .serif-heading {
      line-height: 1.15;
    }
    .ornament-line {
      height: 12px;
    }
  }

  @media (max-width: 380px) {
    .gold-plate-card {
      padding-left: 16px !important;
      padding-right: 16px !important;
    }
  }

  /* ---- Hero banner: extra mobile refinements ---- */
  @media (max-width: 640px) {
    .gold-plate-card {
      padding-top: 24px !important;
      padding-bottom: 24px !important;
      gap: 24px !important;
    }
    .gold-plate-card h1 {
      font-size: 2.1rem !important;
      line-height: 1.15 !important;
    }
    .gold-plate-card > div:nth-child(2) {
      width: 220px !important;
      height: 190px !important;
    }
  }

  @media (max-width: 420px) {
    .gold-plate-card h1 {
      font-size: 1.8rem !important;
    }
    .gold-plate-card > div:nth-child(2) {
      width: 190px !important;
      height: 170px !important;
    }
  }

  @media (max-width: 640px) {
    .gold-plate-card > div:first-child {
      margin-bottom: 4px;
    }
    .gold-plate-card > div:nth-child(2) {
      margin-top: 6px;
    }
  }

  /* ---- Reduce overall banner height (tablet/desktop) ---- */
  .gold-plate-card {
    padding-top: 20px !important;
    padding-bottom: 20px !important;
  }
  @media (min-width: 641px) {
    .gold-plate-card {
      gap: 24px !important;
    }
    .gold-plate-card h1 {
      font-size: 2.75rem !important;
      line-height: 1.1 !important;
    }
    .gold-plate-card > div:nth-child(2) {
      height: 200px !important;
    }
  }
  @media (min-width: 1024px) {
    .gold-plate-card h1 {
      font-size: 3.1rem !important;
    }
    .gold-plate-card > div:nth-child(2) {
      height: 210px !important;
    }
  }

  /* ---- Date navigation bar & location pill ---- */
  @media (max-width: 480px) {
    .dq-date-label {
      font-size: 13px !important;
      line-height: 1.3;
    }
    .dq-location-pill {
      width: 100%;
      justify-content: center;
    }
    .dq-location-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 180px;
    }
  }
  @media (max-width: 360px) {
    .dq-location-text {
      max-width: 130px;
    }
  }

  /* ---- Hero banner: full-bleed on mobile ---- */
  @media (max-width: 768px) {
    .dq-hero-section {
      max-width: 100% !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    .dq-hero-section .gold-plate-card,
    .dq-hero-section .puja-hero-card {
      border-radius: 0 !important;
    }
  }

  /* ---- New "Explore Sacred Panchang" hero banner ---- */
  .puja-hero-card {
    background-image: url('/assets/img/bg/panchang_hero_bg.png');
    background-size: cover;
    background-position: center;
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .puja-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      100deg,
      rgba(15, 3, 8, 0.94) 0%,
      rgba(15, 3, 8, 0.75) 35%,
      rgba(15, 3, 8, 0.35) 65%,
      rgba(15, 3, 8, 0.1) 90%
    );
  }
  .puja-hero-badge {
    transition: background 0.18s ease, transform 0.18s ease;
  }
  .puja-hero-badge:hover {
    background: rgba(0, 0, 0, 0.45);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    .puja-hero-overlay {
      background: linear-gradient(
        180deg,
        rgba(15, 3, 8, 0.55) 0%,
        rgba(15, 3, 8, 0.85) 55%,
        rgba(15, 3, 8, 0.96) 100%
      );
    }
  }
  @media (max-width: 480px) {
    .puja-hero-badges {
      gap: 8px !important;
      padding-left: 16px !important;
      padding-right: 16px !important;
      padding-top: 4px !important;
      padding-bottom: 24px !important;
    }
    .puja-hero-badge {
      padding: 6px 10px !important;
    }
    .puja-hero-badge span:last-child {
      font-size: 10px !important;
    }
  }
`;

export default function PanchangPage() {
  const [dayOffset, setDayOffset] = useState(0);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isStylesReady, setIsStylesReady] = useState(false);

  // Dynamic Tailwind loader
  useEffect(() => {
    // If a previous mount already loaded the CDN script, Tailwind is
    // already active — don't show the loading state again.
    if (window.tailwind) {
      setIsStylesReady(true);
    }

    const existing = document.getElementById("tailwind-cdn-script");
    if (existing) {
      setIsStylesReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.tailwindcss.com";
    script.id = "tailwind-cdn-script";
    script.onload = () => {
      if (window.tailwind) {
        window.tailwind.config = {
          corePlugins: {
            preflight: false, // Prevents Tailwind reset from overriding site Bootstrap/global styles
          }
        };
      }
      setIsStylesReady(true);
    };
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById("tailwind-cdn-script");
      if (el) document.head.removeChild(el);

      // Cleanup styles injected by Tailwind Play CDN
      const styleTags = document.querySelectorAll("style");
      styleTags.forEach((s) => {
        if (s.textContent && (s.textContent.includes("tailwindcss") || s.textContent.includes("--tw-"))) {
          s.remove();
        }
      });
    };
  }, []);

  const d = getPanchangData(dayOffset);

  // Show a minimal, dependency-free loading state while Tailwind's CDN
  // script is still loading — this is what was causing the broken/
  // overlapping mobile layout (utility classes with no CSS applied yet).
  if (!isStylesReady) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          color: "#9a7b2f",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "3px solid #EDE6D8",
            borderTopColor: "#E8703A",
            animation: "dq-spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes dq-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="dq-root min-h-screen">
      <style>{STYLES}</style>

      {/* Standard Layout Menus */}
      <SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
      <PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />

      {/* Global Header */}
      <Header
        onMenuToggle={() => setShowMobileMenu(true)}
        onSideMenuToggle={() => setShowSideMenu(true)}
        onSearchToggle={() => setShowSearch(true)}
        onLoginClick={() => setShowLoginModal(true)}
      />

      {/* Space to separate from sticky header */}
      <div className="h-6"></div>

      {/* ==========================================
          1. HERO DAILY PANCHANG BANNER
          ========================================== */}
      <section className="dq-hero-section max-w-6xl mx-auto px-4 md:px-6 mb-6">
        <div className="puja-hero-card rounded-[24px] relative overflow-hidden">
          <div className="puja-hero-overlay"></div>

          {/* Text block */}
          <div className="relative z-10 px-6 pt-8 pb-4 md:px-12 md:pt-12 md:pb-6 max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-4 bg-white/10 text-orange-300 border border-white/20 backdrop-blur-sm">
              <Sun size={12} className="text-orange-400" /> Daily Panchang
            </span>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white serif-heading">
              Explore
              <span className="block text-orange-500">Sacred Panchang</span>
            </h1>
            <p className="mt-3 text-sm md:text-base text-gray-200 max-w-md font-medium">
              Discover today's auspicious timings and Vedic wisdom, guided by ancient tradition for a better tomorrow.
            </p>
          </div>

          {/* Badge row */}
          <div className="puja-hero-badges relative z-10 flex flex-wrap gap-3 px-6 pb-6 md:px-12 md:pb-8">
            {[
              // { icon: Sunrise, label: "Authentic Vedic Data" },
              // { icon: Clock, label: "Accurate Timings" },
              // { icon: Sparkles, label: "Trusted by Millions" },
              // { icon: Compass, label: "Guidance for Every Moment" },
            ].map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="puja-hero-badge flex items-center gap-2 px-3 py-2 rounded-full bg-black/30 border border-white/15 backdrop-blur-sm">
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-orange-400 flex-shrink-0">
                    <Icon size={13} />
                  </span>
                  <span className="text-[11px] md:text-xs font-semibold text-white whitespace-nowrap">{b.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          2. DATE NAVIGATION & LOCATION BAR
          ========================================== */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 mb-6">
        <div className="bg-white rounded-2xl border border-[#EDE6D8] p-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">

          {/* Date Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <button
              onClick={() => setDayOffset(d => d - 1)}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-[#EDE6D8] bg-white hover:bg-[#FBF3E3] transition-colors"
              aria-label="Previous Day"
            >
              <ChevronLeft size={18} className="text-gray-700" />
            </button>
            <div className="h-8 w-px bg-[#EDE6D8] hidden sm:block"></div>

            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
                <Calendar size={18} />
              </div>
              <div>
                <h2 className="dq-date-label text-base md:text-lg font-bold text-gray-800 tracking-tight">{d.dateLabel}</h2>
                <p className="text-xs text-orange-600 font-semibold">{d.tithiSub}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-[#EDE6D8] hidden sm:block"></div>
            <button
              onClick={() => setDayOffset(d => d + 1)}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-[#EDE6D8] bg-white hover:bg-[#FBF3E3] transition-colors"
              aria-label="Next Day"
            >
              <ChevronRight size={18} className="text-gray-700" />
            </button>
          </div>

          {/* Location Selector */}
          <div className="dq-location-pill flex items-center gap-2 bg-[#FBF3E3] border border-[#EDE6D8] px-4 py-2.5 rounded-full shadow-sm cursor-pointer hover:bg-[#F5EAD4] transition-colors self-center">
            <MapPin size={15} className="text-orange-600 fill-orange-100 flex-shrink-0" />
            <span className="dq-location-text text-xs md:text-sm font-semibold text-gray-700">Lucknow, Uttar Pradesh, IN</span>
            <ChevronDown size={14} className="text-gray-500 ml-1 flex-shrink-0" />
          </div>

        </div>
      </section>

      {/* ==========================================
          3. MAIN LAYOUT CONTENT (ROW-BASED GRIDS)
          ========================================== */}
      {/* Section 1: Panchang Elements + Today's Festivals */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Panchang Elements Card */}
          <div className="bg-white rounded-2xl border border-[#EDE6D8] p-6 shadow-sm h-full">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#EDE6D8]">
              <Calendar size={18} className="text-orange-500" />
              <h3 className="text-base md:text-lg font-bold text-gray-800">Panchang Elements</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              {[
                { label: "TITHI", value: d.tithi, sub: d.tithiSub, icon: Sunrise, color: "bg-[#F4623A] text-white" },
                { label: "KARANA", value: d.karana, sub: d.karanaSub, icon: Sparkles, color: "bg-[#2FA84F] text-white" },
                { label: "NAKSHATRA", value: d.nakshatra, sub: d.nakshatraSub, icon: Star, color: "bg-[#8A4FE0] text-white" },
                { label: "PAKSHA", value: d.paksha, sub: d.season, icon: Moon, color: "bg-[#3B7FE0] text-white" },
                { label: "YOGA", value: d.yoga, sub: d.yogaSub, icon: Wind, color: "bg-[#2D8FE0] text-white" },
                { label: "MONTH", value: d.month, sub: d.season, icon: Calendar, color: "bg-[#E0508F] text-white" },
              ].map((el, i) => {
                const Icon = el.icon;
                return (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 rounded-xl px-2 transition-colors">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${el.color}`}>
                      <Icon size={15} />
                    </div>
                    <div>
                      <span className="text-[10px] md:text-[11px] font-bold tracking-wider text-gray-400 uppercase">{el.label}</span>
                      <h4 className="text-sm md:text-base font-bold text-gray-800 leading-tight mt-0.5">{el.value}</h4>
                      {el.sub && <span className="text-xs text-gray-500 font-medium">{el.sub}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          {/* Today's Festivals Card */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#FFF0F5] to-[#FFF5EE] border border-[#EDE6D8] shadow-sm h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-pink-100">
                <Crown size={18} className="text-pink-600" />
                <h3 className="text-base md:text-lg font-bold text-gray-800">Today's Festivals</h3>
              </div>
              <div className="space-y-3">
                {d.festivals.map((fest, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 shadow-2xs border border-pink-100/30 flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600 flex-shrink-0 animate-pulse"></span>
                    <span className="text-xs md:text-sm font-semibold text-gray-700">{fest}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Sun & Moon Timings + Upcoming Festivals */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sun Timings Card */}
          <div className="rounded-2xl p-6 relative overflow-hidden border border-[#EDE6D8] bg-gradient-to-br from-[#FFF8EC] to-[#FFE9CC] shadow-sm flex flex-col justify-between h-full min-h-[190px]">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-orange-500">
                  <Sun size={16} className="fill-orange-400" />
                </div>
                <h4 className="text-sm md:text-base font-bold text-gray-800">Sun Timings</h4>
              </div>
              <div className="flex justify-between items-center z-10 relative">
                <div>
                  <span className="text-xs text-gray-500 font-medium">Sunrise</span>
                  <p className="text-lg md:text-xl font-black text-orange-600 mt-0.5">{d.sunrise}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium">Sunset</span>
                  <p className="text-lg md:text-xl font-black text-orange-600 mt-0.5">{d.sunset}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs md:text-sm font-semibold text-gray-700 z-10 relative">
              Sun Sign: <span className="text-orange-600">{d.sunSign}</span>
            </div>
            <svg viewBox="0 0 300 60" className="absolute bottom-0 left-0 w-full h-auto opacity-10 pointer-events-none fill-orange-500 z-0">
              <path d="M0,60 C40,45 80,45 120,55 C160,65 200,60 240,40 C280,20 300,30 320,60 Z" />
            </svg>
          </div>

          {/* Moon Timings Card */}
          <div className="rounded-2xl p-6 relative overflow-hidden border border-[#EDE6D8] bg-gradient-to-br from-[#EEF2FF] to-[#DCE4FF] shadow-sm flex flex-col justify-between h-full min-h-[190px]">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-indigo-500">
                  <Moon size={16} className="fill-indigo-400" />
                </div>
                <h4 className="text-sm md:text-base font-bold text-gray-800">Moon Timings</h4>
              </div>
              <div className="flex justify-between items-center z-10 relative">
                <div>
                  <span className="text-xs text-gray-500 font-medium">Moonrise</span>
                  <p className="text-lg md:text-xl font-black text-indigo-600 mt-0.5">{d.moonrise}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-medium">Moonset</span>
                  <p className="text-lg md:text-xl font-black text-indigo-600 mt-0.5">{d.moonset}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-xs md:text-sm font-semibold text-gray-700 z-10 relative">
              Moon Sign: <span className="text-indigo-600">{d.moonSign}</span>
            </div>
            <svg viewBox="0 0 300 60" className="absolute bottom-0 left-0 w-full h-auto opacity-10 pointer-events-none fill-indigo-500 z-0">
              <path d="M0,50 Q60,35 120,48 T240,30 Q280,30 300,50 L300,60 L0,60 Z" />
            </svg>
          </div>
        </div>

        <div>
          {/* Upcoming Festivals Card */}
          <div className="bg-white rounded-2xl border border-[#EDE6D8] p-6 shadow-sm h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-[#EDE6D8]">
                <Calendar size={18} className="text-orange-500" />
                <h3 className="text-base md:text-lg font-bold text-gray-800">Upcoming Festivals</h3>
              </div>

              <div className="space-y-1">
                {[
                  { name: "Sakat Chauth", date: "6 January" },
                  { name: "Sankashti Chaturthi", date: "6 January" },
                  { name: "Kalashtami", date: "10 January" },
                  { name: "Lohri", date: "14 January" },
                  { name: "Makara Sankranti", date: "15 January" },
                  { name: "Pongal", date: "15 January" },
                ].map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-b-0">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-xs md:text-sm font-semibold text-gray-700">{it.name}</span>
                    </div>
                    <span className="text-xs text-orange-500 font-bold bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100/50">{it.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full mt-4 py-2.5 rounded-full text-xs md:text-sm font-bold flex items-center justify-center gap-2 bg-[#FFF9F2] text-orange-600 border border-orange-200 hover:bg-orange-50 transition-colors shadow-2xs">
              <Calendar size={15} /> View Full Calendar
            </button>
          </div>
        </div>
      </section>

      {/* Section 3: Auspicious & Inauspicious Timings + Additional Details */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Auspicious & Inauspicious Timings Card */}
          <div className="bg-white rounded-2xl border border-[#EDE6D8] p-6 shadow-sm h-full">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#EDE6D8]">
              <Clock size={18} className="text-orange-500" />
              <h3 className="text-base md:text-lg font-bold text-gray-800">Auspicious & Inauspicious Timings</h3>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl px-5 py-4 flex items-center justify-between bg-emerald-50/70 border border-emerald-100/50 shadow-xs relative overflow-hidden">
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-emerald-700 tracking-wider">ABHIJIT MUHURAT</h4>
                  <span className="text-[11px] text-gray-500 font-semibold mt-0.5 block">Most Auspicious Time</span>
                </div>
                <span className="text-sm md:text-base font-extrabold text-emerald-700 z-10">{d.abhijit}</span>
                <div className="absolute right-0 top-0 bottom-0 opacity-10 w-24 flex items-center justify-center">
                  <svg width="60" height="60" viewBox="0 0 100 100" className="fill-emerald-800">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
                    <path d="M50,10 L50,90 M10,50 L90,50 M20,20 L80,80 M20,80 L80,20" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              <div className="rounded-xl px-5 py-4 bg-red-50/60 border border-red-100/50 shadow-xs">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-red-100/50">
                  <AlertTriangle size={15} className="text-red-500" />
                  <span className="text-xs font-bold text-red-600 tracking-wider">INAUSPICIOUS TIMINGS</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Rahu Kaal", val: d.rahu },
                    { label: "Gulika Kaal", val: d.gulika },
                    { label: "Yamaghant Kaal", val: d.yamaghant }
                  ].map((it, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-[11px] font-semibold text-gray-500">{it.label}</span>
                      <span className="text-sm font-extrabold text-red-600 mt-0.5">{it.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl px-5 py-4 flex items-center justify-between bg-amber-50/70 border border-amber-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xs text-amber-600">
                    <Compass size={17} />
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-amber-700 tracking-wider">Disha Shool</h4>
                    <span className="text-[11px] text-gray-500 font-semibold block mt-0.5">Avoid travel in this direction</span>
                  </div>
                </div>
                <span className="text-sm md:text-base font-extrabold text-amber-700 bg-white px-4 py-1.5 rounded-full border border-amber-100 shadow-2xs">
                  {d.direction}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* Additional Details Card */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#F5F2FC] to-[#ECE6FA] border border-[#EDE6D8] shadow-sm h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-purple-100">
                <Sparkles size={18} className="text-purple-600" />
                <h3 className="text-base md:text-lg font-bold text-gray-800">Additional Details</h3>
              </div>

              <div className="space-y-1">
                {[
                  { label: "Moon Placement", value: d.direction, icon: Moon },
                  { label: "Season", value: "Hemant", icon: Wind },
                  { label: "Sun Sign", value: d.sunSign, icon: Sun },
                  { label: "Moon Sign", value: d.moonSign, icon: Sparkles }
                ].map((r, i) => {
                  const Icon = r.icon;
                  return (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-purple-100/50 last:border-b-0">
                      <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-600">
                        <Icon size={14} className="text-purple-600" />
                        <span>{r.label}</span>
                      </div>
                      <span className="text-xs md:text-sm font-bold text-gray-800">{r.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: What is Panchang (Full Width) */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 mb-8">
        {/* What is Panchang Explanation Card */}
        <div className="bg-white rounded-2xl border border-[#EDE6D8] p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-600 border border-amber-100">
            <Flower2 className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-extrabold text-gray-800 mb-2.5">What is Panchang?</h3>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium">
              A Panchang is a Hindu calendar that provides details about important celestial occurrences and their influence on life.
              The term "Panchang" is derived from the Sanskrit words <span className="font-semibold text-orange-600">Pancha (five)</span> and <span className="font-semibold text-orange-600">Anga (limb)</span>, meaning "five limbs" or components.
              These five elements - Tithi (Lunar Day), Vara (Day of the Week), Nakshatra (Constellation), Yoga (Auspicious Combination), and Karana (Half of a Tithi) - help determine the most auspicious or inauspicious timings for daily life activities, ceremonies, and rituals.
            </p>
          </div>
          <div className="flex-shrink-0 w-48 md:w-56 flex items-center justify-center">
            <Kalash size={150} />
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <Footer />

      {/* Back to top scroll button */}
      <a
        href="#top"
        className="fixed bottom-6 right-6 w-11 h-11 rounded-full flex items-center justify-center z-50 shadow-lg bg-orange-600 hover:bg-orange-700 transition-transform active:scale-95"
        aria-label="Back to top"
      >
        <ArrowUp size={18} color="#fff" />
      </a>
    </div>
  );
}