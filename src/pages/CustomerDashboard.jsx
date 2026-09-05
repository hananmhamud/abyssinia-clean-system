import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/logo.png";
import businessCardImg from "../assets/Abyssinia_Clean_Business_Card.png";
import telebirrLogo from "../assets/telebirr-logo.png";
import cbeLogo from "../assets/cbe-logo.png";
import chapaLogo from "../assets/chapa-logo.png";

const SERVICE_TYPES = [
  "Standard Clean",
  "Deep Clean",
  "Post-Construction",
];

const ADDONS = [
  { id: "inside-fridge", name: "Inside Fridge" },
  { id: "window-washing", name: "Window Washing" },
  { id: "carpet-cleaning", name: "Carpet Cleaning" },
  { id: "oven-cleaning", name: "Oven Cleaning" },
];

/*
 * Kept for reference only.
 * These records are NOT displayed in the dashboard.
 * Real bookings always come from the backend/database.
 */
const DEMO_BOOKINGS = [
  {
    id: 7,
    service_name: "Home Cleaning",
    service_type: "Post-Construction",
    bedrooms: 45,
    bathrooms: 29,
    square_footage: 6754,
    booking_date: "2027-06-08",
    booking_time: "07:08:00",
    addons: ["Inside Fridge"],
    status: "completed",
    address: "Addis Ababa",
  },
  {
    id: 5,
    service_name: "Home Cleaning",
    service_type: "Standard",
    bedrooms: null,
    bathrooms: null,
    square_footage: null,
    booking_date: "2027-02-01",
    booking_time: "12:03:00",
    addons: [],
    status: "completed",
    address: "Addis Ababa",
  },
  {
    id: 10,
    service_name: "Office Cleaning",
    service_type: "Standard",
    bedrooms: 2,
    bathrooms: 5,
    square_footage: 1200,
    booking_date: "2026-10-09",
    booking_time: "16:07:00",
    addons: [
      "Window Washing",
      "Oven Cleaning",
      "Carpet Cleaning",
      "Inside Fridge",
    ],
    status: "pending",
    address: "Addis Ababa",
  },
  {
    id: 4,
    service_name: "Home Cleaning",
    service_type: "Standard",
    bedrooms: null,
    bathrooms: null,
    square_footage: null,
    booking_date: "2026-09-12",
    booking_time: "12:43:00",
    addons: [],
    status: "cancelled",
    address: "Addis Ababa",
  },
  {
    id: 6,
    service_name: "Home Cleaning",
    service_type: "Standard",
    bedrooms: null,
    bathrooms: null,
    square_footage: null,
    booking_date: "2026-09-11",
    booking_time: "12:34:00",
    addons: [],
    status: "cancelled",
    address: "Addis Ababa",
  },
  {
    id: 9,
    service_name: "Office Cleaning",
    service_type: "Standard",
    bedrooms: null,
    bathrooms: null,
    square_footage: 2970,
    booking_date: "2026-08-31",
    booking_time: "15:07:00",
    addons: ["Inside Fridge"],
    status: "cancelled",
    address: "Addis Ababa",
  },
];

const navItems = [
  { id: "vip", label: "VIP Customer Booking", icon: "star" },
  { id: "bookings", label: "My Bookings", icon: "clipboard" },
  { id: "payments", label: "Payment Methods", icon: "card" },
  { id: "receipts", label: "Receipts & Business Cards", icon: "file" },
  { id: "feedback", label: "Feedback & Reviews", icon: "message" },
  { id: "settings", label: "Settings", icon: "settings" },
];

function Icon({
  name,
  className = "h-5 w-5",
  strokeWidth = 1.8,
}) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (name) {
    case "star":
      return (
        <svg {...common}>
          <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3Z" />
        </svg>
      );

    case "clipboard":
      return (
        <svg {...common}>
          <rect x="5" y="4" width="14" height="17" rx="2" />
          <path d="M9 4.5V3h6v1.5M8.5 9h7M8.5 13h7M8.5 17h4" />
        </svg>
      );

    case "card":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="M3 9h18M7 15h3" />
        </svg>
      );

    case "file":
      return (
        <svg {...common}>
          <path d="M6 3h8l4 4v14H6z" />
          <path d="M14 3v5h4M9 12h6M9 16h6" />
        </svg>
      );

    case "message":
      return (
        <svg {...common}>
          <path d="M5 5h14v10H9l-4 4V5Z" />
          <path d="M8 9h8M8 12h5" />
        </svg>
      );

    case "logout":
      return (
        <svg {...common}>
          <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
          <path d="m14 8 4 4-4 4M9 12h9" />
        </svg>
      );

    case "home":
      return (
        <svg {...common}>
          <path d="m3 11 9-7 9 7" />
          <path d="M5 10v10h14V10M9 20v-6h6v6" />
        </svg>
      );

    case "bell":
      return (
        <svg {...common}>
          <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />
        </svg>
      );

    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c.8-3.3 3.2-5 7-5s6.2 1.7 7 5" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M7 3v4M17 3v4M3 10h18M8 14h2M14 14h2M8 17h2" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7v5l3.5 2" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 2.6 2.7L16.5 9" />
        </svg>
      );

    case "x":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m9 9 6 6M15 9l-6 6" />
        </svg>
      );

    case "refresh":
      return (
        <svg {...common}>
          <path d="M20 11a8 8 0 0 0-14-5L4 8" />
          <path d="M4 4v4h4M4 13a8 8 0 0 0 14 5l2-2" />
          <path d="M20 20v-4h-4" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );

    case "download":
      return (
        <svg {...common}>
          <path d="M12 3v11M8 10l4 4 4-4M5 20h14" />
        </svg>
      );

    case "upload":
      return (
        <svg {...common}>
          <path d="M12 16V4" />
          <path d="m7 9 5-5 5 5" />
          <path d="M5 20h14" />
        </svg>
      );

    case "settings":
      return (
        <svg {...common}>
          <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
          <path d="m19 13 .1-1 .9-1.1-1.3-2.2-1.4.4-.9-.5-.4-1.4h-2.6l-.4 1.4-.9.5-1.4-.4L9.4 9l.9 1.1.1 1-.1 1-.9 1.1 1.3 2.2 1.4-.4.9.5.4 1.4H16l.4-1.4.9-.5 1.4.4 1.3-2.2-.9-1.1.1-1Z" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h13M13 7l5 5-5 5" />
        </svg>
      );

    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 19 6v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );

    case "spark":
      return (
        <svg {...common}>
          <path d="m12 3 1.2 5.8L19 10l-5.8 1.2L12 17l-1.2-5.8L5 10l5.8-1.2L12 3ZM19 16l.5 2.5L22 19l-2.5.5L19 22l-.5-2.5L16 19l2.5-.5L19 16Z" />
        </svg>
      );

    default:
      return (
        <span
          className={className}
          aria-hidden="true"
        />
      );
  }
}

function normalizeBooking(booking) {
  const rawAddons = booking?.addons;

  let addons = [];

  if (Array.isArray(rawAddons)) {
    addons = rawAddons;
  } else if (typeof rawAddons === "string") {
    try {
      const parsed = JSON.parse(rawAddons);

      addons = Array.isArray(parsed)
        ? parsed
        : rawAddons
          ? [rawAddons]
          : [];
    } catch {
      addons = rawAddons
        ? rawAddons
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];
    }
  }

  return {
    ...booking,
    service_name:
      booking?.service_name ||
      booking?.service?.service_name ||
      booking?.service?.name ||
      "Cleaning Service",

    service_type:
      booking?.service_type ||
      booking?.type ||
      "Standard",

    bedrooms:
      booking?.bedrooms ??
      null,

    bathrooms:
      booking?.bathrooms ??
      null,

    square_footage:
      booking?.square_footage ??
      booking?.squareFootage ??
      null,

    booking_date:
      booking?.booking_date ||
      booking?.date ||
      "",

    booking_time:
      booking?.booking_time ||
      booking?.time ||
      "",

    addons,

    status:
      String(booking?.status || "pending").toLowerCase(),

    address:
      booking?.address ||
      "Addis Ababa",
  };
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "-";

  return String(value).slice(0, 5);
}

function propertySummary(booking) {
  const parts = [];

  if (
    booking.bedrooms !== null &&
    booking.bedrooms !== undefined &&
    booking.bedrooms !== ""
  ) {
    parts.push(`${booking.bedrooms} beds`);
  }

  if (
    booking.bathrooms !== null &&
    booking.bathrooms !== undefined &&
    booking.bathrooms !== ""
  ) {
    parts.push(`${booking.bathrooms} baths`);
  }

  if (
    booking.square_footage !== null &&
    booking.square_footage !== undefined &&
    booking.square_footage !== ""
  ) {
    parts.push(`${booking.square_footage} sq ft`);
  }

  return parts.length ? parts.join(", ") : "-";
}

function statusClasses(status) {
  switch (String(status || "").toLowerCase()) {
    case "completed":
      return "bg-emerald-100 text-emerald-800 border border-emerald-200";

    case "confirmed":
      return "bg-blue-100 text-blue-800 border border-blue-200";

    case "pending":
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";

    case "cancelled":
    case "canceled":
      return "bg-red-100 text-red-700 border border-red-200";

    default:
      return "bg-slate-100 text-slate-700 border border-slate-200";
  }
}

