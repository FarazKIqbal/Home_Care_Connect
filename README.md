# Home Care Connect

**A two-sided home services marketplace connecting customers with verified professionals for cleaning, plumbing, and electrical work.**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10%2B-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3%2B-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D14-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

---

## What Is This

A modern web platform that connects homeowners with vetted local service professionals. Customers can browse providers, check availability, and book appointments. Providers manage their schedules and toggle availability through role-based dashboards.

## Why It’s Needed

Small business owners and homeowners waste time juggling fragmented tools for booking service appointments. This platform centralizes the workflow into a single, clean interface with role-aware routing — customers see their bookings, providers manage their availability.

## What You Get

- **Role-based authentication** — Separate customer and provider experiences with distinct navigation
- **Real-time availability** — Providers toggle status directly and customers see live availability
- **Service filtering** — Find cleaners, plumbers, or electricians by service type
- **Booking flow** — Select provider, choose date/time/location, submit job request
- **Responsive UI** — Optimized for desktop and mobile with Tailwind styling

## Quick Start

```bash
git clone https://github.com/FarazKIqbal/Home_Care_Connect.git
cd Home_Care_Connect
npm install
npm start
```

Open http://localhost:3000 in your browser.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, React Router v6 |
| **Styling** | Tailwind CSS, lucide-react icons |
| **Backend** | Firebase Auth, Firestore |
| **Build** | Webpack, Babel, PostCSS |
| **Testing** | React Testing Library, Jest |

## Project Structure

```
src/
├── App.js                    # Main router and auth providers
├── Pages/
│   ├── dashboard/           # Customer: UserDashboard, UserProfile, service-specific pages
│   ├── provider/            # Provider: ProviderDashboard, ProviderProfile
│   ├── login/               # Authentication flows (UserLogin, ProviderLogin)
│   ├── UserRegister/        # Customer registration and help
│   └── provider/ProviderRegister/  # Provider registration
├── components/              # ProtectedRoute, ServiceCard
├── contexts/                # AuthContext for auth state
└── services/                # Firestore service helpers
```

## Getting Started

### Prerequisites

- Node.js >= 14.x
- npm >= 6.x or yarn

### Installation

```bash
npm install
npm start
```

### Build for Production

```bash
npm run build
```

## License

MIT License — see [LICENSE](LICENSE) file for details.