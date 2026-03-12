# Quick Start - Deploy in 3 Steps

## Step 1: Push to GitHub (2 minutes)

### Windows Users:
1. Double-click `push-to-github.bat`
2. If asked, log into GitHub in your browser

### Mac/Linux Users:
1. Open Terminal in this folder
2. Run: `bash push-to-github.sh`
3. If asked, log into GitHub

**If you get a "git not found" error:**
- Windows: Download from https://git-scm.com/download/win
- Mac: Run `xcode-select --install` in Terminal

---

## Step 2: Deploy on Netlify (3 minutes)

1. Go to https://app.netlify.com (sign up with GitHub if needed)

2. Click **"Add new site"** → **"Import an existing project"**

3. Click **"GitHub"** → Find and select **"Servicii-Pentru-Romani"**

4. Settings should auto-fill:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click **"Deploy site"**

5. Wait 2-3 minutes for deployment

---

## Step 3: Add Environment Variables (2 minutes)

⚠️ **CRITICAL: Your site won't work without this step!**

1. In Netlify, go to: **Site settings** → **Environment variables**

2. Click **"Add a variable"** three times and add these:

**Variable 1:**
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://tiwtraxmsmxoesjlzjtz.supabase.co
```

**Variable 2:**
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpd3RyYXhtc214b2Vzamx6anR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjgxOTMsImV4cCI6MjA4ODc0NDE5M30.nINWeFgm10lh6dcpj4uQz12gxmHmyJCCSeizBZkRPXY
```

**Variable 3 (optional):**
```
Key: NEXT_PUBLIC_GA_ID
Value: G-XXXXXXXXXX
```

3. Click **"Save"**

4. Go to **Deploys** tab → **"Trigger deploy"** → **"Deploy site"**

5. Wait 2-3 minutes

---

## ✅ Done!

Your site is now live! You'll see a URL like `https://your-site-name.netlify.app`

### Add Custom Domain (Optional)

See `DEPLOYMENT_GUIDE.md` for detailed instructions on:
- Connecting serviciipentruromani.com
- Setting up DNS on GoDaddy
- Enabling HTTPS

### Create Admin Account

After deployment, see `ADMIN_SETUP.md` to create your admin account and start adding businesses.

---

## Troubleshooting

**Git errors?** Make sure Git is installed (see Step 1)

**Build fails?** Check that all 3 environment variables are added correctly

**Site shows errors?** Wait a few minutes after adding environment variables, then trigger a new deploy

**Need help?** See the full `DEPLOYMENT_GUIDE.md` for detailed troubleshooting
