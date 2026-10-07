/**
 * Application Type Definitions
 */

export interface User {
  id: number;
  full_name: string;
  username: string;
  email: string;
  avatar_url: string;
  bio?: string;
  role: 'admin' | 'user';
  stats?: {
    posts_count: number;
    comments_count: number;
    violations_count: number;
    safety_score: number;
  };
}

export interface Post {
  id: number;
  user_id: number;
  content: string;
  image_url?: string;
  likes_count: number;
  created_at: string;
  author: {
    full_name: string;
    username: string;
    avatar_url: string;
  };
  comments_count: number;
  is_liked: boolean;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  prediction: 'safe' | 'bullying' | 'severe_bullying';
  classification: 'SAFE' | 'WARNING' | 'CYBERBULLYING' | 'SEVERE';
  confidence: number;
  moderation_status: 'approved' | 'flagged' | 'blocked';
  action?: string;
  category?: string;
  language: 'English' | 'Tamil' | 'Tanglish' | 'Mixed';
  created_at: string;
  author: {
    full_name: string;
    username: string;
    avatar_url: string;
  };
  analysis?: MLPredictionResult;
}

export interface ModerationLog {
  id: number;
  comment_id?: number | null;
  user_id: number;
  content: string;
  prediction: 'safe' | 'bullying' | 'severe_bullying';
  classification?: 'SAFE' | 'WARNING' | 'CYBERBULLYING';
  confidence: number;
  moderation_action: 'allow' | 'warning' | 'block';
  language: 'English' | 'Tamil' | 'Tanglish' | 'Mixed';
  detected_categories: string[];
  created_at: string;
  user: {
    full_name: string;
    username: string;
    avatar_url: string;
  };
}

export interface MLPredictionResult {
  prediction: 'safe' | 'bullying' | 'severe_bullying';
  classification: 'SAFE' | 'WARNING' | 'CYBERBULLYING';
  confidence: number;
  moderation: 'allow' | 'warning' | 'block';
  action: string;
  category_display: string;
  reason: string;
  language: 'English' | 'Tamil' | 'Tanglish' | 'Mixed';
  detected_categories: string[];
  tokens_analyzed: { token: string; weight: number; polarity: 'toxic' | 'safe' }[];
  is_code_mixed: boolean;
}

export interface AdminStatistics {
  total_comments: number;
  safe_comments: number;
  bullying_comments: number;
  blocked_comments: number;
  average_confidence: number;
  languages: {
    English: number;
    Tamil: number;
    Tanglish: number;
    Mixed: number;
  };
  daily_trends: { day: string; safe: number; warning: number; block: number }[];
}

export interface ModelMetrics {
  model_name: string;
  framework: string;
  dataset_total_samples: number;
  vocabulary_size: number;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
  };
  confusion_matrix: number[][];
  confusion_matrix_labels: string[];
  languages_supported: string[];
  limitations?: string[];
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: 'safe' | 'warning' | 'blocked' | 'info';
  is_read: boolean;
  created_at: string;
}
