import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  ShieldCheck,
  Languages,
  Bell,
  Sliders,
  LogOut,
  CheckCircle2,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [sensitivity, setSensitivity] = useState<'lenient' | 'balanced' | 'strict'>('balanced');
  const [tamilSupport, setTamilSupport] = useState(true);
  const [notifyOnAudit, setNotifyOnAudit] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-4 lg:p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <SettingsIcon className="w-4 h-4" />
          <span>System Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
          Settings & Moderation Controls
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure detection sensitivity thresholds, appearance, and notifications.
        </p>
      </div>

      <div className="space-y-4">
        {/* Appearance Settings */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Interface Appearance
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Switch between high-contrast dark mode and crisp light mode.
              </p>
            </div>

            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Switch to Light Theme</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span>Switch to Dark Theme</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sensitivity Threshold Slider */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Classifier Threshold Sensitivity
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tune the probability cutoff for moderate cyberbullying warnings.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { id: 'lenient', label: 'Relaxed (75%)', desc: 'Minimizes false positives' },
              { id: 'balanced', label: 'Balanced (85%)', desc: 'Optimal default accuracy' },
              { id: 'strict', label: 'Strict (92%)', desc: 'Maximum harassment filter' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSensitivity(item.id as any);
                  handleSave();
                }}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                  sensitivity === item.id
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs">{item.label}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tamil & Tanglish NLP Engine Toggle */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 max-w-xl">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-indigo-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Tamil Unicode & Tanglish Lexicon Parsing
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Enables phonetic regex scanning and Unicode range U+0B80–U+0BFF preservation during tokenization.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={tamilSupport}
                onChange={(e) => {
                  setTamilSupport(e.target.checked);
                  handleSave();
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>
        </div>

        {/* Real-Time Audit Notifications */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 max-w-xl">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Real-Time Audit Notifications
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Receive notifications whenever a submitted comment is audited by the AI engine.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifyOnAudit}
                onChange={(e) => {
                  setNotifyOnAudit(e.target.checked);
                  handleSave();
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>
        </div>

        {/* Account Termination / Logout */}
        <div className="rounded-3xl border border-rose-200/60 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10 p-6 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Session Management
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Signed in as <span className="font-semibold text-slate-700 dark:text-slate-300">{user?.email}</span>
            </p>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-2xl bg-slate-900 text-white text-xs shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Settings preference saved</span>
        </div>
      )}
    </div>
  );
};
