# Collaborative Node Registry & Editor // Industrial Premium

A high-performance, real-time collaborative development environment engineered for modern teams. This system provides VS Code parity with a focus on low-latency synchronization, conflict-free document state, and a technical "Industrial Premium" aesthetic.

![Landing Page Overhaul](https://img.shields.io/badge/System-v2.4.9-white?style=flat-square&labelColor=050505)
![Build Status](https://img.shields.io/badge/Network-Synchronized-emerald?style=flat-square&labelColor=050505)
![Code Quality](https://img.shields.io/badge/Security-AES--256-blue?style=flat-square&labelColor=050505)

## 📡 Technology Stack

### Core Synchronization
- **Engine**: [Yjs](https://yjs.dev/) (Shared-type CRDTs for conflict-free state).
- **Communication**: [Socket.io](https://socket.io/) (Bi-directional real-time event layer).
- **Relay**: `y-websocket` (Industrial-grade websocket provider).

### Frontend Architecture
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router & SSR Optimization).
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/) (The powerhouse behind VS Code).
- **Styling**: Tailwind CSS & Framer Motion (Industrial aesthetic with technical micro-animations).

### Backend Infrastructure
- **Runtime**: Node.js / Express.
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/).
- **Caching**: [Redis](https://redis.io/) (Used for Socket.io adapters and state persistence).

---

## 🏗️ System Architecture & Workflow

### 1. Unified Identity Flow
Secure authentication sequence using JWT and bcrypt, integrated into a high-fidelity console UI. All user sessions are authenticated against the parent cluster.

### 2. Node Registry (Room Management)
Collaborative environments are organized as "Nodes". Users can initialize new nodes or join existing ones via the "Active_Node_Registry". Each node establishes a dedicated WebSocket tunnel for state synchronization.

### 3. Real-time Multi-layered Sync
Document changes are handled at the byte-level using CRDTs. This ensures that even with global network latency, every peer converges on the exact same character sequence without conflicts.

---

## ⚡ Local Environment Initialization

### 0. Prerequisites
- **Node.js**: v20+
- **Database**: PostgreSQL instance running at port `5432`.
- **Cache**: Redis instance running at port `6379`.

### 1. Repository Setup
```bash
git clone https://github.com/anshaggarwal04/collaborative-coode-editor.git
cd collaborative-coode-editor
```

### 2. Common Configuration
Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5010/api
DATABASE_URL="postgresql://user:pass@localhost:5432/collab_editor"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your_shared_secret"
```

### 3. Backend Deployment
```bash
cd backend
npm install
npx prisma migrate dev  # Initialize the Registry Schema
npm run dev             # Port 5010
```

### 4. Frontend Deployment
```bash
cd ../collab-frontend
npm install
npm run dev             # Port 3000
```

---

## 💎 Design Philosophy: Industrial Premium
The project adheres to a strict Design System characterized by:
- **Pitch Black Foundations**: Hex `#050505` for high-performance visual comfort.
- **Monochromatic Grain**: Substantial monochromatic noise overlays (`bg-noise`) for depth.
- **Technical Grid**: VS Code-inspired 50px grid system constants.
- **System Metadata**: Every UI element exposes technical metadata (Peers, Signal Status, Timestamps).

---

## 🛡️ Maintainers & Support
**Security Note**: All environmental signals are encrypted via AES-256 Auth. For contribution protocols, please initialize a pull request against the `main` branch.
