## 2024-05-18 - Bottom Navigation Accessibility enhancements
**Learning:** Bottom Navigation was lacking screen reader context. The previous layout used `<div>` instead of a semantic `<nav>`, and there was no visual indication for keyboard focus on the navigation links.
**Action:** Use semantic `<nav>` elements for the bottom navigation container. Add `aria-current="page"` to the active tab, and ensure strong, visible focus outlines on interactive elements for keyboard navigation accessibility.
