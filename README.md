# Glassmorphism Wordle

A modern, high-fidelity clone of the popular word-guessing game Wordle, built with a sleek **Glassmorphism** design. This project focuses on clean DOM manipulation, asynchronous state management, and responsive UI components.

# 🚀 Live Demo

TBA

# ✨ Features

- **Staggered Reveal:** Guess results are revealed with a timed delay, mimicking the original game's "suspense."

- **Virtual Keyboard:** A fully interactive, color-coded keyboard that tracks guessed letters and helps users strategize.

- **Glassmorphism UI:** Built using backdrop-filter and semi-transparent RGBA color palettes for a cinematic look.

- **State Protection:** Implements clearTimeout and isGameOver flags to prevent race conditions during resets or after the game concludes.

- **Keyboard Support:** Full support for both physical keyboard input and virtual touch/click input.

# 🛠️ Technical Stack

- **HTML5:** Semantic structure including a 5-column CSS Grid.

- **CSS3:** Advanced styling using Flexbox, CSS Grid, and Keyframe animations for "winner" effects.

- **JavaScript (ES6+):**
  - **Modules:** Uses import/export for word list management.
  - **DOM API:** Dynamic element creation and event delegation.
  - **Logic:** Two-pass algorithm for accurate "Yellow" vs "Green" letter detection (handling duplicate letters correctly).

# 🧩 Key Logic: The "Two-Pass" Check

To ensure duplicate letters are handled correctly (e.g., guessing "SPEED" when the word is "ABIDE"), the algorithm runs in two phases:

1. **Phase 1 (Green):** Identifies exact matches and "mutes" those letters in both the secret word and the guess array.

2. **Phase 2 (Yellow):** Checks the remaining letters to see if they exist elsewhere in the secret word.

# 📦 Installation & Setup

1. **Clone the repository:**

```Bash
git clone https://github.com/shourya0pratap/wordle
```

2. **Run a local server:**
   Because the project uses ES Modules (`import`), it must be served via a local server:

- **VS Code:** Use the **Live Server** extension.

- **Python:** `python -m http.server`

- **Node.js:** `npx serve`

# 🚧 Roadmap / Future Improvements

[ ] **Hard Mode:** Forcing players to use hinted letters in subsequent guesses.

[ ] **Statistics:** Persistent storage via localStorage to track win streaks.

[ ] **Daily Word:** Synchronized "Word of the Day" using a timestamp-based seed for the randomizer.
