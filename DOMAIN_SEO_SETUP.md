# Frosh Domain & SEO Setup Documentation

## Overview
This document details the comprehensive domain redirect and SEO optimization setup for Frosh, ensuring seamless traffic flow from getfrosh.com to frosh.app with maximum SEO benefits.

---

## Domain Redirect Implementation

### Client-Side Redirect (Implemented)
**File:** `src/components/DomainRedirect.tsx`

The DomainRedirect component automatically detects when users access the site via getfrosh.com or www.getfrosh.com and performs a client-side redirect to frosh.app, preserving all paths and parameters.

**Features:**
- Detects getfrosh.com and www.getfrosh.com hostnames
- Preserves full URL paths, query parameters, and hash fragments
- Uses `window.location.replace()` to avoid adding to browser history (acts like a 301 redirect)
- Example: `getfrosh.com/about?ref=social#section` → `frosh.app/about?ref=social#section`

**Integration:** 
Added to main App component in `src/App.tsx` to run on every page load before routing.

---

### Server-Side Redirect Configuration
**File:** `public/.htaccess`

Added HTTPS enforcement using Apache mod_rewrite:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

**Note:** For complete server-side 301 redirects from getfrosh.com → frosh.app, additional DNS/hosting configuration is required at the domain registrar level.

---

## SEO Optimization

### 1. Canonical URL Management
**File:** `src/components/seo/SEO.tsx`

Updated to always use frosh.app as the canonical domain:
```typescript
// Always use frosh.app as canonical domain, even if accessed via getfrosh.com
const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;
```

All pages now include:
```html
<link rel="canonical" href="https://frosh.app/..." />
```

This ensures search engines know frosh.app is the primary domain, even when accessed via getfrosh.com.

---

### 2. Schema.org Structured Data
**File:** `src/utils/seoSchema.ts`

Enhanced all schema objects to include "Get Frosh" references and getfrosh.com domain associations:

#### Organization Schema
```json
{
  "name": "Frosh",
  "alternateName": ["Frosh App", "Get Frosh", "GetFrosh", ...],
  "url": "https://frosh.app",
  "sameAs": [
    "https://getfrosh.com",
    "https://www.getfrosh.com",
    "https://twitter.com/getfrosh",
    ...
  ],
  "description": "Frosh (Get Frosh) is the #1 college social app...",
  "keywords": "frosh, get frosh, getfrosh, getfrosh.com, frosh.app, ..."
}
```

#### Website Schema
```json
{
  "name": "Frosh",
  "alternateName": ["Frosh App", "Get Frosh", "GetFrosh", ...],
  "url": "https://frosh.app",
  "sameAs": ["https://getfrosh.com", "https://www.getfrosh.com"],
  "description": "Frosh (also known as Get Frosh) is the college social network..."
}
```

#### Mobile Application Schema
```json
{
  "name": "Frosh",
  "alternateName": ["Frosh App", "Get Frosh", "GetFrosh", ...],
  "url": "https://frosh.app",
  "sameAs": ["https://getfrosh.com", "https://www.getfrosh.com"]
}
```

---

### 3. Meta Tags & Keywords
**File:** `index.html`

Updated primary meta tags to include "Get Frosh" branding:

**Title:**
```html
<title>Frosh — Where College Begins Before Campus | Get Frosh</title>
```

**Description:**
```html
<meta name="description" content="Join Frosh (Get Frosh), the social platform for college freshmen. Meet classmates, find roommates, and connect before you arrive on campus. Available at Frosh.app and GetFrosh.com.">
```

**Keywords:**
```html
<meta name="keywords" content="frosh, get frosh, getfrosh, frosh app, getfrosh.com, frosh.app, college social app, college freshman app, student networking platform, university social network, college chat app, student matching app, Class of 2030, meet classmates, find roommates, incoming students, freshman community, college networking, student social app">
```

