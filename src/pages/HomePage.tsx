import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { CircularConfidenceGauge } from '../components/CircularConfidenceGauge.tsx';
import { MLPredictionResult } from '../types.ts';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  AlertTriangle,
  Sparkles,
  RotateCcw,
  Cpu,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  Send,
  Languages,
  Zap,
} from 'lucide-react';

interface Props {
  onNavigateToCheckText?: () => void;
  onNavigateToFeed?: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToAbout?: () => void;
}

export const HomePage: React.FC<Props> = ({
  onNavigateToCheckText,
  onNavigateToFeed,
  onNavigateToDashboard,
  onNavigateToAbout,
}) => {
  const { user } = useAuth();

  // State for detection
  const [inputText, setInputText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<MLPredictionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Analysis function calling the backend /api/predict
  const handleAnalyze = async (textToTest?: string) => {
    const text = (textToTest !== undefined ? textToTest : inputText).trim();
    if (!text) {
      setErrorMsg('Please enter a message or comment to analyze.');
      return;
    }

    setErrorMsg(null);
    setAnalyzing(true);

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: text }),
      });

      const data = await res.json();
      if (data.success) {
        setResult({
          prediction: data.prediction,
          classification: data.classification,
          confidence: data.confidence,
          moderation: data.moderation,
          action: data.action,
          category_display: data.category_display,
          reason: data.reason,
          language: data.language,
          detected_categories: data.detected_categories || [],
          tokens_analyzed: data.tokens_analyzed || [],
          is_code_mixed: !!data.is_code_mixed,
        });
      } else {
        setErrorMsg(data.error || 'Failed to analyze text.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error while analyzing message.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setErrorMsg(null);
  };

  const handleCopyResult = () => {
    if (!result) return;
    const text = `Result: ${result.classification} | Confidence: ${Math.round(
      result.confidence * 100
    )}% | Language: ${result.language} | Details: ${result.reason}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Example message presets
  const sampleMessages = [
    {
      category: 'Safe',
      text: 'You did a really good job on this presentation!',
      type: 'safe',
    },
    {
      category: 'Safe Tamil',
      text: 'இந்த பதிவு மிகவும் பயனுள்ளதாக உள்ளது, வாழ்த்துக்கள்!',
      type: 'safe',
    },
    {
      category: 'Questionable',
      text: 'Why do you even bother trying? Nobody cares about what you say.',
      type: 'warning',
    },
    {
      category: 'Harassment',
      text: 'You are completely useless, nobody likes you here, get lost.',
      type: 'severe',
    },
    {
      category: 'Tanglish Bullying',
      text: 'un moonjiya mirror la paathurukkiya, dummy piece mooditu po.',
      type: 'severe',
    },
  ];

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* ================================================== */}
      {/* HOME PAGE HEADER (From Image 1 Content)           */}
      {/* ================================================== */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-2 sm:pt-4">
        {/* Small badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-2xs">
          <span>🛡️</span>
          <span>Welcome to CyberDefense AI</span>
        </div>

        {/* Main heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          AI-Powered Harassment Detection
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg font-medium text-slate-700 dark:text-slate-200">
          Check messages, comments, and social media text for possible harassment, bullying, or harmful language.
        </p>

        {/* Supporting text */}
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Enter a message below and our AI will analyze it and show you a clear, easy-to-understand result.
        </p>
      </div>

      {/* ================================================== */}
      {/* MAIN DETECTION CARD                                */}
      {/* ================================================== */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 sm:p-7 shadow-sm transition-all space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                Check Text for Harassment
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supports English, Tamil Unicode, and Tanglish code-mixed text
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Real-Time NLP Model
          </span>
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <div className="relative">
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Paste or type a message, comment, or text here to check for cyberbullying..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-transparent transition resize-none leading-relaxed"
            />
            {inputText && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition cursor-pointer"
                title="Clear input"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {errorMsg && (
            <div className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1.5 px-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleAnalyze()}
            disabled={analyzing || !inputText.trim()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition cursor-pointer"
          >
            {analyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing Message...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>Analyze Text</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={analyzing || (!inputText && !result)}
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 text-sm font-semibold transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>

        {/* Quick Example Messages Section */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Quick test examples:
            </span>
            <span className="text-slate-400 text-[11px]">
              Click any example to test immediately
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {sampleMessages.map((msg, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setInputText(msg.text);
                  handleAnalyze(msg.text);
                }}
                className={`text-xs px-3 py-1.5 rounded-xl border text-left transition cursor-pointer shadow-2xs hover:scale-[1.01] ${
                  msg.type === 'safe'
                    ? 'bg-emerald-50/70 hover:bg-emerald-100/70 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200'
                    : msg.type === 'warning'
                    ? 'bg-amber-50/70 hover:bg-amber-100/70 dark:bg-amber-950/30 dark:hover:bg-amber-950/50 border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-200'
                    : 'bg-rose-50/70 hover:bg-rose-100/70 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-200'
                }`}
              >
                <span className="font-bold mr-1.5">[{msg.category}]</span>
                <span className="opacity-90">
                  {msg.text.length > 45 ? `${msg.text.substring(0, 45)}...` : msg.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ================================================== */}
        {/* DETECTION RESULT DISPLAY                           */}
        {/* ================================================== */}
        {result && (
          <div className="pt-3 animate-fade-in">
            {(() => {
              const isSafe = result.prediction === 'safe';
              const isBullying = result.prediction === 'bullying';
              const isSevere = result.prediction === 'severe_bullying';

              return (
                <div
                  className={`rounded-2xl border p-5 sm:p-6 transition-all duration-300 ${
                    isSafe
                      ? 'bg-emerald-50/80 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100'
                      : isBullying
                      ? 'bg-amber-50/80 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/60 text-amber-950 dark:text-amber-100'
                      : 'bg-rose-50/80 border-rose-200 dark:bg-rose-950/30 dark:border-rose-800/60 text-rose-950 dark:text-rose-100'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      {/* Icon */}
                      <div
                        className={`p-3 rounded-2xl shrink-0 ${
                          isSafe
                            ? 'bg-emerald-600 text-white'
                            : isBullying
                            ? 'bg-amber-600 text-white'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {isSafe && <ShieldCheck className="w-6 h-6" />}
                        {isBullying && <AlertTriangle className="w-6 h-6" />}
                        {isSevere && <ShieldX className="w-6 h-6" />}
                      </div>

                      {/* Result Text */}
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider opacity-75">
                            AI Detection Result:
                          </span>
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              isSafe
                                ? 'bg-emerald-600 text-white'
                                : isBullying
                                ? 'bg-amber-600 text-white'
                                : 'bg-rose-600 text-white'
                            }`}
                          >
                            {isSafe && 'SAFE'}
                            {isBullying && 'WARNING'}
                            {isSevere && 'CYBERBULLYING DETECTED'}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-900/80 font-mono font-medium">
                            <Languages className="w-3 h-3 text-indigo-500" />
                            {result.language}
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold">
                          {isSafe && 'Safe Message — No Cyberbullying Detected'}
                          {isBullying && 'Potentially Harmful or Insulting Message'}
                          {isSevere && 'High-Risk Cyberbullying or Severe Harassment'}
                        </h3>

                        <p className="text-xs sm:text-sm opacity-90 leading-relaxed max-w-xl">
                          {result.reason}
                        </p>

                        {/* Action recommendation pill */}
                        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-semibold opacity-80">Recommended Action:</span>
                          <span className="font-bold px-2.5 py-0.5 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-current/10">
                            {isSafe && 'Allowed to Post'}
                            {isBullying && 'Flag for Moderator Review'}
                            {isSevere && 'Block and Restrict'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Circular Confidence Gauge */}
                    <div className="flex flex-col items-center sm:items-end justify-center shrink-0 pt-2 sm:pt-0">
                      <CircularConfidenceGauge
                        confidence={result.confidence}
                        prediction={result.prediction}
                        size={64}
                        strokeWidth={6}
                      />
                      <span className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-75">
                        Confidence
                      </span>
                    </div>
                  </div>

                  {/* Copy Result Button */}
                  <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between">
                    <span className="text-[11px] opacity-75">
                      Analysis completed via trained NLP classifier
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyResult}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 transition cursor-pointer border border-current/10"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Result</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </section>

      {/* ================================================== */}
      {/* 3 INFORMATION CARDS (How it Works / Languages / etc) */}
      {/* ================================================== */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* CARD 1: How the AI Works */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-3 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-800 transition">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
            How the AI Works
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            The AI analyzes text using Natural Language Processing (NLP) to detect abusive words, harassment patterns, hostile tone, and severe bullying expressions.
          </p>
        </div>

        {/* CARD 2: Multilingual Support */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-3 shadow-2xs hover:border-violet-300 dark:hover:border-violet-800 transition">
          <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-950/60 border border-violet-200/60 dark:border-violet-800/60 flex items-center justify-center text-violet-600 dark:text-violet-400">
            <Languages className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
            Languages Supported
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Built specifically to understand <strong>English</strong>, <strong>Tamil Unicode</strong>, and <strong>Tanglish</strong> (Tamil written in English script) along with common modern slang.
          </p>
        </div>

        {/* CARD 3: Safe & Private */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 space-y-3 shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-800 transition">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
            Safe & Private
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Your checks are processed securely in real time. We prioritize digital safety and only use the text data necessary to perform accurate harassment detection.
          </p>
        </div>
      </section>

      {/* ================================================== */}
      {/* 3 STEPS / "HOW TO USE" SECTION                      */}
      {/* ================================================== */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 p-6 sm:p-7">
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Simple 3-Step Process
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            How to Check Any Message
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60">
            <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Enter or Paste Text
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Type or copy any social media message, comment, or chat statement into the box.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60">
            <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Analyze with AI
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Click “Analyze Text”. The model classifies polarity, confidence, and language in milliseconds.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60">
            <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Understand the Result
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Review the safety rating, confidence score, and recommended moderation action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* QUICK SHORTCUTS TO OTHER PLATFORM FEATURES          */}
      {/* ================================================== */}
      <section className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Looking to explore more platform features?
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onNavigateToFeed && (
            <button
              onClick={onNavigateToFeed}
              className="text-xs px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold transition cursor-pointer"
            >
              Go to Cyber Safety Feed →
            </button>
          )}
          {onNavigateToDashboard && (
            <button
              onClick={onNavigateToDashboard}
              className="text-xs px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold transition cursor-pointer"
            >
              Moderation Dashboard →
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
