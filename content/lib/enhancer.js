// ===== Whisper AI - AIM Framework Engine =====
// Actor (who AI should be) + Input (what you're giving) + Mission (what you want)
// Vague prompts → vague results. Structured prompts → quality results.

const WhisperEnhancer = {

  // ========== AIM DETECTION ==========
  
  // Detect the MISSION (what does the user want?)
  detectMission(prompt) {
    const lower = prompt.toLowerCase();
    
    const missions = [
      { key: 'review', patterns: /\b(review|check|evaluate|assess|feedback|critique)\b/i, mission: 'Review and provide feedback' },
      { key: 'fix', patterns: /\b(fix|debug|solve|error|bug|issue|problem|broken|wrong)\b/i, mission: 'Identify and fix the problem' },
      { key: 'create', patterns: /\b(write|create|generate|make|build|draft|compose)\b/i, mission: 'Create something new' },
      { key: 'explain', patterns: /\b(explain|what is|how does|why|help me understand|clarify|teach)\b/i, mission: 'Explain clearly' },
      { key: 'improve', patterns: /\b(improve|enhance|better|optimize|refactor|upgrade)\b/i, mission: 'Make it better' },
      { key: 'analyze', patterns: /\b(analyze|analysis|insight|pattern|trend|data)\b/i, mission: 'Analyze and extract insights' },
      { key: 'summarize', patterns: /\b(summarize|summary|tldr|key points|brief|shorten)\b/i, mission: 'Summarize the key points' },
      { key: 'compare', patterns: /\b(compare|versus|vs|difference|choose|which|better)\b/i, mission: 'Compare and recommend' },
      { key: 'brainstorm', patterns: /\b(idea|brainstorm|suggest|options|alternatives|creative)\b/i, mission: 'Generate ideas' },
      { key: 'convert', patterns: /\b(convert|translate|transform|change to|turn into)\b/i, mission: 'Convert/transform' }
    ];

    for (const m of missions) {
      if (m.patterns.test(lower)) {
        return { key: m.key, mission: m.mission };
      }
    }
    
    return { key: 'assist', mission: 'Help with this request' };
  },

  // Detect the INPUT type (what are they giving?)
  detectInput(prompt) {
    const lower = prompt.toLowerCase();
    
    if (/```|function\s|const\s|let\s|var\s|def\s|class\s|import\s|<\w+>/.test(prompt)) {
      return { type: 'code', label: 'Code snippet' };
    }
    if (/\b(error|exception|traceback|failed|cannot|undefined)\b/i.test(lower)) {
      return { type: 'error', label: 'Error/problem' };
    }
    if (/\b(data|numbers?|metrics?|statistics?|results?)\b/i.test(lower) || /\d+.*\d+.*\d+/.test(prompt)) {
      return { type: 'data', label: 'Data/numbers' };
    }
    if (/\b(article|post|blog|email|message|text|content|document)\b/i.test(lower)) {
      return { type: 'content', label: 'Written content' };
    }
    if (/\b(product|feature|app|tool|service|website)\b/i.test(lower)) {
      return { type: 'product', label: 'Product/feature' };
    }
    if (prompt.length > 200) {
      return { type: 'long', label: 'Detailed context' };
    }
    
    return { type: 'request', label: 'Request' };
  },

  // Detect best ACTOR based on context
  detectActor(prompt, profile = {}) {
    const lower = prompt.toLowerCase();
    
    // If user has a role set, use it contextually
    if (profile.role) {
      const roleActors = {
        developer: 'an experienced developer',
        marketer: 'a marketing expert',
        product: 'a product strategist',
        designer: 'a UX expert',
        writer: 'a skilled writer',
        analyst: 'a data analyst',
        student: 'a helpful tutor',
        business: 'a business advisor',
        researcher: 'a research expert'
      };
      if (roleActors[profile.role]) {
        return roleActors[profile.role];
      }
    }
    
    // Auto-detect from content
    if (/\b(code|programming|function|api|bug|debug)\b/i.test(lower)) {
      return 'an experienced developer';
    }
    if (/\b(marketing|brand|campaign|audience|conversion)\b/i.test(lower)) {
      return 'a marketing expert';
    }
    if (/\b(data|analysis|metrics|statistics)\b/i.test(lower)) {
      return 'a data analyst';
    }
    if (/\b(design|ux|ui|user experience)\b/i.test(lower)) {
      return 'a UX expert';
    }
    if (/\b(write|blog|article|copy|content)\b/i.test(lower)) {
      return 'a skilled writer';
    }
    if (/\b(explain|teach|learn|understand)\b/i.test(lower)) {
      return 'a helpful teacher';
    }
    
    return 'a helpful expert';
  },

  // ========== OUTPUT QUALITY ==========

  // Get output guidance based on mission (what makes a GOOD response?)
  getOutputGuidance(missionKey, inputType) {
    const guidance = {
      review: {
        code: 'Point out specific issues with line references. Suggest concrete fixes.',
        default: 'Be specific about what works and what needs improvement.'
      },
      fix: {
        code: 'Show the corrected code. Explain what was wrong and why the fix works.',
        error: 'Identify the root cause. Provide a working solution.',
        default: 'Explain the problem clearly and provide a solution.'
      },
      create: {
        code: 'Write clean, working code with brief comments on key parts.',
        content: 'Write in a natural, engaging tone. Structure it clearly.',
        default: 'Create something practical and ready to use.'
      },
      explain: {
        default: 'Use simple language. Give a real-world analogy. Include an example.'
      },
      improve: {
        code: 'Show the improved version. Explain each improvement.',
        default: 'Show before/after or list specific improvements.'
      },
      analyze: {
        data: 'Identify patterns. Highlight key insights. Suggest actions.',
        default: 'Break it down systematically. Highlight what matters most.'
      },
      summarize: {
        default: 'Capture the essential points. Use bullet points. Be concise.'
      },
      compare: {
        default: 'List pros/cons for each. Give a clear recommendation with reasoning.'
      },
      brainstorm: {
        default: 'Provide varied options from safe to bold. Brief rationale for each.'
      },
      convert: {
        default: 'Maintain accuracy. Keep the same structure/meaning.'
      },
      assist: {
        default: 'Be helpful, specific, and actionable.'
      }
    };

    const missionGuidance = guidance[missionKey] || guidance.assist;
    return missionGuidance[inputType] || missionGuidance.default;
  },

  // ========== MAIN ENHANCE FUNCTION ==========

  enhance(prompt, profile = {}) {
    if (!prompt || prompt.trim().length < 3) {
      return prompt;
    }

    const trimmed = prompt.trim();
    
    // Detect AIM components
    const mission = this.detectMission(trimmed);
    const input = this.detectInput(trimmed);
    const actor = this.detectActor(trimmed, profile);
    
    // Get output guidance
    const guidance = this.getOutputGuidance(mission.key, input.type);
    
    // Build enhanced prompt using AIM
    // Keep it natural - not robotic, not overly formatted
    let enhanced = '';
    
    // Only add actor context for short/vague prompts
    if (trimmed.split(/\s+/).length < 15 && !trimmed.toLowerCase().includes('you are')) {
      enhanced = `You are ${actor}.\n\n`;
    }
    
    // Add the original prompt (the INPUT + implicit MISSION)
    enhanced += trimmed;
    
    // Add output guidance to sharpen the mission
    if (guidance && !this.hasOutputInstructions(trimmed)) {
      enhanced += `\n\n${guidance}`;
    }
    
    return enhanced;
  },

  // Check if user already specified output format
  hasOutputInstructions(prompt) {
    return /\b(please|make sure|format|structure|include|provide|give me|I want|I need|should be)\b/i.test(prompt) &&
           prompt.split(/\s+/).length > 20;
  },

  // ========== ANALYSIS FOR UI ==========

  // Get AIM breakdown for display
  getAIMBreakdown(prompt, profile = {}) {
    const trimmed = prompt.trim();
    const mission = this.detectMission(trimmed);
    const input = this.detectInput(trimmed);
    const actor = this.detectActor(trimmed, profile);
    
    return {
      actor: actor,
      input: input.label,
      mission: mission.mission,
      guidance: this.getOutputGuidance(mission.key, input.type)
    };
  },

  // Get improvement labels for UI
  getImprovements(original, enhanced) {
    const improvements = [];
    
    if (enhanced.includes('You are')) {
      improvements.push('Added expert context');
    }
    if (enhanced.length > original.length + 20) {
      improvements.push('Clearer direction');
    }
    if (/specific|example|explain|show/.test(enhanced.toLowerCase())) {
      improvements.push('More specific ask');
    }
    
    return improvements.length ? improvements : ['Sharpened prompt'];
  }
};

// Export
if (typeof window !== 'undefined') {
  window.WhisperEnhancer = WhisperEnhancer;
}