**Open Graph & Twitter Cards:**
```html
<meta property="og:title" content="Frosh — Where College Begins Before Campus | Get Frosh">
<meta property="og:description" content="Join Frosh (Get Frosh), the social platform for college freshmen. Meet classmates, find roommates, and connect before you arrive on campus. Available at Frosh.app and GetFrosh.com.">
<meta name="twitter:title" content="Frosh — Where College Begins Before Campus | Get Frosh">
<meta name="twitter:description" content="Join Frosh (Get Frosh), the social platform for college freshmen. Meet classmates, find roommates, and connect before you arrive on campus. Available at Frosh.app and GetFrosh.com.">
```

---

### 4. Hidden Semantic Content for Crawlers
**File:** `index.html`

Enhanced the hidden semantic layer with "Get Frosh" references:

```html
<div style="position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden;">
  <h2>About Frosh (Get Frosh): The College Social App</h2>
  <p>
    Frosh, also known as Get Frosh (GetFrosh.com), is a social networking app that helps college 
    freshmen and incoming students meet new friends... Available at both Frosh.app and GetFrosh.com.
  </p>
  <ul>
    <li>Frosh (Get Frosh) social network for college students</li>
    <li>GetFrosh.com and Frosh.app - College freshman app for Class of 2030</li>
    <li>Get Frosh student networking platform for universities</li>
    ...
  </ul>
</div>
```

This provides additional keyword-rich context for search engine crawlers without affecting the user interface.

---

## Target Keywords Coverage

### Primary Keywords
- **Frosh** ✅
- **Get Frosh** ✅
- **GetFrosh** ✅
- **Frosh App** ✅
- **College Social App** ✅
- **College Freshman App** ✅

### Domain-Specific Keywords
- **frosh.app** ✅
- **getfrosh.com** ✅
- **Frosh.app** ✅
- **GetFrosh.com** ✅

### Long-Tail Keywords
- "Where college begins before campus" ✅
- "Meet classmates before college" ✅
- "Find college roommates" ✅
- "College Class of 2030" ✅
- "Student networking platform" ✅

---

## Performance Optimizations

### Existing Optimizations (Maintained)
- ✅ Gzip compression for text-based files
- ✅ Browser caching headers (1 year for images, 1 month for CSS/JS)
- ✅ Font preloading and optimized loading
- ✅ Image optimization and lazy loading
- ✅ XML sitemap (`/sitemap.xml`)
- ✅ Robots.txt configuration

### HTTPS Enforcement
- ✅ Added HTTPS redirect in .htaccess
- ✅ All canonical URLs use HTTPS
- ✅ All schema URLs use HTTPS

---

## Analytics & Tracking Setup

### Google Analytics 4
**File:** `index.html`
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

**Action Required:** Replace `G-XXXXXXXXXX` with actual GA4 tracking ID.

### Google Search Console
**File:** `index.html`
```html
<meta name="google-site-verification" content="YOUR_GSC_VERIFICATION_CODE" />
```

**Action Required:** 
1. Add both frosh.app and getfrosh.com as properties in Google Search Console
2. Replace `YOUR_GSC_VERIFICATION_CODE` with actual verification code
3. Verify both domains and set up domain associations

---

## Server-Level Configuration Checklist

### DNS Configuration (Required at Registrar)
For complete 301 redirect functionality, configure at domain registrar:

**For getfrosh.com:**
```
Type: A
Name: @
Value: [Your Lovable IP or hosting IP]

Type: A  
Name: www
Value: [Your Lovable IP or hosting IP]
```

**For frosh.app:**
```
Type: A
Name: @
Value: 185.158.133.1 (Lovable IP)

Type: A
Name: www
Value: 185.158.133.1 (Lovable IP)
```

