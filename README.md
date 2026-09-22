# Trusted Care Carpet &amp; Upholstery Cleaning

Single-page marketing website for Trusted Care Carpet &amp; Upholstery Cleaning, a carpet,
upholstery, rug and tile cleaning company serving the San Antonio, Texas metro area.

## Stack

Vanilla HTML, CSS and JavaScript — no build step, no dependencies, no external APIs.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Entry point — the full single-page site |
| `styles.css` | Design tokens, layout and responsive styles |
| `script.js` | Mobile nav, scroll reveal, scroll spy, form validation |
| `favicon.svg` | Favicon / app icon |
| `site.webmanifest` | PWA manifest |
| `robots.txt` | Crawler directives |

## Sections

Hero with call-to-action → services overview (6 services) → "needs attention" urgency band →
how it works → why choose us → commercial services → testimonials → service area → contact
form with phone, email and address → footer.

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Notes

- Fully responsive (mobile drawer nav, sticky mobile call bar).
- Semantic HTML, skip link, ARIA labelling, visible focus states, reduced-motion support.
- `LocalBusiness` JSON-LD structured data plus Open Graph and Twitter card meta tags.
- The quote form validates entirely client-side and shows a confirmation message; there is
  no backend, so connect it to a form handler before going live.
- Photography is served from Pexels CDN URLs.
