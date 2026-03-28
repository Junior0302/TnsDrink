# Premium Storytelling Template

**Created & Maintained by TNS DIGITAL**

This project is a high-end, immersive storytelling template built with Next.js, Tailwind CSS, and GSAP. It is designed to be a robust boilerplate for creating cinematic, scroll-based web experiences.

## 🚀 Quick Start (Installation)

1.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  **Open your browser**:
    Navigate to [http://localhost:3000](http://localhost:3000) to see the result.

## 🚀 Features

- **Immersive Scroll Hijacking**: Smooth, page-by-page navigation using `GSAP Observer`.
- **Advanced Animations**: Fluid entrance/exit transitions with `GSAP Timeline`.
- **Reactive UI**: Dynamic background colors and text adaptation based on the current slide.
- **Custom Cursor**: A lag-free, custom cursor that interacts with elements (hover states, scaling).
- **Responsive Design**: Fully responsive layout optimized for desktop and mobile devices.
- **Infallible Hover Effects**: JS-based hover animations that work seamlessly with complex page transitions.

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [GSAP](https://gsap.com/) (GreenSock Animation Platform)
- **Language**: TypeScript

## 📂 Project Structure

- `src/app/layout.tsx`: Root layout and metadata (Branded TNS DIGITAL).
- `src/components/Scene.tsx`: Main controller for the scroll logic and transitions.
- `src/components/Slide.tsx`: Individual slide component with isolated hover logic.
- `src/components/Cursor.tsx`: Custom cursor implementation using `gsap.quickTo`.
- `src/data/content.ts`: Centralized data file for easy content updates.

## 📝 Usage

This template is intended as a starting point. To customize:

1.  **Update Content**: Edit `src/data/content.ts` to change slides, images, and text.
2.  **Theme Colors**: Adjust the `themeColor` property in the content data.
3.  **Images**: Place your assets in `public/img/` and reference them in the content file.

## ⚠️ Note on Animations

The hover effects on images are handled via GSAP within the `Slide` component to ensure reliability. Avoid mixing CSS transitions (`transition-all`) with GSAP transforms on the same elements to prevent conflicts.

---

© 2024 TNS DIGITAL. All rights reserved.
