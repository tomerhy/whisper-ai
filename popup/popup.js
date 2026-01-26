// ===== Whisper AI Popup Script =====

// Advanced Template Data with structured prompt engineering
const TEMPLATES = [
  // ===== CODING TEMPLATES =====
  { 
    id: 1, 
    name: 'Code Review Pro', 
    emoji: '🔍', 
    category: 'coding', 
    prompt: `[ROLE] Senior software engineer with 10+ years of experience in code review, security auditing, and performance optimization

[TASK]
Review the following code comprehensively:

\`\`\`
[PASTE YOUR CODE HERE]
\`\`\`

[FORMAT]
## 🔴 Critical Issues (Must Fix)
List security vulnerabilities, bugs, or breaking issues

## 🟡 Warnings (Should Fix)
Performance issues, code smells, potential problems

## 🟢 Suggestions (Nice to Have)
Style improvements, best practices, optimizations

## 📊 Overall Assessment
- Code Quality Score: X/10
- Key Strengths:
- Priority Fixes:

For each issue: specify line number, explain problem, provide fix with code example.

[QUALITY]
- Be specific with line references
- Provide working code fixes
- Prioritize by severity and impact` 
  },
  { 
    id: 2, 
    name: 'Debug Detective', 
    emoji: '🐛', 
    category: 'coding', 
    prompt: `[ROLE] Expert debugger and software diagnostician with deep knowledge of runtime errors and systematic debugging

[PROBLEM]
Error Message:
\`\`\`
[PASTE ERROR HERE]
\`\`\`

Code:
\`\`\`
[PASTE CODE HERE]
\`\`\`

Expected behavior: [DESCRIBE EXPECTED]
Actual behavior: [DESCRIBE ACTUAL]

[TASK]
1. Analyze the error and identify root cause
2. Explain why this error occurs
3. Provide step-by-step fix
4. Suggest prevention strategies

[FORMAT]
## 🔍 Root Cause Analysis
(What's actually happening and why)

## 🛠️ Step-by-Step Fix
\`\`\`
// Fixed code here
\`\`\`

## 💡 Explanation
(Why this fix works)

## 🛡️ Prevention
(How to avoid this in the future)` 
  },
  { 
    id: 3, 
    name: 'API Documentation', 
    emoji: '📚', 
    category: 'coding', 
    prompt: `[ROLE] Technical writer and API documentation specialist

[CODE]
\`\`\`
[PASTE YOUR API CODE/ENDPOINT HERE]
\`\`\`

[TASK]
Generate comprehensive API documentation

[FORMAT]
## Overview
Brief description of what this endpoint/function does

## Endpoint/Signature
\`METHOD /path\` or \`function signature\`

## Parameters
| Name | Type | Required | Description | Default |
|------|------|----------|-------------|---------|

## Request Example
\`\`\`json
{
  // Example request body
}
\`\`\`

## Response
### Success (200)
\`\`\`json
{
  // Example response
}
\`\`\`

### Errors
| Code | Message | Description |
|------|---------|-------------|

## Usage Examples
### Basic Usage
### With Options
### Error Handling` 
  },
  
  // ===== WRITING TEMPLATES =====
  { 
    id: 4, 
    name: 'Blog Post Pro', 
    emoji: '📝', 
    category: 'writing', 
    prompt: `[ROLE] Expert content strategist and SEO specialist with 10+ years in content marketing

[CONTEXT]
- Topic: [YOUR TOPIC]
- Target Audience: [YOUR AUDIENCE]
- Tone: professional yet approachable
- Length: 1500 words

[TASK]
Write a comprehensive, engaging blog post that provides genuine value

[FORMAT]
## [Attention-Grabbing Headline]
(Include power words, numbers, or questions)

### Hook (First 2-3 sentences)
Start with a surprising stat, question, or relatable pain point

### Introduction
Set context and promise value

### Main Content
Use H2 headers for 3-5 main sections. Include:
- Practical examples
- Data/statistics where relevant
- [IMAGE SUGGESTION: description]

### Key Takeaways
- Bullet point summary
- Actionable next steps

### Call-to-Action

---
**SEO Elements:**
- Meta Description (155 chars):
- Target Keywords:

[QUALITY]
- Lead with value, not fluff
- Flesch reading score: 60+
- Scannable with subheadings every 300 words` 
  },
  { 
    id: 5, 
    name: 'Email Composer', 
    emoji: '📧', 
    category: 'writing', 
    prompt: `[ROLE] Communication expert specializing in business writing and persuasion

[CONTEXT]
- Purpose: [YOUR PURPOSE]
- Recipient: [WHO YOU'RE WRITING TO]
- Background: [CONTEXT/SITUATION]
- Tone: professional

[TASK]
Write an effective email that achieves the intended purpose

[FORMAT]
**Subject Line Options:**
1. [Direct approach]
2. [Curiosity-driven]
3. [Benefit-focused]

---

**Email:**

[Greeting]

[Opening: Context/connection - 1 sentence]

[Body: Main message - 2-3 short paragraphs]

[Clear Call-to-Action: Specific next step]

[Professional closing]

---

**Why This Works:**
- [Explanation of techniques used]

**Shorter Version:**
(For busy executives)

[QUALITY]
- Subject line under 50 characters
- Readable in under 30 seconds
- One clear ask per email` 
  },
  { 
    id: 6, 
    name: 'Concept Explainer', 
    emoji: '🧒', 
    category: 'writing', 
    prompt: `[ROLE] Expert educator known for making complex topics accessible through analogies

[CONTEXT]
- Concept: [CONCEPT TO EXPLAIN]
- Audience Level: beginner with no prior knowledge
- Goal: genuine understanding

[TASK]
Explain this concept in a way that creates genuine understanding

[FORMAT]
## 🎯 One-Sentence Summary
(If you can only remember one thing...)

## 🏠 The Analogy
Real-world comparison that makes this click

## 📖 The Explanation
Build up from first principles:
1. Start with what they already know
2. Introduce new concept gradually
3. Connect back to the analogy

## 💡 Why It Matters
Practical implications and applications

## 🔧 Example in Action
Concrete scenario showing this concept

## ❓ Common Misconceptions
What people often get wrong

## ✅ Quick Check
"You understand this if you can explain why..."

[QUALITY]
- No jargon without definition
- Multiple analogies for different thinking styles
- Build on familiar concepts` 
  },
  
  // ===== ANALYSIS TEMPLATES =====
  { 
    id: 7, 
    name: 'Data Analysis Pro', 
    emoji: '📊', 
    category: 'analysis', 
    prompt: `[ROLE] Senior data analyst with expertise in statistical analysis and business intelligence

[CONTEXT]
- Business Context: [YOUR CONTEXT]
- Analysis Goal: [WHAT YOU WANT TO LEARN]

[DATA]
[PASTE YOUR DATA HERE]

[TASK]
Perform comprehensive analysis and extract actionable insights

[FORMAT]
## 📋 Executive Summary
(3-4 bullet points - key findings only)

## 📈 Key Metrics
| Metric | Value | vs Previous | Status |
|--------|-------|-------------|--------|

## 🔍 Detailed Analysis

### Trends
- Trend 1: [description with numbers]

### Patterns
- Notable pattern with explanation

### Anomalies
- Any outliers or unexpected data

### Correlations
- Relationships found (noting correlation ≠ causation)

## 💡 Insights & Recommendations
| Finding | Implication | Recommended Action | Priority |
|---------|-------------|-------------------|----------|

## ⚠️ Limitations & Caveats

[QUALITY]
- Quantify all claims
- Distinguish correlation from causation
- Make recommendations specific and actionable` 
  },
  { 
    id: 8, 
    name: 'SWOT Analysis', 
    emoji: '🎯', 
    category: 'analysis', 
    prompt: `[ROLE] Strategic consultant with expertise in competitive analysis

[CONTEXT]
- Subject: [YOUR SUBJECT]
- Context: [SITUATION/MARKET]
- Strategic Goal: [YOUR GOAL]

[TASK]
Perform a comprehensive SWOT analysis with actionable strategies

[FORMAT]
## 📊 SWOT Matrix

### 💪 Strengths (Internal Positives)
| Strength | Evidence | Strategic Value |
|----------|----------|-----------------|

### 🎯 Weaknesses (Internal Negatives)
| Weakness | Impact | Urgency to Address |
|----------|--------|-------------------|

### 🚀 Opportunities (External Positives)
| Opportunity | Potential Impact | Feasibility |
|-------------|------------------|-------------|

### ⚠️ Threats (External Negatives)
| Threat | Likelihood | Mitigation Strategy |
|--------|------------|---------------------|

## 🎮 Strategic Recommendations

### SO Strategies (Strengths → Opportunities)
### WO Strategies (Weaknesses → Opportunities)
### ST Strategies (Strengths → Threats)
### WT Strategies (Weaknesses → Threats)

## 📋 Priority Action Plan
| Action | Type | Timeline | Success Metric |
|--------|------|----------|----------------|

[QUALITY]
- Be specific, not generic
- Include evidence for each point
- Make strategies actionable` 
  },
  { 
    id: 9, 
    name: 'Meeting Summarizer', 
    emoji: '📋', 
    category: 'analysis', 
    prompt: `[ROLE] Executive assistant expert in meeting facilitation and action tracking

[CONTEXT]
Meeting Type: [TYPE: team sync, 1:1, planning, etc.]

[MEETING NOTES]
[PASTE YOUR NOTES/TRANSCRIPT HERE]

[TASK]
Extract structured summary with clear action items and decisions

[FORMAT]
## 📅 Meeting Summary

### 🎯 Purpose & Outcome
One sentence on what this meeting accomplished

### ✅ Decisions Made
| Decision | Rationale | Impact |
|----------|-----------|--------|

### 📋 Action Items
| # | Task | Owner | Deadline | Priority |
|---|------|-------|----------|----------|

### 💬 Key Discussion Points
- **Topic 1**: Summary of discussion and conclusions

### ❓ Open Questions / Parking Lot
- Question 1 (needs follow-up by: person)

### 📅 Next Steps
- Next meeting: [date/topic if mentioned]

[QUALITY]
- Action items must be specific and assignable
- Include context for each decision
- Note any disagreements or concerns raised` 
  },
  
  // ===== CREATIVE TEMPLATES =====
  { 
    id: 10, 
    name: 'Idea Generator', 
    emoji: '💡', 
    category: 'creative', 
    prompt: `[ROLE] Creative strategist and innovation consultant with expertise in design thinking

[CONTEXT]
- Challenge: [YOUR CHALLENGE/PROBLEM]
- Background: [RELEVANT CONTEXT]
- Constraints: [ANY LIMITATIONS]

[TASK]
Generate diverse, actionable ideas ranging from safe to bold

[FORMAT]
## 🎯 Challenge Reframe
Alternative ways to think about this problem

## 💡 Ideas Spectrum

### 🟢 Safe Bets (Low risk, proven approaches)
| Idea | Why It Works | Effort | Impact |
|------|--------------|--------|--------|

### 🟡 Strategic Moves (Moderate risk, good potential)
| Idea | Innovation | Effort | Impact |
|------|------------|--------|--------|

### 🔴 Moonshots (High risk, high reward)
| Idea | What If... | Breakthrough Potential |
|------|------------|----------------------|

### 🎲 Wild Cards (Unexpected angles)
| Idea | Surprising Because... |
|------|----------------------|

## ⭐ Top 3 Recommendations
1. **[Idea]**: Because [reasoning]
2. **[Idea]**: Because [reasoning]
3. **[Idea]**: Because [reasoning]

## 📋 Quick Start
Fastest path to testing the top idea

[QUALITY]
- At least 10 distinct ideas
- Range from obvious to unexpected
- Include rationale for each` 
  },
  { 
    id: 11, 
    name: 'Product Copy Pro', 
    emoji: '🛍️', 
    category: 'creative', 
    prompt: `[ROLE] Conversion copywriter specializing in e-commerce and product marketing

[CONTEXT]
- Product: [YOUR PRODUCT]
- Target Customer: [WHO BUYS THIS]
- Key Features: [MAIN FEATURES]
- Price Point: mid-range

[TASK]
Write compelling product copy that drives conversions

[FORMAT]
## 🏷️ Headlines (Pick One)
1. [Benefit-focused]
2. [Problem-solution]
3. [Social proof angle]

## 📝 Short Description (50 words)
For product cards and previews

## 📄 Full Description

### The Hook
(Address pain point or desire immediately)

### Key Benefits
✨ **[Benefit 1]**: [How it helps them]
✨ **[Benefit 2]**: [How it helps them]  
✨ **[Benefit 3]**: [How it helps them]

### Features That Matter
(Technical specs that support the benefits)

### Social Proof
[Testimonial format or usage statistics]

### Risk Reversal
[Guarantee, return policy, or trust builder]

### Call-to-Action

## 📱 Variations
- **Instagram Caption**: 
- **Tweet**: 
- **Email Subject Line**: 

[QUALITY]
- Benefits before features
- Sensory and emotional language
- Address objections preemptively` 
  },
  { 
    id: 12, 
    name: 'Story Crafter', 
    emoji: '✨', 
    category: 'creative', 
    prompt: `[ROLE] Published author and creative writing instructor

[CONTEXT]
- Genre: [YOUR GENRE]
- Theme: [CENTRAL THEME]
- Setting: [WHERE/WHEN]
- Tone: engaging
- Length: 1000 words

[TASK]
Craft a compelling story with strong narrative structure

[FORMAT]
# [Story Title]

## Opening Hook
(First paragraph that demands the reader continues)

## Story
(Full narrative with:)
- Vivid sensory details
- Character with clear motivation
- Rising tension
- Meaningful dialogue
- Satisfying resolution

---

## 📝 Craft Notes
**Narrative Techniques Used:**
- [Technique 1]: How it serves the story

**Theme Exploration:**
How the theme is woven throughout

**Character Arc:**
Brief analysis of character development

[QUALITY]
- Show, don't tell
- Distinct character voices
- Sensory-rich descriptions
- Memorable opening and closing lines` 
  }
];

