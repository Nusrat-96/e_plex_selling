# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static frontend clone of [efirm.com.bd](https://www.efirm.com.bd/) — a single-page O2O (Offline-to-Online) business solutions website. No build system, no package manager, no backend.

## Running the Site

Open `index.html` directly in a browser, or serve it with any static file server:

```bash
# Python
python -m http.server 8080

# Node (if npx available)
npx serve .
```

No compilation, bundling, or install step needed.

## File Structure

```
index.html          # Single-page homepage (all sections)
css/style.css       # All custom styles — single file, no preprocessor
js/script.js        # All JS — single IIFE, no modules
assets/images/      # Logo and local images (logo.png is the navbar logo)
pages/              # Placeholder for future inner pages (currently empty)
```

## Architecture

### Single-page layout
`index.html` is a true single-page app. The navbar links are all in-page anchors matching exact section IDs:

| Nav item  | Section ID           |
|-----------|----------------------|
| Home      | `#home`              |
| Services  | `#services-section`  |
| Portfolio | `#Portfolio-section` |
| Pricing   | `#Pricing-section`   |
| About     | `#About-section`     |
| Contact   | `#Contact-section`   |

> Note: `Portfolio-section` and `About-section` are capitalised — keep them consistent in both HTML and JS.

### CSS conventions
- All design tokens live in `:root` CSS variables at the top of `style.css` (`--primary`, `--secondary`, `--font-body`, etc). Change colours/fonts there only.
- Three font roles: `--font-body` (Raleway) for body text, `--font-heading` (Lora) for all headings, `--font-ui` (Epilogue) for buttons, labels, nav.
- Section backgrounds alternate: `var(--white)` → `var(--light)` → `var(--white)`.
- Responsive breakpoints: `991px` (tablet) and `575px` (mobile) only — no other breakpoints.

### JS conventions
All JS is a single self-invoking function in `js/script.js`. Behaviours in order:
1. Sticky header shadow on scroll
2. Back-to-top button visibility
3. Smooth scroll for all `a[href^="#"]` with navbar-height offset
4. Mobile nav auto-close on link click
5. Desktop dropdown hover (mouseenter/mouseleave)
6. IntersectionObserver reveal animation (adds `.in-view` to `.reveal` elements)
7. Counter animation for `.stat-item h3` elements
8. Scroll-spy — sets `.active` on the matching nav link as sections enter viewport
9. Portfolio filter buttons (`.filter-btn` / `.portfolio-item[data-category]`)
10. Contact form submit feedback (button state change, then reset after 2.5 s)

### Dependencies (CDN only)
- Bootstrap 5.3.2 (CSS + JS bundle)
- Bootstrap Icons 1.11.1
- Google Fonts: Lora, Raleway, Epilogue

No local copies of dependencies — all loaded from CDN.

## Adding a New Inner Page

1. Create `pages/your-page.html`.
2. Copy the `<head>` from `index.html` — adjust the `href` paths for CSS/JS to `../css/style.css` and `../js/script.js`.
3. Copy the full `<header>` and `<footer>` blocks from `index.html`.
4. Add a `.page-header` section (class already defined in `style.css`) for the page title/breadcrumb.
