// ===== Whisper AI Popup Script =====

// Template Data
const TEMPLATES = [
  { id: 1, name: 'Code Review', emoji: '🔍', category: 'coding', prompt: 'Review the following code for bugs, performance issues, and best practices. Provide specific suggestions for improvement:\n\n[CODE]\n\nPlease structure your review as:\n1. Critical Issues\n2. Performance Concerns\n3. Best Practice Recommendations\n4. Overall Assessment' },
  { id: 2, name: 'Debug Helper', emoji: '🐛', category: 'coding', prompt: 'I\'m encountering the following error:\n\n[ERROR MESSAGE]\n\nIn this code:\n\n[CODE]\n\nPlease:\n1. Explain what\'s causing this error\n2. Provide a step-by-step fix\n3. Suggest how to prevent similar issues' },
  { id: 3, name: 'Explain Like I\'m 5', emoji: '🧒', category: 'writing', prompt: 'Explain [CONCEPT] in simple terms that a beginner would understand. Use analogies and real-world examples. Avoid jargon. Structure your explanation as:\n1. Simple definition\n2. Real-world analogy\n3. Why it matters\n4. Quick example' },
  { id: 4, name: 'Blog Post Outline', emoji: '📝', category: 'writing', prompt: 'Create a comprehensive blog post outline about [TOPIC]. Target audience: [AUDIENCE]. Include:\n1. Attention-grabbing headline options (3)\n2. Hook/Introduction\n3. Main sections with key points\n4. Conclusion with CTA\n5. SEO keywords to target' },
  { id: 5, name: 'Data Analysis', emoji: '📊', category: 'analysis', prompt: 'Analyze the following data/metrics:\n\n[DATA]\n\nProvide:\n1. Key insights and patterns\n2. Anomalies or concerns\n3. Actionable recommendations\n4. Suggested next steps for deeper analysis' },
  { id: 6, name: 'SWOT Analysis', emoji: '🎯', category: 'analysis', prompt: 'Perform a SWOT analysis for [SUBJECT]. Be specific and actionable:\n\nStrengths: Internal positive attributes\nWeaknesses: Internal areas for improvement\nOpportunities: External factors to leverage\nThreats: External risks to mitigate\n\nConclude with strategic recommendations.' },
  { id: 7, name: 'Creative Story', emoji: '✨', category: 'creative', prompt: 'Write a creative [GENRE] story about [TOPIC/THEME]. Include:\n- Compelling characters with distinct voices\n- A clear narrative arc\n- Vivid sensory details\n- Unexpected twist or insight\n\nTone: [TONE]\nLength: [LENGTH]' },
  { id: 8, name: 'Product Description', emoji: '🛍️', category: 'creative', prompt: 'Write a compelling product description for [PRODUCT]. Target customer: [CUSTOMER PROFILE].\n\nInclude:\n1. Attention-grabbing headline\n2. Key benefits (not just features)\n3. Emotional appeal\n4. Social proof suggestion\n5. Clear call-to-action' },
  { id: 9, name: 'Email Draft', emoji: '📧', category: 'writing', prompt: 'Write a professional email for [PURPOSE]. Context: [CONTEXT]\n\nTone: [FORMAL/CASUAL/FRIENDLY]\nKey points to convey:\n- [POINT 1]\n- [POINT 2]\n\nInclude a clear subject line and call-to-action.' },
  { id: 10, name: 'API Documentation', emoji: '📚', category: 'coding', prompt: 'Create comprehensive API documentation for the following endpoint/function:\n\n[CODE/SPEC]\n\nInclude:\n1. Description and purpose\n2. Parameters with types and descriptions\n3. Return values\n4. Example requests/responses\n5. Error handling\n6. Usage examples' },
  { id: 11, name: 'Meeting Summary', emoji: '📋', category: 'analysis', prompt: 'Summarize the following meeting notes/transcript:\n\n[NOTES]\n\nProvide:\n1. Key Decisions Made\n2. Action Items (with owners if mentioned)\n3. Open Questions\n4. Next Steps\n5. Follow-up Required' },
  { id: 12, name: 'Brainstorm Ideas', emoji: '💡', category: 'creative', prompt: 'Generate creative ideas for [TOPIC/CHALLENGE]. Context: [CONTEXT]\n\nProvide 10 diverse ideas ranging from:\n- Safe/conventional approaches\n- Innovative middle-ground options  \n- Bold/unconventional ideas\n\nFor each idea, include a brief rationale and potential challenges.' }
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
  onboarding: document.getElementById('onboardingScreen'),
  main: document.getElementById('mainScreen'),
  templates: document.getElementById('templatesScreen'),
  settings: document.getElementById('settingsScreen'),
  history: document.getElementById('historyScreen')
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadState();
  initializeUI();
  setupEventListeners();
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
  if (state.isOnboarded) {
    showScreen('main');
    updateMainScreen();
  } else {
    showScreen('onboarding');
  }
  renderTemplates();
  updateTip();
}

// Show specific screen
function showScreen(screenName) {
  Object.values(screens).forEach(screen => screen.classList.add('hidden'));
  screens[screenName].classList.remove('hidden');
}

// Setup event listeners
function setupEventListeners() {
  // Onboarding navigation
  document.getElementById('nextStep1').addEventListener('click', () => {
    const role = document.getElementById('userRole').value;
    if (role) {
      state.userProfile.role = role;
      document.getElementById('step1').classList.add('hidden');
      document.getElementById('step2').classList.remove('hidden');
    }
  });

  document.getElementById('backStep2').addEventListener('click', () => {
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step1').classList.remove('hidden');
  });

  document.getElementById('finishSetup').addEventListener('click', async () => {
    const industry = document.getElementById('userIndustry').value;
    if (industry) {
      state.userProfile.industry = industry;
      state.isOnboarded = true;
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
        userProfile: { role: '', industry: '' },
        settings: { autoEnhance: true, showWidget: true },
        history: []
      };
      await saveState();
      showScreen('onboarding');
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