const TIPS = [
  "Add specific output format requirements to get structured responses.",
  "Include relevant context about your role and goals for personalized answers.",
  "Use examples to show the AI exactly what you're looking for.",
  "Set constraints like word count or complexity level for focused outputs.",
  "Ask the AI to think step-by-step for complex reasoning tasks.",
  "Specify the tone and audience for your content.",
  "Request multiple options or alternatives when brainstorming."
];

// State
let state = {
  isOnboarded: false,
  hasSeenWalkthrough: false,
  userProfile: {
    role: '',
    industry: ''
  },
  settings: {
    autoEnhance: true,
    showWidget: true
  },
  history: []
};

// DOM Elements
const screens = {
  walkthrough: document.getElementById('walkthroughScreen'),
  onboarding: document.getElementById('onboardingScreen'),
  main: document.getElementById('mainScreen'),
  templates: document.getElementById('templatesScreen'),
  settings: document.getElementById('settingsScreen'),
  history: document.getElementById('historyScreen')
};

// Walkthrough current step
let currentWalkthroughStep = 1;
const TOTAL_WALKTHROUGH_STEPS = 6;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadState();
  initializeUI();
  setupEventListeners();
  setupWalkthroughListeners();
  detectCurrentPlatform();
});

// Load state from storage
async function loadState() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['whisperState'], (result) => {
      if (result.whisperState) {
        state = { ...state, ...result.whisperState };
      }
      resolve();
    });
  });
}

