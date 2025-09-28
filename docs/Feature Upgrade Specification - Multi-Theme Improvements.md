### **Feature Upgrade Specification: Multi-Theme /r/unixporn UI**

**Project:** David Leer (DLEER) Portfolio Website  
**Version:** 1.1  
**Date:** September 27, 2025

#### **1\. Objective**

To enhance the portfolio website by implementing a sophisticated, multi-theme user interface inspired by the aesthetics of the /r/unixporn community. This upgrade will introduce three distinct color themes, a "frosted glass" effect, and define the logic for theme switching and user customization. This version extends the specification to ensure the **Polybar component is fully integrated** into the theming system.

#### **2\. Core Feature: Theming System**

Implement a theming system that allows users to select from three themes. The implementation must use CSS custom properties (variables) for easy switching.  
**2.1. Theme Color Palettes**  
The following palettes must be implemented. A CSS class (e.g., theme-tokyo-night) should be applied to the \<body\> tag to activate the corresponding theme.  
2.1.1. Tokyo Night (Dark)  
| Element | Hex Code | CSS Variable Suggestion |  
| :--- | :--- | :--- |  
| Main Background | \#1a1b26 | \--color-bg |  
| Surface/Panel BG | \#1f2335 | \--color-surface |  
| Body Text | \#c0caf5 | \--color-text-body |  
| Header/Hero Text | \#7aa2f7 | \--color-text-header |  
| Accent Colors | | |  
| Accent 1 (Primary) | \#bb9af7 | \--color-accent-1 |  
2.1.2. Catppuccin (Mocha \- Dark)  
| Element | Hex Code | CSS Variable Suggestion |  
| :--- | :--- | :--- |  
| Main Background | \#1e1e2e | \--color-bg |  
| Surface/Panel BG | \#181825 | \--color-surface |  
| Body Text | \#cdd6f4 | \--color-text-body |  
| Header/Hero Text | \#f5c2e7 | \--color-text-header |  
| Accent Colors | | |  
| Accent 1 (Primary) | \#89b4fa | \--color-accent-1 |  
2.1.3. Latte (Light)  
| Element | Hex Code | CSS Variable Suggestion |  
| :--- | :--- | :--- |  
| Main Background | \#eff1f5 | \--color-bg |  
| Surface/Panel BG | \#e6e9ef | \--color-surface |  
| Body Text | \#4c4f69 | \--color-text-body |  
| Header/Hero Text | \#d20f39 | \--color-text-header |  
| Accent Colors | | |  
| Accent 1 (Primary) | \#1e66f5 | \--color-accent-1 |  
---

#### **3\. UI Style and Aesthetic (/r/unixporn Rice)**

**3.1. Frosted Glass / Blur Effect for Tiles**  
All primary UI components ("tiles") should have a semi-transparent, blurred background effect.

* **Implementation:** Use the backdrop-filter: blur(12px); property. The background-color of the tile should be a semi-transparent version of the main background color (--color-bg).

**3.2. Tile Corner Radius**

* **Recommendation:** Apply a border-radius of 8px to 12px to all tiles for a modern, soft aesthetic.

---

#### **4\. Component-Specific Theming: Polybar**

The Polybar component must be dynamically themed and updated along with the rest of the UI. It should **not** retain a static style.  
4.1. Color Mapping  
The Polybar's elements must be mapped to the theme's CSS variables:

* **Background:** The Polybar's background should use the \--color-surface variable. This provides a slight, clean separation from the main page background.  
* **Foreground/Text:** Standard text and icons within the Polybar should use the \--color-text-body variable.  
* **Accent:** Active elements, indicators, or underlines (e.g., for the active workspace) must use the primary accent color, linked to the \--color-accent-1 variable.

---

#### **5\. Functional Logic: Theme Switching and Accent Color Picker**

The interaction between the theme selector and the accent color picker must be consistent across all themed components, including the Polybar.  
**5.1. Theme Switching Behavior**

* **Action:** User selects a new theme.  
* **Expected Result:** The entire UI, **including the Polybar**, must update to the default color palette of the newly selected theme. This includes the background, text, surface, and primary accent colors.

**5.2. Accent Color Picker Behavior**

* **Persistence Rule:** A custom accent color selected by the user must **not** persist when switching between themes.  
* **State Update:** When a user selects a new theme, the accent color picker's state must be programmatically updated to the new theme's default primary accent color.  
* **Component Sync:** When the user chooses a new color from the color picker, the \--color-accent-1 variable must be updated. This change must be immediately reflected in all elements that use it, **including the accent elements within the Polybar**.

**Updated User Flow:**

1. User is on the "Catppuccin" theme. The Polybar has a dark gray background, light blue text, and a blue accent underline.  
2. User opens the color picker and changes the accent color to green.  
3. **Result:** The tile borders, header text, and the **Polybar's accent underline** all change to green.  
4. User then clicks to switch to the "Tokyo Night" theme.  
5. **Result:** The page re-renders with the full "Tokyo Night" palette. The accent color automatically resets to Tokyo Night's default (\#bb9af7), and both the color picker and the **Polybar's accent underline** update to reflect this purple color.