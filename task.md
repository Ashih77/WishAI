# WishAI UX/UI Redesign: Current Direction

### 1. Project Goal
- Make every WishAI page simpler, clearer, and easier to scan while keeping the existing generation, gallery, rating, and admin workflows intact.

### 2. Design Direction
- **Feel:** modern, calm, friendly, and direct.
- **UX principle:** the main flow should expose only the required decisions first; advanced controls stay secondary.
- **Visual system:** light surfaces, generous spacing, readable contrast, compact cards, and restrained accent colors.
- **Pages covered:** main app flow, result screen, gallery, feedback modal, admin dashboard, and auth simulation page.

### 3. Design System Details
- **Palette:** soft neutral background, white cards, teal primary (`#0f766e`), coral secondary (`#ef6f61`), and muted gold accent (`#c6933d`).
- **Typography:** `Alexandria` for Arabic and `Outfit` for English.
- **Surfaces:** clean white cards with subtle borders and shadows instead of heavy dark glass.
- **Interactions:** small hover lift, clear selected states, and minimum touch-friendly targets.

### 4. Implemented Updates
- Main app copy is shorter and more task-focused.
- The primary app shell is wider, lighter, and less visually heavy.
- Art style selection is now a visible primary step instead of being hidden behind advanced settings.
- The advanced section is labeled as optional and now contains secondary controls only.
- A persistent light/dark theme toggle was added, with a navy gradient dark mode.
- Occasion, model, style, palette, and element selectors use clearer cards and selected states.
- Result, gallery, rating, and feedback surfaces share the same visual language.
- Admin dashboard and auth simulation page now match the app design direction.

### 5. Verification Plan
- Validate JavaScript syntax.
- Open the main app, admin page, and auth simulation locally.
- Check for horizontal overflow and obvious visual overlap.
- Use Netlify Dev or deployed Netlify for full generation/API testing because static preview does not run Netlify Functions.