// Save state to storage
async function saveState() {
  return new Promise((resolve) => {
    chrome.storage.local.set({ whisperState: state }, resolve);
  });
}

// Initialize UI based on state
function initializeUI() {
  if (!state.isOnboarded || !state.hasSeenWalkthrough) {
    // Show walkthrough for first-time users
    showScreen('walkthrough');
    showWalkthroughStep(1);
  } else {
    showScreen('main');
    updateMainScreen();
  }
  renderTemplates();
  updateTip();
}

// Show specific screen
function showScreen(screenName) {
  Object.values(screens).forEach(screen => screen.classList.add('hidden'));
  screens[screenName].classList.remove('hidden');
}

// Setup walkthrough event listeners
function setupWalkthroughListeners() {
  // Step navigation
  document.getElementById('skipWalkthrough')?.addEventListener('click', skipWalkthrough);
  document.getElementById('nextStep1')?.addEventListener('click', () => showWalkthroughStep(2));
  document.getElementById('prevStep2')?.addEventListener('click', () => showWalkthroughStep(1));
  document.getElementById('nextStep2')?.addEventListener('click', () => showWalkthroughStep(3));
  document.getElementById('prevStep3')?.addEventListener('click', () => showWalkthroughStep(2));
  document.getElementById('nextStep3')?.addEventListener('click', () => showWalkthroughStep(4));
  document.getElementById('prevStep4')?.addEventListener('click', () => showWalkthroughStep(3));
  document.getElementById('nextStep4')?.addEventListener('click', () => showWalkthroughStep(5));
  document.getElementById('prevStep5')?.addEventListener('click', () => showWalkthroughStep(4));
  document.getElementById('nextStep5')?.addEventListener('click', () => showWalkthroughStep(6));
  document.getElementById('prevStep6')?.addEventListener('click', () => showWalkthroughStep(5));
  document.getElementById('finishWalkthrough')?.addEventListener('click', finishWalkthrough);
  
  // Watch tutorial button in settings
  document.getElementById('watchTutorialBtn')?.addEventListener('click', () => {
    showScreen('walkthrough');
    showWalkthroughStep(1);
  });
}

