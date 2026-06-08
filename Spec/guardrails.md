# Security Guardrails

HomeSync operates on a dual-layered security model to ensure that your sensitive household data remains entirely private, while still being accessible to you and your partner via the internet.

## 1. Google Sheets Authorization (Data Layer)
The core database of HomeSync is a physical Google Sheet hosted in your personal Google Drive. 
- **Constraint**: The Google Sheet must remain entirely **Private** (Restricted sharing settings).
- **Access Control**: You must explicitly share the document *only* with the Service Account Bot's email address (e.g., `homesync-bot@...iam.gserviceaccount.com`).
- **Protection**: Nobody on the internet, not even anyone who discovers the Spreadsheet ID, can read or write to this file without being logged into your personal Google Account or possessing the highly secure RSA Private Key.

## 2. Next.js Basic Authentication (Application Layer)
Because Vercel hosts the Next.js application publicly on the internet, anyone who guesses or finds your `vercel.app` link could theoretically interact with your Google Sheet via the application. 
- **Constraint**: The Vercel application must not be accessible to the public.
- **Access Control**: We use HTTP Basic Authentication executed at the Edge (Next.js Middleware). 
- **Protection**: Every single request to the app is intercepted before it reaches the server. The user is prompted with a native browser login popup. If the credentials do not exactly match the `APP_USERNAME` and `APP_PASSWORD` environment variables, the server forcefully rejects the connection (401 Unauthorized) and prevents the code from executing. 

## 3. Environment Secrets (Infrastructure Layer)
- **Constraint**: Never commit `.env.local` to GitHub.
- **Protection**: The `.gitignore` file explicitly blocks `.env*` files. Your Private RSA Key, Spreadsheet ID, and App Passwords exist solely on your local hard drive and securely encrypted inside Vercel's Environment Variables vault.
