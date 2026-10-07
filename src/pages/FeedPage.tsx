import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Post, Comment as CommentType, MLPredictionResult } from '../types.ts';
import { CircularConfidenceGauge } from '../components/CircularConfidenceGauge.tsx';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Cpu,
  AlertCircle,
  CheckCircle2,
  Languages,
  X,
  MoreHorizontal,
  Eye,
  EyeOff,
  Check,
  Trash2,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';

export const FeedPage: React.FC = () => {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Active comment threads: postId -> comments array
  const [commentsMap, setCommentsMap] = useState<Record<number, CommentType[]>>({});
  const [loadingCommentsMap, setLoadingCommentsMap] = useState<Record<number, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});

  // Active analyzing indicator per post
  const [isAnalyzingPost, setIsAnalyzingPost] = useState<Record<number, boolean>>({});

  // Masked/unmasked state for offensive comments (commentId -> boolean)
  const [unmaskedComments, setUnmaskedComments] = useState<Record<number, boolean>>({});

  // Saved / bookmarked posts
  const [savedPosts, setSavedPosts] = useState<Record<number, boolean>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
        setPosts(data.posts);
        // Pre-fetch comments for all posts so comments & AI detection cards are visible immediately!
        data.posts.forEach((p: Post) => {
          loadCommentsForPost(p.id);
        });
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const loadCommentsForPost = async (postId: number) => {
    setLoadingCommentsMap((prev) => ({ ...prev, [postId]: true }));
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      const data = await res.json();
      if (data.success) {
        setCommentsMap((prev) => ({ ...prev, [postId]: data.comments }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCommentsMap((prev) => ({ ...prev, [postId]: false }));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [token]);

  const handleLike = async (postId: number) => {
    if (!token) return;

    // Optimistic toggle
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.is_liked;
          return {
            ...p,
            is_liked: nextLiked,
            likes_count: nextLiked ? p.likes_count + 1 : Math.max(0, p.likes_count - 1),
          };
        }
        return p;
      })
    );

    try {
      await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      fetchPosts();
    }
  };

  const handleCommentSubmit = async (postId: number, customText?: string) => {
    const textToSubmit = (customText !== undefined ? customText : (commentInputs[postId] || '')).trim();
    if (!textToSubmit || !token) return;

    setIsAnalyzingPost((prev) => ({ ...prev, [postId]: true }));

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, content: textToSubmit }),
      });

      const data = await res.json();
      if (data.success && data.comment) {
        // Append new comment to this post
        setCommentsMap((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), data.comment],
        }));

        // Clear comment box
        setCommentInputs((prev) => ({ ...prev, [postId]: '' }));

        // Update post comment count
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p))
        );

        setToastMsg(`AI Analysis complete: ${data.comment.classification} (${Math.round(data.comment.confidence * 100)}%)`);
        setTimeout(() => setToastMsg(null), 3000);
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
    } finally {
      setIsAnalyzingPost((prev) => ({ ...prev, [postId]: false }));
    }
  };

  // Moderate comment action (Allow, Remove, Review)
  const handleModerateComment = async (postId: number, commentId: number, action: 'allow' | 'remove' | 'review') => {
    if (!token) return;
    try {
      const res = await fetch(`/api/comments/${commentId}/moderate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        if (action === 'remove') {
          setCommentsMap((prev) => ({
            ...prev,
            [postId]: (prev[postId] || []).filter((c) => c.id !== commentId),
          }));
          setToastMsg('Comment removed by moderator.');
        } else if (action === 'allow') {
          setCommentsMap((prev) => ({
            ...prev,
            [postId]: (prev[postId] || []).map((c) =>
              c.id === commentId
                ? { ...c, moderation_status: 'approved', classification: 'SAFE', action: 'Comment Allowed' }
                : c
            ),
          }));
          setToastMsg('Comment approved by moderator.');
        }
        setTimeout(() => setToastMsg(null), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Preset demo test cases
  const demoTestCases = [
    {
      label: 'Safe English',
      text: 'Great post! I really like this research work.',
      type: 'safe',
    },
    {
      label: 'Safe Tamil',
      text: 'இந்த பதிவு மிகவும் நன்றாக உள்ளது, வாழ்த்துக்கள்!',
      type: 'safe',
    },
    {
      label: 'Safe Tanglish',
      text: 'Semma post bro, all the best for the project!',
      type: 'safe',
    },
    {
      label: 'Warning English',
      text: 'You are so stupid and nobody likes you, delete this.',
      type: 'warning',
    },
    {
      label: 'Warning Tanglish',
      text: 'un moonjiya mirror la paathurukkiya, dummy piece.',
      type: 'warning',
    },
    {
      label: 'Severe / Block',
      text: 'I will find where you live and beat you to death.',
      type: 'severe',
    },
  ];

  const runDemoTestButton = (presetText: string) => {
    if (posts.length === 0) return;
    const targetPostId = posts[0].id;
    // Set input and auto-submit
    setCommentInputs((prev) => ({ ...prev, [targetPostId]: presetText }));
    handleCommentSubmit(targetPostId, presetText);
  };

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full p-3 sm:p-6 space-y-6">
      {/* 1. PROJECT TITLE & SUBTITLE HEADER */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Final-Year B.Sc. AI & Data Science Project
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mt-1">
              Intelligent Cyber Bullying Detection
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              AI-Powered Multilingual Social Media Comment Moderation (English, Tamil Unicode, Tanglish)
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-700 dark:text-indigo-300 font-medium">
            <Cpu className="w-4 h-4 text-indigo-500" />
            <span>Simulated Instagram Demo Interface</span>
          </div>
        </div>
      </div>

      {/* 2. DEMO TEST BUTTONS SECTION (CLEARLY VISIBLE AS REQUESTED) */}
      <section className="rounded-3xl border border-indigo-200 dark:border-indigo-800/80 bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/60 dark:from-indigo-950/40 dark:via-slate-900 dark:to-violet-950/30 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              Cyberbullying Detection Demo
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            Click any button to test live comment classification on Post #1
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 mb-3.5 leading-relaxed">
          Test multilingual comment detection in real time. Each button injects and immediately runs the AI classification model on the post below:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {demoTestCases.map((tc) => {
            const isSafe = tc.type === 'safe';
            const isWarning = tc.type === 'warning';
            return (
              <button
                key={tc.label}
                type="button"
                onClick={() => runDemoTestButton(tc.text)}
                className={`flex flex-col items-start p-2.5 rounded-2xl border text-left transition cursor-pointer shadow-2xs hover:scale-[1.02] ${
                  isSafe
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-100 hover:border-emerald-400'
                    : isWarning
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-100 hover:border-amber-400'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-100 hover:border-rose-400'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] font-bold">{tc.label}</span>
                  <Play className="w-3 h-3 opacity-60 fill-current" />
                </div>
                <span className="text-[9px] uppercase font-bold tracking-wider mt-1 opacity-70">
                  {tc.type}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. INSTAGRAM-STYLE SIMULATED POSTS FEED */}
      <div className="space-y-8 max-w-2xl mx-auto">
        {loadingPosts && (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 animate-pulse space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
            </div>
            <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
        )}

        {posts.map((post) => {
          const comments = commentsMap[post.id] || [];
          const isAnalyzing = isAnalyzingPost[post.id];
          const currentText = commentInputs[post.id] || '';

          return (
            <article
              key={post.id}
              className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs"
            >
              {/* Instagram-Style Post Header */}
              <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-3">
                  {/* Gradient Story Ring Effect */}
                  <div className="p-[2px] rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-rose-500">
                    <img
                      src={post.author.avatar_url}
                      alt={post.author.full_name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-slate-900"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {post.author.username}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-400" />
                      <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                        Student AI Project
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Chennai, Tamil Nadu · {new Date(post.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    AI Moderated
                  </span>
                  <button className="text-slate-400 hover:text-slate-600 p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Instagram Post Image */}
              {post.image_url && (
                <div className="w-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center max-h-[500px] overflow-hidden select-none">
                  <img
                    src={post.image_url}
                    alt="Post visual"
                    className="w-full h-auto object-cover max-h-[500px]"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Instagram Action Bar */}
              <div className="px-4 pt-3 pb-2 flex items-center justify-between text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleLike(post.id)}
                    className={`transition hover:scale-110 cursor-pointer ${
                      post.is_liked ? 'text-rose-500' : 'hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${post.is_liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const inputEl = document.getElementById(`comment-input-${post.id}`);
                      if (inputEl) inputEl.focus();
                    }}
                    className="hover:scale-110 hover:text-indigo-600 transition cursor-pointer"
                  >
                    <MessageCircle className="w-6 h-6" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setToastMsg('Post link copied to clipboard!');
                      setTimeout(() => setToastMsg(null), 2000);
                    }}
                    className="hover:scale-110 hover:text-indigo-600 transition cursor-pointer"
                  >
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSavedPosts((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                  className={`transition hover:scale-110 cursor-pointer ${
                    savedPosts[post.id] ? 'text-indigo-600' : 'hover:text-indigo-600'
                  }`}
                >
                  <Bookmark className={`w-6 h-6 ${savedPosts[post.id] ? 'fill-indigo-600 text-indigo-600' : ''}`} />
                </button>
              </div>

              {/* Likes count & Caption */}
              <div className="px-4 pb-2 space-y-1.5 text-xs sm:text-sm">
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {post.likes_count} likes
                </div>
                <div className="text-slate-800 dark:text-slate-200 leading-relaxed">
                  <span className="font-bold mr-2 text-slate-900 dark:text-slate-100">
                    {post.author.username}
                  </span>
                  {post.content}
                </div>
              </div>

              {/* 4. COMMENT SECTION WITH CYBERBULLYING DETECTION RESULTS */}
              <div className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 p-4 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Comments ({comments.length})
                  </span>
                  <span className="text-[10px] text-indigo-500 font-mono">
                    Every comment is AI-evaluated
                  </span>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((c) => {
                    const isSafe = c.classification === 'SAFE' || c.prediction === 'safe';
                    const isWarning = c.classification === 'WARNING' || c.prediction === 'bullying';
                    const isSevere = c.classification === 'SEVERE' || c.prediction === 'severe_bullying';
                    const isBullying = c.classification === 'CYBERBULLYING' || (!isSafe && !isWarning && !isSevere);

                    const isUnmasked = unmaskedComments[c.id];

                    return (
                      <div
                        key={c.id}
                        className="rounded-2xl border border-[#E2E8F0] dark:border-slate-800/80 p-3.5 bg-white dark:bg-slate-900/90 shadow-2xs space-y-3 transition-all"
                      >
                        {/* Comment Header & Content */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5 min-w-0 flex-1">
                            <img
                              src={c.author.avatar_url}
                              alt={c.author.full_name}
                              className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                            />
                            <div className="min-w-0 flex-1 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-slate-100">
                                  {c.author.username}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>

                              {/* Comment Content Display (with mask for cyberbullying or severe) */}
                              <div className="mt-1 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed">
                                {(isBullying || isSevere) && !isUnmasked ? (
                                  <div className="flex items-center gap-2 py-1 px-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/60 text-rose-800 dark:text-rose-200 text-xs">
                                    <ShieldX className="w-3.5 h-3.5 shrink-0" />
                                    <span className="italic font-medium">Comment blocked by Cyber Safety AI</span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setUnmaskedComments((prev) => ({ ...prev, [c.id]: true }))
                                      }
                                      className="ml-auto text-[11px] underline font-semibold cursor-pointer"
                                    >
                                      View Raw
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-start justify-between gap-2">
                                    <span>{c.content}</span>
                                    {(isBullying || isSevere) && isUnmasked && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setUnmaskedComments((prev) => ({ ...prev, [c.id]: false }))
                                        }
                                        className="text-[10px] text-slate-400 hover:text-slate-600 underline cursor-pointer shrink-0"
                                      >
                                        Hide
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* VISUAL AI DETECTION CARD IMMEDIATELY BELOW THE COMMENT */}
                        <div
                          className={`rounded-xl p-3 border text-xs space-y-2 ${
                            isSafe
                              ? 'bg-emerald-50/90 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/50 text-emerald-950 dark:text-emerald-100'
                              : isWarning
                              ? 'bg-amber-50/90 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/50 text-amber-950 dark:text-amber-100'
                              : 'bg-rose-50/90 border-rose-200 dark:bg-rose-950/20 dark:border-rose-800/50 text-rose-950 dark:text-rose-100'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-current/10 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[11px] uppercase tracking-wider opacity-75">
                                AI Detection:
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-md font-extrabold text-[11px] uppercase tracking-wider ${
                                  isSafe
                                    ? 'bg-emerald-600 text-white'
                                    : isWarning
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-rose-600 text-white'
                                }`}
                              >
                                {isSafe && 'SAFE'}
                                {isWarning && 'WARNING'}
                                {isBullying && 'CYBERBULLYING'}
                                {isSevere && 'SEVERE CYBERBULLYING'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold">
                              <span>Confidence:</span>
                              <span>{Math.round((c.confidence || 0.95) * 100)}%</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px]">
                            <div>
                              <span className="opacity-75">Language: </span>
                              <span className="font-semibold">{c.language || 'English'}</span>
                            </div>
                            <div>
                              <span className="opacity-75">Category: </span>
                              <span className="font-semibold">
                                {c.category || (isSafe ? 'Constructive' : isWarning ? 'Insult / Teasing' : 'Harassment / Threat')}
                              </span>
                            </div>
                            <div>
                              <span className="opacity-75">Action: </span>
                              <span className="font-semibold uppercase text-[10.5px]">
                                {isSafe && 'COMMENT ALLOWED'}
                                {isWarning && 'REVIEW REQUIRED'}
                                {isBullying && 'COMMENT FLAGGED'}
                                {isSevere && 'COMMENT BLOCKED'}
                              </span>
                            </div>
                          </div>

                          {/* Moderation Controls for Warning or Cyberbullying */}
                          {!isSafe && (
                            <div className="pt-2 border-t border-current/10 flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleModerateComment(post.id, c.id, 'review')}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/80 dark:bg-slate-900/80 border border-current/20 hover:bg-white transition cursor-pointer"
                              >
                                Review
                              </button>
                              <button
                                type="button"
                                onClick={() => handleModerateComment(post.id, c.id, 'allow')}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition cursor-pointer"
                              >
                                Allow Comment
                              </button>
                              <button
                                type="button"
                                onClick={() => handleModerateComment(post.id, c.id, 'remove')}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-rose-600 text-white hover:bg-rose-500 transition cursor-pointer"
                              >
                                Remove Comment
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {comments.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-400 italic">
                      No comments yet. Try typing a comment below or click a Demo Test button!
                    </div>
                  )}
                </div>

                {/* Live Analyzing State */}
                {isAnalyzing && (
                  <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs flex items-center gap-3 animate-pulse">
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span>AI is analyzing your comment for cyberbullying...</span>
                  </div>
                )}

                {/* Comment Input Box */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCommentSubmit(post.id);
                  }}
                  className="space-y-2 pt-2"
                >
                  <div className="relative">
                    <input
                      id={`comment-input-${post.id}`}
                      type="text"
                      value={currentText}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      placeholder="Write a comment... (Supports English, தமிழ் Unicode, and Tanglish)"
                      className="w-full pl-4 pr-16 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                    />
                    <button
                      type="submit"
                      disabled={!currentText.trim() || isAnalyzing}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1"
                    >
                      <span>Post</span>
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </form>
              </div>
            </article>
          );
        })}
      </div>

      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-2xl bg-slate-900 text-white text-xs shadow-xl flex items-center gap-2 animate-fade-in border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
