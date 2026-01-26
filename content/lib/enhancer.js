// ===== Whisper AI - Advanced Prompt Enhancement Engine =====
// Universal enhancement logic for all AI platforms

const WhisperEnhancer = {
  // Enhancement configuration
  config: {
    minPromptLength: 10,
    maxEnhancementRatio: 3.0, // Don't make prompts more than 3x longer
    enableSmartComponents: true
  },

  // Detect prompt type/intent
  detectIntent(prompt) {
    const lower = prompt.toLowerCase();
    
    const intents = {
      code: /\b(code|function|debug|error|bug|programming|api|script|implement|fix|refactor)\b/i,
      analysis: /\b(analyze|analysis|evaluate|compare|assess|review|data|metrics|report)\b/i,
      writing: /\b(write|draft|create|compose|article|blog|email|story|content)\b/i,
      explanation: /\b(explain|what is|how does|why|understand|clarify|define)\b/i,
      creative: /\b(creative|brainstorm|ideas|suggest|imagine|design|concept)\b/i,
      learning: /\b(learn|teach|tutorial|guide|help me understand|study)\b/i,
      business: /\b(business|strategy|plan|marketing|sales|revenue|customer)\b/i
    };

    for (const [intent, pattern] of Object.entries(intents)) {
      if (pattern.test(lower)) {
        return intent;
      }
    }
    
    return 'general';
  },

  // Analyze prompt structure
  analyzeStructure(prompt) {
    return {
      hasQuestion: /\?/.test(prompt),
      hasContext: prompt.length > 100,
      hasFormat: /\b(list|table|steps|format|structure|bullet|numbered)\b/i.test(prompt),
      hasRole: /\b(as a|you are|act as|pretend|imagine you're)\b/i.test(prompt),
      hasExamples: /\b(example|for instance|such as|like|e\.g\.|i\.e\.)\b/i.test(prompt),
      hasConstraints: /\b(don't|do not|avoid|must|should|only|limit|max|min)\b/i.test(prompt),
      hasQuality: /\b(detailed|comprehensive|thorough|brief|concise|specific)\b/i.test(prompt),
      wordCount: prompt.split(/\s+/).length,
      sentenceCount: (prompt.match(/[.!?]+/g) || []).length + 1
    };
  },

  // Get role context based on user profile
  getRoleContext(profile) {
    const roleContexts = {
      developer: {
        prefix: 'As an experienced software developer',
        focus: 'technical accuracy, code quality, and practical implementation',
        examples: 'Include code examples where relevant'
      },
      marketer: {
        prefix: 'From a marketing and growth perspective',
        focus: 'audience engagement, conversion, and brand messaging',
        examples: 'Include real-world marketing examples'
      },
      product: {
        prefix: 'As a product manager',
        focus: 'user needs, feature prioritization, and business value',
        examples: 'Consider user stories and acceptance criteria'
      },
      designer: {
        prefix: 'From a UX/design perspective',
        focus: 'user experience, visual hierarchy, and accessibility',
        examples: 'Consider design patterns and usability'
      },
      writer: {
        prefix: 'As a professional content creator',
        focus: 'engaging narrative, clear communication, and audience resonance',
        examples: 'Use vivid examples and storytelling techniques'
      },
      analyst: {
        prefix: 'From an analytical perspective',
        focus: 'data-driven insights, patterns, and evidence-based conclusions',
        examples: 'Include quantitative analysis where possible'
      },
      student: {
        prefix: 'As a student learning this topic',
        focus: 'clear explanations, foundational concepts, and learning progression',
        examples: 'Use simple analogies and build from basics'
      },
      business: {
        prefix: 'From a business strategy perspective',
        focus: 'ROI, market dynamics, and strategic implications',
        examples: 'Include business case examples'
      },
      researcher: {
        prefix: 'As a researcher',
        focus: 'academic rigor, sources, and methodological soundness',
        examples: 'Cite relevant research and frameworks'
      }
    };

    return roleContexts[profile.role] || null;
  },

  // Get industry context
  getIndustryContext(industry) {
    const industries = {
      tech: 'the technology and software industry',
      finance: 'the financial services industry',
      healthcare: 'the healthcare and medical industry',
      education: 'the education sector',
      ecommerce: 'the e-commerce and retail industry',
      media: 'the media and entertainment industry',
      legal: 'the legal industry',
      manufacturing: 'the manufacturing sector',
      consulting: 'professional consulting',
      nonprofit: 'the nonprofit sector',
      government: 'the public/government sector',
      startup: 'the startup ecosystem',
      enterprise: 'large enterprise environments'
    };

    return industries[industry] || industry;
  },

  // Generate format suggestion based on intent
  getFormatSuggestion(intent) {
    const formats = {
      code: `
Structure your response as:
1. Brief explanation of the approach
2. Complete, working code with comments
3. Example usage
4. Edge cases or considerations`,
      
      analysis: `
Structure your analysis as:
## Executive Summary
(Key findings in 2-3 bullets)

## Detailed Analysis
(Main insights with supporting data)

## Recommendations
(Actionable next steps, prioritized)`,
      
      writing: `
Include:
1. Compelling opening hook
2. Clear structure with headers
3. Concrete examples
4. Strong conclusion with takeaway`,
      
      explanation: `
Explain this by:
1. Simple one-sentence definition
2. Real-world analogy
3. How it works (step by step)
4. Why it matters
5. Common misconceptions`,
      
      creative: `
Provide:
- Multiple diverse options (at least 3)
- Range from safe to bold ideas
- Brief rationale for each
- Implementation considerations`,
      
      learning: `
Structure the learning content as:
1. Overview (what you'll learn)
2. Key concepts explained simply
3. Practical examples
4. Practice exercises or questions
5. Next steps for deeper learning`,
      
      business: `
Format your response as:
## Situation Analysis
## Options Considered
## Recommendation
## Implementation Roadmap
## Risk Mitigation`,
      
      general: `
Please structure your response with:
- Clear sections with headers
- Bullet points for key information
- Specific examples where relevant`
    };

    return formats[intent] || formats.general;
  },

  // Generate quality markers based on analysis
  getQualityMarkers(analysis, intent) {
    const markers = [];
    
    if (!analysis.hasQuality) {
      if (intent === 'code') {
        markers.push('Include complete, production-ready code');
        markers.push('Add error handling and edge cases');
      } else if (intent === 'analysis') {
        markers.push('Quantify findings where possible');
        markers.push('Distinguish correlation from causation');
      } else if (intent === 'writing') {
        markers.push('Make it engaging and scannable');
        markers.push('Include a clear call-to-action');
      } else {
        markers.push('Be specific and provide concrete details');
      }
    }
    
    if (!analysis.hasExamples && analysis.wordCount < 50) {
      markers.push('Include practical examples');
    }
    
    return markers;
  },

  // Main enhancement function - produces clean, natural output (no technical tags)
  enhance(prompt, profile = {}) {
    if (!prompt || prompt.length < this.config.minPromptLength) {
      return prompt;
    }

    const intent = this.detectIntent(prompt);
    const analysis = this.analyzeStructure(prompt);
    const roleContext = this.getRoleContext(profile);
    
    let enhanced = prompt.trim();
    const parts = [];

    // 1. Add role context naturally (no [ROLE] tag)
    if (!analysis.hasRole && roleContext) {
      parts.push(`${roleContext.prefix}, I need your help with the following:`);
    }

    // 2. Add the original prompt
    parts.push(enhanced);

    // 3. Add format guidance naturally (no [FORMAT] tag)
    if (!analysis.hasFormat) {
      const format = this.getFormatSuggestionSimple(intent);
      if (format) {
        parts.push(format);
      }
    }

    // 4. Add quality markers naturally
    const qualityMarkers = this.getQualityMarkersSimple(analysis, intent);
    if (qualityMarkers.length > 0) {
      parts.push(qualityMarkers.join(' '));
    }

    // Assemble the enhanced prompt naturally
    enhanced = parts.join('\n\n');

    // Ensure we don't over-enhance
    if (enhanced.length > prompt.length * this.config.maxEnhancementRatio) {
      enhanced = prompt.trim();
      if (!analysis.hasFormat) {
        enhanced += '\n\nPlease structure your response clearly with sections and examples.';
      }
      if (!analysis.hasQuality) {
        enhanced += ' Be specific and actionable.';
      }
    }

    return enhanced;
  },

  // Simpler format suggestions without complex markdown
  getFormatSuggestionSimple(intent) {
    const formats = {
      code: 'Please provide complete working code with comments explaining key parts.',
      analysis: 'Please structure your analysis with key findings, insights, and actionable recommendations.',
      writing: 'Please include a clear structure with an introduction, main points, and conclusion.',
      explanation: 'Please explain step by step, using simple analogies and real-world examples.',
      creative: 'Please provide multiple options with brief explanations for each.',
      learning: 'Please explain from basics to advanced, with examples at each step.',
      business: 'Please include analysis, recommendations, and suggested next steps.',
      general: 'Please provide a clear, well-organized response with specific examples.'
    };
    return formats[intent] || formats.general;
  },

  // Simpler quality markers
  getQualityMarkersSimple(analysis, intent) {
    const markers = [];
    
    if (!analysis.hasQuality) {
      if (intent === 'code') {
        markers.push('Make sure the code handles edge cases and includes error handling.');
      } else if (intent === 'analysis') {
        markers.push('Please quantify findings where possible and distinguish facts from assumptions.');
      } else if (analysis.wordCount < 30) {
        markers.push('Please be specific and provide concrete examples.');
      }
    }
    
    return markers;
  },

  // Analyze what improvements were made (user-friendly labels)
  getImprovements(original, enhanced) {
    const improvements = [];
    const originalAnalysis = this.analyzeStructure(original);
    const enhancedLower = enhanced.toLowerCase();
    
    if (enhancedLower.includes('as a') || enhancedLower.includes('perspective') || enhancedLower.includes('help with')) {
      improvements.push('Added context');
    }
    if (enhancedLower.includes('structure') || enhancedLower.includes('organize') || enhancedLower.includes('section')) {
      improvements.push('Clear structure');
    }
    if (enhancedLower.includes('specific') || enhancedLower.includes('example') || enhancedLower.includes('concrete')) {
      improvements.push('More specific');
    }
    if (enhancedLower.includes('step') || enhancedLower.includes('explain') || enhancedLower.includes('how')) {
      improvements.push('Better guidance');
    }
    if (enhanced.length > original.length * 1.2) {
      improvements.push('More detail');
    }
    
    // Ensure at least one improvement is shown
    if (improvements.length === 0) {
      improvements.push('Optimized');
    }
    
    return improvements.slice(0, 4);
  },

  // Quick enhance for simple improvements
  quickEnhance(prompt, profile = {}) {
    const analysis = this.analyzeStructure(prompt);
    let enhanced = prompt.trim();
    
    // Add role if profile exists and not present
    if (profile.role && !analysis.hasRole) {
      const roleContext = this.getRoleContext(profile);
      if (roleContext) {
        enhanced = `${roleContext.prefix}, ${enhanced.charAt(0).toLowerCase() + enhanced.slice(1)}`;
      }
    }
    
    // Add format hint if not present
    if (!analysis.hasFormat && analysis.wordCount > 15) {
      enhanced += '\n\nProvide a structured response with clear sections.';
    }
    
    // Add specificity hint for short prompts
    if (analysis.wordCount < 20 && !analysis.hasQuality) {
      enhanced += ' Be specific and include examples.';
    }
    
    return enhanced;
  }
};

// Export for use in content scripts
if (typeof window !== 'undefined') {
  window.WhisperEnhancer = WhisperEnhancer;
}
