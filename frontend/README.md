# AWS Route53 Clone Frontend

This is a Next.js 14+ (App Router) clone of the AWS Route 53 Console UI. It is built with React, TypeScript, Tailwind CSS, Radix UI dialogs, Zustand for auth state management, Axios for API calls, and Sonner for toast notifications.

---

## Tech Stack
* **Framework**: Next.js 14+ (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **State Management**: Zustand (with localStorage persistence)
* **HTTP Client**: Axios
* **UI Components**: custom Tailwind + Radix UI Primitives (`@radix-ui/react-dialog`, `@radix-ui/react-slot`)
* **Icons**: Lucide React
* **Toast Alerts**: Sonner

---

## Features
1. **AWS Theme UI**: Dark navigation header bar and light grey content layout matching the actual AWS Management Console styling.
2. **JWT Route Guarding**: Authenticated sessions are enforced on all dashboard and hosted zone screens. Unauthenticated requests are immediately redirected to the Sign-In screen.
3. **Hosted Zones CRUD**: Real-time searching, pagination, sorting (by Name, Created At), creation, and deletion of Hosted Zones.
4. **DNS Records CRUD**: Full management of records within hosted zones, including type validations (supporting `A`, `AAAA`, `CNAME`, `TXT`, `MX`, `NS`, `PTR`, `SRV`, `CAA`), TTL configuration, value configuration, editing, and deletion.
5. **Toast Feedbacks**: Rich color status toasts showing actions outcomes (e.g. "Record created successfully").

---

## Getting Started

### 1. Install Dependencies
Run npm install in the frontend directory:
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to view the console.

---

## Credentials
Sign in using the default AWS Console administrator account details:
* **Email**: `admin@demo.com`
* **Password**: `admin123`
