// ===== Whisper AI - Claude Content Script =====
// AIM Framework: Actor + Input + Mission = Better Results

(function() {
  'use strict';

  const PLATFORM = 'Claude';
  let widgetVisible = false;
  let currentPrompt = '';
  let enhancedPrompt = '';
  let aimBreakdown = null;
  let settings = { autoEnhance: true, showWidget: true };
  let userProfile = { role: '', industry: '' };
  let isEnhancing = false;

  init();

  function init() {
    console.log('Whisper AI initialized for Claude');
    loadSettings();
    createFloatingButton();
    observeTextarea();
    listenForMessages();
    setupPositionUpdates();
  }

  function loadSettings() {
    if (!isExtensionContextValid()) return;
    try {
      chrome.storage.local.get(['whisperState'], (result) => {
        if (chrome.runtime.lastError) return;
        if (result.whisperState) {
          settings = result.whisperState.settings || settings;
          userProfile = result.whisperState.userProfile || userProfile;
        }
      });
    } catch (e) {}
  }

  function createFloatingButton() {
    if (document.getElementById('whisper-trigger')) return;
    const button = document.createElement('button');
    button.id = 'whisper-trigger';
    button.className = 'whisper-trigger';
    button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
    button.title = 'Whisper AI - Sharpen your prompt';
    button.addEventListener('click', toggleWidget);
    document.body.appendChild(button);
  }

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

  function getTextarea() {
    return document.querySelector('[contenteditable="true"].ProseMirror') ||
           document.querySelector('div[contenteditable="true"][data-placeholder]') ||
           document.querySelector('fieldset div[contenteditable="true"]');
  }

  function getTextareaContent(textarea) {
    return textarea ? (textarea.innerText || textarea.textContent || '') : '';
  }

  function setTextareaContent(textarea, text) {
    if (!textarea) return;
    textarea.innerHTML = `<p>${escapeHtml(text)}</p>`;
    textarea.dispatchEvent(new InputEvent('input', { bubbles: true }));
    textarea.focus();
  }

  function setupTextareaListeners(textarea) {
    let debounceTimer;
    const handleInput = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const text = getTextareaContent(textarea);
        if (text.length > 10 && settings.autoEnhance && !isEnhancing) {
          showQuickEnhanceButton(textarea);
        } else {
          hideQuickEnhanceButton();
        }
      }, 300);
    };
    textarea.addEventListener('input', handleInput);
    textarea.addEventListener('focus', handleInput);
    const observer = new MutationObserver(handleInput);
    observer.observe(textarea, { childList: true, subtree: true, characterData: true });
  }

  function showQuickEnhanceButton(textarea) {
    if (!settings.showWidget) return;
    let btn = document.getElementById('whisper-quick-enhance');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'whisper-quick-enhance';
      btn.className = 'whisper-quick-enhance';
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Sharpen`;
      btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); quickEnhance(); });
      document.body.appendChild(btn);
    }
    const rect = textarea.getBoundingClientRect();
    btn.style.cssText = `position:fixed;bottom:${window.innerHeight-rect.top+12}px;right:${window.innerWidth-rect.right+8}px;`;
    btn.classList.add('visible');
  }

  function setupPositionUpdates() {
    const reposition = () => {
      const textarea = getTextarea();
      const text = getTextareaContent(textarea);
      if (textarea && text.length > 10 && settings.autoEnhance && !isEnhancing) {
        showQuickEnhanceButton(textarea);
      } else {
        hideQuickEnhanceButton();
      }
    };
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
  }

  function hideQuickEnhanceButton() {
    document.getElementById('whisper-quick-enhance')?.classList.remove('visible');
  }

  function toggleWidget() {
    if (widgetVisible) { hideWidget(); return; }
    const textarea = getTextarea();
    currentPrompt = getTextareaContent(textarea);
    if (currentPrompt.trim()) { quickEnhance(); } else { showToast('Type something first', 'error'); }
  }

  function quickEnhance() {
    const textarea = getTextarea();
    currentPrompt = getTextareaContent(textarea);
    if (!currentPrompt.trim()) return;
    hideQuickEnhanceButton();
    
    if (typeof WhisperEnhancer !== 'undefined') {
      aimBreakdown = WhisperEnhancer.getAIMBreakdown(currentPrompt, userProfile);
      enhancedPrompt = WhisperEnhancer.enhance(currentPrompt, userProfile);
    } else {
      enhancedPrompt = currentPrompt + '\n\nPlease be specific and provide a clear, structured response.';
      aimBreakdown = { actor: 'a helpful expert', input: 'Request', mission: 'Help with this', guidance: 'Be specific.' };
    }
    
    showWidget();
    saveToHistory();
  }

  function showWidget() {
    hideQuickEnhanceButton();
    let widget = document.getElementById('whisper-widget');
    if (!widget) {
      widget = document.createElement('div');
      widget.id = 'whisper-widget';
      widget.className = 'whisper-widget';
      document.body.appendChild(widget);
    }
    widget.innerHTML = getResultHTML();
    widget.classList.remove('hidden');
    widgetVisible = true;
    setupWidgetListeners();
  }

  function getResultHTML() {
    return `
      <div class="whisper-header">
        <div class="whisper-logo"><div class="whisper-logo-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div><span class="whisper-logo-text">Whisper AI</span></div>
        <button class="whisper-close" id="whisper-close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
      </div>
      <div class="whisper-content">
        <div class="whisper-aim">
          <div class="whisper-aim-title">I understood your prompt as:</div>
          <div class="whisper-aim-grid">
            <div class="whisper-aim-item"><span class="whisper-aim-label">🎭 Actor</span><span class="whisper-aim-value">${aimBreakdown?.actor || 'Expert'}</span></div>
            <div class="whisper-aim-item"><span class="whisper-aim-label">📥 Input</span><span class="whisper-aim-value">${aimBreakdown?.input || 'Request'}</span></div>
            <div class="whisper-aim-item"><span class="whisper-aim-label">🎯 Mission</span><span class="whisper-aim-value">${aimBreakdown?.mission || 'Help'}</span></div>
          </div>
        </div>
        <div class="whisper-section">
          <div class="whisper-section-header"><span class="whisper-section-title">Sharpened Prompt</span></div>
          <div class="whisper-prompt-box enhanced">${escapeHtml(enhancedPrompt)}</div>
        </div>
        <div class="whisper-added"><span class="whisper-added-label">Added:</span><span class="whisper-added-text">${aimBreakdown?.guidance || 'Clearer direction'}</span></div>
        <div class="whisper-actions">
          <button class="whisper-btn whisper-btn-secondary" id="whisper-cancel">Keep Original</button>
          <button class="whisper-btn whisper-btn-primary" id="whisper-apply"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>Use This</button>
        </div>
      </div>`;
  }

  function setupWidgetListeners() {
    const widget = document.getElementById('whisper-widget');
    if (!widget) return;
    widget.querySelector('#whisper-close')?.addEventListener('click', hideWidget);
    widget.querySelector('#whisper-cancel')?.addEventListener('click', hideWidget);
    widget.querySelector('#whisper-apply')?.addEventListener('click', applyEnhancedPrompt);
  }

  function isExtensionContextValid() { try { return chrome.runtime && chrome.runtime.id; } catch (e) { return false; } }

  function saveToHistory() {
    if (!isExtensionContextValid()) return;
    try { chrome.runtime.sendMessage({ action: 'saveHistory', data: { original: currentPrompt, enhanced: enhancedPrompt, platform: PLATFORM, date: new Date().toISOString() } }); } catch (e) {}
  }

  function hideWidget() { document.getElementById('whisper-widget')?.classList.add('hidden'); widgetVisible = false; isEnhancing = false; }

  function applyEnhancedPrompt() {
    const textarea = getTextarea();
    if (textarea && enhancedPrompt) { setTextareaContent(textarea, enhancedPrompt); textarea.focus(); hideWidget(); showToast('Prompt sharpened!', 'success'); }
  }

  function showToast(message, type = 'success') {
    document.querySelector('.whisper-toast')?.remove();
    const toast = document.createElement('div');
    toast.className = `whisper-toast ${type}`;
    toast.innerHTML = `<svg class="whisper-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${type === 'success' ? '<polyline points="20 6 9 17 4 12"></polyline>' : '<circle cx="12" cy="12" r="10"></circle>'}</svg><span class="whisper-toast-message">${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 2500);
  }

  function listenForMessages() {
    if (!isExtensionContextValid()) return;
    try {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'insertTemplate') { const textarea = getTextarea(); if (textarea) { setTextareaContent(textarea, request.template); showToast('Inserted!', 'success'); } sendResponse({ success: true }); }
        if (request.action === 'enhancePrompt') { if (request.userProfile) userProfile = request.userProfile; quickEnhance(); sendResponse({ success: true }); }
        if (request.action === 'settingsUpdated') { settings = request.settings; sendResponse({ success: true }); }
        return true;
      });
    } catch (e) {}
  }

  function escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
})();
