# HomeSync: Product Requirements Document (PRD)

## 1. Executive Summary
**HomeSync** is a collaborative, mobile-first Progressive Web Application (PWA) designed to eliminate "admin fatigue" for households and partners. By centralizing maintenance schedules, financial obligations, and inventory management into a single shared dashboard, HomeSync ensures both partners maintain instant situational awareness. 

This document serves as the foundational reference for Engineering Teams and Solution Architects managing or extending the HomeSync platform.

## 2. Architecture & Tech Stack
To ensure maximum zero-cost scalability, rapid iteration, and immediate synchronization, HomeSync leverages a serverless architecture with Google Sheets acting as a headless CMS/Database.

- **Framework**: Next.js 14 (App Router)
- **Deployment**: Vercel (Edge-ready, automatic CI/CD from GitHub)
- **Database / Backend**: Live Google Sheets via Google Sheets API (v4)
- **State Management & Mutations**: Next.js Server Actions with `revalidatePath` for immediate UI hydration without client-side state fetching.
- **Client App**: iOS/Android Progressive Web App (PWA) configuration (via `manifest.json` and Apple Web App meta tags).
- **Styling**: Vanilla CSS Modules implementing the "Serene Household Orchestrator" design system.

## 3. Core Features & Requirements

### 3.1 Central Command (Dashboard)
- **Requirement**: Provide a high-level overview of immediate priorities.
- **Features**:
  - Summarizes closest upcoming Maintenance task.
  - Summarizes closest due Bill/Financial obligation.
  - Displays recent Activity logs (who did what, when).

### 3.2 Service & Maintenance Hub
- **Requirement**: Track long-term household assets and recurring maintenance (e.g., HVAC filters, Boiler checks).
- **Features**:
  - **Upcoming Tasks**: Shows scheduled maintenance sorted by due date. Includes a countdown timer for the most urgent task.
  - **Action**: Users can click "Complete" via a Server Action to log the task to history and update the timestamp.
  - **History**: Displays all completed tasks.
  - **Creation**: Floating Action Button (FAB) modal to add new appliances/maintenance schedules.

### 3.3 Financial Hub (Bills)
- **Requirement**: Prevent missed payments and organize recurring household bills.
- **Features**:
  - **Overview**: Calculates total sum of `DUE` and `OVERDUE` bills.
  - **Categorization**: Automatically sorts bills into Overdue, Upcoming, and Paid Recently.
  - **Action**: One-click "Mark Paid" button that instantly updates the Google Sheet row status to `PAID`.
  - **Creation**: FAB modal to add new bills with specific due dates.

### 3.4 Smart Pantry & Shopping List
- **Requirement**: Shared inventory management without manual counting.
- **Features**:
  - **Status Toggling**: Users can toggle items between "In Stock" and "Running Low".
  - **Cross-pollination**: Items marked as "Running Low" automatically populate on the Shopping List tab.
  - **Soft Deletion**: Users can "Remove" items they no longer buy. The backend marks the status as `Removed` rather than performing a hard row deletion to maintain historical integrity.

## 4. Data Model (Google Sheets Schema)
The application automatically creates and seeds four required tabs upon initial connection using a Google Cloud IAM Service Account. The app relies strictly on `rowNumber` binding for mutations to prevent race conditions if the sheet is edited manually.

1. **Finances**: `id`, `name`, `amount`, `dueDate`, `status`, `lastUpdatedBy`
2. **Maintenance**: `id`, `title`, `date`, `technician`, `nextDueDate`, `status`
3. **Pantry**: `id`, `name`, `category`, `status`, `lastUpdatedBy`
4. **Activity**: `id`, `user`, `action`, `timestamp`

## 5. User Identity & Customization
HomeSync operates without a complex traditional database auth system to reduce friction.
- **Configuration**: User names are configurable via `.env.local` using `NEXT_PUBLIC_USER1_NAME` and `NEXT_PUBLIC_USER2_NAME`.
- **Session Handling**: A client-side `UserSwitcher` component in the TopBar allows partners to toggle who is holding the phone.
- **Persistence**: The active user is stored in a browser cookie (`homesync_user`).
- **Traceability**: All Server Actions read this cookie to accurately log who performed an action in the `lastUpdatedBy` column and Activity feed.

## 6. Deployment & Environment
**Hosting**: Designed for Vercel.
**Required Environment Variables**:
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` (IAM Service Account)
- `GOOGLE_PRIVATE_KEY` (RSA Key for Server-to-Server Auth)
- `GOOGLE_SPREADSHEET_ID` (The target database sheet)
- `NEXT_PUBLIC_USER1_NAME` (e.g., "Rukmani")
- `NEXT_PUBLIC_USER2_NAME` (e.g., "Namam")

> [!IMPORTANT]
> Because Vercel builds the Next.js app statically where possible, any updates to the `NEXT_PUBLIC_` environment variables require a full Redeployment via the Vercel dashboard to bake the new names into the client bundles.

## 7. Future Roadmap
1. **Push Notifications**: Integrate Web Push APIs or a service like OneSignal to ping users 24 hours before a bill is due.
2. **Receipt Scanning**: Allow users to upload images of receipts to Google Drive and link the Drive URL to the Financial Hub.
3. **True Authentication**: If scaling beyond a single household, replace the `.env` cookie switcher with NextAuth/Auth0 for secure multi-tenant access.
