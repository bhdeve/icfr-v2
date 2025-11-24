# سحابة الأثر - Impact Cloud Platform

> منصة قياس الأثر الاجتماعي المتكاملة

Frontend Application للمنصة العربية الشاملة لقياس وتحليل الأثر الاجتماعي للمنظمات الخيرية والتنموية.

---

## ⚠️ متطلبات أساسية

**هذا التطبيق يتطلب Backend API قيد التشغيل**

قبل تشغيل Frontend، تأكد من:
1. ✅ تشغيل Backend Server على المنفذ 3001
2. ✅ تكوين متغيرات البيئة بشكل صحيح
3. ✅ اتصال الإنترنت نشط

---

## 🏗️ Architecture

```
Frontend (React + TypeScript + Vite)
    ↓ REST API
Backend (Node.js + Express + PostgreSQL)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Backend API running (default: http://localhost:3001)

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```

Application runs at: `http://localhost:5173`

---

## 🔧 Environment Variables

Create `.env` file in root:

```env
# Required
VITE_BACKEND_BASE_URL=http://localhost:3001/api/v1

# Optional
VITE_API_TIMEOUT=30000
VITE_ENABLE_DEBUG_LOGS=false
```

### Production

```env
VITE_BACKEND_BASE_URL=https://api.yourdomain.com/api/v1
```

---

## 📁 Project Structure

```
/
├── api/services/          # API Service Layer (11 services)
├── components/            # React Components
│   ├── ui/               # shadcn/ui components
│   ├── surveys/          # Survey features
│   └── shared/           # Shared components
├── shared/
│   ├── api/              # HTTP Client & Interceptors
│   └── auth/             # JWT Token Manager
├── context/              # React Contexts (Auth, Theme, Language)
├── config/               # Configuration files
├── utils/                # Utility functions
├── constants/            # Types & Constants
└── styles/               # Global styles
```

---

## 🔐 Authentication

JWT-based authentication with automatic token refresh.

All API calls include `Authorization: Bearer {token}` header automatically.

---

## 🎯 User Roles

| Role | Arabic | Access |
|------|--------|--------|
| `super_admin` | مدير أعلى | Full system access |
| `admin` | مدير | Organization management |
| `org_manager` | مدير تنفيذي | Surveys & beneficiaries |
| `beneficiary` | مستفيد | Survey responses |

---

## 📡 API Services

11 integrated API services:

- **Auth Service** - Login, register, token refresh
- **Users Service** - User management
- **Surveys Service** - Survey CRUD & management
- **Beneficiaries Service** - Beneficiary management
- **Organizations Service** - Organization management
- **Billing Service** - Subscription & billing
- **Analytics Service** - Reports & analytics
- **AI Assistant Service** - Barq AI integration
- **Audit Logs Service** - Activity tracking
- **Settings Service** - System settings
- **Transactions Service** - Payment transactions

All services located in `/api/services/`

---

## ✨ Key Features

- 🔐 JWT Authentication
- 👥 Multi-role Access Control
- 📊 Survey Creation & Management
- 🎯 Interactive Dashboard
- 💳 Subscription Management
- 🤖 AI Assistant (Barq)
- 📈 Analytics & Reporting
- 🌐 Full Arabic Support (RTL)
- 🎨 Modern UI (Tailwind CSS + shadcn/ui)
- 📱 Responsive Design

---

## 🛠️ Development

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📦 Build & Deploy

```bash
# Build
npm run build

# Output: /dist folder
```

Deploy to any static hosting (Vercel, Netlify, etc.)

---

## 🎨 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Component library
- **Lucide React** - Icons
- **Recharts** - Charts & graphs
- **Axios** - HTTP client

---

## 📚 Documentation

- **API Integration**: `/docs/API_INTEGRATION_GUIDE.md`
- **API Contract**: `/api_frontend_contract.md`

---

## 🔗 Backend Integration

Frontend connects to backend via REST API.

**Required Backend Endpoints:**

```
POST   /api/v1/auth/login
POST   /api/v1/auth/register
POST   /api/v1/auth/refresh
GET    /api/v1/users
GET    /api/v1/surveys
POST   /api/v1/surveys
... (see API Contract)
```

---

## 🌐 Localization

- Primary: Arabic (RTL)
- Secondary: English
- Locale stored in `localStorage`

---

## 📄 License

Proprietary and confidential.

---

## 👥 Team

**Exology** - Platform Development  
**Atharonaa** - Content & Analysis

---

**Built with ❤️ for Social Impact**