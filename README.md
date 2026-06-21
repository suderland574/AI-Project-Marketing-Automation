# AI Marketing Automation

> A cinematic AI marketing automation web application.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Agent Workflow](#agent-workflow)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Frontend Pages](#frontend-pages)
- [Database Schema](#database-schema)
- [Agent Details](#agent-details)
- [Integrations](#integrations)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

---

## Overview

The **AI Marketing Automation** application eliminates the manual effort in content production pipelines. It uses a **CrewAI multi-agent system** where specialized AI agents collaborate to plan, research, write, design, and distribute content — autonomously.

### Key Capabilities

| Capability | Description |
|---|---|
| 📅 Editorial Planning | AI-driven calendar generation based on goals & trends |
| 🔍 Trend Research | Real-time topic sourcing from the web |
| ✍️ Content Writing | GPT-4o-powered blog posts, social copies, newsletters |
| 🎨 Image Generation | DALL-E 3 prompts & visuals for each piece |
| 📤 Auto Distribution | HubSpot CMS + Buffer scheduling automation |
| 📊 Analytics | Google Analytics integration for performance tracking |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                   │
│  Dashboard │ Calendar │ Agents │ Content │ Analytics │ Logs  │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API / WebSocket
┌────────────────────────▼────────────────────────────────────┐
│                   FastAPI Backend (Python)                   │
│   Auth │ Campaigns │ Agents │ Content │ Integrations │ Jobs  │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
┌────────▼───────┐ ┌─────▼──────┐ ┌─────▼──────────────────┐
│   CrewAI       │ │ PostgreSQL  │ │   External APIs         │
│  Agent System  │ │  Database   │ │  OpenAI │ HubSpot       │
│                │ │             │ │  Buffer │ Google        │
│ Strategy Agent │ │  Campaigns  │ │  DALL-E │ Analytics     │
│ Research Agent │ │  Content    │ │                         │
│ Writing Agent  │ │  Analytics  │ └─────────────────────────┘
│ Design Agent   │ │  AgentLogs  │
│ Distribution   │ └────────────┘
└────────────────┘
```

---

## Agent Workflow

```
┌──────────────────────────────────────────────────────────────────┐
│                     CREWAI PIPELINE                              │
│                                                                  │
│  1. STRATEGY AGENT                                               │
│     └─ Analyzes brand goals, audience, past performance         │
│     └─ Generates 30-day editorial calendar                      │
│     └─ Assigns topics, formats, channels, publish dates         │
│            │                                                     │
│            ▼                                                     │
│  2. RESEARCH AGENT                                               │
│     └─ Searches trending topics via web_search tool             │
│     └─ Gathers competitor content, keywords, statistics         │
│     └─ Returns structured research briefs per topic             │
│            │                                                     │
│            ▼                                                     │
│  3. WRITING AGENT (GPT-4o)                                       │
│     └─ Consumes research brief + brand voice guidelines         │
│     └─ Produces SEO-optimized blog posts, social captions       │
│     └─ Outputs markdown-formatted drafts with metadata          │
│            │                                                     │
│            ▼                                                     │
│  4. DESIGN AGENT (DALL-E 3)                                      │
│     └─ Generates image prompts matching each content piece      │
│     └─ Creates hero images, social cards, thumbnails            │
│     └─ Stores image URLs with asset metadata                    │
│            │                                                     │
│            ▼                                                     │
│  5. DISTRIBUTION AGENT                                           │
│     └─ Publishes blog posts to HubSpot CMS                      │
│     └─ Schedules social posts via Buffer API                    │
│     └─ Triggers email campaigns through HubSpot Workflows       │
│     └─ Logs all distribution events for Analytics tracking      │
└──────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework & build tool |
| Tailwind CSS | Utility-first styling |
| React Router v6 | Client-side routing |
| Recharts | Analytics charts & graphs |
| Zustand | State management |
| React Query | Server state & caching |
| Socket.io Client | Real-time agent log streaming |
| Lucide React | Icon system |

### Backend
| Technology | Purpose |
|---|---|
| Python 3.11 + FastAPI | REST API framework |
| CrewAI | Multi-agent orchestration |
| SQLAlchemy + Alembic | ORM & migrations |
| PostgreSQL | Primary database |
| Redis | Job queue & caching |
| Celery | Async task execution |
| Socket.io | Real-time WebSocket server |
| JWT | Authentication |

### AI & Integrations
| Service | Purpose |
|---|---|
| OpenAI GPT-4o | Writing, strategy, research synthesis |
| DALL-E 3 | Image generation |
| HubSpot API | CMS publishing + CRM + email |
| Buffer API | Social media scheduling |
| Google Analytics API | Performance tracking |

---

## Project Structure

```
ai-content-marketing/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── TopBar.jsx
│   │   │   │   └── Layout.jsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── StatsCard.jsx
│   │   │   │   ├── AgentStatusPanel.jsx
│   │   │   │   └── RecentActivity.jsx
│   │   │   ├── Calendar/
│   │   │   │   ├── EditorialCalendar.jsx
│   │   │   │   └── ContentCard.jsx
│   │   │   ├── Agents/
│   │   │   │   ├── AgentCard.jsx
│   │   │   │   └── AgentLogStream.jsx
│   │   │   ├── Content/
│   │   │   │   ├── ContentEditor.jsx
│   │   │   │   └── ContentList.jsx
│   │   │   └── Analytics/
│   │   │       ├── PerformanceChart.jsx
│   │   │       └── ChannelBreakdown.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Calendar.jsx
│   │   │   ├── Agents.jsx
│   │   │   ├── Content.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Integrations.jsx
│   │   │   └── Settings.jsx
│   │   ├── hooks/
│   │   │   ├── useAgentStream.js
│   │   │   ├── useCampaigns.js
│   │   │   └── useAnalytics.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── formatters.js
│   │   ├── store/
│   │   │   └── useStore.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── config.py            # Settings & env vars
│   │   ├── database.py          # DB connection & session
│   │   ├── models/
│   │   │   ├── campaign.py
│   │   │   ├── content.py
│   │   │   ├── agent_log.py
│   │   │   └── user.py
│   │   ├── routes/
│   │   │   ├── campaigns.py
│   │   │   ├── content.py
│   │   │   ├── agents.py
│   │   │   ├── analytics.py
│   │   │   ├── integrations.py
│   │   │   └── auth.py
│   │   ├── agents/
│   │   │   ├── crew.py          # CrewAI orchestrator
│   │   │   ├── strategy_agent.py
│   │   │   ├── research_agent.py
│   │   │   ├── writing_agent.py
│   │   │   ├── design_agent.py
│   │   │   └── distribution_agent.py
│   │   ├── services/
│   │   │   ├── hubspot_service.py
│   │   │   ├── buffer_service.py
│   │   │   ├── analytics_service.py
│   │   │   └── openai_service.py
│   │   └── middleware/
│   │       ├── auth.py
│   │       └── logging.py
│   ├── alembic/                 # DB migrations
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
│
├── docs/
│   ├── api-reference.md
│   ├── agent-guide.md
│   └── deployment.md
│
├── docker-compose.yml
├── Makefile
└── README.md
```

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (recommended)

### Quick Start (Docker)

```bash
# Clone the repository
git clone https://github.com/your-username/ai-content-marketing.git
cd ai-content-marketing

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit your API keys in backend/.env

# Start all services
docker-compose up --build
```

App will be running at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

### Manual Setup

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start backend server
uvicorn app.main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
# App
SECRET_KEY=your-super-secret-key-here
DEBUG=False
ALLOWED_ORIGINS=http://localhost:5173

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/content_marketing_db

# Redis
REDIS_URL=redis://localhost:6379

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
DALLE_MODEL=dall-e-3

# HubSpot
HUBSPOT_API_KEY=your-hubspot-api-key
HUBSPOT_PORTAL_ID=your-portal-id

# Buffer
BUFFER_CLIENT_ID=your-buffer-client-id
BUFFER_CLIENT_SECRET=your-buffer-client-secret
BUFFER_ACCESS_TOKEN=your-buffer-access-token

# Google Analytics
GOOGLE_ANALYTICS_PROPERTY_ID=GA4-XXXXXXXXX
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./google-service-account.json
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws
```

---

## API Reference

### Campaigns

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/campaigns` | List all campaigns |
| POST | `/api/v1/campaigns` | Create new campaign |
| GET | `/api/v1/campaigns/{id}` | Get campaign details |
| PUT | `/api/v1/campaigns/{id}` | Update campaign |
| DELETE | `/api/v1/campaigns/{id}` | Delete campaign |
| POST | `/api/v1/campaigns/{id}/run` | Trigger full agent pipeline |

### Content

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/content` | List all content pieces |
| GET | `/api/v1/content/{id}` | Get content with metadata |
| PUT | `/api/v1/content/{id}` | Update content draft |
| POST | `/api/v1/content/{id}/publish` | Publish via HubSpot |
| POST | `/api/v1/content/{id}/schedule` | Schedule via Buffer |

### Agents

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/agents/status` | Get all agent statuses |
| POST | `/api/v1/agents/strategy/run` | Run strategy agent |
| POST | `/api/v1/agents/research/run` | Run research agent |
| POST | `/api/v1/agents/writing/run` | Run writing agent |
| POST | `/api/v1/agents/design/run` | Run design agent |
| POST | `/api/v1/agents/distribution/run` | Run distribution agent |
| GET | `/api/v1/agents/logs` | Stream agent logs (SSE) |

### Analytics

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/analytics/overview` | Dashboard KPIs |
| GET | `/api/v1/analytics/content/{id}` | Per-content analytics |
| GET | `/api/v1/analytics/channels` | Channel performance breakdown |

---

## Frontend Pages

### 1. Dashboard (`/`)
- KPI cards: Total pieces published, average engagement, pipeline status
- Active agent status with real-time progress indicators
- Recent activity feed
- Quick-launch campaign button

### 2. Editorial Calendar (`/calendar`)
- Monthly calendar grid with content cards
- Color-coded by content type (blog, social, email, video)
- Drag-and-drop rescheduling
- Status badges: Draft, In Review, Scheduled, Published

### 3. Agent Control Center (`/agents`)
- Visual pipeline showing 5-agent flow
- Real-time log streaming per agent
- Start/stop/retry controls
- Token usage & cost tracking per run

### 4. Content Library (`/content`)
- Filterable content list with search
- Inline markdown preview
- AI-generated image thumbnails
- One-click publish to HubSpot / schedule to Buffer

### 5. Analytics (`/analytics`)
- Engagement trend charts (Recharts)
- Channel breakdown (HubSpot vs Buffer vs Email)
- Top performing content table
- Google Analytics traffic attribution

### 6. Integrations (`/integrations`)
- OAuth connection cards for HubSpot, Buffer, Google
- Connection status, last sync time
- API usage meters

### 7. Settings (`/settings`)
- Brand voice configuration
- Agent behavior tuning
- Notification preferences
- Team member management

---

## Database Schema

### campaigns
```sql
id            UUID PRIMARY KEY
name          VARCHAR(255)
description   TEXT
status        ENUM('draft','active','paused','completed')
start_date    DATE
end_date      DATE
brand_voice   JSONB
goals         JSONB
created_at    TIMESTAMP
updated_at    TIMESTAMP
```

### content_pieces
```sql
id            UUID PRIMARY KEY
campaign_id   UUID REFERENCES campaigns(id)
title         VARCHAR(500)
content_type  ENUM('blog','social_twitter','social_linkedin','email','newsletter')
status        ENUM('draft','review','scheduled','published','failed')
body          TEXT
metadata      JSONB   -- SEO, keywords, reading_time
image_url     VARCHAR(1000)
image_prompt  TEXT
scheduled_at  TIMESTAMP
published_at  TIMESTAMP
hubspot_id    VARCHAR(100)
buffer_id     VARCHAR(100)
created_at    TIMESTAMP
```

### agent_logs
```sql
id            UUID PRIMARY KEY
campaign_id   UUID REFERENCES campaigns(id)
agent_name    ENUM('strategy','research','writing','design','distribution')
status        ENUM('idle','running','completed','failed')
input         JSONB
output        JSONB
tokens_used   INTEGER
cost_usd      DECIMAL(10,6)
started_at    TIMESTAMP
completed_at  TIMESTAMP
error_message TEXT
```

### analytics_snapshots
```sql
id            UUID PRIMARY KEY
content_id    UUID REFERENCES content_pieces(id)
platform      VARCHAR(50)
views         INTEGER
clicks        INTEGER
shares        INTEGER
conversions   INTEGER
snapshot_date DATE
raw_data      JSONB
```

---

## Agent Details

### 1. Strategy Agent
- **Model:** GPT-4o
- **Tools:** Calendar generator, competitor analyzer
- **Input:** Campaign goals, brand guidelines, duration
- **Output:** Structured editorial calendar (JSON)

### 2. Research Agent
- **Model:** GPT-4o + web_search tool
- **Tools:** Web search, keyword extractor
- **Input:** Topic list from Strategy Agent
- **Output:** Research briefs with sources, stats, keywords

### 3. Writing Agent
- **Model:** GPT-4o
- **Tools:** SEO optimizer, brand voice enforcer
- **Input:** Research brief + brand voice guidelines
- **Output:** Formatted markdown content + metadata

### 4. Design Agent
- **Model:** GPT-4o (prompt engineering) + DALL-E 3
- **Tools:** Image generator, style adapter
- **Input:** Content body + brand style guide
- **Output:** Image URLs + alt text + prompts used

### 5. Distribution Agent
- **Model:** GPT-4o (scheduling logic)
- **Tools:** HubSpot API, Buffer API
- **Input:** Published-ready content + schedule
- **Output:** Published URLs, scheduled post IDs, confirmation logs

---

## Integrations

### HubSpot
- Blog post creation and publishing
- CRM contact segmentation for email targeting
- Email campaign triggering
- Lead tracking from content

### Buffer
- Multi-channel social scheduling (Twitter/X, LinkedIn, Instagram, Facebook)
- Optimal time suggestions
- Performance analytics pull

### Google Analytics
- GA4 traffic attribution by content piece
- Conversion tracking
- Audience behavior analysis

---

## Deployment

### Docker Compose (Production)
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment
- Backend: Gunicorn + Uvicorn workers
- Frontend: Nginx serving static build
- DB: PostgreSQL with daily backups
- Cache: Redis Cluster
- Queue: Celery workers (2-4 recommended)

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/agent-improvements`)
3. Commit changes with descriptive messages
4. Push and open a Pull Request
5. Ensure all tests pass (`make test`)

---

## License

MIT License — see [LICENSE](./LICENSE) for details.

---

*Built with ❤️ using CrewAI, GPT-4o, and modern full-stack engineering.*
# AI Marketing Automation

> Self-contained local web application for AI-powered marketing automation, campaign planning, content creation, analytics, and integrations.


