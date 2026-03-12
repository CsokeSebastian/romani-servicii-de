# SEO & Analytics Setup Guide

## What's Been Added

### 1. Google Analytics
- **Location**: `app/layout.tsx`
- **Status**: Ready to use
- **Action Required**: Replace `G-XXXXXXXXXX` in `.env` with your Google Analytics ID

#### How to Get Google Analytics ID:
1. Go to https://analytics.google.com
2. Create account/property for your website
3. Copy your Measurement ID (format: `G-XXXXXXXXXX`)
4. Update `.env` file: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`

### 2. Meta Tags (SEO)
Added comprehensive meta tags including:
- **Open Graph** - For Facebook, LinkedIn sharing
- **Twitter Cards** - For Twitter sharing
- **Canonical URLs** - Prevent duplicate content issues
- **Robots meta** - Control search engine crawling
- **Theme color** - For mobile browsers
- **Viewport** - Proper mobile rendering

### 3. Google Search Console Verification
- **Location**: `app/layout.tsx` (line with `verification.google`)
- **Action Required**: Add your verification code

#### How to Verify:
1. Go to https://search.google.com/search-console
2. Add property: `https://servicii-romani.de`
3. Choose "HTML tag" verification method
4. Copy the verification code (format: `abc123xyz`)
5. Update `app/layout.tsx`: Replace `'your-google-verification-code'` with your code

### 4. Sitemap (sitemap.xml)
- **URL**: `https://servicii-romani.de/sitemap.xml`
- **Auto-generates** all pages from database
- Includes: businesses, categories, static pages
- Updates dynamically based on database content

### 5. Robots.txt
- **URL**: `https://servicii-romani.de/robots.txt`
- Allows all search engines
- Blocks: `/debug/`, `/import/`
- Points to sitemap

### 6. Structured Data (Schema.org)
- **Location**: `components/structured-data.tsx`
- Ready for business pages
- Improves Google search results (rich snippets)
- Types: Organization, LocalBusiness, Breadcrumbs

## Required Environment Variables

Update your `.env` file:

```env
# Google Analytics (REQUIRED)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Your actual domain (update if different)
NEXT_PUBLIC_SITE_URL=https://servicii-romani.de
```

## Submit to Search Engines

### Google
1. Submit sitemap: https://search.google.com/search-console
2. URL: `https://servicii-romani.de/sitemap.xml`

### Bing
1. Go to: https://www.bing.com/webmasters
2. Submit sitemap URL

## Domain Configuration

**IMPORTANT**: Update `metadataBase` in `app/layout.tsx` if your domain is different from `servicii-romani.de`

```typescript
metadataBase: new URL('https://your-actual-domain.com'),
```

Also update in:
- `app/sitemap.ts` (line 7)
- `app/robots.ts` (line 13)

## Testing

1. **Meta Tags**: https://www.opengraph.xyz/
2. **Structured Data**: https://search.google.com/test/rich-results
3. **Mobile Friendly**: https://search.google.com/test/mobile-friendly
4. **Page Speed**: https://pagespeed.web.dev/

## Next Steps

1. ✅ Get Google Analytics ID → Update `.env`
2. ✅ Verify with Google Search Console
3. ✅ Submit sitemap to Google & Bing
4. ✅ Test meta tags with sharing preview tools
5. ✅ Add social media links to footer (if needed)
6. ✅ Consider adding Facebook Pixel (if running ads)

## Social Media Integration

If you want to add Facebook Pixel, Meta Pixel, or other tracking:
- Follow same pattern as Google Analytics
- Add to `app/layout.tsx` with `<Script>` component
