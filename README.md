# The Eagle Fitness Gym — Website

A fast, single-page marketing site for **The Eagle Fitness Gym**, Waghodia, Vadodara.
Built as a hand-tuned static site (HTML + CSS + vanilla JS) — **no build step, no framework, no dependencies**. It opens in any browser and deploys to any host in seconds.

**Design direction:** Dark athletic luxury — near-black canvas, electric-lime accent, condensed display type, cinematic imagery, motion that respects `prefers-reduced-motion`.

---

## Quick start

Just open `index.html` in a browser. For a local server (recommended, so the map and fonts behave like production):

```bash
# from this folder
python3 -m http.server 5050
# then visit http://localhost:5050
```

## Deploy

Drag-and-drop the whole `eagle-fitness/` folder onto **Netlify Drop** (app.netlify.com/drop) or **Vercel**, or push to **GitHub Pages**. No configuration needed.

---

## What's real vs. what to update

This uses the gym's **real** Google data: 4.8★ rating, 232 reviews, the actual review quotes (Bhavik, Yash Chauhan, Thakor Parmar), address, phone, and the women-owned / LGBTQ+-friendly positioning.

Before going live, replace these **placeholders** (all clearly marked in `index.html`):

| Item | Where | Notes |
|------|-------|-------|
| **Photos** | `index.html` `<img src="https://images.unsplash.com/…">` | Currently royalty-free Unsplash images with a graceful gradient fallback. Swap for the gym's own photos — put them in `assets/` and update `src`. |
| **Membership prices** | `#pricing` section (`data-monthly` / `data-annual`) | Sample ₹ figures. Update to real rates. |
| **Trainer names & photos** | `#trainers` section | Placeholder names (Meera, Aarav, Sana, Priya) and specialties. |
| **Class schedule** | `#schedule` section | Sample weekly timetable. Update times/classes/coaches. |
| **Opening hours** | `#contact`, footer, and JSON-LD in `<head>` | Currently Mon–Sat 6 AM–10 PM, Sun 7–11 AM. Confirm and update in all three spots. |
| **Instagram handle** | search `instagram.com/` | Point to the real profile. |
| **Domain / canonical / OG image** | `<head>` (`canonical`, `og:*`) and `assets/og-image.jpg` | Set the final domain and add a 1200×630 share image. |

## Contact form

The "Claim your free trial" form has **no backend** — on submit it opens **WhatsApp** with a pre-filled message to `+91 97374 15234`. This is ideal for a local gym and works on the host's phone immediately.

- Change the number: edit `data-whatsapp="919737415234"` on `#lead-form` (and the `tel:`/`wa.me` links throughout).
- Want email/CRM instead? Point the form at **Netlify Forms**, **Formspree**, or **Google Forms** and remove the WhatsApp handler in `js/main.js` (`initForm`).

---

## Customizing the look

All design decisions live as tokens in [`styles/tokens.css`](styles/tokens.css). Change them once and the whole site updates:

```css
--accent: #c7f94b;   /* the electric-lime brand color */
--bg:     #0a0a0b;   /* page background */
--font-display: "Saira Condensed", …;  /* headlines */
--font-body:    "Inter", …;            /* body text */
```

## File structure

```
eagle-fitness/
├── index.html              # the whole page (semantic sections + SEO + JSON-LD)
├── styles/
│   ├── tokens.css          # design tokens (color, type, spacing, motion)
│   ├── base.css            # reset, base type, grain, reveal, a11y
│   ├── layout.css          # header, nav, mobile drawer, footer
│   ├── components.css      # buttons, cards, marquee, tabs, slider, forms
│   ├── sections-top.css    # hero, about, programs, schedule
│   └── sections-bottom.css # stats, trainers, pricing, gallery, reviews, contact
└── js/
    └── main.js             # nav, scroll-reveal, tabs, slider, count-up, pricing, form
```

## Built-in quality

- **Responsive** — tuned for 320 / 375 / 768 / 1024 / 1440+.
- **Accessible** — semantic landmarks, skip link, ARIA tabs/carousel, keyboard nav, visible focus, `prefers-reduced-motion` honored, AA-contrast lime-on-dark.
- **SEO** — local-business `HealthClub` JSON-LD (rating, address, hours, phone), Open Graph tags, descriptive meta.
- **Fast** — no framework/JS dependencies, system-friendly fonts with `display=swap`, lazy-loaded below-the-fold images, compositor-only animations.
- **Resilient** — images degrade to designed gradients if offline; interactions are progressive enhancements.
