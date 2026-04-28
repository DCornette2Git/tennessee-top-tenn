# Tennessee Top Tenn — README

## Overview

Tennessee Top Tenn is a dashboard-style web application for discovering Tennessee experiences across six categories:

* Paranormal
* Music
* Movies
* Comedy
* Hiking
* Historical

This README explains how to set up and run the project locally for development.

---

## Prerequisites

Make sure you have the following installed:

* **Node.js (v18 or higher)**
* **npm or yarn**

To check:

```bash
node -v   # shows your Node version
npm -v    # shows your npm version
```

---

## Project Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd tennessee-top-tenn
```

**What this does:**

* Downloads the project to your machine
* Moves you into the project folder

---

### 2. Install Dependencies

```bash
npm install
```

**What this does:**

* Downloads all required packages listed in `package.json`
* Sets up your local development environment

---

### 3. Start the Development Server

```bash
npm run dev
```

**What this does:**

* Starts the Vite development server
* Enables hot-reloading (changes update instantly in the browser)

After running, you should see something like:

```
Local: http://localhost:5173/
```

Open that URL in your browser.

---

## Project Structure (Expected)

```
tennessee-top-tenn/
├── public/            # Static assets
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page-level views (Home, Detail, etc.)
│   ├── data/         # Mock or static data (MVP)
│   ├── hooks/        # Custom React hooks
│   ├── App.jsx       # Main app component
│   └── main.jsx      # Entry point (mounted in index.html)
├── index.html        # Root HTML file
├── package.json      # Project config and dependencies
└── vite.config.js    # Vite configuration
```

---

## Available Scripts

### `npm run dev`

Starts the development server.

* Use this during development

### `npm run build`

```bash
npm run build
```

**What this does:**

* Creates a production-ready build in the `dist/` folder
* Optimizes and bundles your code

### `npm run preview`

```bash
npm run preview
```

**What this does:**

* Serves the production build locally
* Lets you test what users will see in production

---

## Environment Variables (Future)

Create a `.env` file in the root when needed:

```
VITE_API_URL=http://localhost:3000
```

**Why:**

* Keeps config separate from code
* Allows switching between local and production APIs

---

## Common Issues

### Port Already in Use

If `5173` is taken:

```bash
npm run dev -- --port=5174
```

**What this does:**

* Starts the dev server on a different port

---

### Node Version Problems

If things fail unexpectedly:

```bash
node -v
```

Make sure you're on Node 18+

---

### Dependencies Not Installing

Try:

```bash
rm -rf node_modules package-lock.json
npm install
```

**What this does:**

* Clears corrupted installs
* Reinstalls everything cleanly

---

## Development Notes

* This project uses **React + Vite**
* The root HTML file mounts the app at:

```html
<div id="root"></div>
```

* Entry point:

```js
/src/main.jsx
```

---

## Next Steps (Suggested)

* Add routing (React Router)
* Build dashboard UI
* Create category pages
* Add mock data for locations
* Implement search and filters

---

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request

---

## License

TBD

