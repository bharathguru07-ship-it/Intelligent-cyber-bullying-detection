import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import {
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Cpu,
  Lock,
  BarChart3,
  Languages,
  CheckCircle2,
  AlertTriangle,
  Sun,
  Moon,
  GraduationCap,
} from 'lucide-react';
import { CircularConfidenceGauge } from '../components/CircularConfidenceGauge.tsx';

interface Props {
  onGetStarted: () => void;
  onGoToLogin: () => void;
}

export const LandingPage: React.FC<Props> = ({ onGetStarted, onGoToLogin }) => {
  const { theme, toggleTheme } = useTheme();
  const [testComment, setTestComment] = useState('Super inspiring project presentation!');
  const [analyzing, setAnalyzing] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const runLiveTest = async (commentText: string) => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: commentText }),
      });
      const data = await res.json();
      if (data.success) {
        setTestResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-[#0F172A] dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md border-b border-[#E2E8F0] dark:border-slate-800/80 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-[#0F172A] dark:text-slate-100">CyberDefense AI</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-[#E2E8F0] dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition cursor-pointer text-[#475569] dark:text-slate-300"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
          <button
            onClick={onGoToLogin}
            className="px-4 py-2 text-sm font-semibold text-[#475569] dark:text-slate-200 hover:text-indigo-600 transition cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={onGetStarted}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-[#4F46E5] hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30 transition cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-20 max-w-6xl mx-auto text-center relative overflow-hidden">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 max-w-4xl mx-auto leading-tight">
          Intelligent Cyber Bullying Detection
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Making online conversations safer with AI-powered real-time comment moderation. Multilingual support for English, Tamil Unicode, and Tanglish.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Live Interactive Sandbox Card */}
        <div className="mt-14 max-w-2xl mx-auto text-left rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live AI Inference Sandbox</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">TF-IDF + Calibrated Classifier</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={testComment}
              onChange={(e) => setTestComment(e.target.value)}
              placeholder="Try: 'Super project!' or 'நீ ஒரு முட்டாள்' or 'un moonjiya paaru'..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => runLiveTest(testComment)}
              disabled={analyzing}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm shrink-0 cursor-pointer transition flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>Test Inference</span>
                </>
              )}
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-500">
            <span className="font-medium">Try presets:</span>
            <button
              type="button"
              onClick={() => {
                setTestComment('You are doing amazing work on this project!');
                runLiveTest('You are doing amazing work on this project!');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              Safe (English)
            </button>
            <button
              type="button"
              onClick={() => {
                setTestComment('இந்த பதிவு மிகவும் பயனுள்ளதாக உள்ளது, வாழ்த்துக்கள்!');
                runLiveTest('இந்த பதிவு மிகவும் பயனுள்ளதாக உள்ளது, வாழ்த்துக்கள்!');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              Safe (Tamil)
            </button>
            <button
              type="button"
              onClick={() => {
                setTestComment('Why don’t you delete your account, you clown?');
                runLiveTest('Why don’t you delete your account, you clown?');
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-200 transition cursor-pointer"
            >
              Bullying (Warning)
            </button>
            <button
              type="button"
              onClick={() => {
                setTestComment('loosu maadhiri pesadha, mooditu po da.');
                runLiveTest('loosu maadhiri pesadha, mooditu po da.');
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-200 transition cursor-pointer"
            >
              Bullying (Tanglish)
            </button>
            <button
              type="button"
              onClick={() => {
                setTestComment('I will find where you live and beat you to death.');
                runLiveTest('I will find where you live and beat you to death.');
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 hover:bg-rose-200 transition cursor-pointer"
            >
              Severe (Blocked)
            </button>
          </div>

          {/* Test Result Display */}
          {testResult && (
            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md ${
                      testResult.prediction === 'safe'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : testResult.prediction === 'bullying'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  >
                    {testResult.prediction === 'safe' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {testResult.prediction === 'bullying' && <AlertTriangle className="w-3.5 h-3.5" />}
                    {testResult.prediction === 'severe_bullying' && <ShieldAlert className="w-3.5 h-3.5" />}
                    <span className="capitalize">{testResult.prediction.replace(/_/g, ' ')}</span>
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    [{testResult.language}]
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {testResult.reason}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <CircularConfidenceGauge
                  confidence={testResult.confidence}
                  prediction={testResult.prediction}
                  size={52}
                  strokeWidth={5}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Pipeline Section */}
      <section className="py-16 bg-[#F1F5F9]/80 dark:bg-slate-900/50 border-y border-[#E2E8F0] dark:border-slate-800/80 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] dark:text-indigo-400">
              System Architecture & Data Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2 text-[#0F172A] dark:text-slate-100">
              How CyberBullying Detection Works
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] dark:text-slate-400 max-w-xl mx-auto mt-2">
              Every submitted comment passes through a high-precision multi-stage NLP & Machine Learning pipeline in under 20 milliseconds.
            </p>
          </div>

          {/* Interactive Pipeline Steps */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative">
            {[
              {
                step: '01',
                title: 'USER COMMENT',
                desc: 'Input in English, Tamil script, or Tanglish code-mix.',
                icon: <ShieldCheck className="w-5 h-5 text-indigo-500" />,
              },
              {
                step: '02',
                title: 'TEXT PROCESSING',
                desc: 'Unicode normalization preserving Tamil range U+0B80–U+0BFF.',
                icon: <Cpu className="w-5 h-5 text-indigo-500" />,
              },
              {
                step: '03',
                title: 'NLP & TF-IDF',
                desc: 'Subword n-gram tokenization and weighted feature extraction.',
                icon: <Languages className="w-5 h-5 text-indigo-500" />,
              },
              {
                step: '04',
                title: 'CLASSIFICATION',
                desc: 'Probabilistic ML classifier evaluates toxic & severe signals.',
                icon: <BarChart3 className="w-5 h-5 text-indigo-500" />,
              },
              {
                step: '05',
                title: 'MODERATION',
                desc: 'Allow, issue warning banner, or block severe violations.',
                icon: <Lock className="w-5 h-5 text-indigo-500" />,
              },
            ].map((p, idx) => (
              <div
                key={p.step}
                className="rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-[#4F46E5] dark:text-indigo-400">
                      {p.step}
                    </span>
                    {p.icon}
                  </div>
                  <h3 className="font-bold text-sm tracking-tight text-[#0F172A] dark:text-slate-100">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-slate-400 mt-2 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] dark:text-indigo-400">
            Core Modules
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2 text-[#0F172A] dark:text-slate-100">
            Comprehensive AI Safety Platform
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'AI Detection',
              desc: 'High-speed NLP classifier trained on annotated social media corpora, detecting insults, harassment, and severe threats.',
              icon: <Cpu className="w-6 h-6 text-indigo-500" />,
            },
            {
              title: 'Real-Time Moderation',
              desc: 'Interactive feedback loop before a comment is published. Fosters digital empathy with prompt warnings.',
              icon: <ShieldAlert className="w-6 h-6 text-amber-500" />,
            },
            {
              title: 'NLP & Unicode Handling',
              desc: 'Zero character corruption for Tamil Unicode letters and phonetic Tanglish code-mixing common in South Indian social discourse.',
              icon: <Languages className="w-6 h-6 text-violet-500" />,
            },
            {
              title: 'Safe Conversations',
              desc: 'Maintains positive community spaces by preventing cyberbullying without censoring genuine constructive critique.',
              icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
            },
            {
              title: 'Analytics & Auditing',
              desc: 'Live administrative dashboard showing violation breakdown, language metrics, model evaluation scores, and audit logs.',
              icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
            },
            {
              title: 'Responsible AI',
              desc: 'Transparent confidence scores, algorithmic bias disclosure, and human-in-the-loop oversight principles.',
              icon: <GraduationCap className="w-6 h-6 text-purple-500" />,
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:border-indigo-500/50 transition group"
            >
              <div className="p-3 rounded-xl bg-[#F1F5F9] dark:bg-slate-800 w-fit mb-4 group-hover:scale-110 transition">
                {f.icon}
              </div>
              <h3 className="font-bold text-base text-[#0F172A] dark:text-slate-100">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-[#64748B] dark:text-slate-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-10 px-6 bg-white dark:bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span className="font-bold text-slate-700 dark:text-slate-300">Intelligent Cyber Bullying Detection</span>
          </div>
          <div>
            Built with modern React, Express, SQLite, Scikit-learn TF-IDF & Multilingual NLP.
          </div>
        </div>
      </footer>
    </div>
  );
};
