"""
=============================================================================
Intelligent Cyber Bullying Detection
Final Year B.Sc. Artificial Intelligence and Data Science Project
Machine Learning Model Training Pipeline (English, Tamil & Tanglish)
=============================================================================
Architecture:
  Dataset -> Multilingual Preprocessing -> Unicode Normalization ->
  TF-IDF Vectorization (n-grams 1-3) -> Multiclass Classifier ->
  Evaluation Metrics (Accuracy, Precision, Recall, F1, Confusion Matrix) ->
  Model Serialization
"""

import os
import re
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, precision_recall_fscore_support
import joblib

# Setup directory paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "cyberbullying_dataset.csv")
MODEL_DIR = os.path.join(BASE_DIR, "model")
os.makedirs(MODEL_DIR, exist_ok=True)

MODEL_OUTPUT_PATH = os.path.join(MODEL_DIR, "cyberbullying_model.pkl")
VECTORIZER_OUTPUT_PATH = os.path.join(MODEL_DIR, "vectorizer.pkl")
METADATA_OUTPUT_PATH = os.path.join(MODEL_DIR, "model_metadata.json")

def preprocess_text(text: str) -> str:
    """
    Multilingual text preprocessing preserving English, Tamil Unicode (U+0B80 to U+0BFF),
    and Tanglish phonetic terms.
    """
    if not isinstance(text, str):
        return ""
    
    # 1. Lowercase text
    text = text.lower().strip()
    
    # 2. Remove URLs, mentions, and excessive punctuation
    text = re.sub(r"https?://\S+|www\.\S+", " ", text)
    text = re.sub(r"@\w+", " ", text)
    
    # 3. CRITICAL: Preserve Tamil Unicode characters (\u0B80-\u0BFF) while stripping special symbols
    # Keep alphanumeric characters and Tamil script block
    text = re.sub(r"[^\w\s\u0B80-\u0BFF]", " ", text)
    
    # 4. Collapse multiple whitespace
    text = re.sub(r"\s+", " ", text).strip()
    return text

def detect_language(text: str) -> str:
    """Classifies text into English, Tamil, or Tanglish based on script & vocabulary."""
    tamil_chars = len(re.findall(r"[\u0B80-\u0BFF]", text))
    if tamil_chars > 3:
        return "Tamil"
    tanglish_keywords = ["bro", "da", "romba", "nalla", "semma", "loosu", "mooditu", "sethuru", "naaye", "machan"]
    lower = text.lower()
    if any(k in lower for k in tanglish_keywords):
        return "Tanglish"
    return "English"

def main():
    print("=" * 65)
    print("  Intelligent Cyber Bullying Detection - ML Model Training")
    print("=" * 65)
    
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}")
    
    print(f"\n[1/6] Loading Dataset from: {DATASET_PATH}")
    df = pd.read_csv(DATASET_PATH)
    print(f"      Total samples loaded: {len(df)}")
    print(f"      Columns identified: {list(df.columns)}")
    
    # Check for text and label columns
    text_col = 'text' if 'text' in df.columns else df.columns[0]
    label_col = 'label' if 'label' in df.columns else df.columns[1]
    
    # Drop missing values
    df = df.dropna(subset=[text_col, label_col])
    print(f"      Class distribution:\n{df[label_col].value_counts().to_string(header=False)}")
    
    print("\n[2/6] Multilingual Text Preprocessing (Preserving Tamil Unicode)...")
    df['clean_text'] = df[text_col].apply(preprocess_text)
    
    X = df['clean_text'].values
    y = df[label_col].values
    
    # Label mapping
    classes = sorted(list(set(y)))
    print(f"      Detected Classes: {classes}")
    
    print("\n[3/6] Splitting Dataset into Train and Test Sets (80/20)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"      Train samples: {len(X_train)} | Test samples: {len(X_test)}")
    
    print("\n[4/6] Feature Extraction via TF-IDF Vectorization (n-grams: 1-3)...")
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 3),
        max_features=2500,
        sublinear_tf=True
    )
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    print(f"      Vocabulary size: {len(vectorizer.vocabulary_)} features")
    
    print("\n[5/6] Training Classifier (Calibrated Logistic Regression & Naive Bayes)...")
    model = LogisticRegression(class_weight='balanced', max_iter=1000, C=2.0)
    model.fit(X_train_vec, y_train)
    
    print("\n[6/6] Model Evaluation & Metrics Calculation...")
    y_pred = model.predict(X_test_vec)
    
    acc = accuracy_score(y_test, y_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted')
    cm = confusion_matrix(y_test, y_pred, labels=classes)
    
    print("\n" + "-" * 55)
    print(f"  MODEL ACCURACY   : {acc * 100:.2f}%")
    print(f"  WEIGHTED PRECISION: {precision * 100:.2f}%")
    print(f"  WEIGHTED RECALL   : {recall * 100:.2f}%")
    print(f"  WEIGHTED F1-SCORE : {f1 * 100:.2f}%")
    print("-" * 55)
    
    print("\nDetailed Classification Report:")
    print(classification_report(y_test, y_pred, target_names=classes))
    
    print("Confusion Matrix:")
    print(f"Classes: {classes}")
    print(cm)
    
    # Save model and vectorizer
    joblib.dump(model, MODEL_OUTPUT_PATH)
    joblib.dump(vectorizer, VECTORIZER_OUTPUT_PATH)
    print(f"\n[OK] Model successfully saved to: {MODEL_OUTPUT_PATH}")
    print(f"[OK] Vectorizer saved to: {VECTORIZER_OUTPUT_PATH}")
    
    # Save computed evaluation metrics for frontend visualization
    metadata = {
        "model_name": "Multilingual Cyberbullying Detector (TF-IDF + Logistic Regression)",
        "framework": "Scikit-Learn & Python NLP",
        "dataset_total_samples": len(df),
        "classes": classes,
        "vocabulary_size": len(vectorizer.vocabulary_),
        "metrics": {
            "accuracy": round(float(acc), 4),
            "precision": round(float(precision), 4),
            "recall": round(float(recall), 4),
            "f1_score": round(float(f1), 4)
        },
        "confusion_matrix": cm.tolist(),
        "languages_supported": ["English", "Tamil (Unicode)", "Tanglish"],
        "class_distribution": df[label_col].value_counts().to_dict(),
        "limitations": [
            "Dialectal Tanglish contains spelling variations not always captured in standard lexicons",
            "Sarcasm and contextual subtext may require deeper semantic analysis",
            "Code-switched Tamil-English sentences require joint phonetic matching"
        ]
    }
    
    with open(METADATA_OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    
    print(f"[OK] Evaluation metadata exported to: {METADATA_OUTPUT_PATH}")
    print("\nTraining complete! Ready for college viva and full-stack integration.")

if __name__ == "__main__":
    main()
