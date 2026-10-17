# 🎬 CodeReel — Interactive Java Visualizer

> **See how your code actually runs.** CodeReel turns Java execution into animated, replayable visualizations — step by step, variable by variable, data structure by data structure.

[![GitHub](https://img.shields.io/badge/GitHub-ruthikph2--jpg-blue?logo=github)](https://github.com/ruthikph2-jpg)
[![Java](https://img.shields.io/badge/Java-21-orange?logo=java)](https://www.java.com)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green?logo=spring)](https://spring.io)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)](https://www.typescriptlang.org)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎮 **Step-by-step Execution** | Play, pause, rewind, and step through every line |
| 📊 **Live Visualizations** | Arrays, Stacks, Queues, Linked Lists animate in real time |
| 🔀 **TwinRun** | Compare two Java programs side by side |
| 🧠 **Predict Mode** | Guess variable values before they're revealed |
| 🐛 **Bug Replay** | Rewind to the exact moment something went wrong |
| 🔗 **Share Links** | Share interactive code snippets with a single URL |
| 📋 **Variable Panel** | Track every variable change, highlighted in real time |
| 📞 **Call Stack** | Visual call stack with method frames |
| 💻 **Console Output** | Live stdout capture |

---

## 🏗 Architecture

```
codereel/
├── codereel-frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Editor/         # Monaco Editor wrapper
│   │   │   ├── Player/         # Video player controls
│   │   │   ├── Visualizations/ # Array, Stack, Queue, LinkedList
│   │   │   ├── Panels/         # Variable, CallStack, Console panels
│   │   │   ├── TwinRun/        # Side-by-side comparison
│   │   │   └── PredictMode/    # Active learning feature
│   │   ├── store/              # Zustand global state
│   │   ├── hooks/              # useExecution, useAutoplay
│   │   ├── api/                # Axios client
│   │   └── types/              # TypeScript interfaces
│   └── ...
│
├── codereel-backend/           # Spring Boot + Java 21
│   └── src/main/java/com/codereel/
│       ├── controller/         # REST endpoints
│       ├── service/            # Code execution + tracing
│       ├── model/              # DTOs and JPA entities
│       ├── repository/         # Spring Data JPA
│       └── config/             # Security + CORS
│
└── docker-compose.yml          # Full stack local setup
```

---

## 🚀 Getting Started

### Prerequisites
- Java 21+
- Node.js 20+
- Maven 3.9+
- Docker + Docker Compose (optional)

---

### Option 1: Docker Compose (Recommended)

```bash
git clone https://github.com/ruthikph2-jpg/CodeReel.git
cd CodeReel
docker-compose up --build
```

Open [http://localhost:3000](http://localhost:3000)

---

### Option 2: Manual Setup

#### Backend
```bash
cd codereel-backend
mvn spring-boot:run
# Starts on http://localhost:8080
```

#### Frontend
```bash
cd codereel-frontend
npm install
npm run dev
# Starts on http://localhost:3000
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/execute` | Execute and trace Java code |
| `GET`  | `/api/health`  | Health check |
| `GET`  | `/api/snippets` | List snippets |
| `POST` | `/api/snippets` | Create snippet |
| `PUT`  | `/api/snippets/{id}` | Update snippet |
| `DELETE` | `/api/snippets/{id}` | Delete snippet |
| `POST` | `/api/snippets/{id}/share` | Generate share link |
| `GET`  | `/api/snippets/shared/{token}` | Get shared snippet |

### Execute Request Example
```json
POST /api/execute
{
  "code": "public class Main { public static void main(String[] args) { int x = 5; System.out.println(x); } }",
  "language": "java",
  "stdin": ""
}
```

---

## 🗺 Roadmap

- [x] Monaco Editor with Java syntax highlighting
- [x] Step-by-step player (play/pause/step/speed)
- [x] Array, Stack, Queue, Linked List visualizations
- [x] Variable panel + Call Stack + Console
- [x] TwinRun (side-by-side comparison)
- [x] Predict Mode (active learning)
- [x] Snippet saving & sharing
- [x] Docker support
- [ ] Full JDI-based real variable tracing
- [ ] Object Universe (heap visualization)
- [ ] AI explanations via Gemini
- [ ] MP4/GIF export
- [ ] Python & C support

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Editor | Monaco Editor |
| Animations | Framer Motion |
| State | Zustand |
| Backend | Spring Boot 3.2, Java 21 |
| Database | H2 (dev), PostgreSQL (prod) |
| Containerization | Docker, Docker Compose |

---

## 👨‍💻 Author

**Ruthik ph** — B.Tech CSE Student  
GitHub: [@ruthikph2-jpg](https://github.com/ruthikph2-jpg)

---

## 📄 License

MIT License — see [LICENSE](LICENSE)
