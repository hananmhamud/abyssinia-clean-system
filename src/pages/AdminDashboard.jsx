import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/logo.png";
import telebirrLogo from "../assets/telebirr-logo.png";
import cbeLogo from "../assets/cbe-logo.png";
import chapaLogo from "../assets/chapa-logo.png";

/*
  AbyssiniaClean - Admin Dashboard
  Principal UI/UX Architect + Senior React Engineer refactor.

  Design goals:
  - Premium light SaaS dashboard.
  - Split operational sidebar / main workspace.
  - No nested Router.
  - No unbalanced JSX fragments.
  - Search and pagination are fully functional.
  - Booking edit, payment edit, cleaner edit/add, settings,
    notifications, SMS simulation and inventory interactions.
  - Workforce is a dedicated navigation destination with synchronized staff and payroll.
*/

const PAGE_SIZE = 5;
const ADMIN_EMAIL = "hananbereka2025@gmail.com";
const API_BASE = "http://localhost:5000/api";

const INITIAL_BOOKINGS = [
  {
    id: 7,
    customer: "Hanan Mahmud",
    email: "hananbereka2025@gmail.com",
    phone: "+251911000001",
    service: "Post-Construction Cleaning",
    price: 6754,
    status: "Completed",
    paymentStatus: "Paid",
    paymentMethod: "CBE Bank",
    assignedCleaner: "Selam Tesfaye",
    date: "2026-09-01",
    instructions: "Clean inside the fridge",
    vip: true,
    location: "Addis Ababa",
  },
  {
    id: 5,
    customer: "Meron Alemu",
    email: "meron.alemu@gmail.com",
    phone: "+251911000002",
    service: "Office Cleaning",
    price: 2500,
    status: "Completed",
    paymentStatus: "Paid",
    paymentMethod: "Telebirr",
    assignedCleaner: "Dawit Bekele",
    date: "2026-08-28",
    instructions: "Focus on conference rooms.",
    vip: true,
    location: "Bole",
  },
  {
    id: 10,
    customer: "Abel Tesfaye",
    email: "abel.tesfaye@gmail.com",
    phone: "+251911000003",
    service: "Home Cleaning",
    price: 1500,
    status: "Pending",
    paymentStatus: "Unpaid",
    paymentMethod: "Chapa",
    assignedCleaner: "Dawit Bekele",
    date: "2026-09-02",
    instructions: "Dog on premises.",
    vip: false,
    location: "Kazanchis",
  },
  {
    id: 4,
    customer: "Sara Mohammed",
    email: "sara.mohammed@gmail.com",
    phone: "+251911000004",
    service: "Carpet Cleaning",
    price: 900,
    status: "Cancelled",
    paymentStatus: "Unpaid",
    paymentMethod: "Telebirr",
    assignedCleaner: "Lidya Abebe",
    date: "2026-08-20",
    instructions: "Large living-room carpet.",
    vip: false,
    location: "Gerji",
  },
  {
    id: 6,
    customer: "Dawit Girma",
    email: "dawit.girma@gmail.com",
    phone: "+251911000005",
    service: "Window Cleaning",
    price: 700,
    status: "Completed",
    paymentStatus: "Paid",
    paymentMethod: "CBE Bank",
    assignedCleaner: "Selam Tesfaye",
    date: "2026-08-18",
    instructions: "High exterior windows.",
    vip: false,
    location: "CMC",
  },
  {
    id: 8,
    customer: "Liya Worku",
    email: "liya.worku@gmail.com",
    phone: "+251911000006",
    service: "Home Cleaning",
    price: 1200,
    status: "Cancelled",
    paymentStatus: "Unpaid",
    paymentMethod: "Chapa",
    assignedCleaner: "Lidya Abebe",
    date: "2026-08-12",
    instructions: "Kitchen requires extra attention.",
    vip: false,
    location: "Sarbet",
  },
  {
    id: 9,
    customer: "Nahom Bekele",
    email: "nahom.bekele@gmail.com",
    phone: "+251911000007",
    service: "Office Cleaning",
    price: 1800,
    status: "Cancelled",
    paymentStatus: "Unpaid",
    paymentMethod: "Telebirr",
    assignedCleaner: "Dawit Bekele",
    date: "2026-08-10",
    instructions: "Reception area and desks.",
    vip: false,
    location: "Mexico",
  },
  {
    id: 3,
    customer: "Bethel Abraham",
    email: "bethel.abraham@gmail.com",
    phone: "+251911000008",
    service: "Carpet Cleaning",
    price: 850,
    status: "Cancelled",
    paymentStatus: "Unpaid",
    paymentMethod: "CBE Bank",
    assignedCleaner: "Lidya Abebe",
    date: "2026-08-05",
    instructions: "Remove coffee stains.",
    vip: false,
    location: "Old Airport",
  },
  {
    id: 2,
    customer: "Mekdes Tadesse",
    email: "mekdes.tadesse@gmail.com",
    phone: "+251911000009",
    service: "Home Cleaning",
    price: 1300,
    status: "Cancelled",
    paymentStatus: "Unpaid",
    paymentMethod: "Chapa",
    assignedCleaner: "Selam Tesfaye",
    date: "2026-07-30",
    instructions: "Clean bedrooms and bathrooms.",
    vip: false,
    location: "Yeka",
  },
  {
    id: 1,
    customer: "Samuel Kassa",
    email: "samuel.kassa@gmail.com",
    phone: "+251911000010",
    service: "Window Cleaning",
    price: 650,
    status: "Cancelled",
    paymentStatus: "Unpaid",
    paymentMethod: "Telebirr",
    assignedCleaner: "Dawit Bekele",
    date: "2026-07-25",
    instructions: "Exterior glass cleaning.",
    vip: false,
    location: "Lideta",
  },
];

const INITIAL_CLEANERS = [
  { id: 1, name: "Selam Tesfaye", initial: "S", specialty: "Home Cleaners", role: "Cleaning Specialist", status: "Available", shift: "Morning" },
  { id: 2, name: "Dawit Bekele", initial: "D", specialty: "Office Cleaners", role: "Senior Cleaner", status: "On Job", shift: "Full Day" },
  { id: 3, name: "Lidya Abebe", initial: "L", specialty: "Carpet Cleaners", role: "Cleaning Specialist", status: "Available", shift: "Afternoon" },
  { id: 4, name: "Mulugeta Kebede", initial: "M", specialty: "Window Cleaners", role: "Window Specialist", status: "On Job", shift: "Morning" },
  { id: 5, name: "Rahel Getachew", initial: "R", specialty: "Home Cleaners", role: "Cleaning Specialist", status: "Available", shift: "Morning" },
  { id: 6, name: "Yonas Alemu", initial: "Y", specialty: "Office Cleaners", role: "Senior Cleaner", status: "On Job", shift: "Full Day" },
  { id: 7, name: "Abebe Tadesse", initial: "A", specialty: "Window Cleaners", role: "Window Specialist", status: "On Job", shift: "Morning" },
  { id: 8, name: "Meron Worku", initial: "M", specialty: "Window Cleaners", role: "Window Specialist", status: "On Job", shift: "Afternoon" },
  { id: 9, name: "Kalkidan Alemu", initial: "K", specialty: "Window Cleaners", role: "Window Specialist", status: "On Job", shift: "Full Day" },
  { id: 10, name: "Biniam Tesfaye", initial: "B", specialty: "Window Cleaners", role: "Window Specialist", status: "On Job", shift: "Morning" },
  { id: 11, name: "Yared Bekele", initial: "Y", specialty: "Window Cleaners", role: "Window Specialist", status: "Available", shift: "Afternoon" },
  { id: 12, name: "Hirut Demissie", initial: "H", specialty: "Window Cleaners", role: "Window Specialist", status: "Available", shift: "Full Day" },
  { id: 13, name: "Natnael Girma", initial: "N", specialty: "Carpet Cleaners", role: "Cleaning Specialist", status: "On Job", shift: "Morning" },
  { id: 14, name: "Mekdes Fikre", initial: "M", specialty: "Carpet Cleaners", role: "Cleaning Specialist", status: "On Job", shift: "Afternoon" },
  { id: 15, name: "Bethel Haile", initial: "B", specialty: "Carpet Cleaners", role: "Cleaning Specialist", status: "On Job", shift: "Full Day" },
  { id: 16, name: "Fitsum Kebede", initial: "F", specialty: "Carpet Cleaners", role: "Cleaning Specialist", status: "On Job", shift: "Morning" },
  { id: 17, name: "Saron Desta", initial: "S", specialty: "Carpet Cleaners", role: "Cleaning Specialist", status: "Available", shift: "Afternoon" },
  { id: 18, name: "Henok Tadesse", initial: "H", specialty: "Carpet Cleaners", role: "Cleaning Specialist", status: "Available", shift: "Full Day" },
  { id: 19, name: "Abel Mamo", initial: "A", specialty: "Office Cleaners", role: "Senior Cleaner", status: "On Job", shift: "Morning" },
  { id: 20, name: "Tigist Bekele", initial: "T", specialty: "Office Cleaners", role: "Senior Cleaner", status: "On Job", shift: "Afternoon" },
  { id: 21, name: "Samuel Girma", initial: "S", specialty: "Office Cleaners", role: "Senior Cleaner", status: "On Job", shift: "Full Day" },
  { id: 22, name: "Mimi Assefa", initial: "M", specialty: "Office Cleaners", role: "Senior Cleaner", status: "On Job", shift: "Morning" },
  { id: 23, name: "Bereket Hailu", initial: "B", specialty: "Office Cleaners", role: "Senior Cleaner", status: "On Job", shift: "Afternoon" },
  { id: 24, name: "Eden Alemu", initial: "E", specialty: "Office Cleaners", role: "Senior Cleaner", status: "On Job", shift: "Full Day" },
  { id: 25, name: "Nahom Tesfaye", initial: "N", specialty: "Office Cleaners", role: "Senior Cleaner", status: "Available", shift: "Morning" },
  { id: 26, name: "Marta Kassa", initial: "M", specialty: "Office Cleaners", role: "Senior Cleaner", status: "Available", shift: "Afternoon" },
  { id: 27, name: "Dani Gebre", initial: "D", specialty: "Office Cleaners", role: "Senior Cleaner", status: "Available", shift: "Full Day" },
  { id: 28, name: "Frehiwot Mekonnen", initial: "F", specialty: "Office Cleaners", role: "Senior Cleaner", status: "Available", shift: "Morning" },
  { id: 29, name: "Solomon Tadesse", initial: "S", specialty: "Office Cleaners", role: "Senior Cleaner", status: "Available", shift: "Afternoon" },
  { id: 30, name: "Hana Mohammed", initial: "H", specialty: "Home Cleaners", role: "Cleaning Specialist", status: "On Job", shift: "Morning" },
  { id: 31, name: "Yemane Worku", initial: "Y", specialty: "Home Cleaners", role: "Cleaning Specialist", status: "On Job", shift: "Afternoon" },
  { id: 32, name: "Almaz Bekele", initial: "A", specialty: "Home Cleaners", role: "Cleaning Specialist", status: "On Job", shift: "Full Day" },
  { id: 33, name: "Martha Tesfaye", initial: "M", specialty: "Home Cleaners", role: "Cleaning Specialist", status: "Available", shift: "Morning" },
  { id: 34, name: "Kidist Abebe", initial: "K", specialty: "Home Cleaners", role: "Cleaning Specialist", status: "Available", shift: "Afternoon" },
  { id: 35, name: "Robel Alemu", initial: "R", specialty: "Home Cleaners", role: "Cleaning Specialist", status: "Available", shift: "Full Day" },
];

