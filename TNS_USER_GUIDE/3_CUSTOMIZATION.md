# 🎨 Customization Guide

**Created by TNS**

This guide explains how to make the site your own by changing texts, images, and colors without breaking the code.

---

## 1. Where to Edit Content?

You don't need to touch the complex code in `Scene.tsx`.
Everything is centralized in one file:

📂 **`src/data/content.ts`**

Open this file. You will see a list (array) of "slides".

```typescript
export const slides = [
  {
    id: 1,
    title: "YOUR TITLE HERE",
    description: "Your paragraph text goes here...",
    image: "/images/your-image.png", // Path to your image
    color: "#HexColor", // Background color
    accent: "#HexColor", // Button/Highlight color
  },
  // ... other slides
];
```

## 2. Changing Images

1.  Prepare your images.
    *   **Format**: PNG is best for transparency. JPG for full backgrounds.
    *   **Style**: For the best "3D" effect, use images with a transparent background (cutouts).
2.  Place your images in the **`public/images/`** folder.
3.  Update the `image` path in `src/data/content.ts` (e.g., `"/images/my-new-shoe.png"`).

## 3. Changing Colors

We use Hexadecimal color codes (e.g., `#FF5733`).
*   **color**: The main background color for that slide.
*   **accent**: The color used for buttons or highlights on that slide.

You can find nice color palettes on sites like [Coolors.co](https://coolors.co/).

## 4. Adding/Removing Slides

*   **To Add**: Copy one of the `{ ... }` blocks in `content.ts`, paste it, and change the ID and content.
*   **To Remove**: Simply delete the `{ ... }` block of the slide you don't want.

The slider is dynamic—it will automatically adjust to the number of slides you have!

---

## 5. Tips for a Premium Look

*   **Consistency**: Keep your titles short and punchy.
*   **Images**: High-quality images make all the difference. Ensure they are cleanly cut out if using transparency.
*   **Contrast**: Make sure your text is readable against the background color.

---

**Make it yours. - TNS**
