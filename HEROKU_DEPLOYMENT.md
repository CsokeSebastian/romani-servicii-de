# Heroku Deployment Guide

This guide will help you deploy your Next.js application to Heroku.

## Prerequisites

1. A Heroku account (sign up at https://heroku.com)
2. Heroku CLI installed (https://devcenter.heroku.com/articles/heroku-cli)
3. Git repository initialized

## Step 1: Install Heroku CLI

If you haven't already, install the Heroku CLI:
- Windows: Download from https://devcenter.heroku.com/articles/heroku-cli
- Mac: `brew tap heroku/brew && brew install heroku`
- Linux: `curl https://cli-assets.heroku.com/install.sh | sh`

## Step 2: Login to Heroku

```bash
heroku login
```

## Step 3: Create a Heroku App

```bash
heroku create your-app-name
```

Or if you want Heroku to generate a name:
```bash
heroku create
```

## Step 4: Add Environment Variables

Add your Supabase credentials and Google Analytics ID to Heroku:

```bash
heroku config:set NEXT_PUBLIC_SUPABASE_URL=https://tiwtraxmsmxoesjlzjtz.supabase.co
heroku config:set NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpd3RyYXhtc214b2Vzamx6anR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjgxOTMsImV4cCI6MjA4ODc0NDE5M30.nINWeFgm10lh6dcpj4uQz12gxmHmyJCCSeizBZkRPXY
heroku config:set NEXT_PUBLIC_GA_ID=YOUR_ACTUAL_GOOGLE_ANALYTICS_ID
```

**Important**: Replace `YOUR_ACTUAL_GOOGLE_ANALYTICS_ID` with your real Google Analytics 4 measurement ID (format: G-XXXXXXXXXX)

## Step 5: Deploy to Heroku

```bash
git add .
git commit -m "Configure for Heroku deployment"
git push heroku main
```

If your default branch is `master` instead of `main`:
```bash
git push heroku master
```

## Step 6: Open Your Application

```bash
heroku open
```

## Step 7: Configure Custom Domain (GoDaddy)

### In Heroku Dashboard:

1. Go to your app in Heroku Dashboard
2. Click on "Settings"
3. Scroll down to "Domains"
4. Click "Add domain"
5. Enter your domain: `servicii-romani.de` and `www.servicii-romani.de`
6. Heroku will give you a DNS target (something like `your-app-name-123abc.herokudns.com`)

### In GoDaddy Dashboard:

1. Log in to GoDaddy
2. Go to "My Products" → "DNS"
3. Find your domain `servicii-romani.de`
4. Add/Update these records:

**For root domain (servicii-romani.de):**
- Type: CNAME
- Name: @
- Value: `your-app-name-123abc.herokudns.com` (use the DNS target from Heroku)
- TTL: 600 seconds

**For www subdomain:**
- Type: CNAME
- Name: www
- Value: `your-app-name-123abc.herokudns.com` (use the DNS target from Heroku)
- TTL: 600 seconds

**Note**: DNS changes can take 24-48 hours to propagate, but usually happen within 1-2 hours.

## Step 8: Set Up Google Analytics

1. Go to https://analytics.google.com/
2. Create a new property for your website
3. Get your Measurement ID (format: G-XXXXXXXXXX)
4. Update the Heroku config:

```bash
heroku config:set NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

## Monitoring and Logs

View your application logs:
```bash
heroku logs --tail
```

## Useful Heroku Commands

- Check app status: `heroku ps`
- Restart app: `heroku restart`
- View environment variables: `heroku config`
- Scale dynos: `heroku ps:scale web=1`

## Troubleshooting

If your app doesn't start:

1. Check the logs: `heroku logs --tail`
2. Verify environment variables: `heroku config`
3. Make sure your build completed: Check the Heroku dashboard

## Updates

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push heroku main
```

Your app will automatically rebuild and redeploy.
