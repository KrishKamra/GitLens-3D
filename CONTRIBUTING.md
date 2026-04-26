# 🤝 Contributing to GitLens-3D

First off, thank you for considering contributing to **GitLens-3D**. It’s people like you who make the open-source ecosystem a world-class space for innovation.

By contributing, you are helping bridge the gap between abstract data and high-fidelity visualization. We follow a **Silicon-Standard** workflow—prioritizing clean code, deterministic logic, and high-signal performance.

---

## 🏗️ Technical Architecture
Before you dive in, familiarize yourself with our "Silicon-to-Software" pipeline:

1.  **Backend (FastAPI):** Orchestrates the GitHub API handshakes and data sanitization.
2.  **Frontend (React + R3F):** Manages the WebGL context and orbital physics.
3.  **Post-Processing:** Handled via `@react-three/postprocessing` for that crystalline neon aesthetic.



---

## 🛠️ How Can I Contribute?

### 1. Reporting Bugs 🐛
* Check the [Issues](https://github.com/KrishKamra/GitLens-3D/issues) tab to see if the bug has already been reported.
* If not, open a new issue using the **Bug Report** template.
* **Crucial:** Include your hardware specs (CPU/GPU) as WebGL performance varies significantly across silicon.

### 2. Suggesting Enhancements ✨
* We love "Elite" ideas! Whether it's a new post-processing effect (like chromatic aberration) or a new data-mapping logic (like commit frequency driving pulse speed).
* Open an issue with the tag `enhancement`.

### 3. Code Contributions 💻
1.  **Fork** the repository.
2.  **Create a Feature Branch:** `git checkout -b feat/your-awesome-feature`.
3.  **Follow the Style Guide:**
    * **React:** Use functional components and hooks. Maintain "Null Safety" with optional chaining (`?.`).
    * **Three.js:** Ensure all assets are disposed of properly to avoid memory leaks.
    * **Python:** Follow PEP 8 guidelines.
4.  **Commit with High Signal:** Use [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat:`, `fix:`, `refactor:`).

---

## 🧪 Local Testing Suite

To ensure the "Digital Core" remains stable:
* **Frontend:** Run `npm run lint` to ensure no unused refs or variables (keep the console clean!).
* **Backend:** Ensure your `GITHUB_TOKEN` has the necessary scopes for the stats you are trying to fetch.
* **Performance:** Test the 3D scene at `dpr={[1, 2]}` to ensure it doesn't lag on integrated graphics.

---

## 📜 Code of Conduct
We are committed to providing a welcoming and inspiring community. Please be respectful, professional, and grounded in your interactions. Like our UI, keep your communication **minimalist and high-impact**.

---

## 💎 Recognition
Significant contributors will have their GitHub node manually "boosted" in our official demo deployments, making your satellite the most luminous in the galaxy.

**Happy Coding!** 🛰️