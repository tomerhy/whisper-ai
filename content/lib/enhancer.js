// ===== Whisper AI - Smart Auto-Enhancement Engine =====
// Automatically improves any prompt with zero user input

const WhisperEnhancer = {
  
  // Detect what the user is trying to do
  detectIntent(prompt) {
    const lower = prompt.toLowerCase();
    
    if (/\b(code|function|debug|error|bug|programming|api|script|implement|fix|refactor|write.*code)\b/i.test(lower)) {
      return 'code';
    }
    if (/\b(analyze|analysis|evaluate|compare|assess|review|data|metrics|report)\b/i.test(lower)) {
      return 'analysis';
    }
    if (/\b(write|draft|create|compose|article|blog|email|letter|content|post)\b/i.test(lower)) {
      return 'writing';
    }
    if (/\b(explain|what is|how does|why|understand|clarify|define|teach|learn)\b/i.test(lower)) {
      return 'explanation';
    }
    if (/\b(idea|brainstorm|suggest|creative|design|concept|come up with)\b/i.test(lower)) {
      return 'creative';
    }
    if (/\b(summarize|summary|tldr|key points|main points)\b/i.test(lower)) {
      return 'summary';
    }
    if (/\b(translate|convert|change.*to)\b/i.test(lower)) {
      return 'transform';
    }
    
    return 'general';
  },

  // Check what's missing from the prompt
  analyzeMissing(prompt) {
    const lower = prompt.toLowerCase();
    return {
      hasContext: prompt.length > 80,
      hasFormat: /\b(list|table|steps|format|structure|bullet|numbered|json|markdown)\b/i.test(lower),
      hasDetail: /\b(detailed|specific|comprehensive|thorough|in-depth)\b/i.test(lower),
      hasExample: /\b(example|for instance|such as|like this|show me)\b/i.test(lower),
      hasLength: /\b(\d+\s*words?|short|long|brief|concise)\b/i.test(lower),
      isQuestion: prompt.includes('?'),
      wordCount: prompt.split(/\s+/).length
    };
  },

  // Get smart additions based on intent
  getSmartAdditions(intent, missing) {
    const additions = {
      code: {
        format: 'Provide complete, working code with comments.',
        detail: 'Include error handling and edge cases.',
        example: 'Show example usage.'
      },
      analysis: {
        format: 'Structure with key findings, insights, and recommendations.',
        detail: 'Be specific and quantify where possible.',
        example: 'Include supporting examples.'
      },
      writing: {
        format: 'Use clear structure with introduction, main points, and conclusion.',
        detail: 'Make it engaging and well-organized.',
        example: 'Include specific details.'
      },
      explanation: {
        format: 'Explain step by step in simple terms.',
        detail: 'Use analogies and real-world examples.',
        example: 'Show a practical example.'
      },
      creative: {
        format: 'Provide multiple options to choose from.',
        detail: 'Be creative and think outside the box.',
        example: 'Include varied approaches.'
      },
      summary: {
        format: 'Use bullet points for key takeaways.',
        detail: 'Capture the essential points.',
        example: ''
      },
      transform: {
        format: 'Maintain the original meaning and structure.',
        detail: 'Be accurate and precise.',
        example: ''
      },
      general: {
        format: 'Organize your response clearly.',
        detail: 'Be specific and helpful.',
        example: 'Include relevant examples.'
      }
    };

    const add = additions[intent] || additions.general;
    const parts = [];

    if (!missing.hasFormat) parts.push(add.format);
    if (!missing.hasDetail && missing.wordCount < 30) parts.push(add.detail);
    if (!missing.hasExample && add.example) parts.push(add.example);

    return parts;
  },

  // Get role prefix based on user profile
  getRolePrefix(profile, intent) {
    if (!profile.role) return '';
    
    const roles = {
      developer: 'As a developer',
      marketer: 'From a marketing perspective',
      product: 'As a product manager',
      designer: 'From a design perspective',
      writer: 'As a writer',
      analyst: 'As an analyst',
      student: 'As a learner',
      business: 'From a business standpoint',
      researcher: 'As a researcher'
    };

    return roles[profile.role] || '';
  },

  // MAIN: Auto-enhance any prompt with one click
  enhance(prompt, profile = {}) {
    if (!prompt || prompt.trim().length < 5) {
      return prompt;
    }

    const trimmed = prompt.trim();
    const intent = this.detectIntent(trimmed);
    const missing = this.analyzeMissing(trimmed);
    const additions = this.getSmartAdditions(intent, missing);
    
    // Build enhanced prompt naturally
    let enhanced = trimmed;

    // Add role context if available and prompt is short
    const rolePrefix = this.getRolePrefix(profile, intent);
    if (rolePrefix && missing.wordCount < 20 && !trimmed.toLowerCase().startsWith('as ')) {
      enhanced = `${rolePrefix}, ${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`;
    }

    // Add smart improvements
    if (additions.length > 0) {
      enhanced += '\n\n' + additions.join(' ');
    }

    // Keep it reasonable - don't over-enhance
    if (enhanced.length > trimmed.length * 3) {
      enhanced = trimmed + '\n\nPlease be specific, well-organized, and include examples.';
    }

    return enhanced;
  },

  // Get user-friendly improvement labels
  getImprovements(original, enhanced) {
    const improvements = [];
    const enhancedLower = enhanced.toLowerCase();
    
    if (enhanced.length > original.length * 1.1) {
      if (enhancedLower.includes('as a') || enhancedLower.includes('perspective')) {
        improvements.push('Added context');
      }
      if (enhancedLower.includes('structure') || enhancedLower.includes('organize') || enhancedLower.includes('step')) {
        improvements.push('Better structure');
      }
      if (enhancedLower.includes('specific') || enhancedLower.includes('example')) {
        improvements.push('More specific');
      }
      if (enhancedLower.includes('complete') || enhancedLower.includes('comprehensive')) {
        improvements.push('More complete');
      }
    }
    
    if (improvements.length === 0) {
      improvements.push('Improved');
    }
    
    return improvements.slice(0, 3);
  }
};

// Export
if (typeof window !== 'undefined') {
  window.WhisperEnhancer = WhisperEnhancer;
}
