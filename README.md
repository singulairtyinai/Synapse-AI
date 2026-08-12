# 🌌 Synapse AI — The Living AI Constellation & Telemetry Radar

An interactive, force-directed graphical web application for mapping and tracking developments across the global AI landscape.

Designed with 100% client-side HTML5 Canvas 2D physics, glassmorphic UI elements, and zero build tool dependencies. Fully optimized out-of-the-box for static hosting on **GitHub Pages**.

---

## 🎯 9 Mapped AI Domains

1. 🌌 **Overall AI Field** (`overall`) — Macro trends, paradigm shifts, and post-scaling compute laws.
2. 🤖 **Agentic AI Domain** (`agentic_ai`) — Autonomous web/GUI agents, multi-agent swarms, and SWE-bench coding benchmarks.
3. 🧠 **Model Releases & Updates** (`models`) — Frontier foundation model releases (OpenAI/ChatGPT, Anthropic Claude 3.7, Meta Llama 4, DeepSeek-R1, Google Gemini 2.5, Perplexity, Mistral, xAI Grok-3).
4. 🏢 **Major AI Companies & Compute** (`companies`) — Datacenter supercomputers (Project Stargate, Colossus 100k H100s), NVIDIA Blackwell B200 GPUs, custom silicon (Google TPU v6), and corporate investments.
5. 🛡️ **AI Security & Safety** (`security`) — OWASP LLM vulnerabilities, indirect prompt injection CVEs, red-teaming, mechanistic interpretability, and weight exfiltration safeguards.
6. 🎓 **Fellowships, Grants & Talent** (`fellowships`) — OpenAI Research Residency, Anthropic AI Safety Fellowship, Schmidt Sciences AI 2050, and Meta AI PhD grants.
7. ⚔️ **Military & Defense AI** (`military`) — Autonomous defense command mesh (Anduril Lattice OS), Palantir AIP Project Maven, NATO DIANA accelerator, and ethical weapon directives (DoD 3000.09).
8. 🏛️ **AI Governance & Policy** (`governance`) — EU AI Act Phase 1 enforcement, US/UK AI Safety Institutes (AISI), NIST evals, and copyright rulings.
9. 🌐 **Multilateral & UN Forums** (`multilateral`) — UN High-Level Advisory Body on AI, Paris AI Action Summit 2025, G7 Hiroshima AI Process, and OECD GPAI integration.

---

## 🚀 How to Host on GitHub Pages

Hosting **Synapse AI** on GitHub Pages is completely free and requires zero compilation or build commands.

### Step 1: Initialize Git and Push to GitHub
Open your terminal inside the `synapse-ai` directory and run:

```bash
# 1. Initialize git repository
git init

# 2. Add all application files
git add .

# 3. Commit the initial release
git commit -m "Initial commit: Synapse AI Constellation App"

# 4. Rename main branch to main (if needed)
git branch -M main

# 5. Link your GitHub remote repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/synapse-ai.git

# 6. Push code to GitHub
git push -u origin main
```

### Step 2: Enable GitHub Pages
1. Go to your repository on **GitHub.com**.
2. Click on **Settings** (top navigation tab).
3. On the left menu, select **Pages**.
4. Under **Build and deployment** -> **Source**, select **Deploy from a branch**.
5. Set **Branch** to `main` and folder to `/ (root)`.
6. Click **Save**.

Your application will be live at `https://YOUR_USERNAME.github.io/synapse-ai/` in 1–2 minutes!

---

## 🛠️ Adding New AI Developments or Nodes

To add new AI developments, releases, or company news, simply edit `assets/js/data.js`:

```javascript
// Add a new node object into SYNAPSE_DATA.nodes:
{
  id: 'my-new-ai-release',
  title: 'My Frontier Model Release',
  category: 'models', // Choose one of the 9 domain keys
  date: '2026-08-12',
  impact: 'CRITICAL', // 'CRITICAL', 'HIGH', or 'MODERATE'
  company: 'My Company',
  tldr: 'Brief 1-2 sentence executive summary.',
  specs: { benchmark: '98.5%', context: '1M tokens' },
  tags: ['#NewModel', '#AI'],
  sourceUrl: 'https://example.com/news-release',
  details: 'Deeper explanation paragraph...'
}
```

---

## 💻 Tech Stack
- **Structure:** HTML5 Semantic Markup
- **Styling:** Vanilla CSS3 (Custom Properties, Glassmorphism, CSS Grid, Responsive Flexbox)
- **Engine:** Dynamic HTML5 2D Canvas Physics Engine (`constellation.js`)
- **Fonts:** Space Grotesk, Inter, IBM Plex Mono (Google Fonts)
