// ===== Whisper AI Popup Script =====

// Simplified Template Data with fill-in fields
const TEMPLATES = [
  // ===== CODING =====
  { 
    id: 1, 
    name: 'Code Review', 
    emoji: '🔍', 
    category: 'coding',
    description: 'Get feedback on your code',
    fields: [
      { id: 'code', label: 'Paste your code', type: 'textarea', placeholder: 'function example() { ... }', required: true },
      { id: 'language', label: 'Programming language', type: 'text', placeholder: 'JavaScript, Python, etc.', required: false },
      { id: 'focus', label: 'What to focus on?', type: 'text', placeholder: 'security, performance, readability', required: false }
    ],
    buildPrompt: (values) => `Review this ${values.language || ''} code${values.focus ? ` focusing on ${values.focus}` : ''}:

\`\`\`
${values.code}
\`\`\`

Please provide:
• Critical issues that need fixing
• Suggestions for improvement
• Overall code quality assessment`
  },
  { 
    id: 2, 
    name: 'Fix This Bug', 
    emoji: '🐛', 
    category: 'coding',
    description: 'Debug and fix errors',
    fields: [
      { id: 'error', label: 'Error message', type: 'textarea', placeholder: 'TypeError: Cannot read property...', required: true },
      { id: 'code', label: 'Your code', type: 'textarea', placeholder: 'Paste the code causing the error', required: true },
      { id: 'expected', label: 'What should happen?', type: 'text', placeholder: 'It should return a list of users', required: false }
    ],
    buildPrompt: (values) => `I'm getting this error:
\`\`\`
${values.error}
\`\`\`

In this code:
\`\`\`
${values.code}
\`\`\`
${values.expected ? `\nExpected: ${values.expected}` : ''}

Please:
1. Explain what's causing this error
2. Show me the fixed code
3. Explain why the fix works`
  },
  { 
    id: 3, 
    name: 'Write Code', 
    emoji: '💻', 
    category: 'coding',
    description: 'Generate code from description',
    fields: [
      { id: 'task', label: 'What should the code do?', type: 'textarea', placeholder: 'Create a function that validates email addresses', required: true },
      { id: 'language', label: 'Programming language', type: 'text', placeholder: 'JavaScript', required: true },
      { id: 'requirements', label: 'Any specific requirements?', type: 'text', placeholder: 'Must handle edge cases, include tests', required: false }
    ],
    buildPrompt: (values) => `Write ${values.language} code that: ${values.task}
${values.requirements ? `\nRequirements: ${values.requirements}` : ''}

Please provide:
• Complete, working code with comments
• Example usage
• Brief explanation of how it works`
  },

  // ===== WRITING =====
  { 
    id: 4, 
    name: 'Write Email', 
    emoji: '📧', 
    category: 'writing',
    description: 'Compose professional emails',
    fields: [
      { id: 'purpose', label: 'Purpose of email', type: 'text', placeholder: 'Request a meeting, follow up on proposal', required: true },
      { id: 'recipient', label: 'Who is it for?', type: 'text', placeholder: 'My manager, a client, job recruiter', required: true },
      { id: 'tone', label: 'Tone', type: 'text', placeholder: 'Professional, friendly, formal', required: false },
      { id: 'keypoints', label: 'Key points to include', type: 'textarea', placeholder: 'Mention the deadline, ask about budget', required: false }
    ],
    buildPrompt: (values) => `Write an email to ${values.recipient} for: ${values.purpose}
${values.tone ? `Tone: ${values.tone}` : ''}
${values.keypoints ? `\nKey points:\n${values.keypoints}` : ''}

Please provide:
• Subject line options
• Complete email body
• Keep it concise and professional`
  },
  { 
    id: 5, 
    name: 'Blog Post', 
    emoji: '📝', 
    category: 'writing',
    description: 'Create engaging blog content',
    fields: [
      { id: 'topic', label: 'Topic', type: 'text', placeholder: '5 Tips for Better Sleep', required: true },
      { id: 'audience', label: 'Target audience', type: 'text', placeholder: 'busy professionals, students', required: false },
      { id: 'length', label: 'Approximate length', type: 'text', placeholder: '500 words, 1000 words', required: false }
    ],
    buildPrompt: (values) => `Write a blog post about: ${values.topic}
${values.audience ? `Target audience: ${values.audience}` : ''}
${values.length ? `Length: approximately ${values.length}` : ''}

Include:
• Catchy headline
• Engaging introduction
• Main content with subheadings
• Conclusion with takeaway`
  },
  { 
    id: 6, 
    name: 'Explain Simply', 
    emoji: '💡', 
    category: 'writing',
    description: 'Explain complex topics simply',
    fields: [
      { id: 'concept', label: 'What to explain?', type: 'text', placeholder: 'Machine learning, blockchain, API', required: true },
      { id: 'audience', label: 'Explain it like I\'m...', type: 'text', placeholder: 'a beginner, 10 years old, my grandma', required: false }
    ],
    buildPrompt: (values) => `Explain "${values.concept}" ${values.audience ? `like I'm ${values.audience}` : 'in simple terms'}.

Use:
• A simple one-sentence definition
• A real-world analogy
• A practical example
• Why it matters`
  },

  // ===== ANALYSIS =====
  { 
    id: 7, 
    name: 'Analyze Data', 
    emoji: '📊', 
    category: 'analysis',
    description: 'Get insights from your data',
    fields: [
      { id: 'data', label: 'Your data', type: 'textarea', placeholder: 'Paste numbers, CSV, or describe your data', required: true },
      { id: 'goal', label: 'What do you want to learn?', type: 'text', placeholder: 'Find trends, identify problems', required: false }
    ],
    buildPrompt: (values) => `Analyze this data:
${values.data}
${values.goal ? `\nGoal: ${values.goal}` : ''}

Please provide:
• Key insights and patterns
• Notable findings
• Actionable recommendations`
  },
  { 
    id: 8, 
    name: 'Summarize', 
    emoji: '📋', 
    category: 'analysis',
    description: 'Summarize long content',
    fields: [
      { id: 'content', label: 'Content to summarize', type: 'textarea', placeholder: 'Paste article, meeting notes, or document', required: true },
      { id: 'format', label: 'Summary format', type: 'text', placeholder: 'bullet points, one paragraph', required: false }
    ],
    buildPrompt: (values) => `Summarize this content${values.format ? ` as ${values.format}` : ''}:

${values.content}

Include:
• Main points
• Key takeaways
• Any action items mentioned`
  },
  { 
    id: 9, 
    name: 'Compare Options', 
    emoji: '⚖️', 
    category: 'analysis',
    description: 'Compare choices pros/cons',
    fields: [
      { id: 'options', label: 'Options to compare', type: 'textarea', placeholder: 'Option A: React\nOption B: Vue\nOption C: Angular', required: true },
      { id: 'criteria', label: 'What matters most?', type: 'text', placeholder: 'cost, ease of use, scalability', required: false }
    ],
    buildPrompt: (values) => `Compare these options:
${values.options}
${values.criteria ? `\nEvaluate based on: ${values.criteria}` : ''}

Please provide:
• Pros and cons for each
• Comparison table
• Recommendation with reasoning`
  },

  // ===== CREATIVE =====
  { 
    id: 10, 
    name: 'Brainstorm Ideas', 
    emoji: '🧠', 
    category: 'creative',
    description: 'Generate creative ideas',
    fields: [
      { id: 'challenge', label: 'What do you need ideas for?', type: 'textarea', placeholder: 'Marketing campaign for a new app, birthday gift ideas', required: true },
      { id: 'constraints', label: 'Any constraints?', type: 'text', placeholder: 'low budget, needs to be quick', required: false }
    ],
    buildPrompt: (values) => `Brainstorm ideas for: ${values.challenge}
${values.constraints ? `Constraints: ${values.constraints}` : ''}

Please provide:
• 10 diverse ideas ranging from safe to bold
• Brief explanation for each
• Your top 3 recommendations`
  },
  { 
    id: 11, 
    name: 'Product Copy', 
    emoji: '🛍️', 
    category: 'creative',
    description: 'Write compelling product descriptions',
    fields: [
      { id: 'product', label: 'Product name & description', type: 'textarea', placeholder: 'Wireless earbuds with 24-hour battery', required: true },
      { id: 'audience', label: 'Target customer', type: 'text', placeholder: 'fitness enthusiasts, commuters', required: false },
      { id: 'features', label: 'Key features', type: 'text', placeholder: 'waterproof, noise canceling', required: false }
    ],
    buildPrompt: (values) => `Write product copy for: ${values.product}
${values.audience ? `Target customer: ${values.audience}` : ''}
${values.features ? `Key features: ${values.features}` : ''}

Please provide:
• 3 headline options
• Short description (50 words)
• Full description highlighting benefits
• Call-to-action`
  },
  { 
    id: 12, 
    name: 'Social Post', 
    emoji: '📱', 
    category: 'creative',
    description: 'Create social media content',
    fields: [
      { id: 'topic', label: 'What\'s the post about?', type: 'textarea', placeholder: 'Launching a new feature, sharing a tip', required: true },
      { id: 'platform', label: 'Platform', type: 'text', placeholder: 'Twitter, LinkedIn, Instagram', required: false },
      { id: 'goal', label: 'Goal', type: 'text', placeholder: 'engagement, awareness, drive traffic', required: false }
    ],
    buildPrompt: (values) => `Write a ${values.platform || 'social media'} post about: ${values.topic}
${values.goal ? `Goal: ${values.goal}` : ''}

Please provide:
• 3 post variations
• Relevant hashtag suggestions
• Best posting tips`
  }
];

const TIPS = [
  "Fill in the required fields and click 'Create Prompt' to generate your enhanced prompt.",
  "The more details you provide, the better your results will be.",
  "You can use templates as a starting point and customize them.",
  "Click the Enhance button on AI platforms to improve any prompt.",
  "Your role and industry settings help personalize suggestions."
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
    showWidget: true,
    simpleMode: true
  },
  history: []
};

let selectedTemplate = null;

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

// Show walkthrough step
function showWalkthroughStep(step) {
  currentWalkthroughStep = step;
  
  document.querySelectorAll('.walkthrough-step').forEach(s => {
    s.classList.remove('active');
  });
  
  const currentStep = document.querySelector(`.walkthrough-step[data-step="${step}"]`);
  if (currentStep) {
    currentStep.classList.add('active');
  }
  
  if (step === 6 && state.userProfile.role) {
    document.getElementById('walkthroughRole').value = state.userProfile.role;
    document.getElementById('walkthroughIndustry').value = state.userProfile.industry;
  }
}

// Skip walkthrough
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

// Finish walkthrough
async function finishWalkthrough() {
  const role = document.getElementById('walkthroughRole').value;
  const industry = document.getElementById('walkthroughIndustry').value;
  
  if (!role || !industry) {
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
    selectedTemplate = null;
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
        settings: { autoEnhance: true, showWidget: true, simpleMode: true },
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

// Render templates in main screen (quick access)
function renderTemplates() {
  const container = document.getElementById('templatesList');
  const popularTemplates = TEMPLATES.slice(0, 3);
  
  container.innerHTML = popularTemplates.map(template => `
    <div class="template-item" data-id="${template.id}">
      <div class="template-emoji">${template.emoji}</div>
      <div class="template-info">
        <div class="template-name">${template.name}</div>
        <div class="template-category">${template.description}</div>
      </div>
      <svg class="template-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </div>
  `).join('');

  container.querySelectorAll('.template-item').forEach(item => {
    item.addEventListener('click', () => {
      showScreen('templates');
      showTemplateWizard(parseInt(item.dataset.id));
    });
  });
}

// Render full templates list with cards
function renderFullTemplates(category) {
  const container = document.getElementById('templatesGrid');
  const filtered = category === 'all' 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === category);
  
  // Check if we're in wizard mode
  if (selectedTemplate) {
    renderTemplateWizard(container);
    return;
  }
  
  container.innerHTML = `
    <div class="template-cards">
      ${filtered.map(template => `
        <div class="template-card" data-id="${template.id}">
          <div class="template-card-header">
            <span class="template-card-emoji">${template.emoji}</span>
            <span class="template-card-name">${template.name}</span>
          </div>
          <div class="template-card-desc">${template.description}</div>
          <span class="template-card-tag">${template.category}</span>
        </div>
      `).join('')}
    </div>
  `;

  container.querySelectorAll('.template-card').forEach(item => {
    item.addEventListener('click', () => showTemplateWizard(parseInt(item.dataset.id)));
  });
}

// Show template wizard
function showTemplateWizard(templateId) {
  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) return;
  
  selectedTemplate = template;
  const container = document.getElementById('templatesGrid');
  renderTemplateWizard(container);
}

// Render template wizard
function renderTemplateWizard(container) {
  const template = selectedTemplate;
  
  container.innerHTML = `
    <div class="template-wizard">
      <div class="wizard-header">
        <button class="wizard-back" id="wizardBack">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <div class="wizard-title-group">
          <div class="wizard-emoji">${template.emoji}</div>
          <div class="wizard-title">${template.name}</div>
          <div class="wizard-subtitle">${template.description}</div>
        </div>
      </div>
      
      <div class="wizard-fields">
        ${template.fields.map(field => `
          <div class="wizard-field">
            <label for="field-${field.id}">
              ${field.label}
              ${field.required ? '<span class="required">*</span>' : ''}
            </label>
            ${field.type === 'textarea' 
              ? `<textarea id="field-${field.id}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''}></textarea>`
              : `<input type="text" id="field-${field.id}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''}/>`
            }
          </div>
        `).join('')}
      </div>
      
      <div class="wizard-actions">
        <button class="btn btn-secondary" id="wizardCancel">Cancel</button>
        <button class="btn btn-primary" id="wizardCreate">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          Create Prompt
        </button>
      </div>
    </div>
  `;
  
  // Event listeners
  container.querySelector('#wizardBack').addEventListener('click', () => {
    selectedTemplate = null;
    renderFullTemplates('all');
  });
  
  container.querySelector('#wizardCancel').addEventListener('click', () => {
    selectedTemplate = null;
    showScreen('main');
  });
  
  container.querySelector('#wizardCreate').addEventListener('click', () => {
    createPromptFromWizard(template);
  });
}

// Create prompt from wizard
function createPromptFromWizard(template) {
  const values = {};
  let isValid = true;
  
  template.fields.forEach(field => {
    const input = document.getElementById(`field-${field.id}`);
    values[field.id] = input.value.trim();
    
    if (field.required && !values[field.id]) {
      input.style.borderColor = '#EF4444';
      isValid = false;
    } else {
      input.style.borderColor = '';
    }
  });
  
  if (!isValid) return;
  
  const prompt = template.buildPrompt(values);
  showPromptResult(prompt, template);
}

// Show prompt result
function showPromptResult(prompt, template) {
  const container = document.getElementById('templatesGrid');
  
  container.innerHTML = `
    <div class="result-simple">
      <div class="result-header">
        <div class="result-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div>
          <div class="result-title">Prompt Ready! ✨</div>
          <div class="result-subtitle">Your ${template.name} prompt is ready to use</div>
        </div>
      </div>
      
      <div class="result-improvements">
        <span class="result-tag">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Clear structure
        </span>
        <span class="result-tag">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Specific request
        </span>
        <span class="result-tag">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Output format
        </span>
      </div>
      
      <div class="result-prompt">
        <div class="result-prompt-text">${escapeHtml(prompt)}</div>
      </div>
      
      <div class="result-actions">
        <button class="btn btn-secondary" id="resultBack">Back</button>
        <button class="btn btn-secondary btn-copy" id="resultCopy">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy
        </button>
        <button class="btn btn-primary" id="resultUse">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          Use Prompt
        </button>
      </div>
    </div>
  `;
  
  container.querySelector('#resultBack').addEventListener('click', () => {
    showTemplateWizard(template.id);
  });
  
  container.querySelector('#resultCopy').addEventListener('click', (e) => {
    navigator.clipboard.writeText(prompt);
    const btn = e.currentTarget;
    btn.classList.add('copied');
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Copied!
    `;
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Copy
      `;
    }, 2000);
  });
  
  container.querySelector('#resultUse').addEventListener('click', () => {
    // Send to active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'insertTemplate',
        template: prompt
      });
    });
    window.close();
  });
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
  
  // Notify content scripts
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

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML.replace(/\n/g, '<br>');
}
