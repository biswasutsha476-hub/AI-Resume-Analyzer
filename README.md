# RESUMEUP - AI Resume Analyzer

An intelligent AI Resume Analyzer powered by a high-performance local Natural Language Processing (NLP) & ATS intelligence engine.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    React 19 + Vite                      │
│     (Tailwind CSS v4, Lucide Icons, Drag & Drop, UI)     │
└───────────────────────────┬─────────────────────────────┘
                            │ REST API (JSON / Multipart)
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    API Server Backend                   │
│      (/api/resumes/analyze, /upload, /improve-bullet)   │
└──────────────┬───────────────────────────┬──────────────┘
               │                           │
               ▼                           ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│       AI NLP Engine       │ │     Cloud Database        │
│  • TF-IDF Keyword Match   │ │  • Resume Scans History   │
│  • ATS Heading Compliance │ │  • Scores & Metrics       │
│  • Power Verb Auditing    │ │  • Skills Breakdown      │
│  • XYZ Bullet Optimizer   │ │  • Candidate Contacts     │
│  • 100% Private & Fast    │ │                           │
└───────────────────────────┘ └───────────────────────────┘
```

---

## Features

- **Automated Resume Evaluation**: High-accuracy resume parsing and candidate assessment.
- **ATS Compatibility Scoring**: Evaluates resume formatting, standard section headers, contact detection, and structure.
- **Quantified Impact & Metric Audit**: Analyzes bullet points for quantifiable numbers, percentages, financial figures, and scale indicators.
- **Power Verbs vs. Weak Buzzwords**: Identifies passive phrases (e.g., *"worked on"*, *"responsible for"*) and provides strong power verb replacements.
- **Categorized Skill Extraction**: Automatically identifies 150+ skills across Frontend, Backend, Cloud & DevOps, Database, AI/Data Science, and Soft Skills.
- **Target Job Description Matching**: Computes keyword alignment % against any job posting and highlights missing critical terms.
- **AI Bullet Point Optimizer (XYZ Formula)**: Interactive tool to rewrite weak bullet statements into high-impact accomplishments: *"Accomplished [X], as measured by [Y], by doing [Z]"*.
- **Scan History & Account Storage**: View, reload, and manage previously analyzed resumes from your database.
- **Export Reports**: Export analysis results to JSON or copy a structured markdown summary.

---

## REST API Documentation

Base URL: `http://localhost:5000/api/resumes` (or proxied through Vite at `http://localhost:5173/api/resumes`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server and MongoDB connection health check |
| `POST` | `/analyze` | Analyzes JSON payload containing `resumeText` and optional `jobDescription` |
| `POST` | `/upload` | Multipart file upload (`.pdf` or `.txt`) with automatic text parsing |
| `GET` | `/` | Retrieves past saved resume analysis scans from MongoDB |
| `GET` | `/:id` | Retrieves a specific scan report by MongoDB ObjectId |
| `DELETE` | `/:id` | Deletes a scan report from MongoDB |
| `POST` | `/improve-bullet` | Transforms a weak bullet point into 4 high-impact variations |

---

## Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ installed
- **MongoDB** running locally (e.g. `mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI in `server/.env`

### 2. Start the Backend Server
```bash
# In the project root:
npm run server

# Or directly in the server directory:
cd server
npm start
```
*The Express server will start on port `5000`.*

### 3. Start the React Frontend
```bash
# In the project root:
npm run dev
```
*Open [http://localhost:5173](http://localhost:5173) in your browser.*

---

## Project Structure

```
Digontom Pvt Ltd/
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection handler with auto-fallback
│   ├── controllers/
│   │   └── resumeController.js   # REST API endpoint logic & Multer PDF parsing
│   ├── models/
│   │   └── ResumeAnalysis.js     # Mongoose schema for resume reports
│   ├── routes/
│   │   └── resumeRoutes.js       # Express route definitions
│   ├── services/
│   │   └── aiEngine.js           # Local AI NLP resume parser & ATS scoring engine
│   ├── test-api.js               # Backend API verification script
│   ├── package.json              # Server dependencies
│   ├── .env                      # Server environment configuration
│   └── server.js                 # Express entry point
├── src/
│   ├── components/
│   │   ├── Navbar.jsx            # Top navigation, theme toggle, samples & history
│   │   ├── HeroSection.jsx       # Hero banner & feature badges
│   │   ├── ScoreCard.jsx         # Circular gauges & score breakdowns
│   │   ├── AnalysisDashboard.jsx # Tabbed analysis (Suggestions, Skills, ATS, Verbs, Job Match)
│   │   ├── BulletOptimizerModal.jsx # AI bullet point rewriter modal
│   │   └── HistoryDrawer.jsx     # Slide-out drawer with MongoDB saved scans
│   ├── data/
│   │   ├── dictionary.js         # Verbs, buzzwords, and skills taxonomy
│   │   └── sampleResumes.js      # Sample candidate profiles (Alex, Jordan, Samantha, Chris)
│   ├── utils/
│   │   ├── aiAnalyzer.js         # Client-side heuristic analyzer
│   │   └── resumeParser.js       # In-browser PDF & text parser helper
│   ├── App.jsx                   # Main React workspace
│   ├── index.css                 # Tailwind CSS v4 directives
│   └── main.jsx                  # React application root
├── package.json                  # Root React configuration
├── vite.config.js                # Vite configuration with REST API proxy
└── README.md
```
