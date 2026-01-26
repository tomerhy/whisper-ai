// ===== Whisper AI - ChatGPT Content Script =====
// Uses the user's ChatGPT session - no API key required!

(function() {
  'use strict';

  const PLATFORM = 'ChatGPT';
  let widgetVisible = false;
  let currentPrompt = '';
  let enhancedPrompt = '';
  let settings = { autoEnhance: true, showWidget: true };
  let userProfile = { role: '', industry: '' };
  let isEnhancing = false;

  // Initialize
  init();

  function init() {
    console.log('Whisper AI initialized for ChatGPT');
    loadSettings();
    createFloatingButton();
    observeTextarea();
    listenForMessages();
    setupPositionUpdates();
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

  // Get ChatGPT textarea
  function getTextarea() {
    return document.querySelector('#prompt-textarea') ||
           document.querySelector('textarea[data-id="root"]') ||
           document.querySelector('textarea[placeholder*="Message"]') ||
           document.querySelector('div[contenteditable="true"][id="prompt-textarea"]');
  }

  // Get the text content from textarea
  function getTextareaContent(textarea) {
    if (!textarea) return '';
    if (textarea.tagName === 'TEXTAREA') {
      return textarea.value;
    }
    // For contenteditable divs
    return textarea.innerText || textarea.textContent || '';
  }

  // Set the text content in textarea
  function setTextareaContent(textarea, text) {
    if (!textarea) return;
    
    if (textarea.tagName === 'TEXTAREA') {
      textarea.value = text;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      // For contenteditable divs (ChatGPT uses ProseMirror-like editor)
      textarea.innerHTML = `<p>${escapeHtml(text)}</p>`;
      textarea.dispatchEvent(new InputEvent('input', { bubbles: true }));
    }
    
    // Trigger React's synthetic events
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
    if (nativeInputValueSetter && textarea.tagName === 'TEXTAREA') {
      nativeInputValueSetter.call(textarea, text);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
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
      }, 300);
    };

    // Listen for various events that might change content
    textarea.addEventListener('input', handleInput);
    textarea.addEventListener('keyup', handleInput);
    textarea.addEventListener('focus', handleInput);
    textarea.addEventListener('blur', () => {
      // Delay hiding to allow click on the button
      setTimeout(() => {
        const text = getTextareaContent(textarea);
        if (text.length <= 20) {
          hideQuickEnhanceButton();
        }
      }, 200);
    });
    
    // Also observe for content changes via mutation
    const observer = new MutationObserver(handleInput);
    observer.observe(textarea, { 
      childList: true, 
      subtree: true, 
      characterData: true 
    });
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
        Enhance
      `;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        enhanceCurrentPrompt();
      });
      document.body.appendChild(btn);
    }

    // Position button inside the textarea area (top-right corner)
    const rect = textarea.getBoundingClientRect();
    btn.style.position = 'fixed';
    btn.style.top = `${rect.top + 8}px`;
    btn.style.right = `${window.innerWidth - rect.right + 8}px`;
    btn.style.bottom = 'auto';
    btn.style.left = 'auto';
    btn.classList.add('visible');
  }

  // Update button position on scroll/resize
  function setupPositionUpdates() {
    let repositionTimer;
    const reposition = () => {
      clearTimeout(repositionTimer);
      repositionTimer = setTimeout(() => {
        const textarea = getTextarea();
        const text = getTextareaContent(textarea);
        if (textarea && text.length > 20 && settings.autoEnhance && !isEnhancing) {
          showQuickEnhanceButton(textarea);
        } else {
          hideQuickEnhanceButton();
        }
      }, 100);
    };
    
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
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
          <span>Whisper will use ChatGPT to enhance your prompt. This will send a message in a new chat.</span>
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
          <span class="whisper-loading-subtext">Using ChatGPT to improve your prompt</span>
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

  // Check if extension context is still valid
  function isExtensionContextValid() {
    try {
      return chrome.runtime && chrome.runtime.id;
    } catch (e) {
      return false;
    }
  }

  // Start enhancement process
  async function startEnhancement() {
    showWidget('loading');
    isEnhancing = true;
    
    try {
      // Enhance locally (no need for background script communication)
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
          // Extension was reloaded, ignore
          console.log('Could not save to history - extension may have been reloaded');
        }
      }
      
    } catch (error) {
      console.error('Enhancement error:', error);
      
      // Check if it's an extension context error
      if (error.message && error.message.includes('Extension context invalidated')) {
        showToast('Extension was updated. Please refresh the page.', 'error');
      } else {
        showToast('Enhancement failed. Please try again.', 'error');
      }
      hideWidget();
    }
    
    isEnhancing = false;
  }

  // Use the advanced WhisperEnhancer for prompt enhancement
  async function simulateEnhancement(prompt, profile) {
    // Use the advanced enhancer if available
    if (typeof WhisperEnhancer !== 'undefined') {
      return WhisperEnhancer.enhance(prompt, profile);
    }
    
    // Fallback to basic enhancement
    let enhanced = prompt.trim();
    
    if (profile.role && !enhanced.toLowerCase().includes('as a')) {
      const rolePrefix = {
        developer: 'As a software developer',
        marketer: 'From a marketing perspective',
        product: 'As a product manager',
        designer: 'From a design standpoint',
        writer: 'As a content creator',
        analyst: 'From an analytical perspective',
        student: 'As a student learning this topic',
        business: 'From a business perspective'
      };
      if (rolePrefix[profile.role]) {
        enhanced = `${rolePrefix[profile.role]}, ${enhanced.charAt(0).toLowerCase() + enhanced.slice(1)}`;
      }
    }
    
    enhanced += '\n\nPlease structure your response clearly with sections and examples. Be specific and actionable.';
    
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
    // Use the advanced enhancer if available
    if (typeof WhisperEnhancer !== 'undefined') {
      return WhisperEnhancer.getImprovements(original, enhanced);
    }
    
    // Fallback analysis
    const improvements = [];
    
    if (enhanced.length > original.length * 1.2) {
      improvements.push('Added context');
    }
    if (enhanced.includes('[FORMAT]') || enhanced.includes('structure')) {
      improvements.push('Output format');
    }
    if (enhanced.includes('[QUALITY]') || enhanced.includes('specific')) {
      improvements.push('Quality criteria');
    }
    if (enhanced.includes('[ROLE]') || enhanced.includes('As a')) {
      improvements.push('Role context');
    }
    
    if (improvements.length === 0) {
      improvements.push('Optimized structure');
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
