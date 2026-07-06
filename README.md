# 🛡️ SAFETY HEAVEN

**SAFETY HEAVEN** is a personal safety and emergency response web application. It gives users a quick way to trigger SOS alerts, manage trusted emergency contacts, report and track incidents, and share their live location on a map — all from a single, mobile-friendly dashboard.

APP LINK :https://avani-shield.lovable.app/ 
       
---

## ✨ Features

- **🆘 SOS Alerts** — One-tap emergency trigger to notify trusted contacts instantly.
- **📇 Emergency Contacts** — Add, edit, and manage a list of trusted contacts who get notified during an emergency.
- **📍 Live Location & Map** — Real-time geolocation tracking displayed on an interactive map.
- **📝 Incident Reporting** — Log and track safety incidents with details and history.
- **📊 Dashboard** — A central hub summarizing alerts, incidents, and contact status at a glance.
- **🔐 Authentication** — Secure sign-up/sign-in flow with session and route protection middleware.
- **📱 Responsive UI** — Fully responsive design with a complete UI component library (dialogs, drawers, tables, forms, toasts, tooltips, and more).

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (React + file-based routing) |
| Language | TypeScript |
| Styling | Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/) (New York style) |
| Icons | [Lucide](https://lucide.dev/) |
| Backend / Database | [Supabase](https://supabase.com/) (Postgres + Auth) |
| Build Tool | [Vite](https://vitejs.dev/) |
| Package Manager | [Bun](https://bun.sh/) |
| Linting | ESLint |

---

## 📁 Project Structure

```
SAFETY-HEAVEN/
├── dashboard.tsx              # Main dashboard view
├── sos.tsx                    # SOS alert trigger
├── incidents.tsx              # Incident reporting & tracking
├── contacts.tsx                # Emergency contacts management
├── map.tsx                    # Live location / map view
├── auth.tsx                   # Authentication UI
├── auth-attacher.ts            # Auth token attachment helper
├── auth-middleware.ts          # Route/session protection middleware
├── use-auth.ts                 # Auth hook
├── use-geolocation.ts           # Geolocation hook
├── use-mobile.tsx               # Mobile viewport detection hook
├── __root.tsx / route.tsx / router.tsx / routeTree.gen.ts
│                              # TanStack Start routing setup
├── client.ts / client.server.ts # Supabase client (browser & server)
├── main.tsx / index.tsx         # App entry points
├── styles.css                  # Global styles / Tailwind config
├── *.tsx (accordion, button, card, dialog, table, etc.)
│                              # shadcn/ui component library
├── *.sql                       # Supabase database migrations
├── vite.config.ts / tsconfig.json / eslint.config.js
│                              # Build & tooling configuration
└── package.json / bun.lock / bunfig.toml
```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- A [Supabase](https://supabase.com/) project (URL + Publishable Key)

### Installation

```bash
# Clone the repository
git clone https://github.com/RGVIGNESH33/SAFETY-HEAVEN.git
cd SAFETY-HEAVEN

# Install dependencies
bun install
```

### Environment Variables

Create a `.env` file in the project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

### Database Setup

Apply the SQL migration files (found in the repo root) to your Supabase project via the Supabase SQL editor or CLI to set up the required tables.

### Run the App

```bash
bun run dev
```

The app should now be running locally — check your terminal output for the local URL.

### Build for Production

```bash
bun run build
```

---

## 🧩 UI Components

The project ships with a full [shadcn/ui](https://ui.shadcn.com/) component set (buttons, dialogs, drawers, forms, tables, tabs, tooltips, toasts, sidebars, and more), so new features can be built quickly using consistent, accessible components.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

No license has been specified for this repository yet. Please check with the repository owner before reuse.

---

## 👤 Author

**RGVIGNESH33** — [GitHub Profile](https://github.com/RGVIGNESH33)
