# Zivanta Mall E-Commerce Platform

Zivanta is a modern, feature-rich digital platform for mall management and e-commerce. It is designed to provide a premium digital experience for mall visitors, offering seamless access to brands, promotions, and exclusive mall services.

## 🌟 Key Features

- **Interactive Mall Services**: Dedicated modules for digital concierge services, personal shopping assistance, and valet parking management.
- **Brand & Directory Management**: Dynamic showcasing of mall brands, categories, and the latest promotions.
- **AI-Powered Chat Assistant**: Integrated conversational AI (powered by LangChain) for intelligent customer support, wayfinding, and shopping recommendations.
- **Loyalty Program**: Built-in loyalty management for customer rewards and points tracking.
- **Leasing Portal**: Streamlined application and inquiry process for prospective retail tenants.
- **Modern & Fluid UI**: Built with Next.js 15 and Framer Motion for a responsive, app-like user experience.
- **Robust API**: High-performance, scalable backend powered by FastAPI and PostgreSQL.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) & [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Database**: PostgreSQL with [SQLAlchemy](https://www.sqlalchemy.org/) ORM
- **Migrations**: [Alembic](https://alembic.sqlalchemy.org/)
- **AI/LLM Integration**: [LangChain](https://www.langchain.com/) (Supporting OpenAI & Google GenAI)
- **Authentication**: JWT & Passlib (bcrypt) for secure access.

## 📂 Project Structure

```
Zivanta/
├── backend/          # FastAPI server, database models, and API routes
│   ├── alembic/      # Database migration scripts
│   └── src/
│       ├── api/      # REST API endpoints (auth, brands, chat, leasing, promotions, etc.)
│       ├── application/
│       ├── domain/
│       └── infrastructure/
├── frontend/         # Next.js web application
│   ├── public/
│   └── src/
│       ├── app/      # Next.js App Router (pages: concierge, gift-cards, valet-parking, etc.)
│       ├── components/ # Reusable React components
│       ├── lib/      # Utility functions
│       └── store/    # Zustand state stores
└── static/           # Shared static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- PostgreSQL

### 1. Backend Setup

Navigate to the backend directory and set up the Python environment:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Set up your environment variables. Create a `.env` file in the `backend` directory (you can use a `.env.example` if provided) and configure your database URL, JWT secret, and AI API keys.

Run database migrations:
```bash
alembic upgrade head
```

Start the FastAPI development server:
```bash
uvicorn main:app --reload --port 8000
```
The API documentation will be available at `http://localhost:8000/docs`.

### 2. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
npm install
```

Configure frontend environment variables in `.env.local` (e.g., API base URL).

Start the Next.js development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

## 📜 License
[Specify License Here]