function StatCard({
  label,
  value,
  tone,
  icon,
  active = false,
  onClick,
}) {
  const tones = {
    emerald:
      "border-emerald-100 bg-white text-emerald-700",

    yellow:
      "border-yellow-100 bg-white text-yellow-700",

    blue:
      "border-blue-100 bg-white text-blue-700",

    red:
      "border-red-100 bg-white text-red-700",
  };

  const iconTones = {
    emerald:
      "bg-emerald-600 text-white",

    yellow:
      "bg-yellow-400 text-slate-900",

    blue:
      "bg-blue-600 text-white",

    red:
      "bg-red-500 text-white",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`w-full rounded-2xl border p-4 text-left shadow-[0_5px_18px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
        tones[tone] || tones.emerald
      } ${
        active
          ? "ring-2 ring-emerald-500 ring-offset-2"
          : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm ${
            iconTones[tone] || iconTones.emerald
          }`}
        >
          <Icon
            name={icon}
            className="h-5 w-5"
          />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-slate-500">
            {label}
          </p>

          <p className="mt-0.5 text-2xl font-black leading-none text-slate-950">
            {value}
          </p>

          <p className="mt-1 text-[9px] font-bold text-slate-400">
            {active
              ? "Currently viewing"
              : "Click to filter"}
          </p>
        </div>
      </div>
    </button>
  );
}

function PaymentBrand({ type }) {
  const brands = {
    cbe: {
      name: "CBE Bank",
      subtitle: "Commercial Bank of Ethiopia",
      logo: cbeLogo,
      wrapper: "bg-[#eef6fb] border-blue-100",
    },

    telebirr: {
      name: "Telebirr",
      subtitle: "Mobile Money",
      logo: telebirrLogo,
      wrapper: "bg-[#fffdf5] border-yellow-100",
    },

    chapa: {
      name: "Chapa",
      subtitle: "Online Payments",
      logo: chapaLogo,
      wrapper: "bg-white border-purple-100",
    },
  };

  const brand =
    brands[type] ||
    brands.telebirr;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        className={`flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border p-1.5 shadow-sm ${brand.wrapper}`}
      >
        <img
          src={brand.logo}
          alt={`${brand.name} logo`}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="min-w-0">
        <p className="truncate text-[14px] font-black text-slate-900">
          {brand.name}
        </p>

        <p className="truncate text-[9px] font-semibold text-slate-400">
          {brand.subtitle}
        </p>
      </div>
    </div>
  );
}

const PAYMENT_ACCOUNTS = {
  "CBE Bank": {
    label: "CBE Account Number",
    value: "1000456789654",
    instruction:
      "Send the payment to this Commercial Bank of Ethiopia account.",
  },

  Telebirr: {
    label: "Telebirr Phone Number",
    value: "+251 977732209",
    instruction:
      "Send the payment to this Telebirr phone number.",
  },

  Chapa: {
    label: "Chapa Payout ID",
    value: "78989976",
    instruction:
      "Use this Chapa payout/account reference.",
  },
};

