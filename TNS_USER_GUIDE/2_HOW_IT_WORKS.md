# 🧠 Technical Guide: How It Works

**Created by TNS**

This document explains the technical logic behind the site. Useful for developers who want to understand the code structure.

---

## 1. Technologies Used

*   **Next.js (React)**: The framework used for the structure and routing of the application.
*   **TypeScript**: Ensures code robustness with strict types.
*   **Tailwind CSS**: Used for styling (layout, colors, fonts).
*   **GSAP (GreenSock Animation Platform)**: The engine behind the smooth animations and the "Scroll Hijacking" effect.

---

## 2. Key Concepts

### A. Scroll Hijacking (The Slider)
Unlike a normal website where you scroll down a long page, this site "hijacks" the scroll.
*   When the user scrolls (mouse wheel or touch), the page **does not move down**.
*   Instead, we detect the scroll event and trigger a **GSAP animation** to switch to the next or previous slide.
*   This creates an "app-like" immersive feel.

### B. The Scene (`Scene.tsx`)
This is the brain of the page.
*   It manages the **state** (which slide is currently active).
*   It listens for user inputs (scroll, touch swipe).
*   It coordinates the **Transitions**:
    *   Exiting the current slide (fading out, moving left).
    *   Entering the next slide (coming from right, fading in).
    *   Updating the background color smoothly.

### C. The Slide (`Slide.tsx`)
This is the visual component.
*   It receives data (title, text, image) and displays it.
*   It uses **Tailwind CSS** for responsive layout (works on mobile and desktop).
*   It has a 3D effect on the image container for added depth.

---

## 3. Project Structure

*   `src/app/page.tsx`: The main entry point. It loads the Scene.
*   `src/components/Scene.tsx`: The main controller (Slider logic, Animation Timeline).
*   `src/components/Slide.tsx`: The UI for a single slide.
*   `src/components/Preloader.tsx`: The loading screen animation.
*   `src/data/content.ts`: **IMPORTANT**. This file contains all the text, image paths, and colors. This is where you edit the content.

---

**Crafted with precision by TNS.**
