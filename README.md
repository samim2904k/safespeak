<h1 align="center">SAFESPEAK 🔒</h1>
<p align="center"><i>Empowering Safer Conversations Across Languages & Voices</i></p>

<p align="center">
  <img src="https://img.shields.io/badge/Django-092E20?style=flat-square&logo=django&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Scikit--Learn-F7931E?style=flat-square&logo=scikit-learn&logoColor=white" />
  <img src="https://img.shields.io/badge/Translatepy-FFCC00?style=flat-square&logo=google-translate&logoColor=black" />
  <img src="https://img.shields.io/badge/Voice_Messages-MP3-blue?style=flat-square&logo=airplayaudio&logoColor=white" />
  <img src="https://img.shields.io/badge/Multilingual-AI-green?style=flat-square&logo=googletranslate&logoColor=white" />
</p>

<p align="center">Built with Django, Machine Learning, and Multilingual Translation</p>

---

## 📸 Preview

> Add screenshots or GIFs of the interface and voice message input system here:

| Multilingual Chat | Detection Result | Voice Input |
|-------------------|------------------|-------------|
| ![Chat](./screenshots/chat.png) | ![Detection](./screenshots/result.png) | ![Voice](./screenshots/voice.png) |

---

## 📚 Table of Contents

- [Overview](#overview)
- [Preview](#preview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Usage](#usage)
- [Testing](#testing)
- [License](#license)

---

## 🧾 Overview

**SafeSpeak** is a Django-based AI-powered cyberbullying detection platform that works in multiple languages and supports **voice message analysis**. It helps users—especially young people—communicate more safely online.

Using NLP and ML, messages (text or voice) are translated into English, checked using a tuned **LinearSVC classifier**, and results are translated back to the user’s original language.

---

## 🚀 Features

- 🌍 **Multilingual Input** (Telugu, Hindi, English & more)
- 🎤 **Voice Message Detection** (via text transcription)
- 🧠 **ML-Based Cyberbullying Detection**
- 🔄 **Translation In & Out** using Translatepy
- 🛡️ **Session-based Secure Django Auth**

---

## 🛠️ Tech Stack

- **Backend**: Django (Python)
- **Machine Learning**: scikit-learn, LinearSVC, TF-IDF Vectorizer
- **Languages**: Python, HTML, JS (optional)
- **Translation**: `translatepy`, `langdetect`
- **Voice Input**: MP3/WAV audio converted to text (speech-to-text logic implied)
- **Authentication**: Django session-based

---

## ⚙️ Setup

```bash
git clone https://github.com/samim2904k/safespeak.git
cd safespeak
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

Add your ML models to `chat/ml_models/`:

- `LinearSVCTuned.pkl`
- `tfidfvectoizer.pkl`
- `stopwords.txt`

---

## 📁 Environment (Optional)

Create a `.env` file for API keys (if voice-to-text service is used), or directly configure settings in `settings.py`.

---

## ▶️ Usage

```bash
python manage.py migrate
python manage.py runserver
```

Login at `/`, access chat at `/chatBot/`, and send messages in your language.

---

## 🧪 Testing

Test message detection with:

```bash
curl -X POST http://localhost:8000/detectBully/ -H "Content-Type: application/json" -d '{"message": "your test text"}'
```

---

## 📄 License

MIT License © 2025 Samim Khan

<p align="center"><i>Made with ❤️ for a safer web</i></p>
