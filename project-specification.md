# Project Specification Document

## 3. Functional Requirements

### 3.1 Dual-City Time Display

1. The dashboard shall display the current local time for each partner's configured city.
2. Each clock shall show:
   - City name and time-zone label.
   - Local time including hours, minutes, and seconds.
   - Local date, including the day of the week where space permits.
3. The implementation shall derive displayed times with the browser's `Date` and `Intl.DateTimeFormat` APIs using an IANA time-zone identifier (for example, `Asia/Taipei` or `America/Los_Angeles`), rather than applying a fixed manual offset.
4. Both clocks shall refresh at least once per second and remain accurate across daylight-saving-time and time-zone offset changes without requiring a page reload.
5. Each city shall expose a day/night state based on that city's local hour. The state shall be represented visually and programmatically (for example, as `day` or `night`) and shall update automatically when the local time crosses the configured boundary.
6. The two clock panels shall remain independently readable when the displayed cities have different dates or day/night states.
7. If a configured IANA time-zone identifier is missing or invalid, that clock shall show a clear “time unavailable” state and the other valid clock shall continue operating.
8. Day/night classification shall use a documented local-hour boundary (default: day from 06:00 inclusive through 17:59, night from 18:00 through 05:59) and shall not be inferred from the visitor’s local time.

**Acceptance criteria**

- With two valid IANA time zones configured, both clocks show the correct local time and date when compared with `Intl.DateTimeFormat`.
- The seconds value updates at least once during every two-second observation window.
- Changing a test time across midnight, a daylight-saving transition, or the day/night boundary updates the corresponding city without affecting the other city.

### 3.2 Anniversary Countdown and Count-Up

1. The dashboard shall accept a relationship-start date/time and an anniversary month/day (or an explicitly configured next-anniversary timestamp) as source values.
2. Before the next anniversary occurrence, the dashboard shall display a countdown to that occurrence.
3. After the anniversary moment has passed, the dashboard shall display elapsed time since the relationship start as a count-up until the next anniversary cycle begins.
4. The primary duration display shall include days, hours, minutes, and seconds in a stable, clearly labeled order.
5. The calculation shall use a precise timestamp and shall update at least once per second.
6. The display shall communicate its current mode (for example, “countdown to our anniversary” or “together for”) and shall handle the anniversary rollover without a manual refresh.
7. Invalid, missing, or ambiguous date values shall produce a readable configuration/error state rather than `NaN`, an empty card, or a broken timer.
8. Leap-day anniversaries shall use an explicit documented policy (default: celebrate on February 28 in non-leap years).

**Acceptance criteria**

- At a known timestamp before the anniversary, the displayed duration decreases by approximately one second per second.
- At a known timestamp after the anniversary, the displayed duration increases by approximately one second per second.
- At rollover, the component switches mode and continues displaying a non-negative duration with no visible page reload.

### 3.3 Surprise Quote or Message Picker

1. The dashboard shall provide a control for selecting a surprise quote or message.
2. Each selection shall choose one item from the configured message collection and render it in the message area.
3. The picker shall provide visual feedback using a fade-out/fade-in transition; the transition shall not cause layout shifting or expose unstyled content.
4. The control shall remain usable by keyboard and shall expose an accessible name and state.
5. The initial message and subsequent selections shall be deterministic in presentation but may be random in item selection; the component shall not require a network request.

**Acceptance criteria**

- Activating the picker changes the visible message to a configured message and completes the fade transition within 1 second.
- Repeated activation never renders an empty message area for more than the transition interval.
- The picker is operable with keyboard focus and has a visible focus state.

### 3.4 Visual Design and Responsive Layout

1. The interface shall present the clocks, anniversary status, and surprise message as a cohesive couple dashboard on a single page.
2. The visual system shall use:
   - A soft Morandi-inspired palette with sufficient contrast for text and controls.
   - Glassmorphism panels using translucent surfaces, borders, blur, and restrained shadows.
   - Consistent spacing, typography, corner radii, and visual hierarchy across all components.
3. The layout shall adapt to narrow mobile screens, tablets, and desktop widths without horizontal scrolling.
4. On small screens, content shall stack or reflow in a readable order; on wider screens, related panels may share a row when sufficient space is available.
5. Decorative effects shall not obscure functional content, prevent interaction, or be required to understand the information.
6. The page shall respect users' reduced-motion preference by reducing or disabling non-essential animation.

**Acceptance criteria**

- At viewport widths of 320 px, 768 px, and 1440 px, all primary content is readable and usable without horizontal scrolling.
- Text and controls remain legible against panel backgrounds, and keyboard focus is visible.
- With `prefers-reduced-motion: reduce`, the surprise-message transition is shortened or removed while the message still changes correctly.

### 3.5 Functional Edge-Case Rules

