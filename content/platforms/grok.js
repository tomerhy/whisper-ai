// ===== Whisper AI - Grok Content Script =====
// Uses the user's Grok/X session - no API key required!

(function() {
  'use strict';

  const PLATFORM = 'Grok';
  let widgetVisible = false;
  let currentPrompt = '';
  let enhancedPrompt = '';
  let settings = { autoEnhance: true, showWidget: true };
  let userProfile = { role: '', industry: '' };
  let isEnhancing = false;

  // Initialize
  init();

  function init() {
    console.log('Whisper AI initialized for Grok');
    loadSettings();
    createFloatingButton();
    observeTextarea();
    listenForMessages();
  }

  // Check if extension context is still valid
  function isExtensionContextValid() {
    try {
      return chrome.runtime && chrome.runtime.id;
    } catch (e) {
      return false;
    }
  }

  // Load settings from storage
  function loadSettings() {
    if (!isExtensionContextValid()) return;
    
    try {
      chrome.storage.local.get(['whisperState'], (result) => {
        if (chrome.runtime.lastError) {
          console.log('Could not load settings:', chrome.runtime.lastError);
          return;
        }
        if (result.whisperState) {
          settings = result.whisperState.settings || settings;
          userProfile = result.whisperState.userProfile || userProfile;
        }
      });
    } catch (e) {
      console.log('Could not load settings - extension may have been reloaded');
    }
  }

  // Create floating trigger button
  function createFloatingButton() {
    if (document.getElementById('whisper-trigger')) return;

    const button = document.createElement('button');
    button.id = 'whisper-trigger';
    button.className = 'whisper-trigger';
    button.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    `;
    button.title = 'Whisper AI - Enhance your prompt';
    button.addEventListener('click', toggleWidget);
    
    document.body.appendChild(button);
  }

  // Observe textarea for input
  function observeTextarea() {
    const observer = new MutationObserver(() => {
      const textarea = getTextarea();
      if (textarea && !textarea.dataset.whisperObserved) {
        textarea.dataset.whisperObserved = 'true';
        setupTextareaListeners(textarea);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Get Grok textarea/contenteditable
  function getTextarea() {
    // Grok on X.com and grok.com
    return document.querySelector('textarea[placeholder*="Ask"]') ||
           document.querySelector('textarea[data-testid="grok-composer"]') ||
           document.querySelector('div[contenteditable="true"][role="textbox"]') ||
           document.querySelector('textarea[aria-label*="message"]') ||
           document.querySelector('.grok-input textarea') ||
           document.querySelector('div[contenteditable="true"][data-placeholder]');
  }

  // Get the text content from textarea
  function getTextareaContent(textarea) {
    if (!textarea) return '';
    if (textarea.tagName === 'TEXTAREA') {
      return textarea.value;
    }
    return textarea.innerText || textarea.textContent || '';
  }

  // Set the text content in textarea
  function setTextareaContent(textarea, text) {
    if (!textarea) return;
    
    if (textarea.tagName === 'TEXTAREA') {
      textarea.value = text;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      
      // For React-based inputs
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(textarea, text);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    } else {
      textarea.innerHTML = `<p>${escapeHtml(text)}</p>`;
      textarea.dispatchEvent(new InputEvent('input', { bubbles: true }));
    }
    
    textarea.focus();
  }

  // Setup textarea listeners
  function setupTextareaListeners(textarea) {
    let debounceTimer;

    const handleInput = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const text = getTextareaContent(textarea);
        if (text.length > 20 && settings.autoEnhance && !isEnhancing) {
          showQuickEnhanceButton(textarea);
        } else {
          hideQuickEnhanceButton();
        }
      }, 500);
    };

    textarea.addEventListener('input', handleInput);
    textarea.addEventListener('keyup', handleInput);
  }

  // Show quick enhance button near textarea
  function showQuickEnhanceButton(textarea) {
    if (!settings.showWidget) return;
    
    let btn = document.getElementById('whisper-quick-enhance');
    
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'whisper-quick-enhance';
      btn.className = 'whisper-quick-enhance';
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
        Enhance with Whisper
      `;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        enhanceCurrentPrompt();
      });
      document.body.appendChild(btn);
    }

    const rect = textarea.getBoundingClientRect();
    btn.style.position = 'fixed';
    btn.style.bottom = `${window.innerHeight - rect.top + 8}px`;
    btn.style.right = `${window.innerWidth - rect.right + 8}px`;
    btn.classList.add('visible');
  }

  // Hide quick enhance button
  function hideQuickEnhanceButton() {
    const btn = document.getElementById('whisper-quick-enhance');
    if (btn) {
      btn.classList.remove('visible');
    }
  }

  // Toggle widget visibility
  function toggleWidget() {
    if (widgetVisible) {
      hideWidget();
    } else {
      const textarea = getTextarea();
      currentPrompt = getTextareaContent(textarea);
      if (currentPrompt.trim()) {
        showWidget('input');
      } else {
        showToast('Please enter a prompt first', 'error');
      }
    }
  }

  // Enhance current prompt
  function enhanceCurrentPrompt() {
    const textarea = getTextarea();
    currentPrompt = getTextareaContent(textarea);
    
    if (currentPrompt.trim()) {
      showWidget('input');
    }
  }

  // Show widget
  function showWidget(mode = 'input') {
    hideQuickEnhanceButton();
    
    let widget = document.getElementById('whisper-widget');
    
    if (!widget) {
      widget = document.createElement('div');
      widget.id = 'whisper-widget';
      widget.className = 'whisper-widget';
      document.body.appendChild(widget);
    }

    if (mode === 'input') {
      widget.innerHTML = getInputModeHTML();
    } else if (mode === 'loading') {
      widget.innerHTML = getLoadingHTML();
    } else if (mode === 'result') {
      widget.innerHTML = getResultHTML();
    }
    
    widget.classList.remove('hidden');
    widgetVisible = true;
    
    setupWidgetListeners();
  }

  // Get input mode HTML
  function getInputModeHTML() {
    return `
      <div class="whisper-header">
        <div class="whisper-logo">
          <div class="whisper-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <span class="whisper-logo-text">Whisper AI</span>
        </div>
        <button class="whisper-close" id="whisper-close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="whisper-content">
        <div class="whisper-section">
          <div class="whisper-section-header">
            <span class="whisper-section-title">Your Prompt</span>
          </div>
          <div class="whisper-prompt-box">${escapeHtml(currentPrompt)}</div>
        </div>
        
        <div class="whisper-info-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <span>Whisper will enhance your prompt using smart prompt engineering techniques.</span>
        </div>
        
        <div class="whisper-actions">
          <button class="whisper-btn whisper-btn-secondary" id="whisper-cancel">Cancel</button>
          <button class="whisper-btn whisper-btn-primary" id="whisper-enhance">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            Enhance Prompt
          </button>
        </div>
      </div>
    `;
  }

  // Get loading HTML
  function getLoadingHTML() {
    return `
      <div class="whisper-header">
        <div class="whisper-logo">
          <div class="whisper-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <span class="whisper-logo-text">Whisper AI</span>
        </div>
        <button class="whisper-close" id="whisper-close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="whisper-content">
        <div class="whisper-loading">
          <div class="whisper-spinner"></div>
          <span class="whisper-loading-text">Enhancing your prompt...</span>
        </div>
      </div>
    `;
  }

  // Get result HTML
  function getResultHTML() {
    const improvements = analyzeImprovements(currentPrompt, enhancedPrompt);
    
    return `
      <div class="whisper-header">
        <div class="whisper-logo">
          <div class="whisper-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <span class="whisper-logo-text">Whisper AI</span>
        </div>
        <button class="whisper-close" id="whisper-close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="whisper-content">
        <div class="whisper-section">
          <div class="whisper-section-header">
            <span class="whisper-section-title">Original</span>
          </div>
          <div class="whisper-prompt-box whisper-prompt-small">${escapeHtml(currentPrompt)}</div>
        </div>
        
        <div class="whisper-section">
          <div class="whisper-section-header">
            <span class="whisper-section-title">Enhanced</span>
            <span class="whisper-badge improved">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Improved
            </span>
          </div>
          <div class="whisper-prompt-box enhanced">${escapeHtml(enhancedPrompt)}</div>
          <div class="whisper-improvements">
            ${improvements.map(imp => `
              <span class="whisper-improvement-tag">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                ${imp}
              </span>
            `).join('')}
          </div>
        </div>
        
        <div class="whisper-actions">
          <button class="whisper-btn whisper-btn-secondary" id="whisper-cancel">Keep Original</button>
          <button class="whisper-btn whisper-btn-primary" id="whisper-apply">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Use Enhanced
          </button>
        </div>
      </div>
    `;
  }

  // Setup widget event listeners
  function setupWidgetListeners() {
    const widget = document.getElementById('whisper-widget');
    if (!widget) return;
    
    widget.querySelector('#whisper-close')?.addEventListener('click', hideWidget);
    widget.querySelector('#whisper-cancel')?.addEventListener('click', hideWidget);
    widget.querySelector('#whisper-enhance')?.addEventListener('click', startEnhancement);
    widget.querySelector('#whisper-apply')?.addEventListener('click', applyEnhancedPrompt);
  }

  // Start enhancement process
  async function startEnhancement() {
    showWidget('loading');
    isEnhancing = true;
    
    try {
      enhancedPrompt = await simulateEnhancement(currentPrompt, userProfile);
      showWidget('result');
      
      // Try to save to history if extension context is still valid
      if (isExtensionContextValid()) {
        try {
          chrome.runtime.sendMessage({
            action: 'saveHistory',
            data: {
              original: currentPrompt,
              enhanced: enhancedPrompt,
              platform: PLATFORM,
              date: new Date().toISOString()
            }
          });
        } catch (e) {
          console.log('Could not save to history - extension may have been reloaded');
        }
      }
      
    } catch (error) {
      console.error('Enhancement error:', error);
      
      if (error.message && error.message.includes('Extension context invalidated')) {
        showToast('Extension was updated. Please refresh the page.', 'error');
      } else {
        showToast('Enhancement failed. Please try again.', 'error');
      }
      hideWidget();
    }
    
    isEnhancing = false;
  }

  // Simulate enhancement (local enhancement logic)
  async function simulateEnhancement(prompt, profile) {
    const enhancements = [];
    let enhanced = prompt.trim();
    
    const roleContexts = {
      developer: 'As a software developer, ',
      marketer: 'From a marketing perspective, ',
      product: 'As a product manager, ',
      designer: 'From a design standpoint, ',
      writer: 'As a content creator, ',
      analyst: 'From an analytical perspective, ',
      student: 'As a student learning this topic, ',
      business: 'From a business perspective, '
    };
    
    if (profile.role && roleContexts[profile.role] && !enhanced.toLowerCase().includes('as a')) {
      enhanced = roleContexts[profile.role] + enhanced.charAt(0).toLowerCase() + enhanced.slice(1);
      enhancements.push('context');
    }
    
    if (!enhanced.includes('format') && !enhanced.includes('structure') && !enhanced.includes('list') && !enhanced.includes('steps')) {
      enhanced += '\n\nPlease structure your response clearly with headers or numbered points where appropriate.';
      enhancements.push('format');
    }
    
    if (prompt.length < 100 && !enhanced.includes('specific') && !enhanced.includes('detailed')) {
      enhanced += ' Be specific and provide concrete examples where relevant.';
      enhancements.push('specificity');
    }
    
    if (!enhanced.includes('actionable') && !enhanced.includes('practical') && !enhanced.includes('how to')) {
      enhanced += ' Focus on actionable and practical insights.';
      enhancements.push('actionable');
    }
    
    return enhanced;
  }

  // Hide widget
  function hideWidget() {
    const widget = document.getElementById('whisper-widget');
    if (widget) {
      widget.classList.add('hidden');
    }
    widgetVisible = false;
    isEnhancing = false;
  }

  // Analyze improvements made
  function analyzeImprovements(original, enhanced) {
    const improvements = [];
    
    if (enhanced.length > original.length * 1.2) {
      improvements.push('Added context');
    }
    if (enhanced.includes('format') || enhanced.includes('structure') || enhanced.includes('headers')) {
      improvements.push('Output format');
    }
    if (enhanced.includes('specific') || enhanced.includes('concrete') || enhanced.includes('examples')) {
      improvements.push('Specificity');
    }
    if (enhanced.includes('actionable') || enhanced.includes('practical')) {
      improvements.push('Actionable');
    }
    if (enhanced.includes('As a') || enhanced.includes('perspective')) {
      improvements.push('Role context');
    }
    
    if (improvements.length === 0) {
      improvements.push('Clarity');
      improvements.push('Structure');
    }
    
    return improvements.slice(0, 4);
  }

  // Apply enhanced prompt to textarea
  function applyEnhancedPrompt() {
    const textarea = getTextarea();
    if (!textarea || !enhancedPrompt) return;

    setTextareaContent(textarea, enhancedPrompt);
    textarea.focus();
    
    hideWidget();
    showToast('Enhanced prompt applied!', 'success');
  }

  // Show toast notification
  function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.whisper-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `whisper-toast ${type}`;
    toast.innerHTML = `
      <svg class="whisper-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${type === 'success' 
          ? '<polyline points="20 6 9 17 4 12"></polyline>'
          : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
        }
      </svg>
      <span class="whisper-toast-message">${message}</span>
    `;

    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Listen for messages from popup
  function listenForMessages() {
    if (!isExtensionContextValid()) return;
    
    try {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        try {
          if (request.action === 'insertTemplate') {
            insertTemplate(request.template);
            sendResponse({ success: true });
          }
          
          if (request.action === 'enhancePrompt') {
            if (request.userProfile) {
              userProfile = request.userProfile;
            }
            enhanceCurrentPrompt();
            sendResponse({ success: true });
          }
          
          if (request.action === 'settingsUpdated') {
            settings = request.settings;
            sendResponse({ success: true });
          }
        } catch (e) {
          console.log('Message handler error:', e);
        }
        
        return true;
      });
    } catch (e) {
      console.log('Could not setup message listener - extension may have been reloaded');
    }
  }

  // Insert template into textarea
  function insertTemplate(template) {
    const textarea = getTextarea();
    if (!textarea) return;

    setTextareaContent(textarea, template);
    textarea.focus();
    showToast('Template inserted!', 'success');
  }

  // Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
})();
