// ===== Whisper AI Background Service Worker =====
// Uses native AI platform sessions - no API key required!

// Import analytics (ES Module)
import { WhisperAnalytics } from '../analytics/analytics.js';

// Initialize analytics
WhisperAnalytics.init();

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getState') {
    getState().then(sendResponse);
    return true;
  }
  
  if (request.action === 'saveHistory') {
    saveToHistory(request.data).then(sendResponse);
    return true;
  }
  
  if (request.action === 'getEnhancementPrompt') {
    const enhancementPrompt = buildEnhancementPrompt(request.originalPrompt, request.userProfile);
    sendResponse({ prompt: enhancementPrompt });
    return true;
  }
  
  // Analytics events from content scripts
  if (request.action === 'analytics') {
    handleAnalyticsEvent(request.event, request.params);
    sendResponse({ success: true });
    return true;
  }
});

// Handle analytics events from content scripts
function handleAnalyticsEvent(eventName, params = {}) {
  switch (eventName) {
    case 'prompt_enhanced':
      WhisperAnalytics.promptEnhanced(params.platform, params.originalLength, params.enhancedLength);
      break;
    case 'enhancement_applied':
      WhisperAnalytics.enhancementApplied(params.platform);
      break;
    case 'enhancement_rejected':
      WhisperAnalytics.enhancementRejected(params.platform);
      break;
    case 'quick_enhance_clicked':
      WhisperAnalytics.quickEnhanceClicked(params.platform);
      break;
    case 'floating_button_clicked':
      WhisperAnalytics.floatingButtonClicked(params.platform);
      break;
    case 'platform_detected':
      WhisperAnalytics.platformDetected(params.platform);
      break;
    default:
      console.log('[Analytics] Unknown event:', eventName);
  }
}

// Build the meta-prompt that asks the AI to enhance the user's prompt
function buildEnhancementPrompt(originalPrompt, userProfile = {}) {
  const roleContext = getRoleContext(userProfile.role);
  const industryContext = getIndustryContext(userProfile.industry);
  
  return `You are an expert prompt engineer. Your task is to enhance the following prompt to get better, more detailed results.

${roleContext ? `Context: The user is a ${userProfile.role}.` : ''}
${industryContext ? `Industry: ${userProfile.industry}.` : ''}

Original prompt to enhance:
"""
${originalPrompt}
"""

Please enhance this prompt by:
1. Adding relevant context and background
2. Specifying the desired output format
3. Including any helpful constraints or requirements
4. Making it more specific and actionable

IMPORTANT: Return ONLY the enhanced prompt itself. Do not include any explanations, labels, or meta-commentary. Just output the improved prompt text that the user can copy and use directly.`;
}

// Get role-specific context
function getRoleContext(role) {
  const contexts = {
    developer: 'software development, coding, and technical tasks',
    marketer: 'marketing, copywriting, and growth strategies',
    product: 'product management, user stories, and roadmaps',
    designer: 'design, UX/UI, and creative direction',
    writer: 'writing, content creation, and editing',
    analyst: 'data analysis, research, and insights',
    student: 'learning, studying, and academic work',
    business: 'business strategy, operations, and management'
  };
  return contexts[role] || '';
}

// Get industry-specific context
function getIndustryContext(industry) {
  const contexts = {
    tech: 'Technology/Software',
    finance: 'Finance/Banking',
    healthcare: 'Healthcare',
    education: 'Education',
    ecommerce: 'E-commerce/Retail',
    media: 'Media/Entertainment',
    consulting: 'Consulting/Agency',
    legal: 'Legal',
    manufacturing: 'Manufacturing'
  };
  return contexts[industry] || '';
}

// Get state from storage
async function getState() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['whisperState'], (result) => {
      const defaultState = {
        isOnboarded: false,
        userProfile: { role: '', industry: '' },
        settings: { autoEnhance: true, showWidget: true },
        history: []
      };
      
      resolve(result.whisperState || defaultState);
    });
  });
}

// Save to history
async function saveToHistory(entry) {
  const state = await getState();
  if (!state.history) state.history = [];
  state.history.unshift(entry);
  // Keep only last 50 entries
  state.history = state.history.slice(0, 50);
  await chrome.storage.local.set({ whisperState: state });
  return true;
}

// Install listener
chrome.runtime.onInstalled.addListener((details) => {
  const manifest = chrome.runtime.getManifest();
  
  if (details.reason === 'install') {
    console.log('Whisper AI installed successfully!');
    WhisperAnalytics.extensionInstalled(manifest.version, false);
  } else if (details.reason === 'update') {
    console.log(`Whisper AI updated to version ${manifest.version}`);
    WhisperAnalytics.extensionInstalled(manifest.version, true);
  }
});
