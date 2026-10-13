# Long-Distance Couple Dashboard
## 1. Project Overview

### 1.1 Project Summary

The **Long-Distance Couple Dashboard** is a responsive, browser-based dashboard designed to make daily connection easier and more meaningful for couples living apart. It combines practical relationship utilities—such as time-zone awareness, shared milestones, countdowns, and quick notes—with a warm, romantic presentation that makes the dashboard feel like a personal gift rather than an administrative tool.

The project has two equally important audiences:

1. **Instructor/evaluator:** The dashboard demonstrates strong frontend fundamentals through semantic HTML5, responsive CSS, clear component structure, client-side state handling, accessible interactions, and polished visual design. The implementation should be easy to inspect, run locally, and publish as a static site.
2. **Long-distance girlfriend/recipient:** The dashboard should feel personal, reassuring, and enjoyable to use. It should help her quickly see meaningful relationship information while also providing small moments of delight, such as affectionate messages, shared memories, and interactive celebration details.

The final product will be a static website suitable for deployment through GitHub Pages. It will not require a server, database, build pipeline, or paid service.

### 1.2 Problem and Opportunity

Long-distance relationships often involve coordinating across time zones, remembering important dates, and maintaining a sense of everyday presence despite physical separation. These needs are commonly scattered across calendar apps, messaging platforms, and personal notes. The dashboard consolidates the most useful information into one focused, emotionally considerate interface.

The project also provides an opportunity to demonstrate that a technically sound frontend can support an authentic user experience. Functionality should be purposeful: every interactive feature must either reduce coordination effort, strengthen emotional connection, or demonstrate a relevant frontend technique.

### 1.3 Project Objectives

The dashboard will:

- Present an immediate, personalized overview of the couple’s current connection status.
- Make the couple’s time-zone difference understandable at a glance.
- Display upcoming anniversaries, visits, calls, and other shared milestones.
- Provide a countdown for a selected event, such as the next visit or anniversary.
- Offer lightweight shared content, including notes, memories, or daily messages.
- Use responsive design so the experience works on mobile phones, tablets, and desktop screens.
- Demonstrate maintainable frontend implementation using only browser-native technologies.
- Create a polished gift experience through thoughtful copy, visual hierarchy, animation restraint, and personalization.

### 1.4 Core User Experience

On opening the dashboard, the user should understand its purpose within a few seconds. The primary view should prioritize:

- A romantic welcome or personalized greeting.
- The local time for each partner, with clear labels and day/night context.
- A prominent countdown to the next important shared date.
- A concise list of upcoming milestones.
- A visible space for an affectionate message, memory, or rotating relationship prompt.
- Simple controls for updating or switching the displayed dashboard state.

The interface should feel calm and supportive rather than busy. Romantic styling should reinforce the relationship context without reducing readability or making the dashboard resemble a novelty landing page. Motion, color, and decorative elements should be used selectively so the practical information remains easy to scan.

### 1.5 Initial Feature Scope

The first release should include the following features:

- **Personalized dashboard header:** Displays the couple’s names or chosen terms of address and a short welcome message.
- **Dual time-zone cards:** Shows each partner’s current local time, date, time-zone label, and a simple day/night indicator. Time values should update without requiring a page refresh.
- **Event countdown:** Calculates and displays the remaining days, hours, minutes, and seconds until a configured milestone. Past or completed events should be handled with a clear completed-state message.
- **Milestone list:** Shows upcoming dates such as anniversaries, birthdays, planned calls, or visits, ordered chronologically.
- **Shared message or memory card:** Presents an editable or configurable romantic message, memory, or note.
- **Small interaction layer:** Includes at least one purposeful interaction, such as marking a memory as viewed, revealing a surprise message, switching memories, or toggling a compact display mode.
- **Persistent client-side data:** Uses browser storage where appropriate so simple user changes survive a page refresh on the same device.
- **Responsive and accessible layout:** Supports keyboard navigation, readable contrast, reduced-motion preferences, and usable touch targets.

Features such as authentication, real-time multi-user synchronization, private messaging, server-side storage, and push notifications are outside the initial scope. They may be listed as future enhancements but should not be implied by the static GitHub Pages implementation.

### 1.6 Success Criteria

The project will be considered successful when:

- An evaluator can open the site from GitHub Pages and use the main features without setup beyond loading the page.
- The layout remains usable at common mobile and desktop widths.
- Time-zone clocks and countdown values update accurately in the browser.
- Dates and relationship content are represented clearly and can be adjusted without changing the application architecture.
- Interactive controls provide visible feedback and do not depend on a backend.
- The interface communicates both technical competence and genuine personal intent.
- The source remains understandable to a frontend reviewer: semantic markup, organized styles, modular JavaScript functions, and no unnecessary framework or dependency overhead.

### 1.7 Constraints and Assumptions

- The application must be deployable as a static site through GitHub Pages.
- The implementation must use pure HTML5, CSS, and Vanilla JavaScript; frontend frameworks and UI libraries are excluded from the initial release.
- All essential functionality must work without a server or build step.
- Configuration should be easy to edit in a clearly identified JavaScript data object or static configuration section.
- The application should degrade gracefully if browser storage is unavailable or if a user’s time-zone data cannot be resolved.
- Personal content should be treated as local presentation data, not as secure private data. No sensitive information should be embedded in public source files.

## 2. Tech Stack

### 2.1 Technology Selection