// Show walkthrough step
function showWalkthroughStep(step) {
  currentWalkthroughStep = step;
  
  // Hide all steps
  document.querySelectorAll('.walkthrough-step').forEach(s => {
    s.classList.remove('active');
  });
  
  // Show current step
  const currentStep = document.querySelector(`.walkthrough-step[data-step="${step}"]`);
  if (currentStep) {
    currentStep.classList.add('active');
  }
  
  // Pre-fill profile if already set
  if (step === 6 && state.userProfile.role) {
    document.getElementById('walkthroughRole').value = state.userProfile.role;
    document.getElementById('walkthroughIndustry').value = state.userProfile.industry;
  }
}

// Skip walkthrough
async function skipWalkthrough() {
  if (!state.isOnboarded) {
    // If not onboarded, at least show minimal setup
    showWalkthroughStep(6);
  } else {
    state.hasSeenWalkthrough = true;
    await saveState();
    showScreen('main');
    updateMainScreen();
  }
}

// Finish walkthrough
async function finishWalkthrough() {
  const role = document.getElementById('walkthroughRole').value;
  const industry = document.getElementById('walkthroughIndustry').value;
  
  if (!role || !industry) {
    // Highlight required fields
    if (!role) document.getElementById('walkthroughRole').style.borderColor = '#EF4444';
    if (!industry) document.getElementById('walkthroughIndustry').style.borderColor = '#EF4444';
    return;
  }
  
  state.userProfile.role = role;
  state.userProfile.industry = industry;
  state.isOnboarded = true;
  state.hasSeenWalkthrough = true;
  
  await saveState();
  showScreen('main');
  updateMainScreen();
}

