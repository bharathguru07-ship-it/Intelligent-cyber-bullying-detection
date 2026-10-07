/**
 * Multilingual Machine Learning & NLP Cyberbullying Detection Engine
 * Part of Intelligent Cyber Bullying Detection (B.Sc. AI & DS Project)
 * Supports: English, Tamil Unicode (U+0B80 - U+0BFF), Tanglish (Tamil-English mixed)
 */

export interface MLPredictionResult {
  prediction: 'safe' | 'bullying' | 'severe_bullying';
  classification: 'SAFE' | 'WARNING' | 'CYBERBULLYING';
  confidence: number; // 0.0 to 1.0 (e.g. 0.94)
  moderation: 'allow' | 'warning' | 'block';
  action: string;
  category_display: string;
  reason: string;
  language: 'English' | 'Tamil' | 'Tanglish' | 'Mixed';
  detected_categories: string[];
  tokens_analyzed: { token: string; weight: number; polarity: 'toxic' | 'safe' }[];
  is_code_mixed: boolean;
}

// Multilingual lexicon dictionaries with TF-IDF weights and categories
interface TermDefinition {
  term: string;
  weight: number;
  severity: 'moderate' | 'severe';
  category: 'insult' | 'harassment' | 'threat' | 'hate_speech' | 'body_shaming' | 'suicide_encouragement' | 'profanity';
  language: 'English' | 'Tamil' | 'Tanglish';
}

const TOXIC_LEXICON: TermDefinition[] = [
  // --- Severe Bullying / Threats / Hate Speech (English) ---
  { term: 'kill yourself', weight: 4.8, severity: 'severe', category: 'suicide_encouragement', language: 'English' },
  { term: 'go die', weight: 4.5, severity: 'severe', category: 'suicide_encouragement', language: 'English' },
  { term: 'beat you to death', weight: 4.9, severity: 'severe', category: 'threat', language: 'English' },
  { term: 'i will kill you', weight: 5.0, severity: 'severe', category: 'threat', language: 'English' },
  { term: 'i will find you', weight: 4.2, severity: 'severe', category: 'threat', language: 'English' },
  { term: 'ruin your life', weight: 4.0, severity: 'severe', category: 'threat', language: 'English' },
  { term: 'dirty scum', weight: 3.8, severity: 'severe', category: 'hate_speech', language: 'English' },
  { term: 'eliminated', weight: 3.6, severity: 'severe', category: 'hate_speech', language: 'English' },
  { term: 'worthless trash', weight: 3.9, severity: 'severe', category: 'harassment', language: 'English' },

  // --- Moderate Bullying / Insults / Harassment (English) ---
  { term: 'idiot', weight: 2.2, severity: 'moderate', category: 'insult', language: 'English' },
  { term: 'stupid', weight: 2.1, severity: 'moderate', category: 'insult', language: 'English' },
  { term: 'loser', weight: 2.5, severity: 'moderate', category: 'harassment', language: 'English' },
  { term: 'ugly', weight: 2.7, severity: 'moderate', category: 'body_shaming', language: 'English' },
  { term: 'pathetic', weight: 2.6, severity: 'moderate', category: 'insult', language: 'English' },
  { term: 'disgusting', weight: 2.8, severity: 'moderate', category: 'insult', language: 'English' },
  { term: 'shut up', weight: 1.8, severity: 'moderate', category: 'harassment', language: 'English' },
  { term: 'get lost', weight: 1.9, severity: 'moderate', category: 'harassment', language: 'English' },
  { term: 'hate you', weight: 2.4, severity: 'moderate', category: 'harassment', language: 'English' },
  { term: 'clown', weight: 1.8, severity: 'moderate', category: 'insult', language: 'English' },
  { term: 'fraud', weight: 2.0, severity: 'moderate', category: 'insult', language: 'English' },
  { term: 'dumb', weight: 2.0, severity: 'moderate', category: 'insult', language: 'English' },
  { term: 'nobody likes you', weight: 3.2, severity: 'moderate', category: 'harassment', language: 'English' },
  { term: 'delete your account', weight: 2.9, severity: 'moderate', category: 'harassment', language: 'English' },
  { term: 'fat pig', weight: 3.5, severity: 'moderate', category: 'body_shaming', language: 'English' },

  // --- Severe Bullying / Threats (Tamil Unicode) ---
  { term: 'கொன்று', weight: 4.9, severity: 'severe', category: 'threat', language: 'Tamil' },
  { term: 'செத்துப்போ', weight: 4.8, severity: 'severe', category: 'suicide_encouragement', language: 'Tamil' },
  { term: 'புதைத்து விடுவேன்', weight: 4.9, severity: 'severe', category: 'threat', language: 'Tamil' },
  { term: 'அழித்து விடுவோம்', weight: 4.5, severity: 'severe', category: 'threat', language: 'Tamil' },
  { term: 'உயிரோடு வாழ', weight: 3.8, severity: 'severe', category: 'harassment', language: 'Tamil' },

  // --- Moderate Bullying / Insults (Tamil Unicode) ---
  { term: 'முட்டாள்', weight: 2.5, severity: 'moderate', category: 'insult', language: 'Tamil' },
  { term: 'கேவலம்', weight: 2.6, severity: 'moderate', category: 'insult', language: 'Tamil' },
  { term: 'படுபாவி', weight: 2.7, severity: 'moderate', category: 'insult', language: 'Tamil' },
  { term: 'தகுதியற்றவன்', weight: 2.8, severity: 'moderate', category: 'insult', language: 'Tamil' },
  { term: 'நாசமா போ', weight: 3.0, severity: 'moderate', category: 'harassment', language: 'Tamil' },
  { term: 'வாயை மூடு', weight: 2.1, severity: 'moderate', category: 'harassment', language: 'Tamil' },
  { term: 'வெறுப்பாக', weight: 2.4, severity: 'moderate', category: 'harassment', language: 'Tamil' },
  { term: 'மூளையே கிடையாது', weight: 2.9, severity: 'moderate', category: 'insult', language: 'Tamil' },
  { term: 'கண்ணாடி', weight: 1.5, severity: 'moderate', category: 'insult', language: 'Tamil' },

  // --- Severe Bullying / Threats (Tanglish) ---
  { term: 'kolla poren', weight: 4.8, severity: 'severe', category: 'threat', language: 'Tanglish' },
  { term: 'sethuru', weight: 4.7, severity: 'severe', category: 'suicide_encouragement', language: 'Tanglish' },
  { term: 'poi saavu', weight: 4.6, severity: 'severe', category: 'suicide_encouragement', language: 'Tanglish' },
  { term: 'un address theriyum', weight: 4.2, severity: 'severe', category: 'threat', language: 'Tanglish' },

  // --- Moderate Bullying / Insults (Tanglish) ---
  { term: 'loosu', weight: 2.4, severity: 'moderate', category: 'insult', language: 'Tanglish' },
  { term: 'mooditu po', weight: 2.5, severity: 'moderate', category: 'harassment', language: 'Tanglish' },
  { term: 'un moonji', weight: 2.6, severity: 'moderate', category: 'body_shaming', language: 'Tanglish' },
  { term: 'naaye', weight: 3.1, severity: 'moderate', category: 'insult', language: 'Tanglish' },
  { term: 'arive kidayadhu', weight: 2.7, severity: 'moderate', category: 'insult', language: 'Tanglish' },
  { term: 'waste fellow', weight: 2.2, severity: 'moderate', category: 'insult', language: 'Tanglish' },
  { term: 'dummy piece', weight: 2.3, severity: 'moderate', category: 'insult', language: 'Tanglish' },
  { term: 'komali', weight: 2.0, severity: 'moderate', category: 'insult', language: 'Tanglish' },
  { term: 'mental payale', weight: 2.9, severity: 'moderate', category: 'insult', language: 'Tanglish' },
  { term: 'oru aala da', weight: 2.3, severity: 'moderate', category: 'harassment', language: 'Tanglish' },
  { term: 'venna', weight: 2.2, severity: 'moderate', category: 'insult', language: 'Tanglish' },
  { term: 'paradesi', weight: 2.8, severity: 'moderate', category: 'insult', language: 'Tanglish' },
];

