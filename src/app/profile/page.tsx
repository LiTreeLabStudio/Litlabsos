"use client";

import { useState, useRef } from "react";
import { useTheme, darkSkins, lightSkins, type SkinPreset, type AccentColor } from "@/context/ThemeContext";
import { useProfile, type UserProfile } from "@/context/ProfileContext";

export default function ProfilePage() {
  const { resolvedColors } = useTheme();
  const { profile, updateProfile } = useProfile();
  
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [visitorCount, setVisitorCount] = useState(133742);
  const [newInterest, setNewInterest] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ coverUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && profile.interests.length < 10) {
      updateProfile({ interests: [...profile.interests, newInterest.trim()] });
      setNewInterest("");
    }
  };

  const removeInterest = (index: number) => {
    const newInterests = [...profile.interests];
    newInterests.splice(index, 1);
    updateProfile({ interests: newInterests });
  };

  const moods = ["😀 Happy", "😎 Cool", "💡 Creative", "🔥 Hot", "🎯 Focused", "🌟 Stellar", "💪 Strong", "🎵 Chill", "🚀 Launching", "😴 Tired", "🤔 Thinking", "💭 Dreaming"];

  const skinPresets: SkinPreset[] = ["cyberpunk", "retro", "ocean", "sunset", "matrix", "pink"];
  const accentColors: AccentColor[] = ["neon-green", "hot-pink", "electric-blue", "cyber-yellow", "matrix-green", "sunset-orange", "ocean-blue", "purple-haze"];

  return (
    <div 
      className="min-h-screen" 
      style={{ backgroundColor: resolvedColors.bgColor, color: resolvedColors.textColor }}
    >
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 overflow-hidden cursor-pointer group" onClick={() => coverInputRef.current?.click()}>
        {profile.coverUrl ? (
          <img src={profile.coverUrl} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: resolvedColors.headerColor }}>
            <span className="text-4xl opacity-50">📷 Add Cover Photo</span>
          </div>
        )}
        <input type="file" ref={coverInputRef} onChange={handleCoverUpload} accept="image/*" className="hidden" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <span className="text-white font-bold">Click to Change Cover</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-12 gap-6">
        {/* Left Column - Profile Info */}
        <div className="md:col-span-4 space-y-4">
          {/* Profile Picture */}
          <div className="border-2 p-4 text-center" style={{ borderColor: resolvedColors.borderColor, backgroundColor: resolvedColors.boxBg }}>
            <input type="file" ref={avatarInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
            <div
              className="w-40 h-40 mx-auto mb-4 cursor-pointer relative group overflow-hidden"
              style={{ 
                backgroundColor: resolvedColors.headerColor,
                border: `4px solid ${resolvedColors.borderColor}`
              }}
              onClick={() => avatarInputRef.current?.click()}
            >
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl">👤</span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <span className="text-white text-sm font-bold">📷 Upload</span>
              </div>
            </div>

            {/* Display Name - Editable */}
            {editingSection === "name" ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => updateProfile({ displayName: e.target.value })}
                  className="w-full p-2 text-center font-bold text-xl border-2"
                  style={{ backgroundColor: resolvedColors.bgColor, color: resolvedColors.textColor, borderColor: resolvedColors.borderColor }}
                />
                <button
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-1 text-sm font-bold"
                  style={{ backgroundColor: resolvedColors.linkColor, color: "white" }}
                >
                  Save
                </button>
              </div>
            ) : (
              <h2 
                className="text-2xl font-bold cursor-pointer hover:opacity-80"
                style={{ color: resolvedColors.headerColor }}
                onClick={() => setEditingSection("name")}
              >
                {profile.displayName} ✏️
              </h2>
            )}

            <p className="text-sm" style={{ color: resolvedColors.accentColor }}>● Online Now</p>
            <p className="text-xs mt-1" style={{ color: resolvedColors.textColor }}>@{profile.username}</p>

            {/* Mood - Editable */}
            <div className="mt-3">
              {editingSection === "mood" ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={profile.mood}
                    onChange={(e) => updateProfile({ mood: e.target.value })}
                    className="w-full p-2 text-sm border-2"
                    style={{ backgroundColor: resolvedColors.bgColor, color: resolvedColors.textColor, borderColor: resolvedColors.borderColor }}
                    placeholder="What's your mood?"
                  />
                  <div className="flex flex-wrap gap-1 justify-center">
                    {moods.map((mood) => (
                      <button
                        key={mood}
                        onClick={() => { updateProfile({ mood }); setEditingSection(null); }}
                        className="px-2 py-1 text-xs border"
                        style={{ borderColor: resolvedColors.borderColor }}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setEditingSection(null)}
                    className="px-4 py-1 text-sm font-bold"
                    style={{ backgroundColor: resolvedColors.linkColor, color: "white" }}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p 
                  className="text-sm cursor-pointer hover:opacity-80"
                  onClick={() => setEditingSection("mood")}
                  style={{ color: resolvedColors.accentColor }}
                >
                  Mood: <strong>{profile.mood}</strong> ✏️
                </p>
              )}
            </div>
          </div>

          {/* Contact & Actions */}
          <div className="border-2 p-4" style={{ borderColor: resolvedColors.borderColor, backgroundColor: resolvedColors.boxBg }}>
            <h3 className="font-bold mb-3" style={{ color: resolvedColors.headerColor }}>Actions</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button className="p-2 border-2 hover:scale-105 transition-transform" style={{ borderColor: resolvedColors.borderColor }}>
                📧 Message
              </button>
              <button className="p-2 border-2 hover:scale-105 transition-transform" style={{ borderColor: resolvedColors.borderColor }}>
                👥 Add Friend
              </button>
              <button className="p-2 border-2 hover:scale-105 transition-transform" style={{ borderColor: resolvedColors.borderColor }}>
                ⭐ Favorite
              </button>
              <button className="p-2 border-2 hover:scale-105 transition-transform" style={{ borderColor: resolvedColors.borderColor }}>
                🔗 Share
              </button>
            </div>
          </div>

          {/* Music Links */}
          <div className="border-2 p-4" style={{ borderColor: resolvedColors.borderColor, backgroundColor: resolvedColors.boxBg }}>
            <h3 className="font-bold mb-3" style={{ color: resolvedColors.headerColor }}>🎵 Music</h3>
            {editingSection === "music" ? (
              <div className="space-y-2">
                <input
                  type="url"
                  placeholder="Spotify URL"
                  value={profile.musicLinks.spotify || ""}
                  onChange={(e) => updateProfile({ musicLinks: { ...profile.musicLinks, spotify: e.target.value } })}
                  className="w-full p-2 text-xs border-2"
                  style={{ backgroundColor: resolvedColors.bgColor, color: resolvedColors.textColor, borderColor: resolvedColors.borderColor }}
                />
                <input
                  type="url"
                  placeholder="YouTube Music URL"
                  value={profile.musicLinks.youtube || ""}
                  onChange={(e) => updateProfile({ musicLinks: { ...profile.musicLinks, youtube: e.target.value } })}
                  className="w-full p-2 text-xs border-2"
                  style={{ backgroundColor: resolvedColors.bgColor, color: resolvedColors.textColor, borderColor: resolvedColors.borderColor }}
                />
                <input
                  type="url"
                  placeholder="SoundCloud URL"
                  value={profile.musicLinks.soundcloud || ""}
                  onChange={(e) => updateProfile({ musicLinks: { ...profile.musicLinks, soundcloud: e.target.value } })}
                  className="w-full p-2 text-xs border-2"
                  style={{ backgroundColor: resolvedColors.bgColor, color: resolvedColors.textColor, borderColor: resolvedColors.borderColor }}
                />
                <input
                  type="url"
                  placeholder="Apple Music URL"
                  value={profile.musicLinks.appleMusic || ""}
                  onChange={(e) => updateProfile({ musicLinks: { ...profile.musicLinks, appleMusic: e.target.value } })}
                  className="w-full p-2 text-xs border-2"
                  style={{ backgroundColor: resolvedColors.bgColor, color: resolvedColors.textColor, borderColor: resolvedColors.borderColor }}
                />
                <button
                  onClick={() => setEditingSection(null)}
                  className="w-full px-4 py-2 text-sm font-bold"
                  style={{ backgroundColor: resolvedColors.linkColor, color: "white" }}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {profile.musicLinks.spotify && (
                  <a href={profile.musicLinks.spotify} target="_blank" className="flex items-center gap-2 p-2 border" style={{ borderColor: resolvedColors.borderColor }}>
                    <span>🎧</span> Spotify
                  </a>
                )}
                {profile.musicLinks.youtube && (
                  <a href={profile.musicLinks.youtube} target="_blank" className="flex items-center gap-2 p-2 border" style={{ borderColor: resolvedColors.borderColor }}>
                    <span>🎵</span> YouTube Music
                  </a>
                )}
                {profile.musicLinks.soundcloud && (
                  <a href={profile.musicLinks.soundcloud} target="_blank" className="flex items-center gap-2 p-2 border" style={{ borderColor: resolvedColors.borderColor }}>
                    <span>☁️</span> SoundCloud
                  </a>
                )}
                {profile.musicLinks.appleMusic && (
                  <a href={profile.musicLinks.appleMusic} target="_blank" className="flex items-center gap-2 p-2 border" style={{ borderColor: resolvedColors.borderColor }}>
                    <span>🍎</span> Apple Music
                  </a>
                )}
                {!profile.musicLinks.spotify && !profile.musicLinks.youtube && !profile.musicLinks.soundcloud && !profile.musicLinks.appleMusic && (
                  <p 
                    className="cursor-pointer hover:opacity-80 text-center p-2 border-2 border-dashed"
                    style={{ borderColor: resolvedColors.borderColor, color: resolvedColors.accentColor }}
                    onClick={() => setEditingSection("music")}
                  >
                    + Add Music Links ✏️
                  </p>
                )}
                {(profile.musicLinks.spotify || profile.musicLinks.youtube || profile.musicLinks.soundcloud || profile.musicLinks.appleMusic) && (
                  <button
                    onClick={() => setEditingSection("music")}
                    className="w-full p-2 text-xs border-2"
                    style={{ borderColor: resolvedColors.accentColor, color: resolvedColors.accentColor }}
                  >
                    ✏️ Edit Music
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Video Links */}
          <div className="border-2 p-4" style={{ borderColor: resolvedColors.borderColor, backgroundColor: resolvedColors.boxBg }}>
            <h3 className="font-bold mb-3" style={{ color: resolvedColors.headerColor }}>🎥 Videos</h3>
            {editingSection === "video" ? (
              <div className="space-y-2">
                <input
                  type="url"
                  placeholder="YouTube URL"
                  value={profile.videoLinks.youtube || ""}
                  onChange={(e) => updateProfile({ videoLinks: { ...profile.videoLinks, youtube: e.target.value } })}
                  className="w-full p-2 text-xs border-2"
                  style={{ backgroundColor: resolvedColors.bgColor, color: resolvedColors.textColor, borderColor: resolvedColors.borderColor }}
                />
                <input
                  type="url"
                  placeholder="Vimeo URL"
                  value={profile.videoLinks.vimeo || ""}
                  onChange={(e) => updateProfile({ videoLinks: { ...profile.videoLinks, vimeo: e.target.value } })}
                  className="w-full p-2 text-xs border-2"
                  style={{ backgroundColor: resolvedColors.bgColor, color: resolvedColors.textColor, borderColor: resolvedColors.borderColor }}
                />
                <button
                  onClick={() => setEditingSection(null)}
                  className="w-full px-4 py-2 text-sm font-bold"
                  style={{ backgroundColor: resolvedColors.linkColor, color: "white" }}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {profile.videoLinks.youtube && (
                  <a href={profile.videoLinks.youtube} target="_blank" className="flex items-center gap-2 p-2 border" style={{ borderColor: resolvedColors.borderColor }}>
                    <span>▶️</span> YouTube
                  </a>
                )}
                {profile.videoLinks.vimeo && (
                  <a href={profile.videoLinks.vimeo} target="_blank" className="flex items-center gap-2 p-2 border" style={{ borderColor: resolvedColors.borderColor }}>
                    <span>🎬</span> Vimeo
                  </a>
                )}
                {!profile.videoLinks.youtube && !profile.videoLinks.vimeo && (
                  <p 
                    className="cursor-pointer hover:opacity-80 text-center p-2 border-2 border-dashed"
                    style={{ borderColor: resolvedColors.borderColor, color: resolvedColors.accentColor }}
                    onClick={() => setEditingSection("video")}
                  >
                    + Add Video Links ✏️
                  </p>
                )}
                {(profile.videoLinks.youtube || profile.videoLinks.vimeo) && (
                  <button
                    onClick={() => setEditingSection("video")}
                    className="w-full p-2 text-xs border-2"
                    style={{ borderColor: resolvedColors.accentColor, color: resolvedColors.accentColor }}
                  >
                    ✏️ Edit Videos
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="border-2 p-4" style={{ borderColor: resolvedColors.borderColor, backgroundColor: resolvedColors.boxBg }}>
            <h3 className="font-bold mb-3" style={{ color: resolvedColors.headerColor }}>🔗 Social</h3>
            {editingSection === "social" ? (
              <div className="space-y-2">
                <input
                  type="url"
                  placeholder="Twitter URL"
                  value={profile.socialLinks.twitter || ""}
                  onChange={(e) => updateProfile({ socialLinks: { ...profile.socialLinks, twitter: e.target.value } })}
                  className="w-full p-2 text-xs border-2"
                  style={{ backgroundColor: resolvedColors.bgColor, color: resolvedColors.textColor, borderColor: resolvedColors.borderColor }}
                />
                <input
                  type="url"
                  placeholder="Instagram URL"
                  value={profile.socialLinks.instagram || ""}
                  onChange={(e) => updateProfile({ socialLinks: { ...profile.socialLinks, instagram: e.target.value } })}
                  className="w-full p-2 text-xs border-2"
                  style={{ backgroundColor: resolvedColors.bgColor, color: resolvedColors.textColor, borderColor: resolvedColors.borderColor }}
                />
                <input
                  type="url"
                  placeholder="GitHub URL"
                  value={profile.socialLinks.github || ""}
                  onChange={(e) => updateProfile({ socialLinks: { ...profile.socialLinks, github: e.target.value } })}
                  className="w-full p-2 text-xs border-2"
                  style={{ backgroundColor: resolvedColors.bgColor, color: resolvedColors.textColor, borderColor: resolvedColors.borderColor }}
                />
                <input
                  type="url"
                  placeholder="LinkedIn URL"
                  value={profile.socialLinks.linkedin || ""}
                  onChange={(e) => updateProfile({ socialLinks: { ...profile.socialLinks, linkedin: e.target.value } })}
                  className="w-full p-2 text-xs border-2"
                  style={{ backgroundColor: resolvedColors.bgColor, color: resolvedColors.textColor, borderColor: resolvedColors.borderColor }}
                />
                <button
                  onClick={() => setEditingSection(null)}
                  className="w-full px-4 py-2 text-sm font-bold"
                  style={{ backgroundColor: resolvedColors.linkColor, color: "white" }}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {profile.socialLinks.twitter && (
                  <a href={profile.socialLinks.twitter} target="_blank" className="flex items-center gap-2 p-2 border" style={{ borderColor: resolvedColors.borderColor }}>
                    <span>🐦</span> Twitter
                  </a>
                )}
                {profile.socialLinks.instagram && (
                  <a href={profile.socialLinks.instagram} target="_blank" className="flex items-center gap-2 p-2 border" style={{ borderColor: resolvedColors.borderColor }}>
                    <span>📸</span> Instagram
                  </a>
                )}
                {profile.socialLinks.github && (
                  <a href={profile.socialLinks.github} target="_blank" className="flex items-center gap-2 p-2 border" style={{ borderColor: resolvedColors.borderColor }}>
                    <span>💻</span> GitHub
                  </a>
                )}
                {profile.socialLinks.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" className="flex items-center gap-2 p-2 border" style={{ borderColor: resolvedColors.borderColor }}>
                    <span>💼</span> LinkedIn
                  </a>
                )}
                {!profile.socialLinks.twitter && !profile.socialLinks.instagram && !profile.socialLinks.github && !profile.socialLinks.linkedin && (
                  <p 
                    className="cursor-pointer hover:opacity-80 text-center p-2 border-2 border-dashed"
                    style={{ borderColor: resolvedColors.borderColor, color: resolvedColors.accentColor }}
                    onClick={() => setEditingSection("social")}
                  >
                    + Add Social Links ✏️
                  </p>
                )}
                {(profile.socialLinks.twitter || profile.socialLinks.instagram || profile.socialLinks.github || profile.socialLinks.linkedin) && (
                  <button
                    onClick={() => setEditingSection("social")}
                    className="w-full p-2 text-xs border-2"
                    style={{ borderColor: resolvedColors.accentColor, color: resolvedColors.accentColor }}
                  >
                    ✏️ Edit Social
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="border-2 p-4" style={{ borderColor: resolvedColors.borderColor, backgroundColor: resolvedColors.boxBg }}>
            <h3 className="font-bold mb-3" style={{ color: resolvedColors.headerColor }}>🏆 Badges</h3>
            <div className="flex flex-wrap gap-2">
              {profile.badges.map((badge, i) => (
                <span key={i} className="px-2 py-1 text-xs border-2" style={{ borderColor: resolvedColors.accentColor, color: resolvedColors.accentColor }}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="md:col-span-8 space-y-4">
          {/* Status/Mood Box */}
          <div className="border-2 p-4" style={{ borderColor: resolvedColors.borderColor, backgroundColor: resolvedColors.boxBg }}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💭</span>
              <p className="italic">
                <strong style={{ color: resolvedColors.accentColor }}>Mood:</strong> {profile.mood} | 
                <strong style={{ color: resolvedColors.accentColor }}> Currently:</strong> building something awesome
              </p>
            </div>
          </div>

          {/* About Me */}
          <div className="border-2 p-4" style={{ borderColor: resolvedColors.borderColor, backgroundColor: resolvedColors.boxBg }}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold" style={{ color: resolvedColors.headerColor }}>About Me</h3>
              <button 
                onClick={() => setEditingSection(editingSection === "bio" ? null : "bio")}
                className="text-xs px-2 py-1 border-2"
                style={{ borderColor: resolvedColors.accentColor, color: resolvedColors.accentColor }}
              >
                ✏️ Edit
              </button>
            </div>
            {editingSection === "bio" ? (
              <div className="space-y-2">
                <textarea
                  value={profile.bio}
                  onChange={(e) => updateProfile({ bio: e.target.value })}
                  className="w-full p-2 text-sm border-2 min-h-[100px]"
                  style={{ backgroundColor: resolvedColors.bgColor, color: resolvedColors.textColor, borderColor: resolvedColors.borderColor }}
                />
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs" style={{ color: resolvedColors.accentColor }}>Location:</label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => updateProfile({ location: e.target.value })}
                      className="w-full p-2 text-sm border-2 mt-1"
                      style={{ backgroundColor: resolvedColors.bgColor, color: resolvedColors.textColor, borderColor: resolvedColors.borderColor }}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs" style={{ color: resolvedColors.accentColor }}>Website:</label>
                    <input
                      type="url"
                      value={profile.website}
                      onChange={(e) => updateProfile({ website: e.target.value })}
                      className="w-full p-2 text-sm border-2 mt-1"
                      style={{ backgroundColor: resolvedColors.bgColor, color: resolvedColors.textColor, borderColor: resolvedColors.borderColor }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 text-sm font-bold"
                  style={{ backgroundColor: resolvedColors.linkColor, color: "white" }}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="text-sm leading-relaxed">
                <p style={{ color: resolvedColors.textColor }}>{profile.bio}</p>
                <div className="mt-2 flex flex-wrap gap-4 text-xs" style={{ color: resolvedColors.accentColor }}>
                  <span>📍 {profile.location}</span>
                  <span>🌐 <a href={profile.website} target="_blank" style={{ color: resolvedColors.linkColor }}>{profile.website}</a></span>
                </div>
              </div>
            )}
          </div>

          {/* Interests */}
          <div className="border-2 p-4" style={{ borderColor: resolvedColors.borderColor, backgroundColor: resolvedColors.boxBg }}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold" style={{ color: resolvedColors.headerColor }}>Interests</h3>
              <button 
                onClick={() => setEditingSection(editingSection === "interests" ? null : "interests")}
                className="text-xs px-2 py-1 border-2"
                style={{ borderColor: resolvedColors.accentColor, color: resolvedColors.accentColor }}
              >
                ✏️ Edit
              </button>
            </div>
            {editingSection === "interests" ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addInterest()}
                    placeholder="Add interest..."
                    className="flex-1 p-2 text-sm border-2"
                    style={{ backgroundColor: resolvedColors.bgColor, color: resolvedColors.textColor, borderColor: resolvedColors.borderColor }}
                  />
                  <button onClick={addInterest} className="px-4 py-2 text-sm font-bold" style={{ backgroundColor: resolvedColors.linkColor, color: "white" }}>
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, i) => (
                    <span key={i} className="px-2 py-1 text-xs border-2 flex items-center gap-1" style={{ borderColor: resolvedColors.borderColor }}>
                      {interest}
                      <button onClick={() => removeInterest(i)} className="ml-1 hover:opacity-70">×</button>
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 text-sm font-bold"
                  style={{ backgroundColor: resolvedColors.linkColor, color: "white" }}
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, i) => (
                  <span key={i} className="px-3 py-1 text-sm border-2" style={{ borderColor: resolvedColors.borderColor, color: resolvedColors.linkColor }}>
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Friends Grid */}
          <div className="border-2 p-4" style={{ borderColor: resolvedColors.borderColor, backgroundColor: resolvedColors.boxBg }}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold" style={{ color: resolvedColors.headerColor }}>Friends (133)</h3>
              <button className="text-xs" style={{ color: resolvedColors.linkColor }}>View All →</button>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="text-center">
                  <div 
                    className="w-full aspect-square flex items-center justify-center border-2 mb-1" 
                    style={{ borderColor: resolvedColors.borderColor, backgroundColor: "#333" }}
                  >
                    <span className="text-2xl">👤</span>
                  </div>
                  <span className="text-xs" style={{ color: resolvedColors.linkColor }}>
                    {["SarahCodes", "DevDave", "PixelPete", "TechTina", "WebWizard", "CodeNinja"][i % 6]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="border-2 p-4" style={{ borderColor: resolvedColors.borderColor, backgroundColor: resolvedColors.boxBg }}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold" style={{ color: resolvedColors.headerColor }}>Photos</h3>
              <button className="text-xs" style={{ color: resolvedColors.linkColor }}>View All →</button>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i}
                  className="aspect-square flex items-center justify-center border-2 hover:scale-105 transition-transform cursor-pointer"
                  style={{ borderColor: resolvedColors.borderColor, backgroundColor: "#333" }}
                >
                  <span className="text-3xl">
                    {["🚀", "💻", "🎵", "⚡", "🔥", "🎨", "🌟", "🏆"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-2 p-4" style={{ borderColor: resolvedColors.borderColor, backgroundColor: resolvedColors.boxBg }}>
            <h3 className="font-bold mb-3" style={{ color: resolvedColors.headerColor }}>Comments</h3>
            <div className="space-y-3">
              {[
                { author: "TechBro99", time: "2 hours ago", text: "Yo this profile is fire! 🔥" },
                { author: "CodeQueen", time: "5 hours ago", text: "Love the vibes!" },
                { author: "DesignDave", time: "1 day ago", text: "Custom theme feature is genius!" },
              ].map((comment, i) => (
                <div key={i} className="border-b border-dashed pb-3" style={{ borderColor: resolvedColors.borderColor }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">👤</span>
                    <span className="font-bold text-sm" style={{ color: resolvedColors.linkColor }}>{comment.author}</span>
                    <span className="text-xs" style={{ color: resolvedColors.accentColor }}>- {comment.time}</span>
                  </div>
                  <p className="text-sm ml-8" style={{ color: resolvedColors.textColor }}>{comment.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <textarea
                placeholder="Write a comment..."
                className="w-full p-2 text-sm border-2 min-h-[60px]"
                style={{ backgroundColor: resolvedColors.bgColor, color: resolvedColors.textColor, borderColor: resolvedColors.borderColor }}
              />
              <button 
                className="mt-2 px-4 py-2 text-sm font-bold"
                style={{ backgroundColor: resolvedColors.linkColor, color: "white" }}
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 mt-6 p-4 text-center text-xs" style={{ borderColor: resolvedColors.borderColor, backgroundColor: resolvedColors.boxBg }}>
        <div className="mb-2">
          <span className="font-bold text-lg" style={{ color: resolvedColors.accentColor }}>{visitorCount.toLocaleString()}</span> visitors
          <button 
            onClick={() => setVisitorCount(v => v + 1)}
            className="ml-2 px-2 py-1 text-xs border-2"
            style={{ borderColor: resolvedColors.borderColor }}
          >
            +1
          </button>
        </div>
        <div style={{ color: resolvedColors.textColor }}>
          © {new Date().getFullYear()} LiTTree Lab Studios | Powered by ⚡GOD-CORE
        </div>
      </div>
    </div>
  );
}