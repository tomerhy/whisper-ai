// ===== Whisper AI Popup Script - Super Simple =====

// Quick-start templates - just starting points that users can edit
const QUICK_TEMPLATES = [
  { emoji: '🔍', name: 'Review Code', prompt: 'Review this code and tell me what to improve:\n\n' },
  { emoji: '🐛', name: 'Fix Bug', prompt: 'Help me fix this error:\n\n' },
  { emoji: '💻', name: 'Write Code', prompt: 'Write code that ' },
  { emoji: '📧', name: 'Write Email', prompt: 'Write an email to ' },
  { emoji: '📝', name: 'Blog Post', prompt: 'Write a blog post about ' },
  { emoji: '💡', name: 'Explain', prompt: 'Explain in simple terms: ' },
  { emoji: '📊', name: 'Analyze', prompt: 'Analyze this and give me insights:\n\n' },
  { emoji: '📋', name: 'Summarize', prompt: 'Summarize the key points:\n\n' },
  { emoji: '⚖️', name: 'Compare', prompt: 'Compare these options and recommend one:\n\n' },
  { emoji: '🧠', name: 'Ideas', prompt: 'Give me creative ideas for ' },
  { emoji: '🛍️', name: 'Product Copy', prompt: 'Write compelling copy for this product: ' },
  { emoji: '📱', name: 'Social Post', prompt: 'Write a social media post about ' }
];

const TIPS = [
  "Type your prompt, click Enhance, and get better results instantly!",
  "The plugin automatically adds structure, context, and clarity.",
  "Click any template to start quickly, then customize it.",
  "Works on ChatGPT, Claude, Gemini, and Grok.",
  "Your role setting helps personalize suggestions."
];

// State
let state = {
  isOnboarded: false,
  hasSeenWalkthrough: false,
  userProfile: { role: '', industry: '' },
  settings: { autoEnhance: true, showWidget: true },
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

let currentWalkthroughStep = 1;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadState();
  initializeUI();
  setupEventListeners();
  setupWalkthroughListeners();
  detectCurrentPlatform();
});

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

async function saveState() {
  return new Promise((resolve) => {
    chrome.storage.local.set({ whisperState: state }, resolve);
  });
}

function initializeUI() {
  if (!state.isOnboarded || !state.hasSeenWalkthrough) {
    showScreen('walkthrough');
    showWalkthroughStep(1);
  } else {
    showScreen('main');
    updateMainScreen();
  }
  renderQuickTemplates();
  updateTip();
}

function showScreen(screenName) {
  Object.values(screens).forEach(screen => screen.classList.add('hidden'));
  screens[screenName].classList.remove('hidden');
}

// Walkthrough
function setupWalkthroughListeners() {
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
  document.getElementById('watchTutorialBtn')?.addEventListener('click', () => {
    showScreen('walkthrough');
    showWalkthroughStep(1);
  });
}

function showWalkthroughStep(step) {
  currentWalkthroughStep = step;
  document.querySelectorAll('.walkthrough-step').forEach(s => s.classList.remove('active'));
  document.querySelector(`.walkthrough-step[data-step="${step}"]`)?.classList.add('active');
  
  if (step === 6 && state.userProfile.role) {
    document.getElementById('walkthroughRole').value = state.userProfile.role;
    document.getElementById('walkthroughIndustry').value = state.userProfile.industry;
  }
}

async function skipWalkthrough() {
  if (!state.isOnboarded) {
    showWalkthroughStep(6);
  } else {
    state.hasSeenWalkthrough = true;
    await saveState();
    showScreen('main');
    updateMainScreen();
  }
}

async function finishWalkthrough() {
  const role = document.getElementById('walkthroughRole').value;
  const industry = document.getElementById('walkthroughIndustry').value;
  
  if (!role || !industry) {
    if (!role) document.getElementById('walkthroughRole').style.borderColor = '#EF4444';
    if (!industry) document.getElementById('walkthroughIndustry').style.borderColor = '#EF4444';
    return;
  }
  
  state.userProfile = { role, industry };
  state.isOnboarded = true;
  state.hasSeenWalkthrough = true;
  await saveState();
  showScreen('main');
  updateMainScreen();
}

