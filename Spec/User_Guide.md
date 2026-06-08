# HomeSync: Setup & Usage Guide

Welcome to **HomeSync**! This guide is designed for anyone to easily set up their own private version of this household management app. You do **not** need to be a programmer to set this up. All you need is a Google Account and about 10 minutes!

---

## Phase 1: Prepare Your Google Sheet Database
HomeSync uses a simple Google Sheet as its "database." This means you completely own your data, and you can even view it directly in Google Sheets!

1. Go to [Google Sheets](https://sheets.google.com) and create a **Blank Spreadsheet**.
2. Look at the URL at the top of your browser. It will look something like this:
   `https://docs.google.com/spreadsheets/d/1ZNKlQFaRc5xRU3EmWv-BepO5UXYuh53We1eJ7H6X1oA/edit`
3. Copy the long mix of letters and numbers in the middle (e.g., `1ZNKlQFaRc5...`). Save this somewhere safe. This is your **Google Spreadsheet ID**.

---

## Phase 2: Create a Google "Bot" (Service Account)
For the app to automatically talk to your Google Sheet behind the scenes, we need to create a secure "bot."

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click **Select a Project** at the top left, then click **New Project**. Name it "HomeSync" and click Create.
3. In the search bar at the top, search for **Google Sheets API** and click on it. Click the blue **Enable** button.
4. Now, search for **Service Accounts** in the top search bar and click on it.
5. Click **+ Create Service Account** at the top. Name it "homesync-bot" and click **Create and Continue**, then click **Done**.
6. You will see your new bot in a list. Copy the **Email Address** (it will end in `.iam.gserviceaccount.com`). Save this somewhere safe. This is your **Service Account Email**.
7. Click on the bot's email address, go to the **Keys** tab, click **Add Key**, and choose **Create new key (JSON)**. A file will download to your computer.
8. Open that downloaded file using a basic text editor (like Notepad on Windows or TextEdit on Mac). You will see a `private_key` section that starts with `-----BEGIN PRIVATE KEY-----`. Save the entire block of text safely. This is your **Private Key**.

---

## Phase 3: Share Your Sheet with the Bot
Your bot needs permission to edit your Google Sheet!
1. Go back to the Google Sheet you created in Phase 1.
2. Click the big **Share** button in the top right.
3. Paste the **Service Account Email** you copied earlier into the text box (just like sharing it with a friend), ensure they are set to "Editor", and click Send!

---

## Phase 4: Deploy the App to the Internet
We will use **Vercel**, a free platform that automatically builds apps for you.

1. Go to [GitHub](https://github.com/) and create a free account if you don't have one.
2. Navigate to the HomeSync code repository and click the **"Fork"** button in the top right corner. This copies the app to your own account.
3. Go to [Vercel.com](https://vercel.com) and sign up using your new GitHub account.
4. Click **Add New Project**, and click **Import** next to your forked HomeSync repository.
5. **CRITICAL STEP**: Open the **Environment Variables** dropdown and add the following 5 keys and their values (using the info you saved earlier):
   - Key: `GOOGLE_SPREADSHEET_ID` | Value: *(Paste the ID from Phase 1)*
   - Key: `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Value: *(Paste the Email from Phase 2)*
   - Key: `GOOGLE_PRIVATE_KEY` | Value: *(Paste the exact Private Key block from Phase 2)*
   - Key: `NEXT_PUBLIC_USER1_NAME` | Value: *(e.g., Jane)*
   - Key: `NEXT_PUBLIC_USER2_NAME` | Value: *(e.g., John)*
6. Click **Deploy**! Wait 2 minutes, and Vercel will give you a live website link.

---

## Phase 5: How to Use the App
When you open your new live link for the first time, HomeSync will automatically set up the structure of your Google Sheet for you!

- **User Switching**: Tap the round circle in the top right corner of the app. It will instantly switch between the two names you configured. Ensure your initial is showing so the app tracks your actions!
- **Install on Your Phone**: Open your website link in Safari (iPhone) or Chrome (Android). Tap the "Share" icon at the bottom of the screen and choose **"Add to Home Screen"**. It will now look and act exactly like a native app downloaded from the App Store!
