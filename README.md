# HRRIS — Hotel and Room Reservation Information System Setup

## Prerequisites
- A browser supporting standard ES6 modules.
- A free [Supabase](https://supabase.com/) Account.

## Setup Steps

### 1. Supabase Project Initialization
1. Log in to your Supabase Dashboard and click **New Project**.
2. Name your project (e.g., `HRRIS-Project`) and assign a secure Database Password.

### 2. Database Creation
1. In your Supabase Dashboard left menu, navigate to **SQL Editor**.
2. Create a new query, paste the contents of `schema.sql`, and click **Run**.
3. Create a second query, paste the contents of `policies.sql`, and click **Run**.
4. Create a third query, paste the contents of `seed.sql`, and click **Run**.

### 3. Authentication Setup
1. In Supabase, go to **Authentication** -> **Providers**.
2. Ensure **Email** provider is Enabled.
3. (Optional for school demo) Go to **Authentication** -> **URL Configuration** and set Site URL to `http://localhost:5500` or your local web server path.

### 4. Link Application Keys
1. In Supabase, click on **Project Settings** (gear icon) -> **API**.
2. Copy the **Project URL** and the **`anon` `public` key**.
3. Open `js/supabase.js` in your project folder and replace placeholder strings:
   ```javascript
   const SUPABASE_URL = "[https://your-project-ref.supabase.co](https://your-project-ref.supabase.co)";
   const SUPABASE_ANON_KEY = "your-actual-anon-key";