### **Feature Upgrade Specification: Final Theming System**

Version: 2.0  
Objective: To implement a final three-tier theming system (Solarized Light, Nord, Tokyo Night) for the portfolio website. This upgrade must ensure all UI components, including the Polybar and form input fields, are fully responsive to theme changes.  
---

### **1\. Theme Color Palettes**

The following themes must be implemented using CSS custom properties (variables) to allow for seamless switching.

#### **1.1. Light Theme: Solarized Light ☀️**

A classic low-contrast theme designed for optimal readability in daylight.

| Element | Hex Code | CSS Variable Suggestion |
| :---- | :---- | :---- |
| **Main Background** | \#fdf6e3 | \--color-bg |
| **Surface/Panel BG** | \#eee8d5 | \--color-surface |
| **Body Text** | \#657b83 | \--color-text-body |
| **Header/Hero Text** | \#268bd2 | \--color-text-header |
| **Accent (Primary)** | \#d33682 | \--color-accent-1 |
| **Input Field Text** | \#586e75 | \--color-input-text |

#### **1.2. Medium Theme: Nord ❄️**

A cool, crisp, arctic-inspired theme that sits comfortably between dark and light.

| Element | Hex Code | CSS Variable Suggestion |
| :---- | :---- | :---- |
| **Main Background** | \#2E3440 | \--color-bg |
| **Surface/Panel BG** | \#3B4252 | \--color-surface |
| **Body Text** | \#D8DEE9 | \--color-text-body |
| **Header/Hero Text** | \#88C0D0 | \--color-text-header |
| **Accent (Primary)** | \#81A1C1 | \--color-accent-1 |
| **Input Field Text** | \#ECEFF4 | \--color-input-text |

#### **1.3. Dark Theme: Tokyo Night 🌃**

A stylish, modern dark theme with deep blues and vibrant, neon-inspired accents.

| Element | Hex Code | CSS Variable Suggestion |
| :---- | :---- | :---- |
| **Main Background** | \#1a1b26 | \--color-bg |
| **Surface/Panel BG** | \#1f2335 | \--color-surface |
| **Body Text** | \#c0caf5 | \--color-text-body |
| **Header/Hero Text** | \#7aa2f7 | \--color-text-header |
| **Accent (Primary)** | \#bb9af7 | \--color-accent-1 |
| **Input Field Text** | \#c0caf5 | \--color-input-text |

---

### **2\. Component Theming Requirements**

All major UI components must be styled using the CSS variables defined in the palettes above to ensure they update correctly when the theme changes.

* **Tiles:** Use \--color-surface for the background, applying the backdrop-filter blur effect. Borders should use a semi-transparent version of \--color-accent-1.  
* **Polybar:** The background must use \--color-surface. Text should use \--color-text-body, and active indicators must use \--color-accent-1.  
* **Text:** General paragraph text should use \--color-text-body. Main headings and hero text should use \--color-text-header.

---

### **3\. Corrective Action: Contact Section Input Fields**

The input fields in the "contact" section must be updated to be theme-aware. The current hardcoded black color scheme breaks visual consistency and can cause readability issues in dark themes.

#### **3.1. Issue Description**

The \<input\> and \<textarea\> elements within the contact form currently have static, hardcoded colors (e.g., color: \#000;, background-color: \#fff;). These do not change when a new theme is applied.

#### **3.2. Required Implementation**

The CSS for the form fields must be refactored to use the theme's CSS variables.  
**Example CSS:**

CSS

/\* Contact Form Input Fields \*/  
.contact-form input,  
.contact-form textarea {  
  /\* Set the background to the theme's surface color \*/  
  background-color: var(--color-surface);

  /\* Set the text color for user input \*/  
  color: var(--color-input-text);

  /\* Use the accent color for the border/outline \*/  
  border: 1px solid var(--color-accent-1);  
    
  /\* Style the placeholder text to be legible \*/  
  \--placeholder-color: color-mix(in srgb, var(--color-text-body) 70%, transparent);  
}

.contact-form input::placeholder,  
.contact-form textarea::placeholder {  
  color: var(--placeholder-color);  
  opacity: 1; /\* Override browser defaults \*/  
}

/\* Change outline color on focus to match the theme's accent \*/  
.contact-form input:focus,  
.contact-form textarea:focus {  
  outline: 2px solid var(--color-accent-1);  
  outline-offset: 2px;  
}

This change will ensure the contact form is a fully integrated and visually consistent part of the user-selected theme.