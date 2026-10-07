import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  User as UserIcon,
  ShieldCheck,
  Edit3,
  Lock,
  MessageSquare,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
  Camera,
} from 'lucide-react';
import { CircularConfidenceGauge } from '../components/CircularConfidenceGauge.tsx';

export const ProfilePage: React.FC = () => {
  const { user, token, refreshUser } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProfileData(data.profile);
        setEditFullName(data.profile.full_name);
        setEditBio(data.profile.bio || '');
        setEditAvatar(data.profile.avatar_url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    try {
      const payload: any = {
        full_name: editFullName,
        bio: editBio,
        avatar_url: editAvatar,
      };
      if (editPassword) {
        payload.new_password = editPassword;
      }

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setToastMsg('Profile updated successfully!');
        setShowEditModal(false);
        setEditPassword('');
        await refreshUser();
        await fetchProfile();
        setTimeout(() => setToastMsg(null), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 lg:p-6 space-y-6">
      {/* Profile Header Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
          <div className="relative group">
            <img
              src={profileData?.avatar_url || user?.avatar_url}
              alt="Profile"
              className="w-24 h-24 sm:w-28 sm:sem-28 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-md"
            />
            <button
              onClick={() => setShowEditModal(true)}
              className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-indigo-600 text-white shadow-md hover:bg-indigo-500 transition cursor-pointer"
              title="Change avatar"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                  {profileData?.full_name || user?.full_name}
                </h1>
                <div className="text-xs text-slate-400 font-mono">
                  @{profileData?.username || user?.username} · {profileData?.email || user?.email}
                </div>
              </div>

              <button
                onClick={() => setShowEditModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm cursor-pointer mx-auto sm:mx-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              {profileData?.bio || 'B.Sc. Artificial Intelligence & Data Science researcher actively contributing to multilingual toxicity prevention.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px] uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                {profileData?.role === 'admin' ? 'Administrator' : 'Verified Student'}
              </span>
              <span>Account Status: Active</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center">
            <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {profileData?.stats?.posts_count || 3}
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Posts Published</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center">
            <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {profileData?.stats?.comments_count || 8}
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Comments Active</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center">
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {profileData?.stats?.safety_score || 98}%
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Safety Rating</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center">
            <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {profileData?.stats?.violations_count || 0}
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Violations</div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Edit Profile Information
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Preset avatar select */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Choose Avatar
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {presetAvatars.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Avatar option ${i}`}
                      onClick={() => setEditAvatar(url)}
                      className={`w-11 h-11 rounded-2xl object-cover cursor-pointer border-2 transition ${
                        editAvatar === url ? 'border-indigo-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Bio
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Change Password (Leave blank to keep current)
                </label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="New password (min. 6 chars)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-2xl bg-slate-900 text-white text-xs shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