- A message collection with zero items shall leave the picker disabled and show a configured fallback message.
- A collection with one item shall remain usable but may display the same item after every selection.
- Repeated picker activation during a fade shall be debounced or queued so messages cannot become stuck invisible.
- Countdown and clock values shall remain non-negative; transient timer drift shall be corrected from a fresh `Date.now()` calculation on every update.
- Content configured with long city names, long messages, or narrow viewport widths shall wrap or truncate intentionally without overlapping controls.

## 4. Non-Functional Requirements

### 4.1 Performance and Resource Use

1. The dashboard shall be a lightweight client-side page with no required backend, polling service, or runtime network dependency for core features.
2. Clock and anniversary updates shall use a small number of scheduled timers, consolidated where practical, and shall not create a new timer per rendered element.
3. Updates shall modify only the affected DOM content rather than reloading the page or rebuilding the entire document.
4. The page shall remain responsive during normal use, with no observable interaction freeze while clocks update or messages transition.
5. In a production build served locally, the initial page shall be usable after the document and local assets load; all core functionality shall work when the network is unavailable after the initial load.
6. The page shall not require external fonts, analytics, CDN scripts, remote images, or API calls for core rendering or interaction.
7. On a typical current desktop or mobile browser, one update pass shall complete within 16 ms during normal operation, and the document shall remain responsive while the page is visible.

**Acceptance criteria**

- A production browser profile can activate the message picker and interact with controls while the clocks update continuously.
- No core feature requests an API, font, image, or script from an external origin at runtime.
- The implementation uses one shared update loop or otherwise demonstrates bounded timer usage rather than one interval per clock/message element.
- Required local resources load successfully when the site is served from a nested GitHub Pages project path.

### 4.2 Browser Compatibility and Accessibility

1. The page shall support current versions of Chrome, Edge, Firefox, and Safari on desktop and mobile form factors.
2. The implementation shall use broadly supported web standards, including `Date`, `Intl.DateTimeFormat`, CSS media queries, and semantic HTML, with graceful degradation for optional visual effects.
3. If a browser does not support a visual effect such as `backdrop-filter`, the panels shall retain an opaque or translucent fallback that preserves readability.
4. Interactive controls shall be reachable by keyboard, have visible focus indicators, and use semantic elements and accessible labels.
5. Color, animation, and decorative state shall not be the sole means of communicating information.
6. Dynamic clock and timer text shall use `aria-live="off"` by default or a carefully limited polite announcement strategy, preventing second-by-second updates from overwhelming assistive technologies.
7. The page shall provide a visible fallback when `localStorage` is unavailable; core display features shall continue without persistence.

**Acceptance criteria**

- Core clock, anniversary, and message-picker behavior works in the latest stable releases of Chrome, Edge, Firefox, and Safari.
- Disabling JavaScript-dependent decorative effects does not prevent the page from loading or displaying its static content.
- Keyboard-only navigation reaches and activates every interactive control in a logical order.

### 4.3 GitHub Pages Deployment

1. The page shall be deployable as a static site on GitHub Pages without a server process, database, server-side rendering, or rewrite configuration.
2. The entry point shall be a repository-served `index.html` (or an equivalent GitHub Pages-compatible entry file), and links shall work from both a project site path and the repository root context.
3. All scripts, stylesheets, images, icons, and other local resources shall use relative paths. No local resource may depend on a leading-root path such as `/assets/...`.
4. The implementation shall not assume a particular hostname, protocol, or repository name.
5. The published page shall function over HTTPS and shall not require secrets, environment variables, or private build services.
6. Local references shall be document-relative (`./...` or a same-directory filename); leading-slash paths, server aliases, and runtime URL rewriting shall not be used.
7. The single HTML entry point shall work when opened from the repository’s Pages root and when the repository is hosted beneath a project subpath.

**Acceptance criteria**

- Publishing the repository through GitHub Pages serves the dashboard at the generated project URL without path-related 404 errors.
- A fresh clone can be opened through the documented GitHub Pages workflow without adding a backend or changing source paths.
- Browser developer tools show no failed requests for required local resources when the site is hosted under a nested project path.
- A source review finds no required local URL beginning with `/`, no bundler-generated asset manifest, and no build-only import.

### 4.4 Architecture and Maintainability

1. The deliverable shall use a single-file architecture: the page structure, styles, and client-side behavior shall be contained in one HTML file unless a directly required GitHub Pages configuration file is needed.
2. The implementation shall keep configuration values (city names, IANA time zones, anniversary timestamp, and message collection) clearly identifiable and easy to update.
3. Time formatting shall remain based on IANA time-zone identifiers and `Intl` formatting rather than duplicated offset logic.
4. Relative paths shall be used for any permitted local resource references.
5. The code shall avoid unnecessary frameworks, build steps, or dependencies so the dashboard can be reviewed, copied, and hosted as a static artifact.
6. The single HTML file shall use clearly marked regions for configuration, semantic markup, CSS, and JavaScript; JavaScript shall expose small functions for formatting, state calculation, rendering, and event binding.
7. Configuration shall be data-only where possible so changing a city, date, or message does not require editing rendering logic.