// Setup event listeners
function setupEventListeners() {
  // Legacy onboarding navigation (kept for backwards compatibility)
  document.getElementById('nextStep1Legacy')?.addEventListener('click', () => {
    const role = document.getElementById('userRole').value;
    if (role) {
      state.userProfile.role = role;
      document.getElementById('step1').classList.add('hidden');
      document.getElementById('step2').classList.remove('hidden');
    }
  });

  document.getElementById('backStep2Legacy')?.addEventListener('click', () => {
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step1').classList.remove('hidden');
  });

  document.getElementById('finishSetup')?.addEventListener('click', async () => {
    const industry = document.getElementById('userIndustry').value;
    if (industry) {
      state.userProfile.industry = industry;
      state.isOnboarded = true;
      state.hasSeenWalkthrough = true;
      await saveState();
      showScreen('main');
      updateMainScreen();
    }
  });

  // Main screen actions
  document.getElementById('settingsBtn').addEventListener('click', () => {
    populateSettings();
    showScreen('settings');
  });

  document.getElementById('enhanceBtn').addEventListener('click', () => {
    triggerEnhancement();
  });

  document.getElementById('templatesBtn').addEventListener('click', () => {
    showScreen('templates');
    renderFullTemplates('all');
  });

  document.getElementById('historyBtn').addEventListener('click', () => {
    showScreen('history');
    renderHistory();
  });

  document.getElementById('seeAllTemplates').addEventListener('click', () => {
    showScreen('templates');
    renderFullTemplates('all');
  });

  // Back buttons
  document.getElementById('backFromTemplates').addEventListener('click', () => {
    showScreen('main');
  });

  document.getElementById('backFromSettings').addEventListener('click', async () => {
    await saveSettings();
    showScreen('main');
  });

  document.getElementById('backFromHistory').addEventListener('click', () => {
    showScreen('main');
  });

  // Category tabs
  document.getElementById('categoryTabs').addEventListener('click', (e) => {
    if (e.target.classList.contains('category-tab')) {
      document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
      e.target.classList.add('active');
      renderFullTemplates(e.target.dataset.category);
    }
  });

  // Settings
  document.getElementById('resetBtn').addEventListener('click', async () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      state = {
        isOnboarded: false,
        hasSeenWalkthrough: false,
        userProfile: { role: '', industry: '' },
        settings: { autoEnhance: true, showWidget: true },
        history: []
      };
      await saveState();
      showScreen('walkthrough');
      showWalkthroughStep(1);
    }
  });

  // Platform icons click
  document.querySelectorAll('.platform-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      const platform = icon.dataset.platform;
      const urls = {
        chatgpt: 'https://chatgpt.com',
        claude: 'https://claude.ai',
        gemini: 'https://gemini.google.com',
        grok: 'https://grok.com'
      };
      if (urls[platform]) {
        chrome.tabs.create({ url: urls[platform] });
      }
    });
  });
}

