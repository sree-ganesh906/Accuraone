# Project Migration & Setup Instructions

This document provides guidelines on how to set up React, TypeScript, Tailwind CSS, and the shadcn CLI in this codebase to utilize React components (such as `TextRoll`).

---

## 1. Why `/components/ui` is Important

When using the **shadcn/ui** design system, UI components (such as buttons, inputs, dialogs, etc.) are installed by default to the `/components/ui` folder. 
This path convention is crucial because:
1. **Automation & CLI:** The shadcn CLI reads your `components.json` file. If you configure `aliases.components` to point to `@/components`, components are placed inside `/components/ui`. Any standard CLI command (e.g., `npx shadcn@latest add button`) automatically looks for this exact subfolder.
2. **Path Aliasing:** React projects typically use path aliases (like `@/*` pointing to `/src/*` or the project root). Keeping UI components in `/components/ui` makes import paths uniform, clean, and predictable (e.g., `import { Button } from "@/components/ui/button"`).
3. **Consistency:** Fulfilling this standard allows developers to integrate community components (like `TextRoll` or custom shadcn components) with zero import friction.

---

## 2. Step-by-Step Project Setup

Follow these steps to initialize a React web application with TypeScript, Tailwind CSS, and shadcn in the current workspace.

### Step 2.1: Initialize React & TypeScript (using Vite)
If you wish to convert this static workspace into a modern React application, initialize it using Vite in the current directory:
```bash
# Create a React + TS Vite project in the current directory
npx -y create-vite@latest ./ --template react-ts
```

### Step 2.2: Install Tailwind CSS
Install Tailwind CSS, PostCSS, and Autoprefixer:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update your `tailwind.config.js` to enable styling on all your React/HTML files:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add the Tailwind directives to your main CSS file (e.g., `src/index.css` or `styles.css`):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 2.3: Install Required Dependencies
Install the package dependencies required by components like `TextRoll`:
```bash
npm install clsx motion tailwind-merge lucide-react
```

### Step 2.4: Initialize shadcn/ui
Initialize the shadcn CLI to configure components and path aliases:
```bash
npx shadcn@latest init
```

During initialization, select the following configuration preferences:
- **Style:** Default
- **Base Color:** Slate / Zinc
- **CSS Variables:** Yes
- **Tailwind Config Path:** `tailwind.config.js`
- **Global CSS File:** `styles.css` (or `src/index.css`)
- **CSS Variables for Colors:** Yes
- **Import Alias for Components:** `@/components`
- **Import Alias for Utils:** `@/lib/utils`

This CLI generates a `components.json` file in your root folder and creates the `/components/ui` folder for you. You can then copy and drop the `text-roll.tsx` file directly into `/components/ui/text-roll.tsx` and run standard imports.
