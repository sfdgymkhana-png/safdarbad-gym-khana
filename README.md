# SAFDARBAD GYM KHAN’A — Official Web Application & Management System

> **Strength • Discipline • Fitness**  
> **Location:** City Safdarabad, Main Bazar, Fatima Center, Top Floor  
> **Contact / WhatsApp:** +92 305 9422464  
> **Standard Monthly Fee:** PKR 2,500 (Live configurable in Admin Portal)

---

## 🏋️ Project Overview

Safdarbad Gym Khan’a is a full-stack gym website, customer admission portal, and comprehensive administration management system designed specifically for the Safdarbad Gym Khan’a facility in Safdarabad, Pakistan.

### Core Features

1. **Public-Facing Website (`/`)**
   - High-impact athletic hero section with official metallic badge logo and dark amber aesthetic.
   - Live editable pricing section displaying the PKR 2,500 monthly fee and promotional discounts.
   - Facilities & Training Areas (Strength Training, Bodybuilding, Fat Loss, Personal Coaching).
   - Responsive photo gallery with interactive full-screen lightbox modal.
   - Contact section with verified address and one-click direct WhatsApp chat (`+92 305 9422464`).

2. **Online Admission System (`/admission`)**
   - Prospective members can apply from home.
   - Live promotional coupon code validation (`WELCOME20`, `FIT500`).
   - Generates unique Application ID (e.g. `APP-10021`) with status tracking.
   - Confirms offline counter payment instructions at Fatima Center reception.

3. **Customer Account Portal (`/account`, `/login`, `/forgot-password`)**
   - Personalized member dashboard with real-time membership validity and days-remaining countdown.
   - Admission review status and balance due.
   - Complete transaction and receipt history.
   - Broadcast announcements and notifications from gym desk.

4. **Secure Admin Portal (`/admin`, `/admin/dashboard`)**
   - **Executive Dashboard**: Live revenue totals, active members, pending admissions, and expiring subscriptions.
   - **Members Management (`/admin/members`)**: Search, filter, walk-in creation, renewals, and CSV export.
   - **Admissions Review (`/admin/admissions`)**: Review applications, assign start dates, record offline cash payments, and activate members.
   - **Payment Management (`/admin/payments`)**: Record cash / bank payments, partial payment tracking, and printable/downloadable PDF receipts via `jsPDF`.
   - **Discounts & Coupons (`/admin/discounts`)**: Percentage and fixed PKR discount codes with validity dates.
   - **Special Offers (`/admin/offers`)**: Marketing promotional campaigns with live website toggles.
   - **Gym Programs (`/admin/programs`)**: Training categories and workout camp listings.
   - **Media & Gallery (`/admin/gallery`)**: High-resolution facility photography and logo management.
   - **Website Content Editor (`/admin/content`)**: Modify gym fee, hero headline, about copy, and address directly without editing source code.
   - **Social Media Settings (`/admin/settings/social`)**: Instagram, TikTok, and WhatsApp URLs (icons hidden until configured).
   - **Financial Reports (`/admin/reports`)**: Strict separation of cash collected vs billed fees, with CSV exports.
   - **Audit Trail (`/admin/audit-logs`)**: Immutable logging of administrative actions.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15+ (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS v4, Charcoal & Athletic Amber palette (`#101010`, `#1A1A1A`, `#FF6B00`, `#FFC857`)
- **Icons**: Lucide React
- **PDF & Receipts**: jsPDF
- **Backend & Database**: Firebase Authentication, Cloud Firestore, Firebase Storage
- **Deployment**: GitHub (Repository) & Vercel (Production Hosting)

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Default Administrator Credentials
- **URL**: `http://localhost:3000/admin`
- **Username / Email**: `admin` or `sfdgymkhana@gmail.com`
- **Password**: `Admin@1234`

---

## 🔒 Security & Firestore Rules

- Production rules are defined in `firestore.rules` and `storage.rules`.
- Customer access is strictly scoped to their own profile and records.
- Financial transactions, pricing changes, and membership activations require authenticated administrator authorization.