// Update main screen
function updateMainScreen() {
  // Update platform icons based on current page
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0]?.url || '';
    document.querySelectorAll('.platform-icon').forEach(icon => {
      icon.classList.remove('active');
    });
    
    if (url.includes('chat.openai.com') || url.includes('chatgpt.com')) {
      document.querySelector('[data-platform="chatgpt"]')?.classList.add('active');
    } else if (url.includes('claude.ai')) {
      document.querySelector('[data-platform="claude"]')?.classList.add('active');
    } else if (url.includes('gemini.google.com')) {
      document.querySelector('[data-platform="gemini"]')?.classList.add('active');
    } else if (url.includes('grok.com') || url.includes('x.com/i/grok')) {
      document.querySelector('[data-platform="grok"]')?.classList.add('active');
    }
  });
}

// Detect current platform
function detectCurrentPlatform() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0]?.url || '';
    let platform = 'Not on AI platform';
    
    if (url.includes('chat.openai.com') || url.includes('chatgpt.com')) {
      platform = 'ChatGPT';
    } else if (url.includes('claude.ai')) {
      platform = 'Claude';
    } else if (url.includes('gemini.google.com')) {
      platform = 'Gemini';
    } else if (url.includes('grok.com') || url.includes('x.com/i/grok')) {
      platform = 'Grok';
    }
    
    document.getElementById('currentPlatform').textContent = platform;
    updateMainScreen();
  });
}

