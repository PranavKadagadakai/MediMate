# 🩺 MediMate - Doctor-Patient Communication System

An AI-powered healthcare platform to enhance doctor-patient interaction, improve medical communication, and provide intelligent assistance through cutting-edge NLP technologies.

---

## 📋 Overview

This system offers the following features:

- **Medical Report Summarization** using LLMs (BART, T5)
- **AI Medical Chatbot** with local GGUF models (DeepSeek/BioMistral) or Hugging Face
- **Doctor-Patient Messaging Interface** with secure real-time chat
- **Language Translation + TTS** for multilingual communication
- **Doctor Discussion Forum** for knowledge sharing
- **Medical History Tracker** for personalized timeline-based logging

---

## 🛠️ Technology Stack

| Component       | Tech Stack                                     |
| --------------- | ---------------------------------------------- |
| Backend         | Django (Python 3.11)                           |
| LLM Integration | Hugging Face Transformers, llama.cpp           |
| Frontend        | React + Vite + Bootstrap                       |
| DB              | SQLite (default), PostgreSQL/MongoDB supported |
| TTS             | gTTS, pyttsx3                                  |
| Auth            | JWT-based login & role management              |

---

## 📦 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/PranavKadagadakai/MediMate.git
cd MediMate
```

2. **Run the setup script**

```bash
chmod +x setup.sh
./setup.sh
```

This script will:

- Create and activate a Python virtual environment inside backend/
- Upgrade `pip`
- Install backend dependencies (requirements.txt)
- Install frontend dependencies (pnpm install or npm install)
- Run database migrations

3. **Activate backend environment (manual, if needed)**

```bash
source backend/.venv/bin/activate   # Linux/Mac
backend\.venv\Scripts\activate.bat # Windows
```

4. **Run backend server**

```bash
cd backend
python manage.py runserver
```

5. **Run frontend (separate terminal)**

```bash
cd frontend
pnpm dev   # or: npm run dev
```

6. **Chatbot model setup**

Download the required DeepSeek-R1-1.5B or BioMistral-7B GGUF model.

Update the path in backend/chatbot/views.py → MODEL_PATH.

---

## 🧪 Testing

- Unit Testing for summarization and chatbot logic
- Integration Testing for frontend-backend APIs
- User Acceptance Testing with real user flows
- Security Testing with JWT and role validation

---

## 🔄 Future Enhancements

- X-ray/MRI analysis using CNNs
- WebRTC-based voice chat
- Appointment system integration
- Push notifications (Twilio/Firebase)

---

## 👥 Team Roles

| Role               | Responsibility               |
| ------------------ | ---------------------------- |
| Backend Developer  | API, Auth, DB                |
| ML Engineer        | Model selection & deployment |
| Frontend Developer | UI/UX implementation         |
| QA Tester          | Testing and bug tracking     |
| DevOps Engineer    | Deployment, CI/CD            |

---

## 📄 License

This project is for educational purposes and prototype development.
