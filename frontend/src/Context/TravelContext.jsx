import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export const TravelContext = createContext(
  /** @type {TravelContextType | null} */ (null)
);

/**
 * Sanitizes a package name by trimming whitespace and removing unsafe characters
 * Keeps letters (including accented), numbers, spaces, and hyphens
 * @param {string} name
 * @returns {string}
 */
const sanitizePackageName = (name) => {
  if (!name) return "";
  return name.trim().replace(/[^\p{L}\p{N}\s-]/gu, "");
};

/**
 * Validates a package object
 * @param {Package} pkg
 * @returns {boolean}
 */
const isValidPackage = (pkg) =>
  pkg &&
  typeof pkg.name === "string" &&
  pkg.name.trim() !== "" &&
  typeof pkg.price === "number";

/**
 * @param {{ children: React.ReactNode }} props
 */
export const TravelContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // Initialize states with localStorage fallback
  const [currency, setCurrency] = useState(
    () => localStorage.getItem("currency") || "USD"
  );
  const [addpackage, setaddpackage] = useState(() => {
    try {
      const saved = localStorage.getItem("addpackage");
      const packages = saved ? JSON.parse(saved) : [];
      return packages
        .filter(isValidPackage)
        .map((pkg) => ({ ...pkg, name: sanitizePackageName(pkg.name) }));
    } catch {
      return [];
    }
  });
  const [addtrend, setaddtrend] = useState(() => {
    try {
      const saved = localStorage.getItem("addtrend");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [addgallery, setaddgallery] = useState(() => {
    try {
      const saved = localStorage.getItem("addgallery");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist states to localStorage
  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem("addpackage", JSON.stringify(addpackage));
  }, [addpackage]);

  useEffect(() => {
    localStorage.setItem("addtrend", JSON.stringify(addtrend));
  }, [addtrend]);

  useEffect(() => {
    localStorage.setItem("addgallery", JSON.stringify(addgallery));
  }, [addgallery]);

  // Fetch latest trending data on mount and listen for cross-tab updates
  const normalizeImage = (img) => {
    if (!img) return null;
    if (/^https?:\/\//i.test(img)) return img;
    return `${backendUrl.replace(/\/$/, "")}/uploads/${img}`;
  };

  const normalizeItemImages = (item) => {
    const copy = { ...item };

    // Normalize otherimages array if present
    if (Array.isArray(copy.otherimages) && copy.otherimages.length > 0) {
      copy.otherimages = copy.otherimages
        .map((img) => normalizeImage(img))
        .filter(Boolean);
    }

    // Normalize mainImage and legacy image fields
    if (copy.mainImage) {
      copy.mainImage = normalizeImage(copy.mainImage);
    }

    [
      "image",
      "image1",
      "image2",
      "image3",
      "image4",
      "image5",
      "image6",
    ].forEach((field) => {
      if (copy[field]) copy[field] = normalizeImage(copy[field]);
    });

    return copy;
  };

  const fetchTrendingData = async () => {
    try {
      const trendRes = await axios.get(`${backendUrl}/api/trending/trenddata`);
      if (trendRes?.data) {
        const normalized = Array.isArray(trendRes.data)
          ? trendRes.data.map(normalizeItemImages)
          : [];
        setaddtrend(normalized);
        // initial load success (no toast spam on realtime events)
        // toast.success('Trends loaded successfully');
      }
    } catch (error) {
      console.error(error);
      // toast.error('Failed to load trends. Please try again.');
    }
  };

  useEffect(() => {
    fetchTrendingData();

    // Listen for cross-tab notifications (e.g., admin panel updates)
    const onStorage = (e) => {
      if (e.key === "trendingUpdatedAt") {
        fetchTrendingData();
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Socket.IO: listen for server-side events to refresh trends in real-time
  useEffect(() => {
    let socket;
    let cancelled = false;

    (async () => {
      try {
        const module = await import("socket.io-client");
        const ioClient =
          module.io || module.default?.io || module.default || module;
        if (cancelled) return;
        socket = ioClient(backendUrl, { transports: ["websocket"] });

        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);
        });

        socket.on("trendingUpdated", (payload) => {
          console.log("Received trendingUpdated via socket:", payload);
          fetchTrendingData();
          try {
            localStorage.setItem("trendingUpdatedAt", String(Date.now()));
          } catch (e) {
            /* ignore */
          }
        });

        socket.on("disconnect", () => {
          console.log("Socket disconnected");
        });
      } catch (err) {
        console.warn(
          "Socket.IO client not available. Install socket.io-client to enable real-time updates.",
          err
        );
      }
    })();

    return () => {
      cancelled = true;
      if (socket) socket.disconnect();
    };
  }, []);

  // Navigation to special section
  const handleSpecial = () => {
    navigate("/");
    const scroll = document.getElementById("special-selection");
    if (scroll) scroll.scrollIntoView({ behavior: "smooth" });
  };

  // Currency setter
  const handleSetCurrency = (newCurrency) => {
    const supported = ["USD", "EUR", "GBP", "INR"];
    if (supported.includes(newCurrency)) {
      setCurrency(newCurrency);
      toast.info(`Currency changed to ${newCurrency}`);
    } else {
      toast.error("Unsupported currency");
    }
  };

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      currency,
      setCurrency: handleSetCurrency,
      handleSpecial,
      navigate,
      addpackage,
      setaddpackage,
      addtrend,
      setaddtrend,
      addgallery,
      setaddgallery,
    }),
    [currency, addpackage, addtrend, addgallery, navigate]
  );

  return (
    <TravelContext.Provider value={contextValue}>
      {children}
    </TravelContext.Provider>
  );
};

// Custom hook
export const useTravelContext = () => {
  const context = useContext(TravelContext);
  if (!context)
    throw new Error(
      "useTravelContext must be used within a TravelContextProvider"
    );
  return context;
};
