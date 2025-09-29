## **Parallax View Issues**

This section details the bugs and feature requests for the main parallax scrolling view of the website.

### **1\. Text Content Layout and Spacing**

* **Current Behavior:** All text blocks (e.g., in the 'About' and 'Projects' sections) extend to the far-left and far-right edges of the viewport, making them hard to read.  
* **Expected Behavior:** Implement horizontal spacing (padding or margins) on the main content containers. Text should have a clear buffer from the browser window's edges, ensuring readability and a more professional layout.

---

### **2\. Missing Dot Gradient Background**

* **Current Behavior:** The background, which should feature a gradient of transparent dots, is no longer visible. The background appears as a solid color.  
* **Expected Behavior:** Restore the transparent dot gradient effect. Ensure it renders correctly as the background for the initial "hero" section of the page, ending where the main content begins.

---

### **3\. Section Separation and Visual Flow**

* **Current Behavior:** There are no visual dividers between the major sections of the page (e.g., between 'About', 'Projects', and 'Blogs').  
* **Expected Behavior:** Add a distinct horizontal line or a visually styled divider (\<hr\> or a styled div) to separate each major content section. This includes a line to mark the end of the initial dot gradient section and the beginning of the main site content.

---

### **4\. Keyboard (Tab) Navigation**

* **Current Behavior:** Using the 'Tab' key to navigate the site does not transition focus between the main sections in a logical order.  
* **Expected Behavior:** Implement proper accessibility and keyboard navigation. Tabbing should cycle through interactive elements and page sections sequentially. When a section is focused, it should be brought into view.

---

### **5\. Non-functional Section Links**

* **Current Behavior:** The navigation links for "Projects" and "Blogs" are not clickable or do not navigate the user to the corresponding sections.  
* **Expected Behavior:** Ensure the "Projects" and "Blogs" navigation links are functional. When clicked, the page should smoothly scroll to the beginning of the respective section anchor.

---

### **6\. Scroll Behavior and Navigation Sync**

* **Current Behavior:** Scrolling feels too fast and uncontrolled. The scroll action is not synchronized with the side-dot navigation menu.  
* **Expected Behavior:** Implement a "scroll-snapping" or section-based scrolling behavior. When the user initiates a scroll, the viewport should smoothly animate and "snap" to the next logical section (either up or down). This action must also update the active state of the corresponding dot in the side navigation menu. This approach is a modern design practice when executed well, but ensure it remains accessible and doesn't hinder users who prefer manual scrolling.

---

### **7\. "Neofetch" Section Background Gap**

* **Current Behavior:** In the "About" section (styled like a neofetch summary), if you are at the top of a lower section and scroll up, a visual gap appears between the "About" section's background and the section below it.  
* **Expected Behavior:** Fix the layout bug by extending the background of the "neofetch" section or adjusting its container's properties to ensure no gap is revealed during scrolling transitions. The background should appear seamless.

---

### **8\. Theme Picker UI/UX**

* **Current Behavior:** The theme picker's placement and functionality are not ideal.  
* **Expected Behavior:**  
  1. Relocate the theme picker component to the **upper-right corner** of the viewport.  
  2. Integrate a button with the text "Switch to" directly inside the theme selector component to make the action clearer to the user.

---

### **9\. Projects and Blogs Item Layout**

* **Current Behavior:** The summary items for individual projects and blog posts are too large, taking up excessive vertical space. They currently include tags and perimeter buttons.  
* **Expected Behavior:** Redesign the project/blog items for a more compact view.  
  * **Remove** the tag elements.  
  * **Remove** the perimeter buttons.  
  * The final item should only consist of the **project/blog title** and a **short summary description**.

---

## **Tiles View (Stacked Tile) Issues**

This section details the bugs and feature requests for the alternative "Tiles View" layout.

### **1\. Custom Scrollbar Implementation**

* **Current Behavior:** A custom "glowing scroll graphic" appears *in addition to* the browser's native scrollbar. Furthermore, this custom graphic is incorrectly positioned inside the content tiles instead of on the edge of the viewport.  
* **Expected Behavior:** The glowing scroll graphic must **replace** the native scrollbar.  
  1. Hide the browser's default scrollbar using CSS.  
  2. Position the custom glowing scrollbar on the right-hand edge of the viewport, outside of the tile containers.  
  3. Ensure this custom scrollbar is only present in the "Tiles View" and not in the "Parallax View".

---

### **2\. Auto-Scroll to Tile**

* **Current Behavior:** When a user clicks an item in the "Contents" tile, the page scrolls to the destination tile, but it is often not centered, cutting off parts of the content.  
* **Expected Behavior:** Implement a precise auto-scroll function. When a link in the "Contents" tile is clicked, the page must scroll smoothly to the target tile and position it **perfectly in the center** of the viewport. Use a method like element.scrollIntoView({ behavior: 'smooth', block: 'center' }).

---

### **3\. Navigation back to "Contents" Tile**

* **Current Behavior:** After navigating to a content tile (e.g., "Contact" or "Theme"), there is no intuitive, one-click method to return to the main "Contents" tile for further navigation. The user must manually scroll back up.  
* **Expected Behavior:** On all tiles *except* the "Contents" tile, add a persistent and clearly visible UI element (e.g., a "Home" icon or a "Back to Contents" button) that, when clicked, smoothly scrolls the user back to the "Contents" tile.

---

### **4\. Keyboard Navigation and State Synchronization**

* **Current Behavior:** Using the 'Tab' key to move focus between tiles does not update the active state of the navigation dots.  
* **Expected Behavior:** Synchronize the focus state with the navigation UI. When a tile gains focus via tabbing, the corresponding dot in the navigation menu must update to its "active" state. The logic must correctly identify which section is active in the "main" tile (About, Projects, or Blogs) and highlight the correct dot accordingly.

---

### **5\. Tile-based Scroll Snapping**

* **Current Behavior:** Manual scrolling in the Tiles View moves freely rather than transitioning between tiles.  
* **Expected Behavior:** Implement a "scroll-snapping" feature specific to this view. When the user scrolls, the viewport should cleanly snap to the next or previous tile, making the navigation feel intentional and tile-based. This is a best-practice implementation using CSS Scroll Snap properties.