function CustomerDashboard() {
  const { user, logout } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [cancellingId, setCancellingId] =
    useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showBookingForm, setShowBookingForm] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState("bookings");

  const [activeBookingFilter, setActiveBookingFilter] =
    useState("all");

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [selectedPayment, setSelectedPayment] =
    useState("Telebirr");

  const [reviewRating, setReviewRating] =
    useState(5);

  const [reviewComment, setReviewComment] =
    useState("");

  const [reviewSubmitted, setReviewSubmitted] =
    useState(false);

  const [paymentAction, setPaymentAction] =
    useState("methods");

  const [receiptBookingId, setReceiptBookingId] =
    useState(null);

  const [showReceipt, setShowReceipt] =
    useState(false);

  const [reviewHistory, setReviewHistory] =
    useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem(
            "abyssiniaCustomerReviews"
          ) || "[]"
        );
      } catch {
        return [];
      }
    });

  const [editingReviewId, setEditingReviewId] =
    useState(null);

  const [paymentReference, setPaymentReference] =
    useState("");

  const [paymentScreenshot, setPaymentScreenshot] =
    useState(null);

  const [paymentProofStatus, setPaymentProofStatus] =
    useState("");

  const [paymentRecords, setPaymentRecords] =
    useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem(
            "abyssiniaPayments"
          ) || "[]"
        );
      } catch {
        return [];
      }
    });

  const [settings, setSettings] =
    useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem(
            "abyssiniaCustomerSettings"
          ) ||
            '{"notifications":true,"emailUpdates":true}'
        );
      } catch {
        return {
          notifications: true,
          emailUpdates: true,
        };
      }
    });

  const [showLogoutConfirm, setShowLogoutConfirm] =
    useState(false);

  const [showCard, setShowCard] =
    useState(false);

  const [formData, setFormData] = useState({
    service_id: "",
    service_type: "Standard Clean",
    bedrooms: "",
    bathrooms: "",
    square_footage: "",
    addons: [],
    booking_date: "",
    booking_time: "",
    address: "",
  });

  /*
   * Customer identity comes from AuthContext.
   * There is no fake personal email fallback.
   */
  const displayName =
    user?.full_name ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "Customer";

  const displayEmail =
    user?.email ||
    "No email available";

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  /*
   * Backend booking connection
   */
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/bookings/my-bookings"
      );

      const remoteBookings =
        Array.isArray(response.data)
          ? response.data.map(normalizeBooking)
          : [];

      setBookings(remoteBookings);
    } catch (err) {
      console.error(
        "Failed to load bookings:",
        err
      );

      setError(
        err.response?.status === 401
          ? "Your session has expired. Please log in again."
          : err.response?.data?.message ||
              "Unable to load your bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Backend services connection
   */
  const fetchServices = async () => {
    try {
      setServicesLoading(true);

      const response = await api.get(
        "/services"
      );

      setServices(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load services:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load cleaning services."
      );
    } finally {
      setServicesLoading(false);
    }
  };

  /*
   * Initial dashboard load
   */
  useEffect(() => {
    fetchBookings();
    fetchServices();
  }, []);

  /*
   * Auto-clear success messages
   */
  useEffect(() => {
    if (success) {
      const timer = window.setTimeout(
        () => setSuccess(""),
        4500
      );

      return () =>
        window.clearTimeout(timer);
    }

    return undefined;
  }, [success]);

  /*
   * Local customer preferences
   */
  useEffect(() => {
    localStorage.setItem(
      "abyssiniaCustomerReviews",
      JSON.stringify(reviewHistory)
    );
  }, [reviewHistory]);

  useEffect(() => {
    localStorage.setItem(
      "abyssiniaPayments",
      JSON.stringify(paymentRecords)
    );
  }, [paymentRecords]);

  useEffect(() => {
    localStorage.setItem(
      "abyssiniaCustomerSettings",
      JSON.stringify(settings)
    );
  }, [settings]);

  /*
   * Normalize backend records before displaying.
   */
  const normalizedBookings = useMemo(
    () =>
      bookings.map(normalizeBooking),
    [bookings]
  );

  /*
   * Real statistics from backend data
   */
  const totalBookings =
    normalizedBookings.length;

  const pendingBookings =
    normalizedBookings.filter(
      (booking) =>
        booking.status === "pending"
    ).length;

  const confirmedBookings =
    normalizedBookings.filter(
      (booking) =>
        booking.status === "confirmed"
    ).length;

  const cancelledBookings =
    normalizedBookings.filter(
      (booking) =>
        booking.status === "cancelled" ||
        booking.status === "canceled"
    ).length;

  /*
   * Stat card filtering
   */
  const handleBookingFilter = (
    filter
  ) => {
    setActiveBookingFilter(filter);
    setActiveSection("bookings");
    setShowNotifications(false);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * IMPORTANT:
   * No hard-coded booking IDs.
   * Every booking returned by the backend can appear here.
   */
  const visibleBookings = useMemo(() => {
    const filtered =
      normalizedBookings.filter(
        (booking) => {
          if (
            activeBookingFilter === "all"
          ) {
            return true;
          }

          if (
            activeBookingFilter ===
            "cancelled"
          ) {
            return (
              booking.status ===
                "cancelled" ||
              booking.status ===
                "canceled"
            );
          }

          return (
            booking.status ===
            activeBookingFilter
          );
        }
      );

    return [...filtered].sort(
      (a, b) => {
        const aDate =
          `${a.booking_date || ""}T${
            a.booking_time || "00:00"
          }`;

        const bDate =
          `${b.booking_date || ""}T${
            b.booking_time || "00:00"
          }`;

        const aTime =
          new Date(aDate).getTime();

        const bTime =
          new Date(bDate).getTime();

        if (
          Number.isFinite(aTime) &&
          Number.isFinite(bTime) &&
          aTime !== bTime
        ) {
          return bTime - aTime;
        }

        return (
          Number(b.id || 0) -
          Number(a.id || 0)
        );
      }
    );
  }, [
    normalizedBookings,
    activeBookingFilter,
  ]);

  const resetForm = () => {
    setFormData({
      service_id: "",
      service_type: "Standard Clean",
      bedrooms: "",
      bathrooms: "",
      square_footage: "",
      addons: [],
      booking_date: "",
      booking_time: "",
      address: "",
    });
  };

  const openBookingForm = () => {
    setError("");
    setSuccess("");
    resetForm();
    setShowBookingForm(true);
  };

  const closeBookingForm = () => {
    if (submitting) return;

    setShowBookingForm(false);
    resetForm();
  };

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddonChange = (
    addonName
  ) => {
    setFormData((previous) => ({
      ...previous,

      addons:
        previous.addons.includes(
          addonName
        )
          ? previous.addons.filter(
              (addon) =>
                addon !== addonName
            )
          : [
              ...previous.addons,
              addonName,
            ],
    }));
  };

  /*
   * Create booking:
   * React -> Axios -> Express -> MySQL
   */
  const handleCreateBooking = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.service_id ||
      !formData.service_type ||
      !formData.booking_date ||
      !formData.booking_time ||
      !formData.address.trim()
    ) {
      setError(
        "Please complete all required booking fields."
      );
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        service_id:
          Number(formData.service_id),

        service_type:
          formData.service_type,

        bedrooms:
          formData.bedrooms
            ? Number(formData.bedrooms)
            : null,

        bathrooms:
          formData.bathrooms
            ? Number(formData.bathrooms)
            : null,

        square_footage:
          formData.square_footage
            ? Number(
                formData.square_footage
              )
            : null,

        addons:
          formData.addons,

        booking_date:
          formData.booking_date,

        booking_time:
          formData.booking_time,

        address:
          formData.address.trim(),
      };

      const response =
        await api.post(
          "/bookings",
          payload
        );

      setSuccess(
        response.data?.message ||
          "Booking created successfully!"
      );

      setShowBookingForm(false);

      resetForm();

      /*
       * Reload directly from backend/database.
       */
      await fetchBookings();

      setActiveBookingFilter(
        "all"
      );

      setActiveSection(
        "bookings"
      );
    } catch (err) {
      console.error(
        "Create booking error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to create booking."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * Cancel booking:
   * React -> Axios -> Express -> MySQL
   * Then refresh from backend.
   */
  const handleCancelBooking = async (
    bookingId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this booking?"
      );

    if (!confirmed) return;

    try {
      setCancellingId(bookingId);
      setError("");
      setSuccess("");

      const response =
        await api.put(
          `/bookings/${bookingId}/cancel`
        );

      setSuccess(
        response.data?.message ||
          "Booking cancelled successfully."
      );

      /*
       * Backend remains the source of truth.
       */
      await fetchBookings();
    } catch (err) {
      console.error(
        "Cancel booking error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to cancel booking."
      );
    } finally {
      setCancellingId(null);
    }
  };

  const handleLogout = () =>
    setShowLogoutConfirm(true);

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  const handlePaymentMethod = (
    method
  ) => {
    setSelectedPayment(method);
    setPaymentAction("methods");

    setSuccess(
      `${method} is selected as your preferred payment method.`
    );

    setError("");
  };

  const openTransactions = () => {
    setPaymentAction(
      "transactions"
    );

    setSuccess(
      "Transaction history is now open."
    );

    setError("");
  };

  const openReceipt = (
    bookingId
  ) => {
    setReceiptBookingId(
      bookingId
    );

    setShowReceipt(true);

    setSuccess(
      `Receipt for booking #${bookingId} opened.`
    );

    setError("");
  };

  const handlePrintReceipt = (
    booking
  ) => {
    if (!booking) return;

    const receiptWindow =
      window.open(
        "",
        "_blank",
        "width=760,height=760"
      );

    if (!receiptWindow) {
      setError(
        "Please allow pop-ups in your browser to print the receipt."
      );
      return;
    }

    const total = Number(
      booking.price ||
        booking.amount ||
        0
    );

    const html = `<!doctype html>
<html>
<head>
<title>Abyssinia Clean Receipt #${booking.id}</title>
<style>
body{
  font-family:'Plus Jakarta Sans',Arial,sans-serif;
  background:#f8fafc;
  color:#0f172a;
  padding:40px
}
.receipt{
  max-width:680px;
  margin:auto;
  background:#fff;
  border:1px solid #e2e8f0;
  border-radius:18px;
  padding:32px
}
h1{
  margin:0;
  color:#047857
}
h2{
  margin:6px 0 0
}
.muted{
  color:#64748b;
  font-size:13px
}
.row{
  display:flex;
  justify-content:space-between;
  gap:20px;
  padding:11px 0;
  border-bottom:1px solid #e2e8f0
}
.total{
  font-size:20px;
  font-weight:800;
  padding-top:18px
}
.footer{
  margin-top:28px;
  color:#64748b;
  font-size:12px
}
</style>
</head>
<body>
<div class="receipt">
<div class="muted">ABYSSINIA CLEAN</div>
<h1>Payment Receipt</h1>
<h2>Booking #${booking.id}</h2>

<div class="row">
<span>Customer</span>
<strong>${displayName}</strong>
</div>

<div class="row">
<span>Service</span>
<strong>${booking.service_name}</strong>
</div>

<div class="row">
<span>Date</span>
<strong>${formatDate(
      booking.booking_date
    )}</strong>
</div>

<div class="row">
<span>Time</span>
<strong>${formatTime(
      booking.booking_time
    )}</strong>
</div>

<div class="row">
<span>Status</span>
<strong>${booking.status}</strong>
</div>

<div class="row">
<span>Payment Method</span>
<strong>${selectedPayment}</strong>
</div>

<div class="row total">
<span>Total</span>
<strong>${total.toLocaleString()} Br</strong>
</div>

<div class="footer">
Thank you for choosing Abyssinia Clean.
</div>
</div>

<script>
window.onload=function(){
  window.print();
}
</script>

</body>
</html>`;

    receiptWindow.document.write(
      html
    );

    receiptWindow.document.close();
  };

  const handleDownloadReceipt = (
    booking
  ) => {
    if (!booking) return;

    const total = Number(
      booking.price ||
        booking.amount ||
        0
    );

    const receiptText = [
      "ABYSSINIA CLEAN",
      "PAYMENT RECEIPT",
      `Booking #: ${booking.id}`,
      `Customer: ${displayName}`,
      `Service: ${booking.service_name}`,
      `Date: ${formatDate(
        booking.booking_date
      )}`,
      `Time: ${formatTime(
        booking.booking_time
      )}`,
      `Status: ${booking.status}`,
      `Payment Method: ${selectedPayment}`,
      `Total: ${total.toLocaleString()} Br`,
      "",
      "Thank you for choosing Abyssinia Clean.",
    ].join("\n");

    const blob =
      new Blob(
        [receiptText],
        {
          type:
            "text/plain;charset=utf-8",
        }
      );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      `Abyssinia_Clean_Receipt_${booking.id}.txt`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

    setSuccess(
      `Receipt #${booking.id} downloaded successfully.`
    );
  };

  const handleReviewSubmit = (
    event
  ) => {
    event.preventDefault();

    const comment =
      reviewComment.trim();

    if (!comment) {
      setError(
        "Please write a short comment before submitting your review."
      );
      return;
    }

    if (editingReviewId) {
      setReviewHistory(
        (previous) =>
          previous.map(
            (review) =>
              review.id ===
              editingReviewId
                ? {
                    ...review,
                    rating:
                      reviewRating,
                    comment,
                    updatedAt:
                      new Date().toLocaleDateString(),
                  }
                : review
          )
      );

      setSuccess(
        "Your review was updated successfully."
      );
    } else {
      const review = {
        id: Date.now(),
        rating:
          reviewRating,
        comment,
        date:
          new Date().toLocaleDateString(),
      };

      setReviewHistory(
        (previous) => [
          review,
          ...previous,
        ]
      );

      setSuccess(
        "Thank you! Your feedback has been submitted successfully."
      );
    }

    setEditingReviewId(null);
    setReviewRating(5);
    setReviewComment("");
    setReviewSubmitted(true);
    setError("");
  };

  const editReview = (
    review
  ) => {
    setEditingReviewId(
      review.id
    );

    setReviewRating(
      review.rating
    );

    setReviewComment(
      review.comment
    );

    setReviewSubmitted(false);

    setActiveSection(
      "feedback"
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteReview = (
    reviewId
  ) => {
    if (
      !window.confirm(
        "Delete this submitted review?"
      )
    ) {
      return;
    }

    setReviewHistory(
      (previous) =>
        previous.filter(
          (review) =>
            review.id !==
            reviewId
        )
    );

    if (
      editingReviewId ===
      reviewId
    ) {
      setEditingReviewId(null);
      setReviewComment("");
      setReviewRating(5);
    }

    setSuccess(
      "Your review was deleted."
    );
  };

  const handlePaymentScreenshot = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setError(
        "Please upload a payment screenshot image."
      );
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Payment screenshot must be 5 MB or smaller."
      );
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      setPaymentScreenshot({
        name: file.name,
        type: file.type,
        dataUrl:
          reader.result,
      });

      setPaymentProofStatus("");
      setError("");
    };

    reader.readAsDataURL(file);
  };

  const savePayment = () => {
    const normalizedReference =
      paymentReference
        .trim()
        .replace(
          /[\s-]/g,
          ""
        );

    const isTelebirrReference =
      /^\+?2519\d{8}$/.test(
        normalizedReference
      ) ||
      /^09\d{8}$/.test(
        normalizedReference
      );

    const isNumericReference =
      /^\d{8,16}$/.test(
        normalizedReference
      );

    if (
      !isTelebirrReference &&
      !isNumericReference
    ) {
      setPaymentProofStatus(
        "error"
      );

      setError(
        selectedPayment ===
          "Telebirr"
          ? "Enter a valid Telebirr phone number, for example +251977732209."
          : `Enter a valid ${selectedPayment} account/reference number (8–16 digits).`
      );

      return;
    }

    if (!paymentScreenshot) {
      setError(
        "Please upload your payment screenshot before submitting the payment proof."
      );

      return;
    }

    const record = {
      id: `PROOF-${Date.now()}`,

      method:
        selectedPayment,

      reference:
        normalizedReference,

      destination:
        PAYMENT_ACCOUNTS[
          selectedPayment
        ]?.value || "",

      amount: 500,

      status:
        "Pending Verification",

      date:
        new Date().toLocaleString(),

      screenshotName:
        paymentScreenshot.name,

      screenshot:
        paymentScreenshot.dataUrl,
    };

    setPaymentRecords(
      (previous) => [
        record,
        ...previous,
      ]
    );

    setPaymentProofStatus(
      "success"
    );

    setSuccess(
      `Payment proof submitted successfully for ${selectedPayment}. Our team will verify the screenshot and update the payment status.`
    );

    setError("");

    setPaymentReference("");

    setPaymentScreenshot(null);
  };

  const downloadPaymentReceipt = (
    record
  ) => {
    const text = `ABYSSINIA CLEAN
PAYMENT RECEIPT
Receipt: ${record.id}
Customer: ${displayName}
Email: ${displayEmail}
Method: ${record.method}
Reference: ${record.reference}
Amount: ${Number(
      record.amount
    ).toLocaleString()} Br
Status: ${record.status}
Date: ${record.date}

Thank you for choosing Abyssinia Clean.`;

    const url =
      URL.createObjectURL(
        new Blob(
          [text],
          {
            type:
              "text/plain;charset=utf-8",
          }
        )
      );

    const a =
      document.createElement(
        "a"
      );

    a.href = url;

    a.download =
      `Abyssinia_Clean_${record.id}.txt`;

    document.body.appendChild(a);

    a.click();

    a.remove();

    URL.revokeObjectURL(url);
  };

  const printPaymentReceipt = (
    record
  ) => {
    const w =
      window.open(
        "",
        "_blank",
        "width=760,height=760"
      );

    if (!w) {
      setError(
        "Please allow pop-ups to print your receipt."
      );
      return;
    }

    w.document.write(
      `<!doctype html>
<html>
<head>
<title>${record.id} - Abyssinia Clean</title>
<style>
body{
  font-family:'Plus Jakarta Sans',Arial,sans-serif;
  padding:40px;
  background:#f8fafc;
  color:#0f172a
}
.receipt{
  max-width:620px;
  margin:auto;
  background:white;
  border:1px solid #e2e8f0;
  border-radius:20px;
  padding:32px
}
h1{
  color:#047857
}
.row{
  display:flex;
  justify-content:space-between;
  border-bottom:1px solid #e2e8f0;
  padding:12px 0
}
.total{
  font-size:20px;
  font-weight:800
}
</style>
</head>

<body>

<div class="receipt">

<small>ABYSSINIA CLEAN</small>

<h1>Payment Receipt</h1>

<div class="row">
<span>Receipt</span>
<b>${record.id}</b>
</div>

<div class="row">
<span>Customer</span>
<b>${displayName}</b>
</div>

<div class="row">
<span>Email</span>
<b>${displayEmail}</b>
</div>

<div class="row">
<span>Method</span>
<b>${record.method}</b>
</div>

<div class="row">
<span>Reference</span>
<b>${record.reference}</b>
</div>

<div class="row">
<span>Status</span>
<b>${record.status}</b>
</div>

<div class="row">
<span>Date</span>
<b>${record.date}</b>
</div>

<div class="row total">
<span>Total</span>
<b>${Number(
        record.amount
      ).toLocaleString()} Br</b>
</div>

<p>
Thank you for choosing Abyssinia Clean.
</p>

</div>

<script>
window.onload=()=>window.print()
</script>

</body>
</html>`
    );

    w.document.close();
  };

  /*
   * Main navigation.
   * Opening My Bookings from the sidebar
   * always shows all bookings.
   */
  const selectSection = (
    section
  ) => {
    setActiveSection(section);
    setShowNotifications(false);

    if (
      section === "bookings"
    ) {
      setActiveBookingFilter(
        "all"
      );
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-[#edf8e9] font-['Plus_Jakarta_Sans'] tracking-tight antialiased text-gray-900">
      <div className="flex min-h-screen flex-col lg:flex-row">

        {/* =========================
            SIDEBAR
        ========================== */}

        <aside className="relative z-20 flex w-full shrink-0 flex-col bg-gradient-to-b from-[#0b2e59] via-[#075985] to-[#0e7490] text-white shadow-[4px_0_20px_rgba(7,89,133,0.22)] lg:w-[190px]">

          <div className="border-b border-white/20 px-5 py-4">
            <Link
              to="/"
              className="flex items-center gap-2.5"
              aria-label="AbyssiniaClean home"
            >
              <img
                src={logoImg}
                alt="AbyssiniaClean logo"
                className="h-12 w-12 shrink-0 origin-left scale-110 rounded-xl bg-white/95 object-contain p-1 shadow-md ring-1 ring-white/30"
              />

              <span className="flex flex-col whitespace-nowrap text-[14px] font-black leading-none tracking-tight">
                <span className="text-white">
                  Abyssinia
                </span>

                <span className="mt-1 text-white">
                  Clean
                </span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 border-b border-white/20 px-4 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/60 text-emerald-700 shadow-sm">
              <Icon
                name="user"
                className="h-5 w-5"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[12px] font-extrabold text-white">
                {displayName}
              </p>

              <p className="text-[10px] font-semibold text-white/75">
                Customer
              </p>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-1 px-2 py-3">

            {navItems.map(
              (item) => {
                const active =
                  activeSection ===
                  item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      selectSection(
                        item.id
                      )
                    }
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[11px] font-semibold transition ${
                      active
                        ? "bg-[#0ea5e9] text-white shadow-lg shadow-sky-950/25 ring-1 ring-white/20"
                        : "text-white/90 hover:bg-[#0ea5e9]/30 hover:text-white"
                    }`}
                  >
                    <Icon
                      name={
                        item.icon
                      }
                      className="h-4 w-4 shrink-0"
                    />

                    <span className="leading-4">
                      {item.label}
                    </span>
                  </button>
                );
              }
            )}

            <div className="mt-auto border-t border-white/20 pt-2">
              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[11px] font-semibold text-white/90 transition hover:bg-red-500/20 hover:text-white"
              >
                <Icon
                  name="logout"
                  className="h-4 w-4"
                />

                Logout Session
              </button>
            </div>
          </nav>

          <div className="border-t border-white/20 px-4 py-3">
            <div className="flex items-center gap-2 rounded-lg bg-white/15 px-2.5 py-2">
              <Icon
                name="shield"
                className="h-4 w-4 text-white"
              />

              <span className="text-[9px] font-bold text-white/90">
                Secure customer workspace
              </span>
            </div>
          </div>
        </aside>

        {/* =========================
            MAIN
        ========================== */}

        <main className="min-w-0 flex-1 bg-gradient-to-br from-[#f4fbef] via-[#f7fbf6] to-[#e9f7e5]">

          {/* HEADER */}

          <header className="sticky top-0 z-10 border-b border-blue-950/40 bg-gradient-to-r from-[#0b2e59] via-[#075985] to-[#0e7490] px-4 py-3 text-white shadow-md shadow-blue-900/10 backdrop-blur-md sm:px-6 lg:px-7">

            <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={() =>
                    selectSection(
                      "bookings"
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white shadow-sm ring-1 ring-white/20 lg:hidden"
                  title="Dashboard"
                >
                  <Icon
                    name="home"
                    className="h-4 w-4"
                  />
                </button>

                <div className="hidden text-[10px] font-black uppercase tracking-[0.18em] text-white sm:block">
                  Abyssinia Clean
                </div>
              </div>

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowNotifications(
                      (value) =>
                        !value
                    )
                  }
                  className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-sm transition hover:bg-white/20"
                  title="Notifications"
                >
                  <Icon
                    name="bell"
                    className="h-4 w-4"
                  />

                  <span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
                </button>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white shadow-sm ring-1 ring-white/20">
                  <Icon
                    name="user"
                    className="h-4 w-4"
                  />
                </div>
              </div>
            </div>

            {showNotifications && (
              <div className="absolute right-4 top-14 w-[280px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:right-6">

                <div className="flex items-center justify-between">

                  <h3 className="text-sm font-black text-slate-900">
                    Notifications
                  </h3>

                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-black text-emerald-700">
                    1 new
                  </span>
                </div>

                <div className="mt-3 rounded-xl bg-emerald-50 p-3">
                  <p className="text-xs font-bold text-emerald-900">
                    Welcome to Abyssinia Clean
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-emerald-700">
                    Your booking status and service information will appear here.
                  </p>
                </div>
              </div>
            )}
          </header>

          <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-7 lg:py-6">

            {/* DASHBOARD HEADER */}

            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>
                <h1 className="text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
                  Customer Dashboard
                </h1>

                <p className="mt-0.5 text-xs font-medium text-slate-600 sm:text-sm">
                  Welcome, {displayName}! Manage your cleaning bookings from one place.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  openBookingForm
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-black text-white shadow-md shadow-emerald-700/20 transition hover:bg-emerald-800"
              >
                <Icon
                  name="plus"
                  className="h-4 w-4"
                />

                New Booking
              </button>
            </section>

            {/* SUCCESS */}

            {success && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800 shadow-sm">
                ✓ {success}
              </div>
            )}

            {/* ERROR */}

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700 shadow-sm">
                {error}
              </div>
            )}

            {/* =========================
                BOOKINGS
            ========================== */}

            {activeSection ===
            "bookings" ? (
              <>
                {/* STATS */}

                <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

                  <StatCard
                    label="Total Bookings"
                    value={
                      totalBookings
                    }
                    tone="emerald"
                    icon="calendar"
                    active={
                      activeBookingFilter ===
                      "all"
                    }
                    onClick={() =>
                      handleBookingFilter(
                        "all"
                      )
                    }
                  />

                  <StatCard
                    label="Pending"
                    value={
                      pendingBookings
                    }
                    tone="yellow"
                    icon="clock"
                    active={
                      activeBookingFilter ===
                      "pending"
                    }
                    onClick={() =>
                      handleBookingFilter(
                        "pending"
                      )
                    }
                  />

                  <StatCard
                    label="Confirmed"
                    value={
                      confirmedBookings
                    }
                    tone="blue"
                    icon="check"
                    active={
                      activeBookingFilter ===
                      "confirmed"
                    }
                    onClick={() =>
                      handleBookingFilter(
                        "confirmed"
                      )
                    }
                  />

                  <StatCard
                    label="Cancelled"
                    value={
                      cancelledBookings
                    }
                    tone="red"
                    icon="x"
                    active={
                      activeBookingFilter ===
                      "cancelled"
                    }
                    onClick={() =>
                      handleBookingFilter(
                        "cancelled"
                      )
                    }
                  />
                </section>

                {/* BOOKINGS TABLE */}

                <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_6px_22px_rgba(15,23,42,0.07)]">

                  <div className="flex flex-col gap-3 border-b border-slate-200 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">

                    <div>
                      <div className="flex flex-wrap items-center gap-2">

                        <h2 className="text-sm font-black text-slate-950 sm:text-base">
                          My Bookings
                        </h2>

                        {activeBookingFilter !==
                          "all" && (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black capitalize text-emerald-700">
                            Filter:{" "}
                            {
                              activeBookingFilter
                            }
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 text-[10px] text-slate-500">
                        Your latest cleaning requests and their current status.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        fetchBookings
                      }
                      disabled={
                        loading
                      }
                      className="inline-flex items-center justify-center gap-1.5 self-start rounded-lg bg-emerald-700 px-3 py-1.5 text-[10px] font-black text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Icon
                        name="refresh"
                        className={`h-3.5 w-3.5 ${
                          loading
                            ? "animate-spin"
                            : ""
                        }`}
                      />

                      {loading
                        ? "Refreshing..."
                        : "Refresh"}
                    </button>
                  </div>

                  {loading ? (
                    <div className="p-12 text-center">

                      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />

                      <p className="mt-3 text-xs font-bold text-slate-500">
                        Loading your bookings...
                      </p>
                    </div>
                  ) : visibleBookings.length ===
                    0 ? (
                    <div className="p-10 text-center">

                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                        <Icon
                          name="calendar"
                          className="h-6 w-6"
                        />
                      </div>

                      <h3 className="mt-3 text-base font-black text-slate-950">
                        {activeBookingFilter ===
                        "all"
                          ? "No bookings yet"
                          : `No ${activeBookingFilter} bookings`}
                      </h3>

                      <p className="mx-auto mt-1 max-w-md text-xs text-slate-500">
                        {activeBookingFilter ===
                        "all"
                          ? "Create your first professional cleaning booking to see it in this workspace."
                          : "There are no bookings matching the selected status."}
                      </p>

                      {activeBookingFilter ===
                        "all" && (
                        <button
                          type="button"
                          onClick={
                            openBookingForm
                          }
                          className="mt-4 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-black text-white hover:bg-emerald-800"
                        >
                          Create Booking
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* DESKTOP TABLE */}

                      <div className="hidden overflow-x-auto md:block">

                        <table className="w-full min-w-[900px] border-collapse text-left">

                          <thead className="bg-slate-100">

                            <tr className="border-b border-slate-200 text-[10px] font-black text-slate-600">

                              <th className="px-3 py-2.5">
                                ID
                              </th>

                              <th className="px-3 py-2.5">
                                Service
                              </th>

                              <th className="px-3 py-2.5">
                                Type
                              </th>

                              <th className="px-3 py-2.5">
                                Property Details
                              </th>

                              <th className="px-3 py-2.5">
                                Date
                              </th>

                              <th className="px-3 py-2.5">
                                Time
                              </th>

                              <th className="px-3 py-2.5">
                                Add-ons
                              </th>

                              <th className="px-3 py-2.5">
                                Status
                              </th>

                              <th className="px-3 py-2.5">
                                Action
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-100">

                            {visibleBookings.map(
                              (booking) => {
                                const canCancel =
                                  booking.status !==
                                    "cancelled" &&
                                  booking.status !==
                                    "canceled" &&
                                  booking.status !==
                                    "completed";

                                return (
                                  <tr
                                    key={
                                      booking.id
                                    }
                                    className="transition hover:bg-emerald-50/40"
                                  >
                                    <td className="px-3 py-2.5 text-xs font-black text-slate-900">
                                      #
                                      {
                                        booking.id
                                      }
                                    </td>

                                    <td className="px-3 py-2.5 text-xs font-bold text-slate-800">
                                      {
                                        booking.service_name
                                      }
                                    </td>

                                    <td className="px-3 py-2.5 text-[10px] font-semibold text-slate-700">
                                      {
                                        booking.service_type
                                      }
                                    </td>

                                    <td className="max-w-[210px] px-3 py-2.5 text-[10px] text-slate-600">
                                      {propertySummary(
                                        booking
                                      )}
                                    </td>

                                    <td className="whitespace-nowrap px-3 py-2.5 text-[10px] font-semibold text-slate-700">
                                      {formatDate(
                                        booking.booking_date
                                      )}
                                    </td>

                                    <td className="px-3 py-2.5 text-[10px] font-semibold text-slate-700">
                                      {formatTime(
                                        booking.booking_time
                                      )}
                                    </td>

                                    <td className="max-w-[180px] px-3 py-2.5 text-[10px] text-slate-600">
                                      {booking
                                        .addons
                                        .length
                                        ? booking.addons.join(
                                            ", "
                                          )
                                        : "None"}
                                    </td>

                                    <td className="px-3 py-2.5">

                                      <span
                                        className={`inline-flex rounded-md px-2 py-1 text-[9px] font-black capitalize ${statusClasses(
                                          booking.status
                                        )}`}
                                      >
                                        {
                                          booking.status
                                        }
                                      </span>
                                    </td>

                                    <td className="px-3 py-2.5">

                                      {canCancel ? (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleCancelBooking(
                                              booking.id
                                            )
                                          }
                                          disabled={
                                            cancellingId ===
                                            booking.id
                                          }
                                          className="text-[10px] font-bold text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-red-600 disabled:opacity-50"
                                        >
                                          {cancellingId ===
                                          booking.id
                                            ? "Cancelling..."
                                            : "Cancel"}
                                        </button>
                                      ) : (
                                        <span className="text-[10px] text-slate-300">
                                          —
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* MOBILE CARDS */}

                      <div className="divide-y divide-slate-100 md:hidden">

                        {visibleBookings.map(
                          (booking) => {
                            const canCancel =
                              booking.status !==
                                "cancelled" &&
                              booking.status !==
                                "canceled" &&
                              booking.status !==
                                "completed";

                            return (
                              <article
                                key={
                                  booking.id
                                }
                                className="p-4"
                              >
                                <div className="flex items-start justify-between gap-3">

                                  <div>
                                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                                      Booking
                                    </p>

                                    <p className="mt-0.5 text-xl font-black text-slate-950">
                                      #
                                      {
                                        booking.id
                                      }
                                    </p>
                                  </div>

                                  <span
                                    className={`rounded-md px-2 py-1 text-[9px] font-black capitalize ${statusClasses(
                                      booking.status
                                    )}`}
                                  >
                                    {
                                      booking.status
                                    }
                                  </span>
                                </div>

                                <div className="mt-3 grid gap-2 text-[11px] text-slate-700">

                                  <div>
                                    <span className="font-black text-slate-500">
                                      Service:
                                    </span>{" "}
                                    {
                                      booking.service_name
                                    }
                                  </div>

                                  <div>
                                    <span className="font-black text-slate-500">
                                      Type:
                                    </span>{" "}
                                    {
                                      booking.service_type
                                    }
                                  </div>

                                  <div>
                                    <span className="font-black text-slate-500">
                                      Property:
                                    </span>{" "}
                                    {propertySummary(
                                      booking
                                    )}
                                  </div>

                                  <div>
                                    <span className="font-black text-slate-500">
                                      Date:
                                    </span>{" "}
                                    {formatDate(
                                      booking.booking_date
                                    )}
                                  </div>

                                  <div>
                                    <span className="font-black text-slate-500">
                                      Time:
                                    </span>{" "}
                                    {formatTime(
                                      booking.booking_time
                                    )}
                                  </div>

                                  <div>
                                    <span className="font-black text-slate-500">
                                      Add-ons:
                                    </span>{" "}
                                    {booking
                                      .addons
                                      .length
                                      ? booking.addons.join(
                                          ", "
                                        )
                                      : "None"}
                                  </div>

                                  <div>
                                    <span className="font-black text-slate-500">
                                      Address:
                                    </span>{" "}
                                    {
                                      booking.address
                                    }
                                  </div>
                                </div>

                                {canCancel && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleCancelBooking(
                                        booking.id
                                      )
                                    }
                                    disabled={
                                      cancellingId ===
                                      booking.id
                                    }
                                    className="mt-3 w-full rounded-lg border border-red-200 py-2 text-[11px] font-black text-red-600 hover:bg-red-50 disabled:opacity-50"
                                  >
                                    {cancellingId ===
                                    booking.id
                                      ? "Cancelling..."
                                      : "Cancel Booking"}
                                  </button>
                                )}
                              </article>
                            );
                          }
                        )}
                      </div>
                    </>
                  )}
                </section>
              </>
            ) : (
              <section className="mt-5">

                {/* =========================
                    VIP
                ========================== */}

                {activeSection ===
                  "vip" && (
                  <article className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
                          Premium customer service
                        </p>

                        <h2 className="mt-1 text-2xl font-black text-slate-950">
                          VIP Bookings
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          Active special services for{" "}
                          {displayName}.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={
                          openBookingForm
                        }
                        className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-black text-white hover:bg-emerald-800"
                      >
                        Book VIP Service
                      </button>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">

                      <button
                        type="button"
                        onClick={() =>
                          setSuccess(
                            "Special Services selected. Add your preferred service during booking."
                          )
                        }
                        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left hover:border-emerald-400"
                      >
                        <p className="text-sm font-black text-emerald-900">
                          ⚡ Special Services
                        </p>

                        <p className="mt-1 text-xs text-emerald-700">
                          Priority cleaning, deep-clean options and premium add-ons.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setSuccess(
                            "VIP Lights selected. Window and lighting-detail services are available in your booking add-ons."
                          )
                        }
                        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left hover:border-emerald-400"
                      >
                        <p className="text-sm font-black text-emerald-900">
                          ⭐ VIP Lights
                        </p>

                        <p className="mt-1 text-xs text-emerald-700">
                          Premium attention to windows and presentation details.
                        </p>
                      </button>
                    </div>
                  </article>
                )}

                {/* =========================
                    PAYMENTS
                ========================== */}

                {activeSection ===
                  "payments" && (
                  <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">
                          Secure payment center
                        </p>

                        <h2 className="mt-1 text-2xl font-black text-slate-950">
                          Payment Methods
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          Choose and manage the payment channel you want to use for your cleaning bookings.
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-700">
                        Selected:{" "}
                        {
                          selectedPayment
                        }
                      </span>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">

                      {[
                        {
                          type: "cbe",
                          name: "CBE Bank",
                          detail:
                            "Commercial Bank of Ethiopia",
                          tone: "blue",
                        },
                        {
                          type: "telebirr",
                          name: "Telebirr",
                          detail:
                            "Mobile Money",
                          tone: "emerald",
                        },
                        {
                          type: "chapa",
                          name: "Chapa",
                          detail:
                            "Online Payments",
                          tone: "purple",
                        },
                      ].map(
                        (method) => {
                          const selected =
                            selectedPayment ===
                            method.name;

                          const toneClass =
                            method.tone ===
                            "blue"
                              ? "border-blue-200 bg-blue-50 text-blue-700"
                              : method.tone ===
                                  "purple"
                                ? "border-purple-200 bg-purple-50 text-purple-700"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700";

                          return (
                            <button
                              key={
                                method.type
                              }
                              type="button"
                              onClick={() =>
                                handlePaymentMethod(
                                  method.name
                                )
                              }
                              className={`rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                                selected
                                  ? `${toneClass} ring-2 ring-emerald-300`
                                  : "border-slate-200 bg-white"
                              }`}
                            >
                              <PaymentBrand
                                type={
                                  method.type
                                }
                              />

                              <p className="mt-4 text-xs font-black text-slate-900">
                                {
                                  method.name
                                }
                              </p>

                              <p className="mt-1 text-[10px] text-slate-500">
                                {
                                  method.detail
                                }
                              </p>

                              <span
                                className={`mt-3 inline-flex rounded-full px-2 py-1 text-[9px] font-black ${toneClass}`}
                              >
                                {selected
                                  ? "Selected"
                                  : "Use this method"}
                              </span>
                            </button>
                          );
                        }
                      )}
                    </div>

                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                          <p className="text-sm font-black text-slate-900">
                            {
                              selectedPayment
                            }{" "}
                            Payment Details
                          </p>

                          <p className="mt-1 text-[10px] text-slate-500">
                            Use the official Abyssinia Clean payment destination below.
                          </p>
                        </div>

                        <span className="rounded-full bg-white px-3 py-1 text-[9px] font-black text-emerald-700 shadow-sm">
                          ABYSSINIA CLEAN
                        </span>
                      </div>

                      <div className="mt-4 rounded-2xl border border-emerald-200 bg-white p-4">

                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-emerald-700">
                          Send payment to
                        </p>

                        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                          <div>
                            <p className="text-xs font-black text-slate-900">
                              {
                                PAYMENT_ACCOUNTS[
                                  selectedPayment
                                ]?.label
                              }
                            </p>

                            <p className="mt-1 break-all text-xl font-black tracking-wide text-slate-950">
                              {
                                PAYMENT_ACCOUNTS[
                                  selectedPayment
                                ]?.value
                              }
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(
                                PAYMENT_ACCOUNTS[
                                  selectedPayment
                                ]?.value ||
                                  ""
                              );

                              setSuccess(
                                `${selectedPayment} payment destination copied.`
                              );

                              setError("");
                            }}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-[10px] font-black text-slate-700 hover:bg-slate-50"
                          >
                            Copy
                          </button>
                        </div>

                        <p className="mt-2 text-[10px] text-slate-500">
                          {
                            PAYMENT_ACCOUNTS[
                              selectedPayment
                            ]?.instruction
                          }
                        </p>
                      </div>

                      <div className="mt-5">

                        <label className="text-xs font-black text-slate-900">
                          Your payment reference
                        </label>

                        <p className="mt-1 text-[10px] text-slate-500">
                          {selectedPayment ===
                          "Telebirr"
                            ? "Enter the phone number used for the payment."
                            : `Enter your ${selectedPayment} account/reference number.`}
                        </p>

                        <input
                          value={
                            paymentReference
                          }
                          onChange={(e) =>
                            setPaymentReference(
                              e.target
                                .value
                            )
                          }
                          inputMode="tel"
                          placeholder={
                            selectedPayment ===
                            "Telebirr"
                              ? "+251 9XXXXXXXX"
                              : `${selectedPayment} account/reference number`
                          }
                          className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                        />
                      </div>

                      <div className="mt-5 rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 p-5">

                        <div className="text-center">

                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                            <Icon
                              name="upload"
                              className="h-6 w-6"
                            />
                          </div>

                          <p className="mt-3 text-sm font-black text-slate-900">
                            Upload payment screenshot
                          </p>

                          <p className="mt-1 text-[10px] text-slate-500">
                            Attach the screenshot showing your payment confirmation.
                          </p>

                          <label className="mt-4 inline-flex cursor-pointer rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-black text-white hover:bg-slate-800">

                            {paymentScreenshot
                              ? "Change Screenshot"
                              : "Choose Screenshot"}

                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              onChange={
                                handlePaymentScreenshot
                              }
                              className="hidden"
                            />
                          </label>
                        </div>

                        {paymentScreenshot && (
                          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">

                            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">

                              <div className="min-w-0">
                                <p className="text-[10px] font-black text-slate-900">
                                  Payment screenshot attached
                                </p>

                                <p className="truncate text-[9px] text-slate-500">
                                  {
                                    paymentScreenshot.name
                                  }
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  setPaymentScreenshot(
                                    null
                                  )
                                }
                                className="rounded-lg border border-red-200 px-3 py-1.5 text-[9px] font-black text-red-600 hover:bg-red-50"
                              >
                                Remove
                              </button>
                            </div>

                            <img
                              src={
                                paymentScreenshot.dataUrl
                              }
                              alt="Uploaded payment screenshot preview"
                              className="mx-auto max-h-72 w-full object-contain bg-slate-100 p-2"
                            />
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={
                          savePayment
                        }
                        className="mt-5 w-full rounded-xl bg-emerald-700 px-5 py-3 text-xs font-black text-white shadow-lg shadow-emerald-700/20 hover:bg-emerald-800"
                      >
                        Submit Payment Proof ·
                        500 Br
                      </button>

                      {paymentProofStatus ===
                        "success" && (
                        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800">
                          ✓ Payment screenshot received successfully. Status:{" "}
                          <strong>
                            Pending Verification
                          </strong>
                          .
                        </div>
                      )}

                      {paymentProofStatus ===
                        "error" &&
                        error && (
                          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
                            ✕ Payment proof was not submitted.{" "}
                            {error}
                          </div>
                        )}

                      <p className="mt-3 text-center text-[9px] text-slate-400">
                        Abyssinia Clean will verify the uploaded proof before marking the payment as paid. This screen does not falsely confirm a bank transaction.
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          setPaymentAction(
                            "methods"
                          )
                        }
                        className={`rounded-xl px-4 py-2 text-xs font-black ${
                          paymentAction ===
                          "methods"
                            ? "bg-slate-950 text-white"
                            : "border border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        Manage Methods
                      </button>

                      <button
                        type="button"
                        onClick={
                          openTransactions
                        }
                        className={`rounded-xl px-4 py-2 text-xs font-black ${
                          paymentAction ===
                          "transactions"
                            ? "bg-slate-950 text-white"
                            : "border border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        Transactions
                      </button>
                    </div>

                    {paymentAction ===
                      "transactions" && (
                      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">

                        <p className="text-xs font-black text-slate-900">
                          Transaction History
                        </p>

                        <div className="mt-3 divide-y divide-slate-200">

                          {paymentRecords.map(
                            (record) => (
                              <div
                                key={
                                  record.id
                                }
                                className="flex flex-wrap items-center justify-between gap-3 py-3"
                              >
                                <div>
                                  <p className="text-[11px] font-black text-slate-800">
                                    {
                                      record.id
                                    }{" "}
                                    ·{" "}
                                    {
                                      record.method
                                    }
                                  </p>

                                  <p className="text-[10px] text-slate-500">
                                    Ref:{" "}
                                    {
                                      record.reference
                                    }{" "}
                                    ·{" "}
                                    {
                                      record.date
                                    }
                                  </p>
                                </div>

                                <div className="flex gap-2">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      downloadPaymentReceipt(
                                        record
                                      )
                                    }
                                    className="rounded-lg border border-emerald-200 px-2.5 py-1.5 text-[9px] font-black text-emerald-700"
                                  >
                                    Receipt
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      printPaymentReceipt(
                                        record
                                      )
                                    }
                                    className="rounded-lg bg-slate-950 px-2.5 py-1.5 text-[9px] font-black text-white"
                                  >
                                    Print
                                  </button>
                                </div>
                              </div>
                            )
                          )}

                          {normalizedBookings
                            .filter(
                              (
                                booking
                              ) =>
                                booking.status ===
                                "completed"
                            )
                            .map(
                              (
                                booking
                              ) => (
                                <div
                                  key={
                                    booking.id
                                  }
                                  className="flex items-center justify-between gap-3 py-3"
                                >
                                  <div>
                                    <p className="text-[11px] font-black text-slate-800">
                                      Booking #
                                      {
                                        booking.id
                                      }
                                    </p>

                                    <p className="text-[10px] text-slate-500">
                                      {
                                        booking.service_name
                                      }{" "}
                                      ·{" "}
                                      {formatDate(
                                        booking.booking_date
                                      )}
                                    </p>
                                  </div>

                                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-black text-emerald-700">
                                    Completed
                                  </span>
                                </div>
                              )
                            )}

                          {paymentRecords.length ===
                            0 &&
                            normalizedBookings.filter(
                              (
                                booking
                              ) =>
                                booking.status ===
                                "completed"
                            ).length ===
                              0 && (
                              <p className="py-3 text-xs text-slate-500">
                                No completed transactions yet.
                              </p>
                            )}
                        </div>
                      </div>
                    )}
                  </article>
                )}

                {/* =========================
                    RECEIPTS
                ========================== */}

                {activeSection ===
                  "receipts" && (
                  <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">

                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
                      Customer resources
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-slate-950">
                      Receipts &amp; Business Cards
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Access receipts for completed bookings and your Abyssinia Clean business card.
                    </p>

                    <div className="mt-6 grid gap-4 lg:grid-cols-2">

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                            <Icon
                              name="file"
                              className="h-5 w-5"
                            />
                          </div>

                          <div>
                            <p className="text-sm font-black text-slate-900">
                              Downloadable receipts
                            </p>

                            <p className="text-[10px] text-slate-500">
                              View a receipt generated from your completed booking.
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">

                          {normalizedBookings
                            .filter(
                              (
                                booking
                              ) =>
                                booking.status ===
                                "completed"
                            )
                            .map(
                              (
                                booking
                              ) => (
                                <div
                                  key={
                                    booking.id
                                  }
                                  className="flex items-center justify-between gap-3 rounded-xl bg-white p-3"
                                >
                                  <div>
                                    <p className="text-[11px] font-black text-slate-800">
                                      Receipt · #
                                      {
                                        booking.id
                                      }
                                    </p>

                                    <p className="text-[9px] text-slate-500">
                                      {
                                        booking.service_name
                                      }{" "}
                                      ·{" "}
                                      {formatDate(
                                        booking.booking_date
                                      )}
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      openReceipt(
                                        booking.id
                                      )
                                    }
                                    className="rounded-lg bg-emerald-700 px-3 py-1.5 text-[9px] font-black text-white hover:bg-emerald-800"
                                  >
                                    View
                                  </button>
                                </div>
                              )
                            )}

                          {normalizedBookings.filter(
                            (
                              booking
                            ) =>
                              booking.status ===
                              "completed"
                          ).length ===
                            0 && (
                            <p className="text-xs text-slate-500">
                              Completed booking receipts will appear here.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-gradient-to-br from-slate-950 to-slate-800 p-5 text-white shadow-lg">

                        <div className="inline-flex rounded-lg bg-white px-3 py-1.5 text-[10px] font-black tracking-[0.18em] text-slate-950">
                          ABYSSINIA{" "}
                          <span className="ml-1 text-emerald-700">
                            CLEAN
                          </span>
                        </div>

                        <p className="mt-3 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">
                          Abyssinia Clean
                        </p>

                        <h3 className="mt-2 text-xl font-black">
                          {displayName}
                        </h3>

                        <p className="mt-1 text-xs text-slate-300">
                          Customer · Cleaning Services
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              setShowCard(
                                true
                              )
                            }
                            className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-black hover:bg-white/20"
                          >
                            View / Print
                          </button>

                          <a
                            href={
                              businessCardImg
                            }
                            download="Abyssinia_Clean_Business_Card.png"
                            className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black text-slate-950 hover:bg-emerald-400"
                          >
                            Download Card
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                )}

                {/* =========================
                    SETTINGS
                ========================== */}

                {activeSection ===
                  "settings" && (
                  <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">

                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
                      Workspace controls
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-slate-950">
                      Settings
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Manage your customer workspace preferences.
                    </p>

                    <div className="mt-6 max-w-2xl space-y-3">

                      <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 p-4">

                        <span>
                          <b className="block text-sm text-slate-900">
                            Booking notifications
                          </b>

                          <small className="text-xs text-slate-500">
                            Receive updates about booking status.
                          </small>
                        </span>

                        <input
                          type="checkbox"
                          checked={
                            settings.notifications
                          }
                          onChange={(
                            e
                          ) =>
                            setSettings(
                              (p) => ({
                                ...p,
                                notifications:
                                  e.target
                                    .checked,
                              })
                            )
                          }
                          className="h-5 w-5 accent-emerald-600"
                        />
                      </label>

                      <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 p-4">

                        <span>
                          <b className="block text-sm text-slate-900">
                            Email updates
                          </b>

                          <small className="text-xs text-slate-500">
                            Receive service and receipt information by email.
                          </small>
                        </span>

                        <input
                          type="checkbox"
                          checked={
                            settings.emailUpdates
                          }
                          onChange={(
                            e
                          ) =>
                            setSettings(
                              (p) => ({
                                ...p,
                                emailUpdates:
                                  e.target
                                    .checked,
                              })
                            )
                          }
                          className="h-5 w-5 accent-emerald-600"
                        />
                      </label>

                      <div className="rounded-2xl bg-slate-50 p-4">

                        <p className="text-xs font-black text-slate-900">
                          Verified account
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {displayName} ·{" "}
                          {
                            displayEmail
                          }
                        </p>
                      </div>
                    </div>
                  </article>
                )}

                {/* =========================
                    FEEDBACK
                ========================== */}

                {activeSection ===
                  "feedback" && (
                  <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.08)]">

                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-yellow-600">
                      Customer voice
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-slate-950">
                      Feedback &amp; Reviews
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Tell us about your cleaning experience.
                    </p>

                    <form
                      onSubmit={
                        handleReviewSubmit
                      }
                      className="mt-6 max-w-2xl"
                    >

                      <label className="text-xs font-black text-slate-800">
                        Your rating
                      </label>

                      <div className="mt-2 flex items-center gap-1">

                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <button
                              key={
                                star
                              }
                              type="button"
                              onClick={() =>
                                setReviewRating(
                                  star
                                )
                              }
                              aria-label={`Rate ${star} star${
                                star >
                                1
                                  ? "s"
                                  : ""
                              }`}
                              className={`text-3xl leading-none transition hover:scale-110 ${
                                star <=
                                reviewRating
                                  ? "text-yellow-400"
                                  : "text-slate-300"
                              }`}
                            >
                              ★
                            </button>
                          )
                        )}

                        <span className="ml-2 text-xs font-black text-slate-500">
                          {
                            reviewRating
                          }
                          /5
                        </span>
                      </div>

                      <label
                        className="mt-5 block text-xs font-black text-slate-800"
                        htmlFor="customer-review"
                      >
                        Your comment
                      </label>

                      <textarea
                        id="customer-review"
                        value={
                          reviewComment
                        }
                        onChange={(
                          event
                        ) => {
                          setReviewComment(
                            event
                              .target
                              .value
                          );

                          setReviewSubmitted(
                            false
                          );
                        }}
                        rows="5"
                        placeholder="Tell us what went well or how we can improve..."
                        className="mt-2 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                      />

                      <div className="mt-3 flex flex-wrap gap-2">

                        <button
                          type="submit"
                          className="rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-black text-white hover:bg-emerald-800"
                        >
                          {editingReviewId
                            ? "Save Review Changes"
                            : "Submit New Review"}
                        </button>

                        {editingReviewId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingReviewId(
                                null
                              );

                              setReviewComment(
                                ""
                              );

                              setReviewRating(
                                5
                              );
                            }}
                            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50"
                          >
                            Cancel Edit
                          </button>
                        )}
                      </div>

                      {reviewSubmitted && (
                        <p className="mt-3 text-xs font-bold text-emerald-700">
                          ✓ Review submitted successfully.
                        </p>
                      )}
                    </form>

                    {reviewHistory.length >
                      0 && (
                      <div className="mt-7 max-w-2xl border-t border-slate-200 pt-5">

                        <h3 className="text-sm font-black text-slate-900">
                          Your submitted reviews
                        </h3>

                        <div className="mt-3 space-y-3">

                          {reviewHistory.map(
                            (review) => (
                              <div
                                key={
                                  review.id
                                }
                                className="rounded-2xl bg-slate-50 p-4"
                              >

                                <div className="flex items-center justify-between gap-3">

                                  <span className="text-yellow-400">
                                    {"★".repeat(
                                      review.rating
                                    )}

                                    <span className="text-slate-300">
                                      {"★".repeat(
                                        5 -
                                          review.rating
                                      )}
                                    </span>
                                  </span>

                                  <span className="text-[9px] font-bold text-slate-400">
                                    {
                                      review.date
                                    }
                                  </span>
                                </div>

                                <p className="mt-2 text-xs leading-5 text-slate-600">
                                  {
                                    review.comment
                                  }
                                </p>

                                <div className="mt-3 flex gap-2">

                                  <button
                                    type="button"
                                    onClick={() =>
                                      editReview(
                                        review
                                      )
                                    }
                                    className="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-[10px] font-black text-emerald-700 hover:bg-emerald-50"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteReview(
                                        review.id
                                      )
                                    }
                                    className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[10px] font-black text-red-600 hover:bg-red-50"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </article>
                )}
              </section>
            )}
          </div>
        </main>
      </div>

      {/* =========================
          LOGOUT MODAL
      ========================== */}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 p-4">

          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Icon
                name="logout"
                className="h-6 w-6"
              />
            </div>

            <h2 className="mt-4 text-xl font-black text-slate-950">
              Log out of workspace?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Are you absolutely sure you want to log out of your cleaning workspace? ⚠️
            </p>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setShowLogoutConfirm(
                    false
                  )
                }
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50"
              >
                Stay Logged In
              </button>

              <button
                type="button"
                onClick={
                  confirmLogout
                }
                className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-black text-white hover:bg-red-700"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          RECEIPT MODAL
      ========================== */}

      {showReceipt &&
        receiptBookingId !==
          null &&
        (() => {
          const receiptBooking =
            normalizedBookings.find(
              (booking) =>
                Number(
                  booking.id
                ) ===
                Number(
                  receiptBookingId
                )
            );

          if (!receiptBooking)
            return null;

          return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4">

              <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">

                <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                      Abyssinia Clean
                    </p>

                    <h2 className="mt-1 text-xl font-black text-slate-950">
                      Payment Receipt #
                      {
                        receiptBooking.id
                      }
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Receipt generated from your completed booking.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowReceipt(
                        false
                      );

                      setReceiptBookingId(
                        null
                      );
                    }}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600 hover:bg-slate-200"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-3 p-6">

                  <div className="rounded-2xl bg-slate-50 p-4">

                    <div className="flex justify-between gap-4 border-b border-slate-200 py-2 text-xs">
                      <span className="text-slate-500">
                        Customer
                      </span>

                      <strong>
                        {
                          displayName
                        }
                      </strong>
                    </div>

                    <div className="flex justify-between gap-4 border-b border-slate-200 py-2 text-xs">
                      <span className="text-slate-500">
                        Service
                      </span>

                      <strong>
                        {
                          receiptBooking.service_name
                        }
                      </strong>
                    </div>

                    <div className="flex justify-between gap-4 border-b border-slate-200 py-2 text-xs">
                      <span className="text-slate-500">
                        Date
                      </span>

                      <strong>
                        {formatDate(
                          receiptBooking.booking_date
                        )}
                      </strong>
                    </div>

                    <div className="flex justify-between gap-4 border-b border-slate-200 py-2 text-xs">
                      <span className="text-slate-500">
                        Time
                      </span>

                      <strong>
                        {formatTime(
                          receiptBooking.booking_time
                        )}
                      </strong>
                    </div>

                    <div className="flex justify-between gap-4 border-b border-slate-200 py-2 text-xs">
                      <span className="text-slate-500">
                        Payment
                      </span>

                      <strong>
                        {
                          selectedPayment
                        }
                      </strong>
                    </div>

                    <div className="flex justify-between gap-4 pt-4 text-base">
                      <span className="font-black text-slate-700">
                        Total
                      </span>

                      <strong className="text-emerald-700">
                        {Number(
                          receiptBooking.price ||
                            receiptBooking.amount ||
                            0
                        ).toLocaleString()}{" "}
                        Br
                      </strong>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">

                    <button
                      type="button"
                      onClick={() =>
                        handlePrintReceipt(
                          receiptBooking
                        )
                      }
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50"
                    >
                      Print Receipt
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDownloadReceipt(
                          receiptBooking
                        )
                      }
                      className="flex-1 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-black text-white hover:bg-emerald-800"
                    >
                      Download Receipt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* =========================
          BUSINESS CARD MODAL
      ========================== */}

      {showCard && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/75 p-4">

          <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                  Customer resource
                </p>

                <h2 className="text-lg font-black text-slate-950">
                  Abyssinia Clean Business Card
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCard(false)
                }
                className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-600"
              >
                Close
              </button>
            </div>

            <div className="bg-slate-100 p-4">

              <div className="mb-4 rounded-2xl bg-white px-5 py-4 text-center shadow-sm">

                <p className="text-sm font-black tracking-[0.28em] text-slate-950">
                  ABYSSINIA{" "}
                  <span className="text-emerald-700">
                    CLEAN
                  </span>
                </p>

                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Customer Business Card
                </p>
              </div>

              <img
                src={
                  businessCardImg
                }
                alt="Abyssinia Clean Business Card"
                className="mx-auto max-h-[60vh] w-auto rounded-xl object-contain shadow-lg"
              />
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-200 p-4 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => {
                  const w =
                    window.open(
                      businessCardImg,
                      "_blank",
                      "width=900,height=700"
                    );

                  if (!w) {
                    setError(
                      "Please allow pop-ups to print the business card."
                    );
                    return;
                  }

                  setTimeout(
                    () =>
                      w.print(),
                    700
                  );
                }}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-black text-slate-700"
              >
                Print
              </button>

              <a
                href={
                  businessCardImg
                }
                download="Abyssinia_Clean_Business_Card.png"
                className="rounded-xl bg-emerald-700 px-5 py-2.5 text-center text-xs font-black text-white"
              >
                Download PNG
              </a>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          BOOKING MODAL
      ========================== */}

      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">

          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                  Abyssinia Clean
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-950">
                  Schedule a Cleaning
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Tell us about your property and preferred schedule.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeBookingForm
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                aria-label="Close booking form"
              >
                <Icon
                  name="x"
                  className="h-4 w-4"
                />
              </button>
            </div>

            <form
              onSubmit={
                handleCreateBooking
              }
              className="space-y-5 p-6"
            >

              {/* SERVICE */}

              <div>
                <label className="mb-2 block text-xs font-black text-slate-800">
                  Cleaning Service *
                </label>

                {servicesLoading ? (
                  <div className="rounded-xl border border-slate-200 px-4 py-3 text-xs text-slate-500">
                    Loading services...
                  </div>
                ) : (
                  <select
                    name="service_id"
                    value={
                      formData.service_id
                    }
                    onChange={
                      handleChange
                    }
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value="">
                      Select a cleaning service
                    </option>

                    {services.map(
                      (service) => (
                        <option
                          key={
                            service.id
                          }
                          value={
                            service.id
                          }
                        >
                          {service.service_name ||
                            service.name}
                          {service.price
                            ? ` — Br ${service.price}`
                            : ""}
                        </option>
                      )
                    )}
                  </select>
                )}
              </div>

              {/* SERVICE TYPE */}

              <div>
                <label className="mb-2 block text-xs font-black text-slate-800">
                  Service Type *
                </label>

                <select
                  name="service_type"
                  value={
                    formData.service_type
                  }
                  onChange={
                    handleChange
                  }
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                >
                  {SERVICE_TYPES.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* PROPERTY */}

              <div>
                <label className="mb-2 block text-xs font-black text-slate-800">
                  Property Details
                </label>

                <div className="grid gap-3 sm:grid-cols-3">

                  <input
                    type="number"
                    name="bedrooms"
                    value={
                      formData.bedrooms
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                    max="50"
                    placeholder="Bedrooms"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />

                  <input
                    type="number"
                    name="bathrooms"
                    value={
                      formData.bathrooms
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                    max="50"
                    placeholder="Bathrooms"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />

                  <input
                    type="number"
                    name="square_footage"
                    value={
                      formData.square_footage
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                    placeholder="Square feet"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* ADDONS */}

              <div>
                <label className="mb-2 block text-xs font-black text-slate-800">
                  Add-ons
                </label>

                <div className="grid gap-2 sm:grid-cols-2">

                  {ADDONS.map(
                    (addon) => {
                      const selected =
                        formData.addons.includes(
                          addon.name
                        );

                      return (
                        <label
                          key={
                            addon.id
                          }
                          className={`cursor-pointer rounded-xl border p-3 transition ${
                            selected
                              ? "border-emerald-400 bg-emerald-50"
                              : "border-slate-200 hover:border-emerald-200"
                          }`}
                        >
                          <div className="flex items-center gap-2">

                            <input
                              type="checkbox"
                              checked={
                                selected
                              }
                              onChange={() =>
                                handleAddonChange(
                                  addon.name
                                )
                              }
                              className="h-4 w-4 accent-emerald-700"
                            />

                            <span className="text-xs font-bold text-slate-700">
                              {
                                addon.name
                              }
                            </span>
                          </div>
                        </label>
                      );
                    }
                  )}
                </div>
              </div>

              {/* DATE + TIME */}

              <div className="grid gap-3 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-xs font-black text-slate-800">
                    Booking Date *
                  </label>

                  <input
                    type="date"
                    name="booking_date"
                    value={
                      formData.booking_date
                    }
                    onChange={
                      handleChange
                    }
                    min={today}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black text-slate-800">
                    Booking Time *
                  </label>

                  <input
                    type="time"
                    name="booking_time"
                    value={
                      formData.booking_time
                    }
                    onChange={
                      handleChange
                    }
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* ADDRESS */}

              <div>
                <label className="mb-2 block text-xs font-black text-slate-800">
                  Service Address *
                </label>

                <textarea
                  name="address"
                  value={
                    formData.address
                  }
                  onChange={
                    handleChange
                  }
                  required
                  rows="3"
                  placeholder="Example: Bole, Addis Ababa"
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              {/* ACTIONS */}

              <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row">

                <button
                  type="button"
                  onClick={
                    closeBookingForm
                  }
                  disabled={
                    submitting
                  }
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-black text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    servicesLoading
                  }
                  className="flex-1 rounded-xl bg-emerald-700 py-3 text-sm font-black text-white shadow-lg shadow-emerald-700/20 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "Creating Booking..."
                    : "Create Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;