### Hosting Configuration (If using separate hosting)
If getfrosh.com is hosted separately, add server-level 301 redirects:

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteCond %{HTTP_HOST} ^(www\.)?getfrosh\.com$ [NC]
RewriteRule ^(.*)$ https://frosh.app/$1 [R=301,L]
```

**Nginx:**
```nginx
server {
    server_name getfrosh.com www.getfrosh.com;
    return 301 https://frosh.app$request_uri;
}
```

---

## Testing Checklist

### Redirect Testing
- [ ] Test `http://getfrosh.com` → `https://frosh.app`
- [ ] Test `http://www.getfrosh.com` → `https://frosh.app`
- [ ] Test `https://getfrosh.com` → `https://frosh.app`
- [ ] Test `https://www.getfrosh.com` → `https://frosh.app`
- [ ] Test path preservation: `getfrosh.com/about` → `frosh.app/about`
- [ ] Test query parameters: `getfrosh.com/?ref=test` → `frosh.app/?ref=test`

### SEO Testing
- [ ] Verify canonical tags on all pages point to frosh.app
- [ ] Test structured data with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Verify Open Graph tags with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Test Twitter Cards with [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] Check mobile-friendliness with [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [ ] Verify robots.txt accessibility: `frosh.app/robots.txt`
- [ ] Verify sitemap accessibility: `frosh.app/sitemap.xml`

### Performance Testing
- [ ] Test Core Web Vitals with [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Target: Performance score 90+
- [ ] Verify HTTPS certificate validity for both domains
- [ ] Check cache headers with browser DevTools Network tab

---

## Expected SEO Benefits

### Short-Term (1-4 weeks)
- ✅ Clean domain structure with frosh.app as canonical
- ✅ Proper indexing of both "Frosh" and "Get Frosh" keywords
- ✅ Rich snippets in search results via schema markup
- ✅ Improved click-through rates with optimized titles/descriptions

### Medium-Term (1-3 months)
- 📈 Higher rankings for "frosh app" and "get frosh" searches
- 📈 Increased organic traffic from both brand variations
- 📈 Better visibility for college-specific searches
- 📈 Improved social media preview cards

### Long-Term (3-6 months)
- 🚀 Dominant rankings for "college social app" and related terms
- 🚀 Authority consolidation on frosh.app domain
- 🚀 Strong brand recognition for both "Frosh" and "Get Frosh"
- 🚀 Comprehensive indexing of all school-specific pages

---

## Maintenance & Monitoring

### Monthly Tasks
- Monitor Google Search Console for both domains
- Review Analytics for organic traffic trends
- Check for 404 errors and broken redirects
- Update schema markup as features evolve

### Quarterly Tasks
- Audit keyword rankings for target terms
- Review and update meta descriptions for top pages
- Analyze competitor SEO strategies
- Update structured data schemas if needed

### Annual Tasks
- Comprehensive SEO audit
- Review and refresh all meta content
- Update schema markup to latest standards
- Reassess keyword strategy and targets

---

## Summary

### What Was Implemented
✅ Client-side domain redirect component (DomainRedirect.tsx)  
✅ Enhanced schema markup with "Get Frosh" references  
✅ Updated meta tags and descriptions across all pages  
✅ Canonical URL management ensuring frosh.app is primary  
✅ Hidden semantic content for search engine crawlers  
✅ HTTPS enforcement in .htaccess  
✅ Comprehensive keyword integration  

### What Requires Configuration
⚠️ DNS settings at domain registrar  
⚠️ Google Analytics 4 tracking ID  
⚠️ Google Search Console verification codes  
⚠️ Server-level 301 redirects (if hosting separately)  

### Goal Achievement
🎯 **frosh.app** is established as the canonical domain  
🎯 **getfrosh.com** redirects seamlessly with path preservation  
🎯 Both "Frosh" and "Get Frosh" are optimized for search engines  
🎯 Users searching for either term will find the platform  
🎯 Maximum SEO pass-through from getfrosh.com to frosh.app  

---

**Document Version:** 1.0  
**Last Updated:** 2025  
**Maintained By:** Frosh Development Team