const INVENTORY = [
  {
    id: 1,
    name: "Professional Carpet Extraction Vacuum",
    quantity: 8,
    unit: "units",
    level: "Healthy",
  },
  {
    id: 2,
    name: "Microfiber Antimicrobial Cloths",
    quantity: 240,
    unit: "packs",
    level: "Healthy",
  },
  {
    id: 3,
    name: "Eco-Friendly Non-Toxic Detergents",
    quantity: 74,
    unit: "bottles",
    level: "Healthy",
  },
  {
    id: 4,
    name: "Industrial High-Pressure Window Squeegees",
    quantity: 31,
    unit: "units",
    level: "Watch",
  },
  {
    id: 5,
    name: "Electrostatic Electro-Disinfectant Sprayers",
    quantity: 18,
    unit: "units",
    level: "Healthy",
  },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTHLY_BOOKINGS = [0, 0, 0, 0, 0, 0, 2, 4, 4, 0, 0, 0];

const SERVICE_DIVISIONS = [
  {
    name: "Window Cleaners",
    icon: "🪟",
    description: "Glass, exterior and high-window specialists.",
  },
  {
    name: "Home Cleaners",
    icon: "🏠",
    description: "Residential rooms, kitchens and bathrooms.",
  },
  {
    name: "Office Cleaners",
    icon: "🏢",
    description: "Corporate spaces, desks and meeting rooms.",
  },
  {
    name: "Carpet Cleaners",
    icon: "🧺",
    description: "Extraction, stain removal and carpet care.",
  },
];

const DEFAULT_SETTINGS = {
  baseTax: 15,
  automatedNotifications: true,
  cleanerScheduling: true,
  automaticSms: true,
  compactSidebar: false,
  showVipCustomers: true,
};

function readLocalStorage(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn(`Unable to read ${key}:`, error);
    return fallback;
  }
}

function Icon({ name, className = "h-5 w-5" }) {
  const common = {
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.8,
    stroke: "currentColor",
    className,
    "aria-hidden": "true",
  };

  const paths = {
    dashboard: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 13h6V4H4v9Zm10 7h6v-9h-6v9ZM4 20h6v-3H4v3Zm10-10h6V4h-6v6Z"
        />
      </>
    ),
    bookings: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3.75h10.5A2.25 2.25 0 0 1 19.5 6v12a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 18V6a2.25 2.25 0 0 1 2.25-2.25Z"
        />
        <path strokeLinecap="round" d="M8 8h8M8 12h8M8 16h4" />
      </>
    ),
    users: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
        />
      </>
    ),
    settings: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 15.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m19.4 15 .04.04a2 2 0 1 1-2.83 2.83l-.04-.04a2 2 0 0 0-3.41 1.42v.05a2 2 0 1 1-4 0v-.05a2 2 0 0 0-3.41-1.42l-.04.04a2 2 0 1 1-2.83-2.83l.04-.04A2 2 0 0 0 1.5 11.5v-.05a2 2 0 1 1 0-4h.05A2 2 0 0 0 2.97 4.04l-.04-.04a2 2 0 1 1 2.83-2.83l.04.04A2 2 0 0 0 9.21-.21h.05a2 2 0 1 1 4 0v.05a2 2 0 0 0 3.41 1.42l.04-.04a2 2 0 1 1 2.83 2.83l-.04.04A2 2 0 0 0 20.96 7.5h.05a2 2 0 1 1 0 4h-.05A2 2 0 0 0 19.4 15Z"
        />
      </>
    ),
    box: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 8.25 7.5-4 7.5 4m-15 0v7.5l7.5 4 7.5-4v-7.5m-15 0 7.5 4 7.5-4M12 12.25v7.5"
        />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path strokeLinecap="round" d="m16 16 4 4" />
      </>
    ),
    bell: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"
        />
      </>
    ),
    logout: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 17l5-5-5-5M15 12H3M21 5v14a2 2 0 0 1-2 2h-5"
        />
      </>
    ),
    edit: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m16.86 4.49 2.65 2.65M4 20l4.2-.9L19.5 7.8a1.88 1.88 0 0 0-2.65-2.65L5.55 16.45 4 20Z"
        />
      </>
    ),
    plus: (
      <>
        <path strokeLinecap="round" d="M12 5v14M5 12h14" />
      </>
    ),
    chart: (
      <>
        <path strokeLinecap="round" d="M4 19V5M4 19h16" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m7 15 3-4 3 2 4-6"
        />
      </>
    ),
    close: (
      <>
        <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
      </>
    ),
    check: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m5 12 4 4L19 6"
        />
      </>
    ),
    arrowLeft: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </>
    ),
    arrowRight: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
      </>
    ),
    filter: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M10 18h4" />
      </>
    ),
    phone: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.5 3.75h3l1.2 4-1.75 1.75a13.4 13.4 0 0 0 5.55 5.55l1.75-1.75 4 1.2v3c0 1.1-.9 2-2 2C11.5 19.5 4.5 12.5 4.5 5.75c0-1.1.9-2 2-2Z"
        />
      </>
    ),
    card: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path strokeLinecap="round" d="M3 10h18M7 15h3" />
      </>
    ),
    moon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.5 15.25A8.75 8.75 0 0 1 8.75 3.5 8.75 8.75 0 1 0 20.5 15.25Z"
        />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="3.5" />
        <path
          strokeLinecap="round"
          d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"
        />
      </>
    ),
  };

  return <svg {...common}>{paths[name] || paths.dashboard}</svg>;
}

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-yellow-400/15 text-yellow-700 border-yellow-400/20",
    Confirmed: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    Completed: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    Cancelled: "bg-red-500/10 text-red-700 border-red-500/20",
    Paid: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    Unpaid: "bg-red-500/10 text-red-700 border-red-500/20",
    Available: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    "On Job": "bg-yellow-400/15 text-yellow-700 border-yellow-400/20",
    Healthy: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    Watch: "bg-yellow-400/15 text-yellow-700 border-yellow-400/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${
        styles[status] || "border-slate-200 bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}