// Event Listeners
function setupEventListeners() {
  document.getElementById('settingsBtn').addEventListener('click', () => {
    populateSettings();
    showScreen('settings');
  });

  document.getElementById('enhanceBtn').addEventListener('click', triggerEnhancement);
  
  document.getElementById('templatesBtn').addEventListener('click', () => {
    showScreen('templates');
    renderFullTemplates();
  });

  document.getElementById('historyBtn').addEventListener('click', () => {
    showScreen('history');
    renderHistory();
  });

  document.getElementById('seeAllTemplates').addEventListener('click', () => {
    showScreen('templates');
    renderFullTemplates();
  });

  document.getElementById('backFromTemplates').addEventListener('click', () => showScreen('main'));
  document.getElementById('backFromSettings').addEventListener('click', async () => {
    await saveSettings();
    showScreen('main');
  });
  document.getElementById('backFromHistory').addEventListener('click', () => showScreen('main'));

  document.getElementById('resetBtn').addEventListener('click', async () => {
    if (confirm('Reset all data?')) {
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

  document.querySelectorAll('.platform-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      const urls = {
        chatgpt: 'https://chatgpt.com',
        claude: 'https://claude.ai',
        gemini: 'https://gemini.google.com',
        grok: 'https://grok.com'
      };
      if (urls[icon.dataset.platform]) {
        chrome.tabs.create({ url: urls[icon.dataset.platform] });
      }
    });
  });
}

function updateMainScreen() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0]?.url || '';
    document.querySelectorAll('.platform-icon').forEach(icon => icon.classList.remove('active'));
    
    if (url.includes('chatgpt.com') || url.includes('chat.openai.com')) {
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

function detectCurrentPlatform() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0]?.url || '';
    let platform = 'Not on AI platform';
    
    if (url.includes('chatgpt.com') || url.includes('chat.openai.com')) platform = 'ChatGPT';
    else if (url.includes('claude.ai')) platform = 'Claude';
    else if (url.includes('gemini.google.com')) platform = 'Gemini';
    else if (url.includes('grok.com') || url.includes('x.com/i/grok')) platform = 'Grok';
    
    document.getElementById('currentPlatform').textContent = platform;
    updateMainScreen();
  });
}

// Render quick templates (main screen - show 3)
function renderQuickTemplates() {
  const container = document.getElementById('templatesList');
  container.innerHTML = QUICK_TEMPLATES.slice(0, 3).map((t, i) => `
    <div class="template-item" data-index="${i}">
      <div class="template-emoji">${t.emoji}</div>
      <div class="template-info">
        <div class="template-name">${t.name}</div>
        <div class="template-category">Quick start</div>
      </div>
      <svg class="template-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </div>
  `).join('');

  container.querySelectorAll('.template-item').forEach(item => {
    item.addEventListener('click', () => useQuickTemplate(parseInt(item.dataset.index)));
  });
}

// Render all templates
function renderFullTemplates() {
  const container = document.getElementById('templatesGrid');
  container.innerHTML = QUICK_TEMPLATES.map((t, i) => `
    <div class="template-item" data-index="${i}">
      <div class="template-emoji">${t.emoji}</div>
      <div class="template-info">
        <div class="template-name">${t.name}</div>
        <div class="template-category">Click to use</div>
      </div>
      <svg class="template-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </div>
  `).join('');

  container.querySelectorAll('.template-item').forEach(item => {
    item.addEventListener('click', () => useQuickTemplate(parseInt(item.dataset.index)));
  });
}

// Use a quick template - insert and close
function useQuickTemplate(index) {
  const template = QUICK_TEMPLATES[index];
  if (!template) return;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'insertTemplate',
      template: template.prompt
    });
  });
  window.close();
}

// Trigger enhancement on current prompt
function triggerEnhancement() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'enhancePrompt',
      userProfile: state.userProfile
    });
  });
  window.close();
}

function updateTip() {
  document.getElementById('tipText').textContent = TIPS[Math.floor(Math.random() * TIPS.length)];
}

function populateSettings() {
  document.getElementById('settingsRole').value = state.userProfile.role;
  document.getElementById('settingsIndustry').value = state.userProfile.industry;
  document.getElementById('autoEnhance').checked = state.settings.autoEnhance;
  document.getElementById('showWidget').checked = state.settings.showWidget;
}

async function saveSettings() {
  state.userProfile.role = document.getElementById('settingsRole').value;
  state.userProfile.industry = document.getElementById('settingsIndustry').value;
  state.settings.autoEnhance = document.getElementById('autoEnhance').checked;
  state.settings.showWidget = document.getElementById('showWidget').checked;
  await saveState();
  
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        action: 'settingsUpdated',
        settings: state.settings
      }).catch(() => {});
    });
  });
}

function renderHistory() {
  const container = document.getElementById('historyList');
  
  if (!state.history.length) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <p>No history yet</p>
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
      <div class="history-preview">${item.original.substring(0, 80)}${item.original.length > 80 ? '...' : ''}</div>
    </div>
  `).join('');

  container.querySelectorAll('.history-item').forEach(item => {
    item.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'insertTemplate',
          template: decodeURIComponent(item.dataset.prompt)
        });
      });
      window.close();
    });
  });
}

function formatDate(dateString) {
  const diff = Date.now() - new Date(dateString);
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(dateString).toLocaleDateString();
}
