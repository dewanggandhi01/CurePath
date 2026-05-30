# CurePath -- Digital Prescription Management Platform

CurePath is a full-stack web application built to solve a real problem in healthcare: patients lose physical prescriptions, and clinics struggle to maintain organized prescription records. This platform allows doctors to create, manage, and track digital prescriptions while giving patients secure, on-demand access to their prescription history and medical records.

The application is built with Next.js 16, React 19, and TypeScript, following modern frontend architecture patterns. It ships with role-based access control, client-side PDF generation, animated UI transitions, and a responsive design system that adapts from mobile to desktop.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Architecture Decisions](#architecture-decisions)
- [Getting Started](#getting-started)
- [Demo Credentials](#demo-credentials)
- [User Flows](#user-flows)
- [Design System](#design-system)
- [Build and Deployment](#build-and-deployment)

---

## Problem Statement

Patients often lose physical prescriptions, while clinics struggle to maintain organized prescription records. CurePath addresses this by providing a web-based prescription management platform where:

- Doctors can create and manage digital prescriptions.
- Patients can securely access their prescription history.
- Both roles benefit from simplified prescription tracking and improved accessibility.

---

## Core Features

### Authentication and Authorization
- Role-based login system supporting two distinct user types: Doctor and Patient.
- Session persistence via localStorage with JSON-serialized user objects.
- Route-level authorization guards that redirect unauthorized users.
- Separate navigation menus and dashboard views rendered based on the authenticated role.

### Prescription Management (Doctor)
- Full CRUD operations: create, read, update, and delete prescriptions.
- Multi-medication support per prescription with dosage, frequency, duration, and instruction fields.
- Status tracking across three states: Active, Completed, and Expired.
- Patient assignment via dropdown selection during prescription creation.

### Prescription Access (Patient)
- Patients can view all prescriptions assigned to them.
- Each prescription displays the issuing doctor, diagnosis, medications, and status.
- Patients can download any prescription as a formatted PDF document.

### Medical History (Patient)
- Chronological timeline view of past medical records.
- Record types include Lab Results, General Checkups, X-Rays, and Blood Tests.
- Each record shows the attending doctor, diagnosis, and clinical notes.
- Searchable by diagnosis, doctor name, or record type.

### Patient Records (Doctor)
- Doctors can browse all patients who have received prescriptions.
- Each patient profile displays their full prescription history.
- Quick access to view, edit, or download any prescription from the patient detail page.

### PDF Generation
- Client-side PDF generation using jsPDF -- no server round-trip required.
- Generated documents include a branded header, doctor and patient details, diagnosis, a formatted medication table, clinical notes, and a signature line.
- PDF files are named using the prescription ID for traceability.

### Search and Filters
- Real-time search across prescription diagnosis, patient name, and doctor name.
- Filter by prescription status (Active, Completed, Expired).
- Filter by patient (Doctor view only).
- Sort by date or diagnosis.
- Keyboard shortcut support (Ctrl+K / Cmd+K to focus search).

### Analytics Dashboard
- KPI cards displaying Total Patients, Total Prescriptions, Active Cases, and Monthly Issuance.
- Area chart showing prescription issuance trends over the last six months.
- Time range selector for chart data (7 days, 30 days, 6 months, 1 year).
- Summary statistics row with growth indicators.

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16.2.6 (App Router) | Server-side rendering, routing, and build tooling |
| UI Library | React 19 | Component architecture and state management |
| Language | TypeScript 5 | Type safety across the entire codebase |
| Styling | Tailwind CSS 4 + Custom CSS | Utility-first styling with a hand-tuned design system |
| Animations | Framer Motion 12 | Page transitions, card animations, and micro-interactions |
| Charts | Recharts 3.8 | Responsive area charts for the analytics dashboard |
| PDF | jsPDF 4.2 | Client-side prescription PDF generation |
| Icons | Lucide React 1.16 | Consistent iconography across all components |
| UI Primitives | Radix UI | Accessible dialog, select, and tab components |
| Build Tool | Turbopack | Fast incremental compilation during development |

---

## Project Structure

```
curepath/
├── app/
│   ├── page.tsx                          # Login page with role-based authentication
│   ├── layout.tsx                        # Root layout with theme and font providers
│   ├── globals.css                       # Complete design system (variables, components, animations)
│   └── dashboard/
│       ├── layout.tsx                    # Dashboard shell with sidebar navigation
│       ├── page.tsx                      # Analytics home with KPI cards and charts
│       ├── prescriptions/
│       │   ├── page.tsx                  # Prescription list with search, filters, and CRUD
│       │   └── [id]/page.tsx             # Prescription detail with edit and download
│       ├── patients/
│       │   ├── page.tsx                  # Patient directory (Doctor only)
│       │   └── [id]/page.tsx             # Patient profile with prescription history
│       └── history/
│           └── page.tsx                  # Medical history timeline (Patient only)
├── components/
│   ├── Navbar.tsx                        # Responsive navigation with animated menu toggle
│   ├── PrescriptionCard.tsx              # Prescription card with status indicators and actions
│   ├── PrescriptionForm.tsx              # Multi-step prescription creation/edit form
│   ├── SearchFilter.tsx                  # Reusable search and filter bar
│   ├── StatsCard.tsx                     # Animated KPI card with counter transitions
│   ├── Skeleton.tsx                      # Loading skeleton components
│   ├── ThemeToggle.tsx                   # Dark/light theme switcher
│   └── Toast.tsx                         # Notification toast system
├── lib/
│   ├── auth.ts                           # Authentication logic with role management
│   ├── data.ts                           # Data layer with localStorage persistence
│   └── pdf.ts                            # PDF document generation
└── public/
    └── heartbeat.svg                     # Decorative SVG used in analytics card background
```

---

## Architecture Decisions

**Client-side data persistence.** All prescription and medical record data is stored in localStorage. This eliminates the need for a backend server during development and evaluation while preserving the full CRUD contract. The data layer in `lib/data.ts` exposes the same interface you would expect from a REST API client, making it straightforward to swap in a real backend later.

**Role-based rendering, not role-based routing.** Rather than splitting doctor and patient into separate route trees, CurePath uses a single dashboard layout that conditionally renders UI based on the authenticated user's role. This keeps the routing surface small and avoids code duplication for shared pages like the prescription detail view.

**Client-side PDF generation.** Prescription PDFs are generated entirely in the browser using jsPDF. This means the feature works offline, requires no server infrastructure, and produces consistent output regardless of the deployment environment.

**Custom design system over component libraries.** The visual layer is built from scratch using CSS custom properties and Tailwind utilities rather than a prebuilt component library. This gives full control over the visual identity and ensures the UI feels intentional rather than templated.

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm, yarn, or pnpm

### Installation

```bash
git clone https://github.com/dewanggandhi01/CurePath.git
cd CurePath
npm install
```

### Development

```bash
npm run dev
```

The application starts at `http://localhost:3000`. Turbopack handles hot module replacement, so changes are reflected immediately.

### Production Build

```bash
npm run build
npm start
```

---

## Demo Credentials

The application ships with seeded demo data. Use the following credentials to explore both roles:

| Role | Email | Password |
|------|-------|----------|
| Doctor | dr.sharma@curepath.com | doctor123 |
| Doctor | dr.patel@curepath.com | doctor123 |
| Patient | rahul@email.com | patient123 |
| Patient | priya@email.com | patient123 |
| Patient | amit@email.com | patient123 |

Data is seeded automatically on first login. To reset the application state, clear localStorage in your browser's developer tools.

---

## User Flows

### Doctor Workflow

1. Log in with a doctor account.
2. View the analytics dashboard with KPI cards and prescription trends.
3. Navigate to Prescriptions to see all issued prescriptions.
4. Click "New Prescription" to create a prescription -- select a patient, enter diagnosis, add medications with dosage details, and submit.
5. Click any prescription card to view its full details, edit fields, or download it as a PDF.
6. Navigate to Patients to browse the patient directory and view individual patient histories.

### Patient Workflow

1. Log in with a patient account.
2. View the dashboard showing active prescriptions, total prescriptions, and medical record counts.
3. Navigate to My Prescriptions to see all prescriptions issued to you.
4. Click any prescription to view details or download the PDF.
5. Navigate to Medical History to see a chronological timeline of past consultations, lab results, and checkups.

---

## Design System

The visual identity is defined through CSS custom properties in `app/globals.css`, supporting both light and dark themes. Key design tokens:

- **Typography**: Oswald and Montserrat font stack with a tight tracking system.
- **Color palette**: Clinical teal (#0f766e) as the primary accent, with semantic colors for status indicators (green for active, blue for completed, slate for expired).
- **Elevation**: Layered box-shadow system for cards, dialogs, and hover states.
- **Motion**: Framer Motion spring physics for menu toggles, card entrances, and page transitions.
- **Spacing**: 4px baseline grid with consistent padding and gap values.
- **Dark mode**: Full dark theme support toggled via a data-theme attribute on the document root.

---

## Build and Deployment

The production build compiles successfully with zero warnings:

```
Route (app)
  /                           Static
  /dashboard                  Static
  /dashboard/history          Static
  /dashboard/patients         Static
  /dashboard/patients/[id]    Dynamic
  /dashboard/prescriptions    Static
  /dashboard/prescriptions/[id]  Dynamic
```

Static routes are prerendered at build time. Dynamic routes (`[id]` segments) are server-rendered on demand.

The application can be deployed to any platform that supports Next.js, including Vercel, Netlify, AWS Amplify, or a self-hosted Node.js server.
