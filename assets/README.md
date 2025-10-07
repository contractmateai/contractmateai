# Assets Organization Guide

This directory contains all static assets for the SignSense project, optimized for Vercel deployment.

## Directory Structure

```
assets/
├── icons/             # All PNG icons (features, UI, logos, etc.)
│   ├── logo.png
│   ├── riskIcon.png
│   ├── clarityIcon.png
│   ├── proIcon.png
│   ├── favIcon.png
│   ├── deadIcon.png
│   ├── scoreIcon.png
│   ├── confidenceIcon.png
│   └── [other icons...]
├── images/            # App screenshots, hero images, backgrounds
└── screenshots/       # Review screenshots, testimonials
```

## File Naming Conventions

### Icons (PNG format recommended)

- Use lowercase with hyphens: `feature-security.png`
- Include size in filename if multiple sizes: `arrow-right-24.png`
- Use descriptive names: `ai-chip-icon.png` not `icon1.png`

### Logos

- Include variation in name: `signsense-logo-white.png`
- Standard sizes: 64x64, 128x128, 256x256 for favicons
- Use consistent naming: `logo-[variation]-[size].png`

### App Screenshots

- Include context: `app-preview-main.png`
- Use consistent dimensions for uniformity
- Optimize file sizes (use tools like TinyPNG)

## Vercel Deployment Notes

1. **Static Asset Serving**: All files in `assets/` will be served from the root
2. **Caching**: Vercel automatically caches static assets with optimal headers
3. **Optimization**: PNG files are automatically compressed
4. **Path References**: Use relative paths from root: `/assets/icons/feature-ai.png`

## Performance Tips

1. **Optimize Images**: Use tools like TinyPNG or ImageOptim before adding
2. **Proper Sizing**: Don't use oversized images, resize to actual display size
3. **WebP Fallback**: Consider providing WebP versions for better compression
4. **Lazy Loading**: Use `loading="lazy"` attribute for non-critical images

## Current External URLs to Replace

Replace these external URLs with local assets:

### In HTML files:

- Logo: `https://imgur.com/VFu8eyq.png` → `/assets/icons/logo.png`
- Favicon: `https://imgur.com/hWueM44.png` → `/assets/icons/favicon.png`
- App Preview: `https://i.imgur.com/slsiM6i.png` → `/assets/images/app-preview.png`
- Various feature icons from imgur → `/assets/icons/[descriptive-name].png`

### In PDF Generator (✅ Already Updated):

Your `pdf-generator.js` ASSETS object is correctly configured for local paths.

## Vercel Deployment Guide

### 1. **How Vercel Serves Static Assets**

- All files in `assets/` directory are automatically served from your domain root
- Example: `assets/icons/logo.png` becomes `yoursite.vercel.app/assets/icons/logo.png`
- No additional configuration needed

### 2. **Performance Optimizations**

```bash
# Before adding images to your repo, optimize them:
# Use online tools like TinyPNG or install local tools:
npm install -g imagemin-cli imagemin-pngquant
imagemin assets/icons/*.png --out-dir=assets/icons --plugin=pngquant
```

### 3. **Deployment Steps**

1. Add your PNG files to `assets/icons/` directory
2. Update HTML file references from imgur URLs to local paths
3. Commit and push to your repository
4. Vercel will automatically deploy with optimized asset serving

### 4. **Best Practices**

- ✅ Keep PNG files under 500KB each for fast loading
- ✅ Use descriptive filenames: `ai-chip-icon.png` not `icon1.png`
- ✅ Consistent sizing: resize to actual display dimensions
- ✅ Use `loading="lazy"` for non-critical images in HTML
