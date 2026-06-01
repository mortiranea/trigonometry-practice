# TrigMaster: Interactive Trigonometry Practice

TrigMaster is a minimalist, web-based platform designed to help students master trigonometry through targeted, interactive practice. Built entirely on visual intuition and instant feedback, the platform strips away the fluff to focus on core mathematical comprehension.

---

## Key Features

### 1. Interactive Unit Circle

Master the foundations of sine, cosine, and tangent using a dynamic visual interface.

* **Live Vector Tracking:** Drag the terminal side of an angle to watch trigonometric values update in real time.
* **Quadrant Visualizer:** Color-coded grids instantly show whether values are positive or negative based on the angle's location.
* **Special Angles Mode:** Practice exact values for standard radian and degree measures ($30^\circ$, $45^\circ$, $60^\circ$, etc.).

### 2. Adaptive Problem Generator

No repetitive worksheets. Our engine generates unique problems tailored to your current skill level across three core modules:

| Module | Topics Covered | Input Type |
| --- | --- | --- |
| **Right Triangle Trig** | SOH-CAH-TOA, solving for sides, angles of elevation/depression | Numeric / Multiple Choice |
| **Identities & Proofs** | Pythagorean identities, double-angle formulas, verification | Step-by-step logic selector |
| **Graphing Functions** | Amplitude, period shifts, phase shifts for $\sin(x)$, $\cos(x)$, and $\tan(x)$ | Interactive canvas dragging |

### 3. Immediate Feedback & Error Isolation

When you get an answer wrong, TrigMaster doesn't just show you the correct result. The system breaks down your response to pinpoint exactly where you miscalculated:

> **Example:** "Your calculation for the hypotenuse length is correct ($\sqrt{25}$), but you applied the secant ratio instead of the cosecant ratio."

---

## Technical Stack & Performance

The website is optimized for accessibility, speed, and cross-device compatibility:

* **Frontend UI:** HTML5, CSS3 (Tailwind CSS), and Vanilla JavaScript.
* **Math Rendering:** `MathJax` / `KaTeX` for crisp, textbook-quality formulas.
* **Visual Canvas:** SVG and HTML5 Canvas for smooth, lag-free circle and graph interactions without heavy external libraries.
* **No Database Required:** Student progress is saved locally using browser `localStorage`, making the platform fully serverless and lightning-fast to load.
