# Nehang Patel — Portfolio

Personal portfolio website for Nehang Patel — MS CS @ USC Viterbi.

**Live site:** [nehangpatel.vercel.app](https://nehangpatel.vercel.app) *(update once deployed)*

---

## Tech stack

| Layer | Detail |
|---|---|
| Structure | Vanilla HTML5 |
| Styling | Vanilla CSS3 (CSS custom properties, grid, clamp) |
| Interactivity | Vanilla JavaScript (ES6+) |
| 3D animations | Three.js r128 (CDN) |
| Fonts | Google Fonts (Cormorant Garamond + Syne) |
| Hosting | Vercel |

No build step. No framework. No dependencies to install. Open `index.html` in any browser and it works.

---

## Directory structure

```
nehang-portfolio/
├── index.html            # Main HTML — all sections, markup, resume modal
├── assets/
│   ├── css/
│   │   └── style.css     # All styles — tokens, layout, components, responsive
│   ├── js/
│   │   └── main.js       # All JS — theme, nav, 3D animations, terminal, interactions
│   └── resume/
│       └── Nehang_Patel_Resume.pdf   # ← add your PDF here
├── .gitignore
└── README.md
```

---

## Running locally

No server required for most features. Just open the file:

```bash
# Option 1 — double-click index.html in Finder/Explorer

# Option 2 — serve locally (avoids any browser CORS quirks)
npx serve .
# or
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

---

## Adding your resume PDF

1. Export your resume as a PDF named `Nehang_Patel_Resume.pdf`
2. Place it in `assets/resume/`
3. In `index.html`, find the Download PDF button and update the `href`:
   ```html
   <a href="assets/resume/Nehang_Patel_Resume.pdf" download="Nehang_Patel_Resume.pdf" ...>
   ```

---

## Deploying to Vercel

See the detailed deployment guide in the project documentation.
Short version: connect this GitHub repo to Vercel, set framework to **Other**, root directory to `/`, no build command, output directory `.` — done.

---

## Customising

All design tokens (colours, spacing, fonts) live at the top of `assets/css/style.css` inside `:root { }`. Change `--gold`, `--teal`, `--bg` etc. and the whole site updates.

---

*Built with Three.js, chaos theory, and intention.*
