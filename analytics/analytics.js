/**
 * Whisper AI - Google Analytics 4 Module
 * Uses GA4 Measurement Protocol for reliable tracking in Chrome extensions
 * 
 * Tracks: Page views, Button clicks, Feature usage
 */

const WhisperAnalytics = {
  // GA4 Configuration
  MEASUREMENT_ID: 'G-9T1SK3XEXL',
  API_SECRET: 'NQ0b3kXMTumswL4TQWYYRg',
  
  // Endpoint
  ENDPOINT: 'https://www.google-analytics.com/mp/collect',
  DEBUG_ENDPOINT: 'https://www.google-analytics.com/debug/mp/collect',
  
  // Debug mode (set to true to see logs, false for production)
  DEBUG: false,
  
  // Client ID (persisted)
  _clientId: null,
  
  /**
   * Initialize analytics - call once on extension load
   */
  async init() {
    await this._ensureClientId();
    console.log('[Analytics] Initialized with client ID:', this._clientId);
  },
  
  /**
   * Get or create a persistent client ID
   */
  async _ensureClientId() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['whisperAnalyticsClientId'], (result) => {
        if (result.whisperAnalyticsClientId) {
          this._clientId = result.whisperAnalyticsClientId;
        } else {
          // Generate a new client ID (UUID-like)
          this._clientId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
          chrome.storage.local.set({ whisperAnalyticsClientId: this._clientId });
        }
        resolve(this._clientId);
      });
    });
  },
  
  /**
   * Send event to GA4
   */
  async _sendEvent(eventName, params = {}) {
    if (!this._clientId) {
      await this._ensureClientId();
    }
    
    // Skip if API secret not configured
    if (!this.API_SECRET) {
      console.log('[Analytics] API Secret not configured, skipping:', eventName, params);
      return;
    }
    
    const endpoint = this.DEBUG ? this.DEBUG_ENDPOINT : this.ENDPOINT;
    const url = `${endpoint}?measurement_id=${this.MEASUREMENT_ID}&api_secret=${this.API_SECRET}`;
    
    const payload = {
      client_id: this._clientId,
      events: [{
        name: eventName,
        params: {
          engagement_time_msec: 100,
          session_id: Date.now().toString(),
          ...params
        }
      }]
    };
    
    try {
      console.log('[Analytics] Sending event:', eventName, params);
      
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      if (this.DEBUG) {
        const debugData = await response.json();
        console.log('[Analytics Debug]', eventName, debugData);
      } else {
        console.log('[Analytics] Event sent:', eventName, 'Status:', response.status);
      }
    } catch (error) {
      console.error('[Analytics] Error sending event:', error);
    }
  },
  
  // ========== PAGE VIEWS ==========
  
  /**
   * Track page/screen view
   */
  pageView(pageName, pageTitle = '') {
    this._sendEvent('page_view', {
      page_title: pageTitle || pageName,
      page_location: `chrome-extension://whisper-ai/${pageName}`,
      page_path: `/${pageName}`
    });
  },
  
  /**
   * Track popup opened
   */
  popupOpened() {
    this.pageView('popup', 'Whisper AI Popup');
  },
  
  /**
   * Track screen/section view in popup
   */
  screenView(screenName) {
    this._sendEvent('screen_view', {
      screen_name: screenName
    });
  },
  
  // ========== BUTTON CLICKS ==========
  
  /**
   * Track button click
   */
  buttonClick(buttonName, buttonLocation = 'popup') {
    this._sendEvent('button_click', {
      button_name: buttonName,
      button_location: buttonLocation
    });
  },
  
  /**
   * Track settings button click
   */
  settingsClicked() {
    this.buttonClick('settings', 'popup_header');
  },
  
  /**
   * Track template selected
   */
  templateSelected(templateName, templateCategory) {
    this._sendEvent('template_selected', {
      template_name: templateName,
      template_category: templateCategory
    });
  },
  
  // ========== FEATURE USAGE ==========
  
  /**
   * Track prompt enhancement
   */
  promptEnhanced(platform, originalLength, enhancedLength) {
    this._sendEvent('prompt_enhanced', {
      platform: platform,
      original_length: originalLength,
      enhanced_length: enhancedLength,
      length_increase: enhancedLength - originalLength
    });
  },
  
  /**
   * Track enhancement applied (user accepted the enhancement)
   */
  enhancementApplied(platform) {
    this._sendEvent('enhancement_applied', {
      platform: platform
    });
  },
  
  /**
   * Track enhancement rejected (user kept original)
   */
  enhancementRejected(platform) {
    this._sendEvent('enhancement_rejected', {
      platform: platform
    });
  },
  
  /**
   * Track quick enhance button clicked
   */
  quickEnhanceClicked(platform) {
    this._sendEvent('quick_enhance_clicked', {
      platform: platform
    });
    this.buttonClick('sharpen_button', platform);
  },
  
  /**
   * Track floating trigger button clicked
   */
  floatingButtonClicked(platform) {
    this._sendEvent('floating_button_clicked', {
      platform: platform
    });
    this.buttonClick('floating_trigger', platform);
  },
  
  /**
   * Track walkthrough completion
   */
  walkthroughCompleted(role, industry) {
    this._sendEvent('walkthrough_completed', {
      user_role: role,
      user_industry: industry
    });
  },
  
  /**
   * Track walkthrough step
   */
  walkthroughStep(stepNumber) {
    this._sendEvent('walkthrough_step', {
      step_number: stepNumber
    });
  },
  
  /**
   * Track walkthrough skipped
   */
  walkthroughSkipped(atStep) {
    this._sendEvent('walkthrough_skipped', {
      skipped_at_step: atStep
    });
  },
  
  /**
   * Track settings changed
   */
  settingsChanged(setting, newValue) {
    this._sendEvent('settings_changed', {
      setting_name: setting,
      setting_value: String(newValue)
    });
  },
  
  /**
   * Track extension installed/updated
   */
  extensionInstalled(version, isUpdate = false) {
    this._sendEvent(isUpdate ? 'extension_updated' : 'extension_installed', {
      extension_version: version
    });
  },
  
  /**
   * Track platform detected
   */
  platformDetected(platform) {
    this._sendEvent('platform_detected', {
      platform: platform
    });
  },
  
  /**
   * Track error
   */
  trackError(errorType, errorMessage, context = '') {
    this._sendEvent('error_occurred', {
      error_type: errorType,
      error_message: errorMessage.substring(0, 100),
      error_context: context
    });
  }
};

// ES Module export for service worker
export { WhisperAnalytics };

// Also expose globally for content scripts and popup
if (typeof window !== 'undefined') {
  window.WhisperAnalytics = WhisperAnalytics;
}
