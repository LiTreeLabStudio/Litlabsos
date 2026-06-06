"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

// User profile type
export interface UserProfile {
  displayName: string;
  username: string;
  bio: string;
  mood: string;
  litbit_coins: number;
  avatarUrl: string | null;
  coverUrl: string | null;
  location: string;
  website: string;
  interests: string[];
  musicLinks: {
    spotify?: string;
    youtube?: string;
    soundcloud?: string;
    appleMusic?: string;
  };
  videoLinks: {
    youtube?: string;
    vimeo?: string;
  };
  socialLinks: {
    twitter?: string;
    instagram?: string;
    github?: string;
    linkedin?: string;
  };
  badges: string[];
}

// Default profile
const defaultProfile: UserProfile = {
  displayName: "LiTreeCeo",
  username: "litree_ceo",
  bio: "CEO & Founder of LiTreeLabStudios. Building the future of AI agents. Welcome to my corner of the internet!",
  mood: "creative",
  litbit_coins: 0,
  avatarUrl: null,
  coverUrl: null,
  location: "Everywhere",
  website: "https://litlabs.net",
  interests: ["Web Development", "AI", "Music Production", "Entrepreneurship"],
  musicLinks: {},
  videoLinks: {},
  socialLinks: {},
  badges: ["🔥 Early Adopter", "🤖 Agent Builder", "💬 Community"],
};

// Context
interface ProfileContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  fetchProfile: () => Promise<void>;
  resetProfile: () => void;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/account");
      const data = await res.json();
      if (data.user) {
        setProfile((prev) => ({
          ...prev,
          displayName: data.user.name || prev.displayName,
          litbit_coins: data.user.litbit_coins ?? 0,
          // Merge other fields as needed
        }));
      }
    } catch (err) {
      console.error("[ProfileContext] Failed to fetch profile:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load from localStorage on mount and then fetch from server
  useEffect(() => {
    const stored = localStorage.getItem("litlabs-profile");
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse profile", e);
      }
    }
    setMounted(true);
    fetchProfile();
  }, [fetchProfile]);

  // Save to localStorage on change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("litlabs-profile", JSON.stringify(profile));
    }
  }, [profile, mounted]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const resetProfile = () => {
    setProfile(defaultProfile);
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, fetchProfile, resetProfile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return context;
}