**Acceptance criteria**

- A reviewer can update both city time zones, the anniversary value, and the message list in one clearly marked configuration area.
- Opening the HTML file reveals all required markup, CSS, and JavaScript for the dashboard's core behavior.
- The page can be deployed from a clean repository without a package installation step.

## 5. Instructor-Facing Grading Highlights

The dashboard should feel like a thoughtful gift first and a technical demonstration second. Each visible interaction should have a practical or romantic purpose, while the implementation should leave clear evidence of frontend learning for an instructor reviewing the source.

### 5.1 Romantic and Practical Interaction Design

1. The opening view shall answer two immediate relationship questions: “What time is it for each of us?” and “What are we looking forward to together?”
2. Each time-zone card shall use an affectionate, human-readable label such as “Your morning” or “Her evening” alongside the city and IANA time-zone name. The label must remain understandable without color or icons.
3. The anniversary panel shall change its copy by state:
   - Before the target moment: “Counting down until our next anniversary.”
   - At or after the target moment: “Together for …”
   - Invalid or missing configuration: a friendly setup message rather than `NaN`, an empty card, or a console-only error.
4. A “Send a little love” or equivalent surprise control shall reveal a configured message, memory, or prompt. It should be a small moment of delight, not a complex messaging system.
5. The surprise interaction shall preserve the current layout, announce the new message to assistive technology, and leave the control ready for another activation.
6. The interface may include a compact “next shared moment” label (for example, a call, visit, or meal) but should keep the first release focused. Any editable content should be local to the browser and clearly described as private-to-this-device rather than synchronized.
7. On mobile, the order shall prioritize greeting, dual clocks, countdown, and surprise message. On desktop, clocks may sit side by side with the countdown while the message remains visually prominent.

**Evidence an instructor can observe**

- A user can understand the time difference and milestone state without reading source code.
- A keyboard user can activate the same romantic interaction as a pointer user.
- The UI gives immediate visual and textual feedback without a page reload or network request.
- The design uses relationship language and meaningful empty/error states instead of generic placeholder copy.

### 5.2 Timer State Management

1. The implementation shall use one shared update loop, or a deliberately bounded set of timers, for the two clocks and anniversary display.
2. Timer callbacks shall calculate from the current `Date` on every tick instead of incrementing a previously rendered value. This prevents drift after a tab is backgrounded or a callback is delayed.
3. The code shall keep timer identifiers in named state and clear them when the page no longer needs updates, such as when a component is removed or initialization is repeated.
4. The anniversary renderer shall explicitly model at least `countdown`, `count-up`, and `invalid` states. A state change shall update both the value and its explanatory label.
5. Updates shall be safe when a rendered value is unchanged; unnecessary DOM writes should be avoided where practical.

**Technical evidence**

- A reviewer can find a single `setInterval` or a clearly justified timer strategy.
- The code derives duration from `targetTimestamp - Date.now()` or an equivalent current-time calculation.
- Boundary tests or a manually injectable “now” value can demonstrate midnight and anniversary rollover behavior.

### 5.3 `Intl` and Time-Zone Handling

1. City configuration shall store IANA identifiers such as `Asia/Taipei` and `America/Los_Angeles`, never hand-written UTC offsets.
2. `Intl.DateTimeFormat` shall receive the configured `timeZone` for each clock and format time, date, and time-zone label from the same source instant.
3. The implementation shall not assume both partners share the same calendar date, daylight-saving rules, or day/night status.
4. Invalid identifiers shall be caught during configuration normalization and shown as a recoverable setup state.
5. Day/night status shall be derived from the formatted local hour (or an equivalent timezone-aware value), then represented in text or an accessible attribute in addition to decorative styling.

**Technical evidence**

- A reviewer can change one IANA identifier in the configuration object and see the whole card update.
- The source contains no duplicated manual offset arithmetic.
- Formatting options are centralized in named helpers rather than repeated throughout event handlers.

### 5.4 DOM Manipulation and Rendering

1. JavaScript shall cache references to stable DOM nodes during initialization and update only the text, attributes, and state classes that changed.
2. Dynamic text shall use `textContent` or equivalent safe DOM APIs. `innerHTML` shall not be required for ordinary clock, countdown, or message updates.
3. Rendering functions shall have narrow responsibilities, such as `renderClock`, `renderAnniversary`, and `renderMessage`.
4. Configuration data shall be separate from rendering logic so the recipient’s names, cities, milestone, and message list can be changed without rewriting event handlers.
5. Missing optional content shall produce a useful fallback state while preserving the surrounding layout.

