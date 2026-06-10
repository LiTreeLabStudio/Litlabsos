"use client";

import { useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import { useUser } from "@clerk/nextjs";
import { Save, User as UserIcon, Mail, Globe, MapPin, Info } from "lucide-react";

export default function ProfileSettings() {
  const { profile, updateProfile } = useProfile();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    displayName: profile?.displayName || user?.fullName || "",
    username: profile?.username || user?.username || "",
    bio: profile?.bio || "",
    website: profile?.website || "",
    location: profile?.location || "",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-volcanic-text uppercase tracking-wider mb-1">
          Node Profile
        </h1>
        <p className="text-xs text-volcanic-text/40">
          Manage your identity across the hive mind.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-volcanic-text/40 uppercase tracking-widest flex items-center gap-1.5">
              <UserIcon size={12} />
              Display Name
            </label>
            <input 
              type="text"
              value={formData.displayName}
              onChange={e => setFormData({...formData, displayName: e.target.value})}
              className="w-full bg-black/40 border border-volcanic-border rounded px-3 py-2 text-sm text-volcanic-text focus:border-volcanic-accent outline-none transition-colors"
              placeholder="Your name"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-volcanic-text/40 uppercase tracking-widest flex items-center gap-1.5">
              <Mail size={12} />
              Username
            </label>
            <input 
              type="text"
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
              className="w-full bg-black/40 border border-volcanic-border rounded px-3 py-2 text-sm text-volcanic-text focus:border-volcanic-accent outline-none transition-colors"
              placeholder="unique_handle"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold text-volcanic-text/40 uppercase tracking-widest flex items-center gap-1.5">
            <Info size={12} />
            Biographical Data
          </label>
          <textarea 
            value={formData.bio}
            onChange={e => setFormData({...formData, bio: e.target.value})}
            rows={3}
            className="w-full bg-black/40 border border-volcanic-border rounded px-3 py-2 text-sm text-volcanic-text focus:border-volcanic-accent outline-none transition-colors resize-none"
            placeholder="Tell the hive about yourself..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-volcanic-text/40 uppercase tracking-widest flex items-center gap-1.5">
              <Globe size={12} />
              Web Interface
            </label>
            <input 
              type="text"
              value={formData.website}
              onChange={e => setFormData({...formData, website: e.target.value})}
              className="w-full bg-black/40 border border-volcanic-border rounded px-3 py-2 text-sm text-volcanic-text focus:border-volcanic-accent outline-none transition-colors"
              placeholder="https://..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-volcanic-text/40 uppercase tracking-widest flex items-center gap-1.5">
              <MapPin size={12} />
              Physical Location
            </label>
            <input 
              type="text"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              className="w-full bg-black/40 border border-volcanic-border rounded px-3 py-2 text-sm text-volcanic-text focus:border-volcanic-accent outline-none transition-colors"
              placeholder="Sector 7G"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-volcanic-accent text-black font-black text-[11px] uppercase tracking-widest rounded hover:bg-volcanic-accent/80 transition-all disabled:opacity-50"
          >
            <Save size={14} />
            {loading ? "Syncing..." : "Update Node"}
          </button>
          
          {success && (
            <span className="text-[10px] font-mono text-green-500 animate-pulse uppercase font-bold tracking-widest">
              Profile Synced Successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
