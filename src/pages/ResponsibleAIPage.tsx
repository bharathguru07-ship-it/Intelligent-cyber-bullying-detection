import React from 'react';
import {
  ShieldCheck,
  Lock,
  Globe,
  Cpu,
  Users,
  Flag,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

export const ResponsibleAIPage: React.FC = () => {
  return (
    <div className="flex-1 max-w-5xl mx-auto w-full p-4 lg:p-6 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Safety & Ethical Guidelines</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Responsible AI & Safety
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
          How our AI helps identify cyberbullying while keeping users safe and treated fairly.
        </p>
      </div>

      {/* Main Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SECTION 1: Privacy Matters */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 w-fit">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
            🔒 Your Privacy Matters
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            We respect your privacy. The system checks messages for potentially harmful or bullying content and uses only the information needed for moderation.
          </p>
          <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-5 pt-1">
            <li>Your messages are checked to identify potentially harmful content.</li>
            <li>We avoid displaying unnecessary personal information.</li>
            <li>You do not need to reveal your identity to check a message.</li>
            <li>Only information needed for moderation should be retained.</li>
          </ul>
        </div>

        {/* SECTION 2: Fair for Everyone */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 w-fit">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
            🌍 Fair for Everyone
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            People communicate in different languages and styles. Our system is designed to better understand English, Tamil, Tanglish, slang, and informal messages.
          </p>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Please note:</span> Different words can have different meanings depending on the situation, so the AI may sometimes misunderstand a message.
          </div>
        </div>

        {/* SECTION 3: How the AI Works */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 w-fit">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
            🤖 How the AI Works
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            The AI looks at the words and meaning of a message and estimates whether it may contain bullying or harmful content.
          </p>
          <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs sm:text-sm space-y-1">
            <div className="font-bold text-rose-900 dark:text-rose-300">Example:</div>
            <div className="text-slate-700 dark:text-slate-300 font-mono text-xs">Message: “You are useless, get lost!”</div>
            <div className="text-rose-700 dark:text-rose-400 font-semibold">Result: Potentially harmful</div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
            AI cannot always understand jokes, friendship, sarcasm, or the full situation behind a conversation. An AI result should therefore be treated as a warning, not a final judgment.
          </p>
        </div>

        {/* SECTION 4: People Have the Final Say */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 w-fit">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
            👤 People Have the Final Say
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            AI helps identify possible cyberbullying, but human review should guide final decisions when mistakes occur.
          </p>
          <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-5 pt-1">
            <li>Users can report mistakes or incorrect flags.</li>
            <li>Moderators can review context and make the final decision.</li>
            <li>The goal is to protect users, not silence harmless conversations.</li>
          </ul>
        </div>
      </div>

      {/* SECTION 5: Why Mistakes Can Happen */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 lg:p-8 space-y-5 shadow-xs">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
            ⚠️ Why Mistakes Can Happen
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          No automated tool is 100% accurate. Here are common reasons why AI can misread a message:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-2">
            <span className="font-bold text-amber-900 dark:text-amber-300">
              When harmless words look harmful
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Friendly teasing, memes, casual words, or sarcasm may sometimes be mistakenly flagged as negative.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 space-y-2">
            <span className="font-bold text-rose-900 dark:text-rose-300">
              When bullying words are hidden
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              People may disguise harmful phrases using unusual spellings, new slang, or indirect remarks that the AI does not immediately recognize.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 6: Tips for Users and Parents */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 lg:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-5 h-5 text-indigo-500" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
            💡 Tips for Users and Parents
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
            <span className="text-base leading-none">💬</span>
            <span>Pause before posting if a warning appears.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
            <span className="text-base leading-none">🛡️</span>
            <span>Use reporting tools if someone is being bullied.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
            <span className="text-base leading-none">🗣️</span>
            <span>Talk with a teacher, parent, or trusted adult if online abuse occurs.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
            <span className="text-base leading-none">🤝</span>
            <span>Remember that words matter, even online.</span>
          </div>
        </div>
      </div>

      {/* SECTION 7: Our Commitment to Safe Online Spaces */}
      <div className="rounded-3xl border border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-slate-50 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-slate-900 p-6 lg:p-8 space-y-3 shadow-xs">
        <div className="flex items-center gap-3">
          <Flag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
            🌱 Our Commitment to Safe Online Spaces
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Technology should help make online conversations kinder and safer. We continually review user feedback and moderation patterns to reduce misunderstandings and keep digital spaces respectful.
        </p>
      </div>
    </div>
  );
};