**Technical evidence**

- DOM queries and event binding occur during initialization rather than on every timer tick.
- The source is readable as a sequence of configuration, formatting, state, rendering, and event-handling sections.
- A browser inspector shows targeted text and attribute updates rather than full-document replacement.

### 5.5 Event Handling and Interaction Feedback

1. Interactive controls shall use native `button` elements with accessible names and shall work with keyboard activation, touch, and pointer input.
2. Event listeners shall be registered once during initialization and shall not multiply when a component re-renders.
3. The message picker shall prevent accidental double activation from producing overlapping transitions or an empty message.
4. Focus shall remain predictable after activation, and visible `:focus-visible` styling shall remain present.
5. If a control is temporarily busy during a transition, its disabled state or equivalent status shall be communicated without making the experience feel unresponsive.

**Technical evidence**

- The same handler responds correctly to Enter/Space through native button behavior.
- The implementation demonstrates event delegation only where it simplifies a repeated list; otherwise direct, named listeners are acceptable.
- The UI can be tested by clicking, tabbing, and activating controls without inspecting implementation details.

### 5.6 Animation and Reduced Motion

1. Message changes shall use a short opacity transition or similarly restrained effect that preserves the card’s height.
2. The next message shall be prepared before the old message disappears for longer than the transition interval.
3. `prefers-reduced-motion: reduce` shall shorten or disable non-essential transitions while preserving the content change and state feedback.
4. Decorative animation shall never be required to understand time, date, day/night, or anniversary state.

**Technical evidence**

- CSS transitions are applied to a stable element rather than rebuilding animated markup.
- A reduced-motion media query is present and can be demonstrated through browser accessibility settings.
- Animation timing is centralized in a custom property or small set of variables.

### 5.7 Responsive Layout

1. The layout shall use CSS Grid or Flexbox with fluid tracks and wrapping rather than fixed coordinates.
2. At approximately 320 px wide, each clock and the countdown shall remain readable without horizontal scrolling or clipped labels.
3. At tablet and desktop widths, related cards may share a row while maintaining enough spacing for independent scanning.
4. Long city names, localized dates, and larger browser text settings shall wrap or reflow without overlapping controls.
5. Touch targets shall have comfortable spacing, and the surprise control shall remain easy to find on small screens.

**Technical evidence**

- Breakpoints are tied to layout needs rather than a long list of device-specific overrides.
- The instructor can resize the viewport and observe intentional stacking and reflow.
- No JavaScript device-width branching is needed for the primary layout.

### 5.8 Accessibility

1. The page shall use one logical heading hierarchy, semantic landmarks, and native controls.
2. Dynamic clock and countdown text shall be readable in the visual UI; `aria-live` shall be used selectively so second-by-second updates do not overwhelm screen readers.
3. The surprise message region shall expose a polite announcement when its content changes.
4. Day/night and countdown mode shall be communicated with text or accessible labels, not color alone.
5. Focus indicators, contrast, text resizing, reduced motion, and keyboard order shall be verified at the main viewport sizes.

**Technical evidence**

- Accessibility can be checked with keyboard-only navigation and a browser audit without requiring a framework.
- Decorative icons have empty alternative text or are hidden from assistive technology when appropriate.
- The page remains understandable when animation is disabled and when color perception is limited.

### 5.9 Maintainability and Learning Demonstration

1. The single HTML file shall have clearly marked configuration, markup, styles, and script sections.
2. Functions shall be small enough to explain in a code review, with names that describe behavior rather than implementation details.
3. Repeated values such as colors, spacing, animation duration, and breakpoints shall use CSS custom properties where useful.
4. The implementation shall favor browser-native APIs and a small amount of explicit code over a framework or dependency that hides the behavior being graded.
5. Any comments shall explain a non-obvious decision, such as why a shared timer is used or why `Intl` formatting is centralized; comments shall not restate obvious syntax.
6. The README or deployment notes, if present, shall identify the configuration area, GitHub Pages setup, and the browser behaviors demonstrated.

**Technical evidence**

- A reviewer can personalize the gift by editing one configuration block.
- A fresh clone can run without package installation or a build command.
- The source makes timer state, DOM updates, event listeners, animation, responsive CSS, and accessibility decisions visible enough to discuss during grading.
- A reviewer can identify the configuration block and the four primary functional modules without following generated or minified code.

### 5.10 Scope Guardrails

The first release should not add authentication, real-time synchronization, a backend, a database, complex forms, or a large animation system. These would increase implementation risk without improving the core gift. A small number of polished, inspectable interactions is preferable to a larger feature list with unclear state management or inaccessible behavior.
