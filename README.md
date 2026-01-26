# ⚡ Whisper AI - Smart Prompt Builder

A Chrome extension that helps you create better, more effective prompts for AI tools like ChatGPT, Claude, Gemini, and Grok.

**No API key required!** Uses your existing AI platform accounts.

![Whisper AI](https://img.shields.io/badge/Version-1.0.0-6366F1?style=flat-square)
![Chrome Extension](https://img.shields.io/badge/Platform-Chrome-4285F4?style=flat-square&logo=googlechrome&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-10B981?style=flat-square)

## ✨ Features

- **🎯 Smart Prompt Enhancement** - Transform vague prompts into detailed, effective ones
- **📚 Template Library** - Access 12+ pre-built prompt templates for coding, writing, analysis, and more
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
2. Select your **role** (Developer, Marketer, PM, etc.)
3. Select your **industry** (Tech, Finance, Healthcare, etc.)
4. You're ready to go!

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
├── content/platforms/
│   ├── chatgpt.js            # ChatGPT content script
│   ├── claude.js             # Claude content script
│   ├── gemini.js             # Gemini content script
│   └── grok.js               # Grok content script
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
2. An "Enhance with Whisper" button appears
3. Click to enhance your prompt
4. Review the enhanced version with improvement tags
5. Click "Use Enhanced" to apply it

### Templates

Categories include:
- **Coding**: Code review, debugging, API documentation
- **Writing**: Blog posts, emails, explanations
- **Analysis**: Data analysis, SWOT, meeting summaries
- **Creative**: Stories, product descriptions, brainstorming

## ⚙️ How Enhancement Works

Whisper AI uses smart prompt engineering techniques to improve your prompts:

1. **Role Context** - Adds perspective based on your profile (e.g., "As a developer...")
2. **Output Format** - Requests structured responses with headers/lists
3. **Specificity** - Asks for concrete examples and details
4. **Actionable Focus** - Emphasizes practical, usable insights

The enhancement happens locally - no external API calls needed!

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

- [ ] More advanced enhancement algorithms
- [ ] Custom enhancement templates
- [ ] Keyboard shortcuts
- [ ] Export/import prompt library
- [ ] Team sharing features
- [ ] More AI platforms (Perplexity, Copilot, etc.)

---

Made with ⚡ by Whisper AI
