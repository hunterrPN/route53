# AWS Route53 Clone

A functional UI/UX clone of **AWS Route53** with persistent storage and backend API. Built to closely replicate the real AWS Route53 console experience.

![Route53 Clone](https://via.placeholder.com/800x400?text=Route53+Clone+Screenshot)

## ✨ Features

- **Authentication**: Mocked login system with JWT
- **Hosted Zones**: Full CRUD (Create, Read, Update, Delete)
- **DNS Records**: Full CRUD with support for major record types
- **Modern UI**: Closely mimics real AWS Route53 design
- **Search, Filters & Pagination**
- **Responsive Design**
- **Persistent Data** using SQLite

### Supported Record Types
`A`, `AAAA`, `CNAME`, `TXT`, `MX`, `NS`, `PTR`, `SRV`, `CAA`

---

## 🛠 Tech Stack

### Backend
- **FastAPI** (Python)
- **SQLAlchemy** (ORM)
- **SQLite** Database
- **JWT** Authentication
- **Pydantic v2**

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Zustand** (State Management)
- **Axios**

---

## 📁 Project Structure
route53-clone/
├── backend/              # FastAPI Backend
│   ├── app/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── crud/
│   │   ├── routers/
│   │   ├── database.py
│   │   └── main.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/             # Next.js Frontend
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── store/
│   └── package.json
│
└── README.md
text---

cd backend

   # Backend Setup

# Create virtual environment
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the backend
uvicorn app.main:app --reload --port 8000

  #  Frontend Setup
Bashcd frontend

# Install dependencies
npm install

# Run the frontend
npm run dev

Default Login Credentials:

Email: admin@demo.com
Password: admin123