// Render templates in main screen
function renderTemplates() {
  const container = document.getElementById('templatesList');
  const popularTemplates = TEMPLATES.slice(0, 3);
  
  container.innerHTML = popularTemplates.map(template => `
    <div class="template-item" data-id="${template.id}">
      <div class="template-emoji">${template.emoji}</div>
      <div class="template-info">
        <div class="template-name">${template.name}</div>
        <div class="template-category">${template.category}</div>
      </div>
      <svg class="template-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </div>
  `).join('');

  // Add click handlers
  container.querySelectorAll('.template-item').forEach(item => {
    item.addEventListener('click', () => useTemplate(parseInt(item.dataset.id)));
  });
}

// Render full templates list
function renderFullTemplates(category) {
  const container = document.getElementById('templatesGrid');
  const filtered = category === 'all' 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === category);
  
  container.innerHTML = filtered.map(template => `
    <div class="template-item" data-id="${template.id}">
      <div class="template-emoji">${template.emoji}</div>
      <div class="template-info">
        <div class="template-name">${template.name}</div>
        <div class="template-category">${template.category}</div>
      </div>
      <svg class="template-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </div>
  `).join('');

  // Add click handlers
  container.querySelectorAll('.template-item').forEach(item => {
    item.addEventListener('click', () => useTemplate(parseInt(item.dataset.id)));
  });
}

// Use template
async function useTemplate(templateId) {
  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) return;

  // Send template to content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'insertTemplate',
      template: template.prompt
    });
  });

  window.close();
}

// Trigger prompt enhancement
function triggerEnhancement() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'enhancePrompt',
      userProfile: state.userProfile
    });
  });
  window.close();
}

// Update tip
function updateTip() {
  const tipIndex = Math.floor(Math.random() * TIPS.length);
  document.getElementById('tipText').textContent = TIPS[tipIndex];
}

// Populate settings
function populateSettings() {
  document.getElementById('settingsRole').value = state.userProfile.role;
  document.getElementById('settingsIndustry').value = state.userProfile.industry;
  document.getElementById('autoEnhance').checked = state.settings.autoEnhance;
  document.getElementById('showWidget').checked = state.settings.showWidget;
}

// Save settings
async function saveSettings() {
  state.userProfile.role = document.getElementById('settingsRole').value;
  state.userProfile.industry = document.getElementById('settingsIndustry').value;
  state.settings.autoEnhance = document.getElementById('autoEnhance').checked;
  state.settings.showWidget = document.getElementById('showWidget').checked;
  await saveState();
  
  // Notify content scripts of settings change
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        action: 'settingsUpdated',
        settings: state.settings
      }).catch(() => {});
    });
  });
}

// Render history
function renderHistory() {
  const container = document.getElementById('historyList');
  
  if (state.history.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <p>No prompt history yet</p>
        <span>Enhanced prompts will appear here</span>
      </div>
    `;
    return;
  }

  container.innerHTML = state.history.slice(0, 20).map(item => `
    <div class="history-item" data-prompt="${encodeURIComponent(item.enhanced)}">
      <div class="history-header">
        <span class="history-platform">${item.platform}</span>
        <span class="history-date">${formatDate(item.date)}</span>
      </div>
      <div class="history-preview">${item.original.substring(0, 100)}${item.original.length > 100 ? '...' : ''}</div>
    </div>
  `).join('');

  // Add click handlers to reuse prompts
  container.querySelectorAll('.history-item').forEach(item => {
    item.addEventListener('click', () => {
      const prompt = decodeURIComponent(item.dataset.prompt);
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'insertTemplate',
          template: prompt
        });
      });
      window.close();
    });
  });
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString();
}