The dashboard will use a deliberately lightweight browser-native stack:

| Layer | Technology | Role |
|---|---|---|
| Structure | HTML5 | Semantic page structure, content regions, form controls, and accessibility landmarks |
| Presentation | CSS3 | Responsive layout, theme variables, visual hierarchy, transitions, and responsive states |
| Behavior | Vanilla JavaScript (ES6+) | Clock updates, countdown calculations, rendering, event handling, validation, and local persistence |
| Hosting | GitHub Pages | Static deployment over HTTPS from the repository |
| Persistence | Web Storage API (`localStorage`) | Optional persistence for local preferences and editable dashboard content |
| Time handling | Browser `Date` and `Intl.DateTimeFormat` APIs | Local time rendering and timezone-aware formatting without third-party libraries |

No runtime framework, package manager, bundler, or external backend is required for the initial implementation. This keeps the project transparent for evaluation and ensures that the published site can be served directly from a repository branch or GitHub Pages workflow.

### 2.2 HTML5 Structure

The page should use semantic elements to make the content understandable to users, assistive technologies, and code reviewers. The expected high-level structure is:

- `header` for the personalized title and introductory message.
- `main` for the dashboard’s primary content.
- `section` elements for clocks, countdown, milestones, and memories.
- `article` elements for independently meaningful milestone or memory cards.
- `nav` only where navigation or view switching is present.
- `footer` for a brief closing message or project attribution.
- Native buttons, labels, inputs, and dialogs where interaction requires them.

The document should include a meaningful title, viewport metadata, language declaration, visible focus states, and accessible names for controls. Decorative imagery or icons should not be the sole source of meaning.

### 2.3 CSS Architecture and Visual Direction

CSS should be organized around a small set of reusable custom properties for colors, spacing, typography, radii, shadows, and transition timing. Layout should use modern CSS Grid and Flexbox rather than fixed positioning, allowing the same content to adapt from a single-column mobile layout to a balanced desktop dashboard.

The visual direction should combine:

- A warm, romantic color palette with sufficient text contrast.
- Clear card hierarchy so practical data remains prominent.
- Soft decorative details that support, rather than compete with, the content.
- Responsive typography using scalable units where appropriate.
- `prefers-reduced-motion` handling so nonessential animation can be disabled.
- Media-query adjustments for narrow screens, larger screens, and touch interaction.

Animation should be limited to meaningful feedback—for example, a subtle reveal, state transition, or countdown update—and should never prevent the user from reading or operating the dashboard.

### 2.4 Vanilla JavaScript Responsibilities

JavaScript should be separated into small, named functions with clear responsibilities. The initial implementation should include modules or logical sections for:

- Loading and normalizing dashboard configuration.
- Formatting dates, times, and time-zone labels with `Intl.DateTimeFormat`.
- Updating the two live clocks at a controlled interval.
- Calculating countdown values and handling completed events.
- Sorting and rendering milestone data.
- Reading and writing optional local preferences through `localStorage`.
- Binding event listeners and updating the DOM without full-page reloads.
- Handling invalid, missing, or outdated date values with user-friendly fallback states.

All user-provided or configurable text inserted into the page should be rendered safely. Where text-only content is sufficient, the implementation should prefer `textContent` over injecting raw HTML.

### 2.5 GitHub Pages Compatibility

The project must work when served from a repository subpath, not only from the domain root. Asset references should therefore use relative paths, and the application should not assume server-side routing or URL rewriting. The site should have an `index.html` entry point and keep all required assets within the repository.

Deployment should require only enabling GitHub Pages for the chosen branch or configuring a simple static Pages workflow. The repository should include concise setup instructions covering:

1. Where relationship-specific configuration is edited.
2. How to run the site locally using a static server when needed.
3. Which branch or workflow publishes the site.
4. Which browser features are required and what fallback behavior is expected.

### 2.6 Browser and Accessibility Baseline

The implementation should target current versions of major evergreen browsers, including Chrome, Edge, Firefox, and Safari. The baseline should include:

- Keyboard-operable controls and visible focus indicators.
- Semantic headings with a logical order.
- Sufficient color contrast for text and controls.
- `aria-live` only for dynamic information where announcements are useful and not disruptive.
- Reduced-motion support.
- Responsive behavior without horizontal scrolling at common viewport widths.
- Graceful fallback messaging for unsupported storage or unavailable time-zone configuration.

This baseline keeps the project technically demonstrable while preserving the intimate, low-friction experience expected from a personal interactive gift.

### 2.7 Single-File and Deployment Contract

The initial deliverable shall be a single self-contained `index.html` containing the semantic markup, embedded CSS, configuration data, and Vanilla JavaScript required for the dashboard’s core experience. A separate file is permitted only when required by GitHub Pages configuration or a deliberately documented local asset; the dashboard must not depend on a bundler, transpiler, package installation, module graph, or generated asset manifest.

All references to permitted local resources shall be document-relative, using a same-directory filename or a `./` path. Leading-root paths such as `/assets/app.css`, hostname-specific URLs, server aliases, and history-API rewrites shall not be used. The page must work at both the repository root and a GitHub Pages project subpath, so deployment must not assume a particular repository name or hostname.

The configuration block shall be clearly marked and contain the two city names and IANA time zones, relationship dates, day/night boundary, and surprise-message collection. A reviewer should be able to personalize these values without changing rendering or timer logic. Core behavior must remain available offline after the initial document load and must not require secrets or external runtime services.
