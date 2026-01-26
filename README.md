# ⚡ Whisper AI - Smart Prompt Builder

A Chrome extension that helps you create better, more effective prompts for AI tools like ChatGPT, Claude, Gemini, and Grok.

**No API key required!** Uses your existing AI platform accounts.

![Whisper AI](https://img.shields.io/badge/Version-1.1.0-6366F1?style=flat-square)
![Chrome Extension](https://img.shields.io/badge/Platform-Chrome-4285F4?style=flat-square&logo=googlechrome&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-10B981?style=flat-square)

## ✨ Features

- **🎯 Advanced Prompt Enhancement** - Transform vague prompts into structured, effective ones using proven prompt engineering
- **📚 12+ Pro Templates** - Pre-built templates with [ROLE], [CONTEXT], [TASK], [FORMAT], [QUALITY] structure
- **👤 Personalized Suggestions** - Get recommendations based on your role and industry
- **🌐 Multi-Platform Support** - Works on ChatGPT, Claude, Gemini, and Grok
- **📊 Prompt History** - Track and reuse your enhanced prompts
- **⚡ Quick Actions** - One-click enhancement with floating widget
- **🔒 No API Key Required** - Uses your existing AI platform sessions

## 🚀 Quick Start

### 1. Generate Icons (Optional)

If icons aren't already generated:

```bash
npm install
npm run generate-icons
```

Or open `scripts/generate-icons.html` in your browser and download icons.

### 2. Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `whisper-ai` folder
5. The extension icon will appear in your toolbar

### 3. Complete Setup

1. Click the Whisper AI extension icon
2. Go through the walkthrough tutorial
3. Select your **role** (Developer, Marketer, PM, etc.)
4. Select your **industry** (Tech, Finance, Healthcare, etc.)
5. You're ready to go!

## 🧠 Advanced Prompt Engineering System

Whisper AI v1.1.0 introduces a professional prompt engineering system based on best practices:

### Template Structure (7 Core Components)

| Component | Purpose | Priority |
|-----------|---------|----------|
| **[ROLE]** | Define AI's expertise/persona | 🔴 Critical |
| **[CONTEXT]** | Background information & constraints | 🔴 Critical |
| **[TASK]** | Clear, specific instruction | 🔴 Critical |
| **[FORMAT]** | Desired output structure | 🟡 Important |
| **[EXAMPLES]** | Show desired input/output patterns | 🟡 Important |
| **[CONSTRAINTS]** | Limitations & requirements | 🟢 Optional |
| **[QUALITY]** | Success criteria & standards | 🟢 Optional |

### Before/After Example

**❌ Before (Generic Prompt):**
```
Review this code
```

**✅ After (Enhanced with Whisper AI):**
```
[ROLE] Senior software engineer with 10+ years of experience in code review

[TASK]
Review the following code comprehensively:
...

[FORMAT]
## 🔴 Critical Issues (Must Fix)
## 🟡 Warnings (Should Fix)
## 🟢 Suggestions (Nice to Have)
## 📊 Overall Assessment

[QUALITY]
- Be specific with line references
- Provide working code fixes
- Prioritize by severity
```

**Result:** 70%+ more actionable feedback with specific, prioritized issues

## 📁 Project Structure

```
whisper-ai/
├── manifest.json              # Extension manifest (MV3)
├── popup/
│   ├── popup.html            # Main popup UI
│   ├── popup.css             # Styles
│   └── popup.js              # Popup logic
├── background/
│   └── service-worker.js     # Background service worker
├── content/
│   ├── lib/
│   │   └── enhancer.js       # Advanced enhancement engine
│   └── platforms/
│       ├── chatgpt.js        # ChatGPT content script
│       ├── claude.js         # Claude content script
│       ├── gemini.js         # Gemini content script
│       └── grok.js           # Grok content script
├── docs/
│   └── PROMPT_ENGINEERING_SYSTEM.md  # Complete documentation
├── styles/
│   └── widget.css            # Floating widget styles
├── assets/icons/             # Extension icons
├── scripts/                  # Build scripts
├── README.md                 # Documentation
└── package.json              # For icon generation
```

## 🎨 Using Whisper AI

### Popup Interface

- Click the extension icon to open the popup
- Use **Enhance Prompt** to improve your current prompt
- Browse **Templates** for ready-to-use prompts
- View **History** to reuse past enhanced prompts
- Click platform icons to quickly navigate to AI sites

### Floating Widget

When you're on a supported AI platform:
1. Type a prompt (20+ characters)
2. An "Enhance" button appears in the top-right of the textarea
3. Click to enhance your prompt
4. Review the enhanced version with improvement tags
5. Click "Use Enhanced" to apply it

### Template Categories

| Category | Templates | Best For |
|----------|-----------|----------|
| 💻 **Coding** | Code Review Pro, Debug Detective, API Docs | Developers |
| ✍️ **Writing** | Blog Post Pro, Email Composer, Concept Explainer | Content creators |
| 📊 **Analysis** | Data Analysis Pro, SWOT Analysis, Meeting Summarizer | Analysts, PMs |
| 🎨 **Creative** | Idea Generator, Product Copy Pro, Story Crafter | Marketers, Writers |

## ⚙️ How Enhancement Works

The advanced `WhisperEnhancer` engine analyzes your prompt and applies:

1. **Intent Detection** - Identifies if you're asking about code, writing, analysis, etc.
2. **Structure Analysis** - Checks for missing elements (role, format, quality criteria)
3. **Role Context** - Adds persona based on your profile ("As a developer...")
4. **Industry Context** - Incorporates your industry for relevant examples
5. **Format Guidance** - Adds appropriate output structure for your intent
6. **Quality Markers** - Specifies success criteria and expectations

All enhancement happens **locally** - no external API calls needed!

## 🌐 Supported Platforms

| Platform | URL | Status |
|----------|-----|--------|
| ChatGPT | chatgpt.com, chat.openai.com | ✅ Supported |
| Claude | claude.ai | ✅ Supported |
| Gemini | gemini.google.com | ✅ Supported |
| Grok | grok.com, x.com/i/grok | ✅ Supported |

## ⚙️ Settings

Access settings from the popup:
- **Profile**: Update your role and industry for personalized enhancements
- **Auto-enhance**: Toggle automatic enhancement suggestions
- **Show widget**: Enable/disable the floating widget on AI sites
- **Watch Tutorial**: Re-watch the onboarding walkthrough

## 🛠️ Development

### Requirements

- Node.js 16+ (for icon generation only)
- Chrome browser

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd whisper-ai

# Install dependencies (optional, for icon generation)
npm install

# Generate icons
npm run generate-icons
```

### Version Management

```bash
# Bump patch version (1.0.0 -> 1.0.1)
npm run version:patch

# Bump minor version (1.0.0 -> 1.1.0)
npm run version:minor

# Bump major version (1.0.0 -> 2.0.0)
npm run version:major
```

### Testing

1. Make changes to the code
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Whisper AI extension
4. Test your changes on supported platforms

### Adding New Platforms

To add support for a new AI platform:

1. Create a new file in `content/platforms/`
2. Add the platform's URL patterns to `manifest.json`
3. Implement the same interface as existing platform scripts
4. Update the popup to show the new platform icon

## 🔒 Privacy

- **No API keys required** - Uses your existing AI platform sessions
- **No external servers** - All enhancement logic runs locally
- **Local storage only** - Your data stays in your browser
- **Open source** - Full transparency on what the code does

## 📝 License

MIT License - feel free to use and modify!

## 🗺️ Roadmap

- [x] ~~Advanced prompt engineering system~~
- [x] ~~7-component template structure~~
- [x] ~~Intent-based format suggestions~~
- [ ] Variable/placeholder system for templates
- [ ] Custom template editor
- [ ] Keyboard shortcuts
- [ ] Export/import prompt library
- [ ] Team sharing features
- [ ] More AI platforms (Perplexity, Copilot, etc.)

---

Made with ⚡ by Whisper AI
