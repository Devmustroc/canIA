import { useState, useEffect } from "react";

export interface BrandKit {
  name: string;
  tagline: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  logos: string[];
}

export const DEFAULT_BRAND_KIT: BrandKit = {
  name: "Mon Entreprise",
  tagline: "L'innovation au service du design",
  colors: {
    primary: "#6366f1", // Indigo 500
    secondary: "#8b5cf6", // Purple 500
    accent: "#f59e0b", // Amber 500
    background: "#0f172a", // Slate 900
    text: "#ffffff",
  },
  fonts: {
    heading: "Arial Black",
    body: "Arial",
  },
  logos: [],
};

const STORAGE_KEY = "cania_brand_kit";

export const getStoredBrandKit = (): BrandKit => {
  if (typeof window === "undefined") return DEFAULT_BRAND_KIT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_BRAND_KIT;
    return { ...DEFAULT_BRAND_KIT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_BRAND_KIT;
  }
};

export const saveStoredBrandKit = (brandKit: BrandKit) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(brandKit));
    window.dispatchEvent(new Event("cania_brand_kit_updated"));
  } catch (err) {
    console.error("Failed to save brand kit to storage:", err);
  }
};

export const useBrandKit = () => {
  const [brandKit, setBrandKitState] = useState<BrandKit>(DEFAULT_BRAND_KIT);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setBrandKitState(getStoredBrandKit());
    setIsLoaded(true);

    const handleUpdate = () => {
      setBrandKitState(getStoredBrandKit());
    };

    window.addEventListener("cania_brand_kit_updated", handleUpdate);
    return () => window.removeEventListener("cania_brand_kit_updated", handleUpdate);
  }, []);

  const updateBrandKit = (newKit: Partial<BrandKit>) => {
    const updated = { ...brandKit, ...newKit };
    setBrandKitState(updated);
    saveStoredBrandKit(updated);
  };

  const updateColor = (key: keyof BrandKit["colors"], value: string) => {
    const updated = {
      ...brandKit,
      colors: {
        ...brandKit.colors,
        [key]: value,
      },
    };
    setBrandKitState(updated);
    saveStoredBrandKit(updated);
  };

  const updateFont = (key: keyof BrandKit["fonts"], value: string) => {
    const updated = {
      ...brandKit,
      fonts: {
        ...brandKit.fonts,
        [key]: value,
      },
    };
    setBrandKitState(updated);
    saveStoredBrandKit(updated);
  };

  return {
    brandKit,
    isLoaded,
    updateBrandKit,
    updateColor,
    updateFont,
  };
};