function PaymentLogo({ method, compact = false }) {
  const normalized = String(method || "").toLowerCase();
  const sizeClass = compact ? "h-8 w-8" : "h-12 w-12";

  let image = chapaLogo;
  let label = "Chapa";

  if (normalized.includes("cbe")) {
    image = cbeLogo;
    label = "CBE";
  } else if (normalized.includes("telebirr")) {
    image = telebirrLogo;
    label = "Telebirr";
  }

  return (
    <div
      className={`flex ${sizeClass} items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100`}
      aria-label={`${label} logo`}
      title={label}
    >
      <img
        src={image}
        alt={`${label} logo`}
        className="h-full w-full object-contain p-0.5"
      />
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-emerald-300"
    >
      <span className="text-sm font-bold text-slate-800">{label}</span>
      <span
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "bg-emerald-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function AnalyticsChart({ bookings = [] }) {
  const barColors = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#84cc16", "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#22c55e"];
  // The chart is driven by real booking dates. Months with no bookings remain at zero.
  const monthlyValues = MONTHS.map((_, monthIndex) =>
    bookings.filter((booking) => {
      const date = new Date(`${booking.date}T00:00:00`);
      return !Number.isNaN(date.getTime()) && date.getMonth() === monthIndex;
    }).length
  );
  const maxValue = Math.max(5, ...monthlyValues);
  const width = 900;
  const height = 320;
  const paddingX = 48;
  const paddingTop = 24;
  const paddingBottom = 54;
  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = width - paddingX * 2;
  const columnWidth = chartWidth / MONTHS.length;
  const barWidth = Math.min(42, columnWidth * 0.56);

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[320px] min-w-[780px] w-full"
        role="img"
        aria-label="Multi-color monthly booking bar analytics for January through December 2026 with full month labels"
      >
        <defs>
          {barColors.map((color, index) => (
            <linearGradient key={`bar-gradient-${index}`} id={`monthly-bar-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color} stopOpacity="0.58" />
            </linearGradient>
          ))}
        </defs>
        {Array.from({ length: 6 }, (_, tick) => tick).map((value) => {
          const y = paddingTop + chartHeight - (value / maxValue) * chartHeight;
          return (
            <g key={`grid-${value}`}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="4 5"
              />
              <text
                x={paddingX - 12}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fontWeight="800"
                fill="#94a3b8"
              >
                {value}
              </text>
            </g>
          );
        })}

        {monthlyValues.map((value, index) => {
          const isFuture = false;
          const safeValue = value;
          const barHeight = safeValue > 0
            ? Math.max(8, (safeValue / maxValue) * chartHeight)
            : 4;
          const x = paddingX + index * columnWidth + (columnWidth - barWidth) / 2;
          const y = paddingTop + chartHeight - barHeight;
          const color = barColors[index % barColors.length];

          return (
            <g key={MONTHS[index]}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="8"
                fill={isFuture ? "#cbd5e1" : `url(#monthly-bar-${index})`}
                opacity={isFuture ? "0.7" : "1"}
              />
              {!isFuture && (
                <text
                  x={x + barWidth / 2}
                  y={y - 9}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="900"
                  fill="#0f172a"
                >
                  {value}
                </text>
              )}
              <text
                x={x + barWidth / 2}
                y={height - 18}
                textAnchor="middle"
                fontSize="11"
                fontWeight="800"
                fill={isFuture ? "#94a3b8" : "#475569"}
              >
                {MONTHS[index]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function GearPreview({ type }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (type === 1) {
    return (
      <svg viewBox="0 0 80 80" className="h-16 w-16 text-emerald-600" aria-hidden="true">
        <circle cx="28" cy="58" r="8" fill="currentColor" opacity="0.14" />
        <circle cx="60" cy="58" r="8" fill="currentColor" opacity="0.14" />
        <path {...common} d="M27 51V27h25l10 14v10M35 27V18h17v9M52 41h10M23 58h-7M68 58h5" />
        <path {...common} d="M39 35h7M39 41h7" />
      </svg>
    );
  }

  if (type === 2) {
    return (
      <svg viewBox="0 0 80 80" className="h-16 w-16 text-blue-600" aria-hidden="true">
        <path d="M17 24h46v34H17z" fill="currentColor" opacity="0.08" />
        <path {...common} d="M17 24h46v34H17zM24 31h32M24 39h32M24 47h22M30 58v6M50 58v6" />
        <path {...common} d="m55 31 5-5M55 39l5-5M55 47l5-5" />
      </svg>
    );
  }

  if (type === 3) {
    return (
      <svg viewBox="0 0 80 80" className="h-16 w-16 text-emerald-600" aria-hidden="true">
        <path d="M30 18h20v7H30zM27 25h26l-3 38H30z" fill="currentColor" opacity="0.1" />
        <path {...common} d="M30 18h20v7H30zM27 25h26l-3 38H30zM34 37h12M35 45h10" />
        <path {...common} d="M50 18c8 2 11 7 12 14" />
      </svg>
    );
  }

  if (type === 4) {
    return (
      <svg viewBox="0 0 80 80" className="h-16 w-16 text-yellow-600" aria-hidden="true">
        <path {...common} d="M16 22h48M22 22v35M58 22v35M27 57h26M31 29h18M31 37h18M31 45h18" />
        <path d="M20 18h40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.22" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 80 80" className="h-16 w-16 text-purple-600" aria-hidden="true">
      <rect x="27" y="22" width="26" height="37" rx="7" fill="currentColor" opacity="0.1" />
      <path {...common} d="M34 22v-5h12v5M27 32h26M33 40h14M33 48h9" />
      <path {...common} d="M53 30c8 4 10 10 10 17" />
      <circle cx="63" cy="50" r="4" fill="currentColor" opacity="0.22" />
    </svg>
  );
}

function BookingRow({
  booking,
  onEdit,
  onConfirm,
  onCancel,
  onTogglePayment,
}) {
  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
      <td className="whitespace-nowrap px-4 py-4">
        <span className="font-black text-slate-900">#{booking.id}</span>
      </td>

      <td className="min-w-[190px] px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xs font-black text-emerald-700">
            {booking.customer.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-black text-slate-900">
                {booking.customer}
              </p>
              {booking.vip && (
                <span className="rounded-md border border-yellow-400/20 bg-yellow-400/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-yellow-700 shadow-sm">
                  VIP
                </span>
              )}
            </div>
            <p className="truncate text-[11px] text-slate-400">{booking.email}</p>
          </div>
        </div>
      </td>

      <td className="whitespace-nowrap px-4 py-4">
        <p className="text-xs font-bold text-slate-800">{booking.service}</p>
        <p className="mt-1 text-[10px] font-semibold text-slate-400">{booking.date}</p>
      </td>

      <td className="whitespace-nowrap px-4 py-4">
        <p className="font-black text-slate-900">
          {Number(booking.price).toLocaleString()} Br
        </p>
        <div className="mt-1">
          <PaymentBadge method={booking.paymentMethod} />
        </div>
      </td>

      <td className="whitespace-nowrap px-4 py-4">
        <StatusBadge status={booking.status} />
        <button
          type="button"
          onClick={() => onTogglePayment(booking)}
          className="mt-1 block text-[9px] font-black uppercase tracking-wide text-slate-400 hover:text-emerald-600"
        >
          Payment: {booking.paymentStatus}
        </button>
      </td>

      <td className="whitespace-nowrap px-4 py-4">
        <p className="text-[11px] font-bold text-slate-700">
          {booking.assignedCleaner}
        </p>
      </td>

      <td className="whitespace-nowrap px-4 py-4">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(booking)}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-emerald-300 hover:text-emerald-600"
            title="Edit booking"
          >
            <Icon name="edit" className="h-4 w-4" />
          </button>

          {booking.status === "Pending" && (
            <button
              type="button"
              onClick={() => onConfirm(booking)}
              className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100"
              title="Confirm booking"
            >
              <Icon name="check" className="h-4 w-4" />
            </button>
          )}

          {booking.status !== "Cancelled" && (
            <button
              type="button"
              onClick={() => onCancel(booking)}
              className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
              title="Cancel booking"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function EmptyState({ text }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center p-8 text-center">
      <div>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <Icon name="search" />
        </div>
        <p className="mt-3 text-sm font-bold text-slate-600">{text}</p>
      </div>
    </div>
  );
}


function MetricCard({ label, value, icon, tone = "green", active = false, onClick }) {
  const tones = {
    green: {
      icon: "bg-emerald-50 text-emerald-600",
      value: "text-emerald-700",
      active: "border-emerald-300 ring-2 ring-emerald-100",
    },
    yellow: {
      icon: "bg-yellow-50 text-yellow-600",
      value: "text-yellow-700",
      active: "border-yellow-300 ring-2 ring-yellow-100",
    },
    blue: {
      icon: "bg-blue-50 text-blue-600",
      value: "text-blue-700",
      active: "border-blue-300 ring-2 ring-blue-100",
    },
    red: {
      icon: "bg-red-50 text-red-600",
      value: "text-red-700",
      active: "border-red-300 ring-2 ring-red-100",
    },
  };
  const currentTone = tones[tone] || tones.green;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        active ? currentTone.active : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${currentTone.icon}`}>
          <Icon name={icon} className="h-5 w-5" />
        </div>
        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
          Live
        </span>
      </div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-black ${currentTone.value}`}>{value}</p>
    </button>
  );
}

function PaymentBadge({ method }) {
  const normalized = String(method || "").toLowerCase();
  let label = method || "Payment";
  let classes = "border-slate-200 bg-slate-50 text-slate-600";

  if (normalized.includes("telebirr")) {
    label = "Telebirr";
    classes = "border-emerald-200 bg-emerald-50 text-emerald-700";
  } else if (normalized.includes("cbe")) {
    label = "CBE";
    classes = "border-blue-200 bg-blue-50 text-blue-700";
  } else if (normalized.includes("chapa")) {
    label = "Chapa";
    classes = "border-green-200 bg-green-50 text-green-700";
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-wide ${classes}`}>
      {label}
    </span>
  );
}

function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={`max-h-[92vh] w-full overflow-y-auto rounded-3xl bg-white shadow-2xl ${wide ? "max-w-5xl" : "max-w-xl"}`}>
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
          <h2 className="text-lg font-black text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            aria-label="Close"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading, setUser } = useAuth();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [cleaners, setCleaners] = useState(() => {
    const saved = readLocalStorage("adminCleaners", null);
    if (!Array.isArray(saved) || saved.length < INITIAL_CLEANERS.length) return INITIAL_CLEANERS;
    return saved;
  });
  const [payrollRecords, setPayrollRecords] = useState(() =>
    readLocalStorage("adminPayroll", INITIAL_CLEANERS.map((cleaner) => ({
      cleanerId: cleaner.id,
      name: cleaner.name,
      amount: cleaner.name === "Dawit Bekele" || cleaner.name === "Mulugeta Kebede" ? 5200 : 4500,
      status: cleaner.name === "Selam Tesfaye" || cleaner.name === "Dawit Bekele" ? "Paid" : cleaner.name === "Lidya Abebe" ? "Unpaid" : "Pending",
    }))));
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem("adminCleaners", JSON.stringify(cleaners));
      window.localStorage.setItem("adminPayroll", JSON.stringify(payrollRecords));
    } catch (error) {
      console.warn("Unable to persist workforce records:", error);
    }
  }, [cleaners, payrollRecords]);

  // Keep payroll synchronized with the workforce: every cleaner gets exactly one payroll row.
  useEffect(() => {
    setPayrollRecords((previous) =>
      cleaners.map((cleaner) => {
        const existing = previous.find((record) => record.cleanerId === cleaner.id);
        return existing
          ? { ...existing, cleanerId: cleaner.id, name: cleaner.name }
          : {
              cleanerId: cleaner.id,
              name: cleaner.name,
              amount: 4500,
              status: "Pending",
            };
      })
    );
  }, [cleaners]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCleanerModal, setShowCleanerModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [editingCleaner, setEditingCleaner] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [settingsSaved, setSettingsSaved] = useState(false);

  const [settings, setSettings] = useState(() =>
    readLocalStorage("adminSettings", DEFAULT_SETTINGS)
  );

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "Ticket #10 changed to Pending",
      time: "Just now",
    },
    {
      id: 2,
      text: "Automated SMS dispatched to Dawit Bekele",
      time: "5 min ago",
    },
    {
      id: 3,
      text: "Ticket #7 completed successfully",
      time: "18 min ago",
    },
  ]);

  const [cleanerForm, setCleanerForm] = useState({
    name: "",
    specialty: "Home Cleaners",
    role: "Cleaning Specialist",
    status: "Available",
    shift: "Morning",
  });

  const [bookingForm, setBookingForm] = useState({
    id: "",
    customer: "",
    email: "",
    phone: "",
    service: "Home Cleaning",
    price: "",
    status: "Pending",
    paymentStatus: "Unpaid",
    paymentMethod: "Telebirr",
    assignedCleaner: "Selam Tesfaye",
    date: "",
    instructions: "",
    vip: false,
    location: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    paymentStatus: "Unpaid",
    paymentMethod: "Telebirr",
  });

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const email = String(user.email || "").toLowerCase();
    const admin =
      user.isAdmin === true ||
      user.role === "admin" ||
      email === ADMIN_EMAIL;

    if (!admin) {
      navigate("/customer-dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    try {
      window.localStorage.setItem("adminSettings", JSON.stringify(settings));
    } catch (error) {
      console.warn("Unable to persist admin settings:", error);
    }
  }, [settings]);

  useEffect(() => {
    let cancelled = false;

    async function loadBookings() {
      const token =
        window.localStorage.getItem("token") ||
        window.localStorage.getItem("authToken");

      if (!token) {
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (!cancelled && Array.isArray(data) && data.length > 0) {
          const normalized = data
            .map((item) => ({
              ...item,
              id: Number(item.id ?? item.booking_id),
              customer:
                item.customer ||
                item.full_name ||
                item.customer_name ||
                "Customer",
              email: item.email || "",
              phone: item.phone || "",
              service: item.service || item.service_name || "Cleaning Service",
              price: Number(item.price ?? item.total_price ?? 0),
              status: item.status || "Pending",
              paymentStatus: item.paymentStatus || item.payment_status || "Unpaid",
              paymentMethod: item.paymentMethod || item.payment_method || "Telebirr",
              assignedCleaner:
                item.assignedCleaner ||
                item.assigned_cleaner ||
                "Unassigned",
              date:
                item.date ||
                item.booking_date ||
                item.scheduled_date ||
                "",
              instructions:
                item.instructions ||
                item.special_instructions ||
                "",
              vip: Boolean(item.vip),
              location: item.location || item.address || "",
            }))
            .filter((item) => Number.isFinite(item.id));

          if (normalized.length > 0) {
            setBookings(normalized);
          }
        }
      } catch (error) {
        console.warn("Booking API unavailable; using dashboard data.", error);
      }
    }

    loadBookings();

    return () => {
      cancelled = true;
    };
  }, []);

  const displayName = user?.full_name || user?.name || "Hanan Mahmud";
  const displayEmail = user?.email || ADMIN_EMAIL;

  const filteredBookings = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch =
        !term ||
        String(booking.id).includes(term) ||
        String(booking.customer).toLowerCase().includes(term) ||
        String(booking.email).toLowerCase().includes(term) ||
        String(booking.phone).toLowerCase().includes(term) ||
        String(booking.service).toLowerCase().includes(term) ||
        String(booking.location).toLowerCase().includes(term) ||
        String(booking.assignedCleaner).toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / PAGE_SIZE)
  );

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const metrics = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter((booking) => booking.status === "Pending").length,
      confirmed: bookings.filter((booking) => booking.status === "Confirmed").length,
      completed: bookings.filter((booking) => booking.status === "Completed").length,
      cancelled: bookings.filter((booking) => booking.status === "Cancelled").length,
    }),
    [bookings]
  );

  const completedRevenue = useMemo(
    () =>
      bookings
        .filter((booking) => booking.status === "Completed")
        .reduce((total, booking) => total + Number(booking.price || 0), 0),
    [bookings]
  );

  const paidRevenue = useMemo(
    () =>
      bookings
        .filter((booking) => booking.paymentStatus === "Paid")
        .reduce((total, booking) => total + Number(booking.price || 0), 0),
    [bookings]
  );

  const totalCleaners = cleaners.length;
  const availableCleaners = cleaners.filter((cleaner) => cleaner.status === "Available").length;
  const onJobCleaners = cleaners.filter((cleaner) => cleaner.status === "On Job").length;

  const addNotification = (text) => {
    const notification = {
      id: Date.now(),
      text,
      time: "Just now",
    };

    setNotifications((previous) => [notification, ...previous]);
    setNotificationMessage(text);

    window.setTimeout(() => {
      setNotificationMessage("");
    }, 4000);
  };

  const updateBooking = (id, field, value) => {
    setBookings((previous) =>
      previous.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              [field]: field === "price" ? Number(value) : value,
            }
          : booking
      )
    );
  };

  const confirmBooking = (booking) => {
    updateBooking(booking.id, "status", "Confirmed");

    if (settings.automaticSms) {
      addNotification(
        `📱 SMS notification sent to ${booking.phone} and ${booking.assignedCleaner}.`
      );
    } else {
      addNotification(`Ticket #${booking.id} confirmed.`);
    }
  };

  const cancelBooking = (booking) => {
    const confirmed = window.confirm(
      `Cancel Ticket #${booking.id} for ${booking.customer}?`
    );

    if (!confirmed) {
      return;
    }

    updateBooking(booking.id, "status", "Cancelled");
    addNotification(`Ticket #${booking.id} cancelled.`);
  };

  const openBookingEditor = (booking) => {
    setEditingBooking(booking);
    setBookingForm({
      id: booking.id,
      customer: booking.customer,
      email: booking.email,
      phone: booking.phone,
      service: booking.service,
      price: booking.price,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      paymentMethod: booking.paymentMethod,
      assignedCleaner: booking.assignedCleaner,
      date: booking.date,
      instructions: booking.instructions,
      vip: booking.vip,
      location: booking.location,
    });
    setShowBookingModal(true);
  };

  const saveBooking = (event) => {
    event.preventDefault();

    if (!editingBooking) {
      return;
    }

    setBookings((previous) =>
      previous.map((booking) =>
        booking.id === editingBooking.id
          ? {
              ...booking,
              ...bookingForm,
              id: editingBooking.id,
              price: Number(bookingForm.price || 0),
            }
          : booking
      )
    );

    addNotification(`Ticket #${editingBooking.id} updated successfully.`);
    setShowBookingModal(false);
    setEditingBooking(null);
  };

  const togglePaymentStatus = (booking) => {
    setEditingPayment(booking);
    setPaymentForm({
      paymentStatus:
        booking.paymentStatus === "Paid" ? "Unpaid" : "Paid",
      paymentMethod: booking.paymentMethod,
    });
    setShowPaymentModal(true);
  };

  const savePayment = (event) => {
    event.preventDefault();

    if (!editingPayment) {
      return;
    }

    updateBooking(
      editingPayment.id,
      "paymentStatus",
      paymentForm.paymentStatus
    );

    updateBooking(
      editingPayment.id,
      "paymentMethod",
      paymentForm.paymentMethod
    );

    addNotification(
      `Payment for Ticket #${editingPayment.id} updated to ${paymentForm.paymentStatus}.`
    );

    setShowPaymentModal(false);
    setEditingPayment(null);
  };

  const openPayrollEditor = (payroll) => {
    setEditingPayroll(payroll);
    setShowPayrollModal(true);
  };

  const cyclePayrollStatus = (cleanerId) => {
    const statuses = ["Paid", "Unpaid", "Pending"];
    setPayrollRecords((previous) =>
      previous.map((record) => {
        if (record.cleanerId !== cleanerId) return record;
        const nextIndex = (statuses.indexOf(record.status) + 1) % statuses.length;
        return { ...record, status: statuses[nextIndex] };
      })
    );
  };

  const savePayroll = (event) => {
    event.preventDefault();
    if (!editingPayroll) return;
    const amount = Number(editingPayroll.amount);
    if (!Number.isFinite(amount) || amount < 0) {
      addNotification("Please enter a valid payroll amount.");
      return;
    }
    setPayrollRecords((previous) =>
      previous.map((record) =>
        record.cleanerId === editingPayroll.cleanerId
          ? { ...record, amount, status: editingPayroll.status }
          : record
      )
    );
    addNotification(`Payroll for ${editingPayroll.name} updated.`);
    setShowPayrollModal(false);
    setEditingPayroll(null);
  };

  const openCleanerEditor = (cleaner) => {
    setEditingCleaner(cleaner);
    setCleanerForm({
      name: cleaner.name,
      specialty: cleaner.specialty,
      role: cleaner.role,
      status: cleaner.status,
      shift: cleaner.shift,
    });
    setShowCleanerModal(true);
  };

  const openNewCleaner = () => {
    setEditingCleaner(null);
    setCleanerForm({
      name: "",
      specialty: "Home Cleaners",
      role: "Cleaning Specialist",
      status: "Available",
      shift: "Morning",
    });
    setShowCleanerModal(true);
  };

  const saveCleaner = (event) => {
    event.preventDefault();

    const cleanName = cleanerForm.name.trim();

    if (!cleanName) {
      addNotification("Please enter the cleaner's name.");
      return;
    }

    if (editingCleaner) {
      const oldName = editingCleaner.name;
      setCleaners((previous) =>
        previous.map((cleaner) =>
          cleaner.id === editingCleaner.id
            ? {
                ...cleaner,
                ...cleanerForm,
                initial: cleanName.charAt(0).toUpperCase(),
              }
            : cleaner
        )
      );
      setPayrollRecords((previous) =>
        previous.map((record) =>
          record.cleanerId === editingCleaner.id
            ? { ...record, name: cleanName }
            : record
        )
      );
      setBookings((previous) =>
        previous.map((booking) =>
          booking.assignedCleaner === oldName
            ? { ...booking, assignedCleaner: cleanName }
            : booking
        )
      );

      addNotification(`${cleanName}'s workforce profile was updated.`);
    } else {
      const nextId =
        Math.max(0, ...cleaners.map((cleaner) => Number(cleaner.id))) + 1;

      setCleaners((previous) => [
        ...previous,
        {
          id: nextId,
          ...cleanerForm,
          initial: cleanName.charAt(0).toUpperCase(),
        },
      ]);
      setPayrollRecords((previous) => [
        ...previous,
        { cleanerId: nextId, name: cleanName, amount: 4500, status: "Pending" },
      ]);

      addNotification(`${cleanName} added to the workforce directory and payroll ledger.`);
    }

    setShowCleanerModal(false);
    setEditingCleaner(null);
  };

  const deleteCleaner = () => {
    if (!editingCleaner) {
      return;
    }

    const confirmed = window.confirm(
      `Remove ${editingCleaner.name} from the workforce directory?`
    );

    if (!confirmed) {
      return;
    }

    const removedName = editingCleaner.name;
    setCleaners((previous) =>
      previous.filter((cleaner) => cleaner.id !== editingCleaner.id)
    );
    setPayrollRecords((previous) =>
      previous.filter((record) => record.cleanerId !== editingCleaner.id)
    );
    setBookings((previous) =>
      previous.map((booking) =>
        booking.assignedCleaner === removedName
          ? { ...booking, assignedCleaner: "Unassigned" }
          : booking
      )
    );

    addNotification(`${removedName} was removed from workforce, payroll, and assigned jobs.`);
    setShowCleanerModal(false);
    setEditingCleaner(null);
  };

  const handleSettingsChange = (field, value) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));
    setSettingsSaved(false);
  };

  const saveSettings = () => {
    try {
      window.localStorage.setItem("adminSettings", JSON.stringify(settings));
      setSettingsSaved(true);
      addNotification("System settings saved.");
    } catch (error) {
      console.error("Unable to save settings:", error);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(false);

    try {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("authToken");
    } catch (error) {
      console.warn("Unable to clear local auth storage:", error);
    }

    if (typeof setUser === "function") {
      setUser(null);
    }

    navigate("/", { replace: true });
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard Overview",
      icon: "dashboard",
    },
    {
      id: "bookings",
      label: "Booking Request Pipeline",
      icon: "bookings",
    },
    {
      id: "workforce",
      label: "Workforce",
      icon: "users",
    },
    {
      id: "settings",
      label: "System Settings",
      icon: "settings",
    },
    {
      id: "inventory",
      label: "Gear Inventory",
      icon: "box",
    },
  ];

  const goToTab = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#e4f4e8] font-sans text-slate-900">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-500" />
          <p className="mt-3 text-sm font-bold text-slate-500">
            Loading administration workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e4f4e8] font-sans tracking-tight text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-emerald-900/20 bg-gradient-to-br from-[#064e3b] via-[#059669] to-[#6ee7b7] p-4 text-white shadow-[8px_0_30px_rgba(5,150,105,0.24)] lg:flex lg:w-72 lg:flex-col lg:border-b-0 lg:border-r lg:border-emerald-900/20 lg:p-5">
          <div>
            <div className="group flex items-center gap-3 overflow-visible rounded-2xl px-1 py-2">
              <img
                src={logoImg}
                alt="Abyssinia Clean Logo"
                className="h-12 w-auto object-contain bg-white/95 rounded-xl p-1 shadow-md ring-1 ring-white/30 scale-110 origin-left"
              />
              <div className="flex min-w-0 items-baseline gap-1 whitespace-nowrap">
                <span className="text-xl font-black text-white tracking-tight">Abyssinia</span>
                <span className="text-xl font-extrabold text-black tracking-tight">Clean</span>
              </div>
            </div>

            <div className="mt-8">
              <p className="px-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/60">
                Operations
              </p>

              <nav className="mt-2 grid grid-cols-2 gap-1 lg:grid-cols-1">
                {navItems.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => goToTab(item.id)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[11px] font-black transition ${
                      activeTab === item.id
                        ? "bg-white text-emerald-800 shadow-lg shadow-emerald-950/15"
                        : "text-white/85 hover:bg-[#bbf7d0] hover:text-[#064e3b]"
                    }`}
                  >
                    <Icon name={item.icon} className="h-4 w-4 shrink-0" />
                    <span className="leading-4">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-4 lg:mt-auto">
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[11px] font-black text-white/75 transition hover:bg-red-500/15 hover:text-red-300"
            >
              <Icon name="logout" className="h-4 w-4 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-[radial-gradient(circle_at_top_right,_rgba(110,231,183,0.22),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.10),_transparent_28%)] p-4 sm:p-6 lg:p-8">
          <header className="rounded-3xl border border-emerald-100/80 bg-white/95 p-4 shadow-sm backdrop-blur sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">
                  AbyssiniaClean Operations Center
                </p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                  {activeTab === "dashboard"
                    ? "Dashboard Overview"
                    : activeTab === "bookings"
                    ? "Booking Request Pipeline"
                    : activeTab === "workforce"
                    ? "Workforce"
                    : activeTab === "settings"
                    ? "System Settings"
                    : "Corporate Material Inventory"}
                </h1>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Premium operational control for cleaning-service administration.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowNotifications(true)}
                  className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-emerald-300 hover:text-emerald-600"
                  title="Notifications"
                >
                  <Icon name="bell" className="h-4 w-4" />
                  {notifications.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[8px] font-black text-white">
                      {notifications.length}
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-xs font-black text-emerald-700">
                    {String(displayName).charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden min-w-0 sm:block">
                    <p className="truncate text-xs font-black text-slate-900">
                      Hanan Mahmud
                    </p>
                    <p className="truncate text-[9px] font-semibold text-slate-400">
                      hananbereka2025@gmail.com
                    </p>
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[9px] font-black tracking-wider text-emerald-700">
                    ADMIN
                  </span>
                </div>

              </div>
            </div>
          </header>

          {notificationMessage && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800 shadow-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white">
                <Icon name="check" className="h-4 w-4" />
              </div>
              <span>{notificationMessage}</span>
            </div>
          )}

          {activeTab === "dashboard" && (
            <section className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
                <MetricCard
                  label="Total Bookings"
                  value={metrics.total}
                  icon="bookings"
                  active={statusFilter === "All"}
                  onClick={() => {
                    setStatusFilter("All");
                    goToTab("bookings");
                  }}
                />
                <MetricCard
                  label="Pending"
                  value={metrics.pending}
                  icon="bell"
                  tone="yellow"
                  active={statusFilter === "Pending"}
                  onClick={() => {
                    setStatusFilter("Pending");
                    goToTab("bookings");
                  }}
                />
                <MetricCard
                  label="Confirmed"
                  value={metrics.confirmed}
                  icon="check"
                  tone="blue"
                  active={statusFilter === "Confirmed"}
                  onClick={() => {
                    setStatusFilter("Confirmed");
                    goToTab("bookings");
                  }}
                />
                <MetricCard
                  label="Completed"
                  value={metrics.completed}
                  icon="check"
                  active={statusFilter === "Completed"}
                  onClick={() => {
                    setStatusFilter("Completed");
                    goToTab("bookings");
                  }}
                />
                <MetricCard
                  label="Cancelled"
                  value={metrics.cancelled}
                  icon="close"
                  tone="red"
                  active={statusFilter === "Cancelled"}
                  onClick={() => {
                    setStatusFilter("Cancelled");
                    goToTab("bookings");
                  }}
                />
              </div>

              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.75fr)]">
                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">
                        2026 Pipeline Analytics
                      </p>
                      <h2 className="mt-1 text-xl font-black text-slate-900">
                        Monthly Bookings
                      </h2>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2 text-right">
                      <p className="text-[9px] font-black uppercase text-slate-400">
                        Current timeline
                      </p>
                      <p className="text-xs font-black text-slate-700">
                        September 2026
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="mb-4 flex flex-wrap gap-2">
                  {MONTHS.map((month, index) => (
                    <span key={month} className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-[9px] font-black text-slate-500">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#84cc16", "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#22c55e"][index] }} />
                      {month.slice(0, 3)}
                    </span>
                  ))}
                </div>
                <AnalyticsChart bookings={bookings} />
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-[10px] font-bold text-slate-400">
                      Live comparison of booking volume across all twelve months.
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black text-emerald-700">
                      12-MONTH COMPARISON
                    </span>
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Financial Snapshot
                  </p>
                  <h2 className="mt-1 text-xl font-black text-slate-900">
                    Payments
                  </h2>

                  <div className="mt-5 space-y-3">
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                      <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                        Paid Revenue
                      </p>
                      <p className="mt-1 text-2xl font-black text-emerald-800">
                        {paidRevenue.toLocaleString()} Br
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                        Completed Revenue
                      </p>
                      <p className="mt-1 text-2xl font-black text-slate-800">
                        {completedRevenue.toLocaleString()} Br
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {["CBE Bank", "Telebirr", "Chapa"].map((method) => (
                        <div key={method} className="group rounded-2xl border border-slate-100 bg-white p-3 text-center shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md">
                          <div className="mx-auto w-fit transition-transform duration-200 group-hover:scale-105">
                            <PaymentLogo method={method} />
                          </div>
                          <p className="mt-2 text-[10px] font-black text-slate-800">{method}</p>
                          <p className="mt-0.5 text-[8px] font-semibold text-slate-400">Available</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>

              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                      Premium Customer Registry
                    </p>
                    <h2 className="mt-1 text-xl font-black text-slate-900">
                      VIP / Premium Customers
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => goToTab("bookings")}
                    className="text-xs font-black text-emerald-700 hover:text-emerald-800"
                  >
                    View pipeline →
                  </button>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {bookings
                    .filter((booking) => booking.vip)
                    .map((booking) => (
                      <button
                        type="button"
                        key={booking.id}
                        onClick={() => openBookingEditor(booking)}
                        className="rounded-2xl border border-yellow-200 bg-yellow-50/60 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate text-sm font-black text-slate-900">
                            {booking.customer}
                          </p>
                          <span className="rounded-md border border-yellow-400/20 bg-yellow-400/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-yellow-700 shadow-sm">
                            VIP
                          </span>
                        </div>
                        <p className="mt-1 truncate text-[10px] font-semibold text-slate-500">
                          {booking.email}
                        </p>
                        <p className="mt-3 text-xs font-black text-slate-800">
                          Ticket #{booking.id} · {booking.service}
                        </p>
                      </button>
                    ))}
                </div>
              </section>
            </section>
          )}

          {activeTab === "workforce" && (
            <section className="mt-6 space-y-6">
              {/* STAFF ALLOCATION */}
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">
                      Workforce Management
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-slate-900">
                      Staff Allocation
                    </h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      Manage cleaner availability, assignments, and workforce status.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openNewCleaner}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    <Icon name="plus" className="h-4 w-4" />
                    Add New Cleaner
                  </button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Total Staff
                        </p>
                        <p className="mt-2 text-3xl font-black text-slate-900">
                          {totalCleaners}
                        </p>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-200 text-slate-600">
                        <Icon name="users" className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                          Available Staff
                        </p>
                        <p className="mt-2 text-3xl font-black text-emerald-700">
                          {availableCleaners}
                        </p>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                        <span className="h-3 w-3 rounded-full bg-emerald-500" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-yellow-100 bg-yellow-50 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-yellow-700">
                          On Job Cleaners
                        </p>
                        <p className="mt-2 text-3xl font-black text-yellow-700">
                          {onJobCleaners}
                        </p>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-yellow-600 shadow-sm">
                        <span className="h-3 w-3 rounded-full bg-yellow-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ON JOB CLEANERS */}
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-yellow-600">Live Allocation</p>
                  <h2 className="mt-1 text-xl font-black text-slate-900">On Job Cleaners</h2>
                  <p className="mt-1 text-sm font-medium text-slate-500">All cleaners currently working, grouped by their service department.</p>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {SERVICE_DIVISIONS.map((division) => {
                    const onJob = cleaners.filter((cleaner) => cleaner.specialty === division.name && cleaner.status === "On Job");
                    return (
                      <div key={division.name} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-lg">{division.icon}</span>
                          <span className="rounded-full bg-yellow-100 px-2 py-1 text-[10px] font-black text-yellow-700">{onJob.length} ON JOB</span>
                        </div>
                        <p className="mt-3 text-xs font-black text-slate-800">{division.name}</p>
                        <div className="mt-3 space-y-2">
                          {onJob.length ? onJob.map((cleaner) => (
                            <button key={cleaner.id} type="button" onClick={() => openCleanerEditor(cleaner)} className="flex w-full items-center justify-between rounded-xl bg-white px-3 py-2 text-left shadow-sm transition hover:ring-2 hover:ring-emerald-100">
                              <span className="text-xs font-black text-slate-700">{cleaner.name}</span>
                              <span className="text-[9px] font-black text-emerald-600">EDIT</span>
                            </button>
                          )) : <p className="text-[10px] font-semibold text-slate-400">No cleaner currently on a job.</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* CLEANER DIVISIONS */}
              <div className="grid gap-5 md:grid-cols-2">
                {SERVICE_DIVISIONS.map((division) => {
                  const members = cleaners.filter(
                    (cleaner) => cleaner.specialty === division.name
                  );

                  return (
                    <section
                      key={division.name}
                      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                            {division.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-slate-900">
                              {division.name}
                            </h3>
                            <p className="text-[11px] font-medium text-slate-400">
                              {division.description}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">
                          {members.length}
                        </span>
                      </div>

                      <div className="mt-4 space-y-2">
                        {members.length ? (
                          members.map((cleaner) => (
                            <div
                              key={cleaner.id}
                              className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 transition hover:border-emerald-200 hover:bg-emerald-50/40"
                            >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-black text-emerald-700 shadow-sm">
                                {cleaner.initial}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-black text-slate-900">
                                  {cleaner.name}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                  <StatusBadge status={cleaner.status} />
                                  <span className="text-[10px] font-semibold text-slate-400">
                                    {cleaner.shift}
                                  </span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => openCleanerEditor(cleaner)}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-wide text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700"
                              >
                                EDIT
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-center">
                            <p className="text-xs font-bold text-slate-400">
                              No cleaners in this division.
                            </p>
                          </div>
                        )}
                      </div>
                    </section>
                  );
                })}
              </div>

              {/* PAYROLL LEDGER */}
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">
                      Workforce Finance
                    </p>
                    <h2 className="mt-1 text-xl font-black text-slate-900">Payroll Ledger</h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      All 35 staff members are listed here by department. Edit salary, change payment status, or view the full payroll record.
                    </p>
                  </div>
                  <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">35 Staff · Monthly</span>
                </div>

                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Staff Member</th>
                        <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Department</th>
                        <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Monthly Payroll</th>
                        <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Status</th>
                        <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-wider text-slate-400">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payrollRecords.map((payroll) => {
                        const cleaner = cleaners.find((item) => item.id === payroll.cleanerId);
                        if (!cleaner) return null;
                        return (
                          <tr key={payroll.cleanerId} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-xs font-black text-emerald-700">{cleaner.initial}</div>
                                <p className="text-sm font-black text-slate-900">{payroll.name}</p>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-xs font-bold text-slate-500">{cleaner.specialty}</td>
                            <td className="px-4 py-4">
                              <p className="text-sm font-black text-slate-900">Br {Number(payroll.amount).toLocaleString()}</p>
                            </td>
                            <td className="px-4 py-4">
                              <button type="button" onClick={() => cyclePayrollStatus(payroll.cleanerId)} className="rounded-full transition hover:scale-105" title="Click to change payment status">
                                <StatusBadge status={payroll.status} />
                              </button>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <button type="button" onClick={() => openPayrollEditor(payroll)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-wide text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700">View / Edit</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </section>
          )}

          {activeTab === "bookings" && (
            <section className="mt-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">
                      Live Administration
                    </p>
                    <h2 className="mt-1 text-xl font-black text-slate-900">
                      Booking Request Pipeline
                    </h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      Search all 10 operational tickets inline. Maximum 5 records
                      are displayed per page.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative min-w-[260px]">
                      <Icon
                        name="search"
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search ticket, client, email..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
                      />
                    </div>

                    <div className="relative">
                      <Icon
                        name="filter"
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      />
                      <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-xs font-black text-slate-700 outline-none focus:border-emerald-400"
                      >
                        <option>All</option>
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1050px] border-collapse">
                      <thead className="bg-slate-50">
                        <tr className="text-left">
                          {[
                            "Ticket",
                            "Customer",
                            "Service",
                            "Price / Payment",
                            "Status",
                            "Assigned Cleaner",
                            "Actions",
                          ].map((heading) => (
                            <th
                              key={heading}
                              className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-slate-400"
                            >
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedBookings.length ? (
                          paginatedBookings.map((booking) => (
                            <BookingRow
                              key={booking.id}
                              booking={booking}
                              onEdit={openBookingEditor}
                              onConfirm={confirmBooking}
                              onCancel={cancelBooking}
                              onTogglePayment={togglePaymentStatus}
                            />
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7">
                              <EmptyState text="No booking records match your search." />
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[10px] font-bold text-slate-400">
                    Showing{" "}
                    <span className="font-black text-slate-700">
                      {paginatedBookings.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-black text-slate-700">
                      {filteredBookings.length}
                    </span>{" "}
                    matching records · 5 max per page
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Icon name="arrowLeft" className="h-3.5 w-3.5" />
                      Previous
                    </button>

                    <span className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-black text-white">
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.min(totalPages, page + 1)
                        )
                      }
                      className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <Icon name="arrowRight" className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "settings" && (
            <section className="mt-6">
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Icon name="settings" className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">
                        Configuration
                      </p>
                      <h2 className="mt-1 text-xl font-black text-slate-900">
                        System Settings
                      </h2>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        Administrative preferences are persisted in localStorage.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 md:grid-cols-3">
                    <label className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <span className="block text-xs font-black text-slate-700">Shift Hours</span>
                      <input type="text" value={settings.businessShift || "08:00 AM - 06:00 PM"} onChange={(event) => handleSettingsChange("businessShift", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-400" />
                    </label>
                    <label className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <span className="block text-xs font-black text-slate-700">Municipal Tax</span>
                      <input type="number" min="0" max="100" value={settings.municipalTaxRate ?? 15} onChange={(event) => handleSettingsChange("municipalTaxRate", Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-400" />
                    </label>
                    <label className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <span className="block text-xs font-black text-slate-700">Corporate Admin Alert Email Ledger</span>
                      <input type="email" value={settings.corporateAdminAlertEmail || ADMIN_EMAIL} onChange={(event) => handleSettingsChange("corporateAdminAlertEmail", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-emerald-400" />
                    </label>
                  </div>

                  <div className="mt-3 space-y-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <label className="block text-xs font-black text-slate-700">
                        Base Tax Percentage
                      </label>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={settings.baseTax}
                          onChange={(event) =>
                            handleSettingsChange(
                              "baseTax",
                              Number(event.target.value)
                            )
                          }
                          className="w-32 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-black text-slate-900 outline-none focus:border-emerald-400"
                        />
                        <span className="text-xs font-bold text-slate-400">%</span>
                      </div>
                    </div>

                    <Toggle
                      label="Automated notifications"
                      checked={settings.automatedNotifications}
                      onChange={(value) =>
                        handleSettingsChange("automatedNotifications", value)
                      }
                    />

                    <Toggle
                      label="Cleaner scheduling controls"
                      checked={settings.cleanerScheduling}
                      onChange={(value) =>
                        handleSettingsChange("cleanerScheduling", value)
                      }
                    />

                    <Toggle
                      label="Automatic SMS simulation"
                      checked={settings.automaticSms}
                      onChange={(value) =>
                        handleSettingsChange("automaticSms", value)
                      }
                    />

                    <Toggle
                      label="Show VIP / Premium registry"
                      checked={settings.showVipCustomers}
                      onChange={(value) =>
                        handleSettingsChange("showVipCustomers", value)
                      }
                    />
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={saveSettings}
                      className="rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-emerald-600"
                    >
                      Save Settings
                    </button>
                    {settingsSaved && (
                      <span className="text-xs font-bold text-emerald-700">
                        Settings saved ✓
                      </span>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Security
                  </p>
                  <h2 className="mt-1 text-xl font-black text-slate-900">
                    Administration Identity
                  </h2>

                  <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sm font-black text-emerald-700">
                        H
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-900">
                          Hanan Mahmud
                        </p>
                        <p className="truncate text-[10px] font-semibold text-slate-500">
                          hananbereka2025@gmail.com
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 inline-flex rounded-full border border-emerald-200 bg-white px-3 py-1 text-[10px] font-black tracking-wider text-emerald-700">
                      VERIFIED ADMIN
                    </div>
                  </div>

                </div>
              </div>
            </section>
          )}

          {activeTab === "inventory" && (
            <section className="mt-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">
                      Corporate Operations
                    </p>
                    <h2 className="mt-1 text-xl font-black text-slate-900">
                      Corporate Material Inventory
                    </h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      Cleaning equipment and supply readiness registry.
                    </p>
                  </div>

                  <span className="rounded-xl bg-slate-100 px-3 py-2 text-[10px] font-black text-slate-600">
                    {INVENTORY.length} MATERIAL CATEGORIES
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {INVENTORY.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                          <GearPreview type={item.id} />
                        </div>
                        <StatusBadge status={item.level} />
                      </div>

                      <h3 className="mt-4 text-sm font-black leading-5 text-slate-900">
                        {item.name}
                      </h3>

                      <div className="mt-5 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-3xl font-black text-slate-900">
                            {item.quantity}
                          </p>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {item.unit}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            addNotification(`${item.name} inventory checked.`)
                          }
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-black text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700"
                        >
                          Check Stock
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <footer className="mt-8 border-t border-slate-200 pt-5 text-center text-[10px] font-bold text-slate-400">
            AbyssiniaClean Administration Workspace · 2026 · Operational dashboard
          </footer>
        </main>
      </div>

      {showNotifications && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/20"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowNotifications(false);
            }
          }}
        >
          <aside className="absolute right-0 top-0 h-full w-full max-w-md border-l border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">
                  Operations
                </p>
                <h2 className="mt-1 text-xl font-black text-slate-900">
                  Notifications
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="mt-5 space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Icon name="bell" className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-5 text-slate-800">
                        {notification.text}
                      </p>
                      <p className="mt-1 text-[9px] font-semibold text-slate-400">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setNotifications([])}
              className="mt-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-600 hover:bg-slate-50"
            >
              Clear notifications
            </button>
          </aside>
        </div>
      )}

      {showLogoutModal && (
        <Modal
          title="Confirm administration logout"
          onClose={() => setShowLogoutModal(false)}
        >
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm font-bold leading-6 text-yellow-900">
              Are you absolutely sure you want to log out of the administration
              workspace? ⚠️
            </p>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowLogoutModal(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-600 hover:bg-slate-50"
            >
              Stay Logged In
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-red-600 px-4 py-2.5 text-xs font-black text-white hover:bg-red-700"
            >
              Yes, Logout
            </button>
          </div>
        </Modal>
      )}

      {showPayrollModal && editingPayroll && (
        <Modal title={`Payroll · ${editingPayroll.name}`} onClose={() => { setShowPayrollModal(false); setEditingPayroll(null); }}>
          <form onSubmit={savePayroll} className="space-y-5">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Monthly Payroll Record</p>
              <p className="mt-1 text-lg font-black text-slate-900">{editingPayroll.name}</p>
            </div>
            <label className="block">
              <span className="text-xs font-black text-slate-700">Monthly Amount (Br)</span>
              <input type="number" min="0" value={editingPayroll.amount} onChange={(event) => setEditingPayroll((record) => ({ ...record, amount: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-400" />
            </label>
            <label className="block">
              <span className="text-xs font-black text-slate-700">Payment Status</span>
              <select value={editingPayroll.status} onChange={(event) => setEditingPayroll((record) => ({ ...record, status: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-400">
                <option>Paid</option><option>Unpaid</option><option>Pending</option>
              </select>
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => { setShowPayrollModal(false); setEditingPayroll(null); }} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-600 hover:bg-slate-50">Cancel</button>
              <button type="submit" className="rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-black text-white hover:bg-emerald-600">Save Payroll</button>
            </div>
          </form>
        </Modal>
      )}

      {showBookingModal && (
        <Modal
          title={`Edit Booking #${editingBooking?.id || ""}`}
          onClose={() => {
            setShowBookingModal(false);
            setEditingBooking(null);
          }}
          wide
        >
          <form onSubmit={saveBooking} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-xs font-black text-slate-700">Customer</span>
                <input
                  value={bookingForm.customer}
                  onChange={(event) =>
                    setBookingForm((form) => ({
                      ...form,
                      customer: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-400"
                />
              </label>

              <label className="block">
                <span className="text-xs font-black text-slate-700">Email</span>
                <input
                  type="email"
                  value={bookingForm.email}
                  onChange={(event) =>
                    setBookingForm((form) => ({
                      ...form,
                      email: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-400"
                />
              </label>

              <label className="block">
                <span className="text-xs font-black text-slate-700">Phone</span>
                <input
                  value={bookingForm.phone}
                  onChange={(event) =>
                    setBookingForm((form) => ({
                      ...form,
                      phone: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-400"
                />
              </label>

              <label className="block">
                <span className="text-xs font-black text-slate-700">Location</span>
                <input
                  value={bookingForm.location}
                  onChange={(event) =>
                    setBookingForm((form) => ({
                      ...form,
                      location: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-400"
                />
              </label>

              <label className="block">
                <span className="text-xs font-black text-slate-700">Service</span>
                <select
                  value={bookingForm.service}
                  onChange={(event) =>
                    setBookingForm((form) => ({
                      ...form,
                      service: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-400"
                >
                  <option>Home Cleaning</option>
                  <option>Office Cleaning</option>
                  <option>Window Cleaning</option>
                  <option>Carpet Cleaning</option>
                  <option>Post-Construction Cleaning</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-black text-slate-700">Price (Br)</span>
                <input
                  type="number"
                  min="0"
                  value={bookingForm.price}
                  onChange={(event) =>
                    setBookingForm((form) => ({
                      ...form,
                      price: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-400"
                />
              </label>

              <label className="block">
                <span className="text-xs font-black text-slate-700">Status</span>
                <select
                  value={bookingForm.status}
                  onChange={(event) =>
                    setBookingForm((form) => ({
                      ...form,
                      status: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-400"
                >
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-black text-slate-700">
                  Payment Method
                </span>
                <select
                  value={bookingForm.paymentMethod}
                  onChange={(event) =>
                    setBookingForm((form) => ({
                      ...form,
                      paymentMethod: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-400"
                >
                  <option>Telebirr</option>
                  <option>Chapa</option>
                  <option>CBE Bank</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-black text-slate-700">
                  Assigned Cleaner
                </span>
                <select
                  value={bookingForm.assignedCleaner}
                  onChange={(event) =>
                    setBookingForm((form) => ({
                      ...form,
                      assignedCleaner: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-400"
                >
                  {cleaners.map((cleaner) => (
                    <option key={cleaner.id} value={cleaner.name}>
                      {cleaner.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-black text-slate-700">Date</span>
                <input
                  type="date"
                  value={bookingForm.date}
                  onChange={(event) =>
                    setBookingForm((form) => ({
                      ...form,
                      date: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-400"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-xs font-black text-slate-700">
                Special Instructions
              </span>
              <textarea
                rows="4"
                value={bookingForm.instructions}
                onChange={(event) =>
                  setBookingForm((form) => ({
                    ...form,
                    instructions: event.target.value,
                  }))
                }
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-400"
              />
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-yellow-100 bg-yellow-50 p-3">
              <input
                type="checkbox"
                checked={bookingForm.vip}
                onChange={(event) =>
                  setBookingForm((form) => ({
                    ...form,
                    vip: event.target.checked,
                  }))
                }
                className="h-4 w-4 accent-emerald-500"
              />
              <span className="text-xs font-black text-yellow-800">
                Mark customer as VIP / Premium
              </span>
            </label>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowBookingModal(false);
                  setEditingBooking(null);
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-black text-white hover:bg-emerald-600"
              >
                Save Booking
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showPaymentModal && (
        <Modal
          title={`Edit Payment · Ticket #${editingPayment?.id || ""}`}
          onClose={() => {
            setShowPaymentModal(false);
            setEditingPayment(null);
          }}
        >
          <form onSubmit={savePayment} className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Customer
              </p>
              <p className="mt-1 text-sm font-black text-slate-900">
                {editingPayment?.customer}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                {Number(editingPayment?.price || 0).toLocaleString()} Br
              </p>
            </div>

            <label className="block">
              <span className="text-xs font-black text-slate-700">
                Payment Method
              </span>
              <select
                value={paymentForm.paymentMethod}
                onChange={(event) =>
                  setPaymentForm((form) => ({
                    ...form,
                    paymentMethod: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-400"
              >
                <option>Telebirr</option>
                <option>Chapa</option>
                <option>CBE Bank</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-black text-slate-700">
                Payment Status
              </span>
              <select
                value={paymentForm.paymentStatus}
                onChange={(event) =>
                  setPaymentForm((form) => ({
                    ...form,
                    paymentStatus: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-400"
              >
                <option>Paid</option>
                <option>Unpaid</option>
              </select>
            </label>

            <div className="grid grid-cols-3 gap-2">
              <PaymentBadge method="Telebirr" />
              <PaymentBadge method="Chapa" />
              <PaymentBadge method="CBE Bank" />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowPaymentModal(false);
                  setEditingPayment(null);
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-black text-white hover:bg-emerald-600"
              >
                Save Payment
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showCleanerModal && (
        <Modal
          title={editingCleaner ? "Edit Cleaner" : "Add New Cleaner"}
          onClose={() => {
            setShowCleanerModal(false);
            setEditingCleaner(null);
          }}
        >
          <form onSubmit={saveCleaner} className="space-y-4">
            <label className="block">
              <span className="text-xs font-black text-slate-700">Full Name</span>
              <input
                autoFocus
                value={cleanerForm.name}
                onChange={(event) =>
                  setCleanerForm((form) => ({
                    ...form,
                    name: event.target.value,
                  }))
                }
                placeholder="e.g. Hana Tesfaye"
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-400"
              />
            </label>

            <label className="block">
              <span className="text-xs font-black text-slate-700">
                Service Division
              </span>
              <select
                value={cleanerForm.specialty}
                onChange={(event) =>
                  setCleanerForm((form) => ({
                    ...form,
                    specialty: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-400"
              >
                {SERVICE_DIVISIONS.map((division) => (
                  <option key={division.name}>{division.name}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-black text-slate-700">Role</span>
              <input
                value={cleanerForm.role}
                onChange={(event) =>
                  setCleanerForm((form) => ({
                    ...form,
                    role: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-400"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-black text-slate-700">Status</span>
                <select
                  value={cleanerForm.status}
                  onChange={(event) =>
                    setCleanerForm((form) => ({
                      ...form,
                      status: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-400"
                >
                  <option>Available</option>
                  <option>On Job</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-black text-slate-700">Shift</span>
                <select
                  value={cleanerForm.shift}
                  onChange={(event) =>
                    setCleanerForm((form) => ({
                      ...form,
                      shift: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-400"
                >
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Full Day</option>
                  <option>Evening</option>
                </select>
              </label>
            </div>

            <div className="flex justify-between gap-2 pt-2">
              <div>
                {editingCleaner && (
                  <button
                    type="button"
                    onClick={deleteCleaner}
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-black text-red-600 hover:bg-red-100"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCleanerModal(false);
                    setEditingCleaner(null);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-black text-white hover:bg-emerald-600"
                >
                  {editingCleaner ? "Save Cleaner" : "Add Cleaner"}
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default AdminDashboard;
