# Deployment Guide for ServiciiPentruRomani

## Step 1: Push Code to GitHub

### On Windows:
1. Open Command Prompt or PowerShell
2. Navigate to your project folder
3. Run these commands one by one:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/CsokeSebastian/Servicii-Pentru-Romani.git
git branch -M main
git push -u origin main
```

### On Mac:
1. Open Terminal
2. Navigate to your project folder
3. Run the same commands as above

**Note:** If you get an error saying "remote origin already exists", run this first:
```bash
git remote remove origin
```
Then run the commands above again.

---

## Step 2: Deploy to Netlify

1. **Log into Netlify** (https://app.netlify.com)

2. **Click "Add new site"** → **"Import an existing project"**

3. **Choose GitHub**
   - Click "Authorize Netlify" if asked
   - Select your repository from the list

4. **Configure build settings** (should auto-detect):
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click **"Deploy site"**

5. **Wait for deployment** (2-5 minutes)

---

## Step 3: Add Environment Variables

⚠️ **IMPORTANT: Your site won't work without these!**

1. In Netlify, go to: **Site settings** → **Environment variables**

2. Click **"Add a variable"** and add these THREE variables:

### Variable 1:
- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://tiwtraxmsmxoesjlzjtz.supabase.co`

### Variable 2:
- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpd3RyYXhtc214b2Vzamx6anR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjgxOTMsImV4cCI6MjA4ODc0NDE5M30.nINWeFgm10lh6dcpj4uQz12gxmHmyJCCSeizBZkRPXY`

### Variable 3 (Optional - for Google Analytics):
- **Key:** `NEXT_PUBLIC_GA_ID`
- **Value:** `G-XXXXXXXXXX` (replace with your actual Google Analytics ID when you have one)

3. Click **"Save"**

4. **Trigger a new deploy:**
   - Go to **Deploys** tab
   - Click **"Trigger deploy"** → **"Deploy site"**

---

## Step 4: Add Custom Domain

1. In Netlify → **Domain management** → **Add custom domain**

2. Enter: `serviciipentruromani.com`

3. Click **"Verify"** and **"Add domain"**

4. Netlify will show you DNS settings to configure

---

## Step 5: Update GoDaddy DNS Settings

1. **Log into GoDaddy** (https://godaddy.com)

2. Go to **My Products** → **Domains** → **DNS**

3. **Delete existing A records and CNAME records** for your domain

4. **Add new records** (Netlify will show you the exact values):

   **Type A Record:**
   - Type: `A`
   - Name: `@`
   - Value: (Netlify will provide the IP - usually something like `75.2.60.5`)
   - TTL: `600` seconds

   **Type CNAME Record:**
   - Type: `CNAME`
   - Name: `www`
   - Value: `your-site-name.netlify.app` (Netlify will show this)
   - TTL: `600` seconds

5. **Save all changes**

6. **Wait 15-60 minutes** for DNS to propagate

---

## Step 6: Enable HTTPS (SSL)

1. After DNS propagates, go to Netlify → **Domain management**

2. Scroll to **HTTPS** section

3. Click **"Verify DNS configuration"**

4. Click **"Provision certificate"**

5. Wait a few minutes - your site will now have HTTPS! 🎉

---

## Troubleshooting

### "Command not found: git"
- **Windows:** Download Git from https://git-scm.com/download/win
- **Mac:** Install Xcode Command Line Tools: `xcode-select --install`

### "Repository not found"
- Make sure your GitHub repository URL is correct
- Make sure you're logged into GitHub

### Site shows errors
- Check that all 3 environment variables are added correctly
- Make sure you triggered a new deploy after adding variables

### Domain not working
- Wait up to 24 hours for DNS changes to fully propagate
- Double-check DNS settings match Netlify's instructions exactly

---

## What's Next?

After successful deployment:

1. ✅ Test your live site at `serviciipentruromani.com`
2. ✅ Create an admin account (see `ADMIN_SETUP.md`)
3. ✅ Start adding businesses through the admin panel
4. ✅ Set up Google Analytics (optional)

---

## Need Help?

If you get stuck, let me know:
- What step you're on
- Any error messages you see
- Screenshots help!