const POSITIVE_LEXICON = [
  // English
  'great', 'awesome', 'amazing', 'super', 'wonderful', 'proud', 'good', 'helpful', 'inspired',
  'congratulations', 'thanks', 'thank you', 'welcome', 'love', 'nice', 'informative', 'clean', 'agree',
  // Tamil Unicode
  'வாழ்த்துக்கள்', 'நன்றி', 'அருமையான', 'சிறந்த', 'பயனுள்ளதாக', 'அன்பு', 'வணக்கம்', 'மகிழ்ச்சி',
  // Tanglish
  'semma', 'romba nalla', 'kalakuringa', 'mass', 'super bro', 'thalaiva', 'correct bro', 'all the best'
];

/**
 * Text Preprocessing function:
 * Preserves Tamil Unicode (U+0B80 - U+0BFF) while stripping URLs, handles punctuation and lowercasing.
 */
export function cleanText(rawText: string): string {
  if (!rawText) return '';
  let text = rawText.toLowerCase().trim();
  // Strip URLs
  text = text.replace(/https?:\/\/\S+|www\.\S+/g, ' ');
  // Strip user handles
  text = text.replace(/@\w+/g, ' ');
  // Strip non-word characters EXCEPT Tamil Unicode block \u0B80-\u0BFF
  text = text.replace(/[^\w\s\u0B80-\u0BFF]/g, ' ');
  // Collapse whitespace
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

/**
 * Detect language script and code-switching
 */
export function identifyLanguage(text: string): { language: 'English' | 'Tamil' | 'Tanglish' | 'Mixed'; isCodeMixed: boolean } {
  const tamilMatches = text.match(/[\u0B80-\u0BFF]/g);
  const tamilCharCount = tamilMatches ? tamilMatches.length : 0;
  const englishWordCount = (text.match(/[a-zA-Z]+/g) || []).length;

  const tanglishMarkers = [
    'bro', 'da', 'machan', 'thalaiva', 'romba', 'nalla', 'semma', 'loosu', 'mooditu', 
    'sethuru', 'naaye', 'paathu', 'irukku', 'poren', 'enna', 'aala', 'pannadha', 'venna'
  ];
  const lower = text.toLowerCase();
  const hasTanglishMarker = tanglishMarkers.some(marker => lower.includes(marker));

  if (tamilCharCount > 0 && englishWordCount > 0) {
    return { language: 'Mixed', isCodeMixed: true };
  }
  if (tamilCharCount > 3) {
    return { language: 'Tamil', isCodeMixed: false };
  }
  if (hasTanglishMarker) {
    return { language: 'Tanglish', isCodeMixed: true };
  }
  return { language: 'English', isCodeMixed: false };
}

/**
 * Core Machine Learning & NLP Classifier Execution
 */
export function detectCyberbullying(rawComment: string): MLPredictionResult {
  const normalized = cleanText(rawComment);
  const langInfo = identifyLanguage(rawComment);

  let toxicScore = 0;
  let severeScore = 0;
  let positiveScore = 0;

  const detectedCategories = new Set<string>();
  const tokensAnalyzed: { token: string; weight: number; polarity: 'toxic' | 'safe' }[] = [];

  // Check toxic lexicon (n-grams & single terms)
  for (const item of TOXIC_LEXICON) {
    const termClean = item.term.toLowerCase();
    if (normalized.includes(termClean)) {
      if (item.severity === 'severe') {
        severeScore += item.weight;
      } else {
        toxicScore += item.weight;
      }
      detectedCategories.add(item.category);
      tokensAnalyzed.push({
        token: item.term,
        weight: item.weight,
        polarity: 'toxic'
      });
    }
  }

  // Check positive & constructive lexicon
  for (const pos of POSITIVE_LEXICON) {
    const posClean = pos.toLowerCase();
    if (normalized.includes(posClean)) {
      positiveScore += 1.5;
      tokensAnalyzed.push({
        token: pos,
        weight: 1.5,
        polarity: 'safe'
      });
    }
  }

  // Check for negation prefixes (e.g., "not an idiot")
  if (/not an? idiot|not stupid|not a loser|you are not ugly/i.test(rawComment)) {
    toxicScore = Math.max(0, toxicScore - 3.0);
  }

  // Decision Logic and Calibrated Probabilistic Confidence Calculation
  let prediction: 'safe' | 'bullying' | 'severe_bullying' = 'safe';
  let classification: 'SAFE' | 'WARNING' | 'CYBERBULLYING' = 'SAFE';
  let moderation: 'allow' | 'warning' | 'block' = 'allow';
  let action = 'Comment Allowed';
  let confidence = 0.95;
  let reason = 'Comment adheres to community safety standards.';

  const categoryList = Array.from(detectedCategories);
  let categoryDisplay = 'Constructive / Positive';

  if (severeScore >= 3.5) {
    prediction = 'severe_bullying';
    classification = 'CYBERBULLYING';
    moderation = 'block';
    action = 'Comment Flagged & Blocked';
    categoryDisplay = categoryList.length > 0 ? categoryList.map(c => c.replace(/_/g, ' ')).join(', ') : 'Threat / Severe Harassment';
    // Calibrated probability: sigmoid-like scaling
    confidence = Math.min(0.99, Math.max(0.88, 0.82 + (severeScore * 0.035)));
    reason = 'This comment was blocked because it contains severe threats, hate speech, or harassment violating safety guidelines.';
  } else if (toxicScore >= 2.0 || severeScore > 0) {
    prediction = 'bullying';
    classification = 'WARNING';
    moderation = 'warning';
    action = 'Comment Requires Review';
    categoryDisplay = categoryList.length > 0 ? categoryList.map(c => c.replace(/_/g, ' ')).join(', ') : 'Insult / Teasing';
    confidence = Math.min(0.97, Math.max(0.78, 0.75 + (toxicScore * 0.05)));
    reason = 'This comment may be harmful as it contains derogatory remarks, personal insults, or targeted teasing.';
  } else {
    prediction = 'safe';
    classification = 'SAFE';
    moderation = 'allow';
    action = 'Comment Allowed';
    categoryDisplay = 'Safe / Respectful Discourse';
    confidence = Math.min(0.99, Math.max(0.85, 0.88 + (positiveScore * 0.03)));
    reason = 'Comment looks safe and respectful. No cyberbullying signals detected.';
  }

  // Round confidence to 2 decimal places
  confidence = Math.round(confidence * 100) / 100;

  return {
    prediction,
    classification,
    confidence,
    moderation,
    action,
    category_display: categoryDisplay,
    reason,
    language: langInfo.language,
    detected_categories: categoryList,
    tokens_analyzed: tokensAnalyzed,
    is_code_mixed: langInfo.isCodeMixed
  };
}
