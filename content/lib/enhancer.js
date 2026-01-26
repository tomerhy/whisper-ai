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

  // Main enhancement function
  enhance(prompt, profile = {}) {
    if (!prompt || prompt.length < this.config.minPromptLength) {
      return prompt;
    }

    const intent = this.detectIntent(prompt);
    const analysis = this.analyzeStructure(prompt);
    const roleContext = this.getRoleContext(profile);
    
    let enhanced = prompt.trim();
    const components = [];

    // 1. Add role context if not present
    if (!analysis.hasRole && roleContext) {
      components.push({
        type: 'role',
        content: `[ROLE] ${roleContext.prefix} with focus on ${roleContext.focus}`
      });
    }

    // 2. Add industry context if available
    if (profile.industry && !prompt.toLowerCase().includes(profile.industry)) {
      const industryContext = this.getIndustryContext(profile.industry);
      components.push({
        type: 'context',
        content: `[CONTEXT] This is for ${industryContext}`
      });
    }

    // 3. The original task/prompt
    components.push({
      type: 'task',
      content: `[TASK]\n${enhanced}`
    });

    // 4. Add format guidance if not present
    if (!analysis.hasFormat) {
      const format = this.getFormatSuggestion(intent);
      components.push({
        type: 'format',
        content: `[FORMAT]${format}`
      });
    }

    // 5. Add quality markers
    const qualityMarkers = this.getQualityMarkers(analysis, intent);
    if (qualityMarkers.length > 0) {
      components.push({
        type: 'quality',
        content: `[QUALITY]\n${qualityMarkers.map(m => `- ${m}`).join('\n')}`
      });
    }

    // Assemble the enhanced prompt
    const hasStructuredComponents = components.some(c => c.type === 'role' || c.type === 'context');
    
    if (hasStructuredComponents) {
      // Use structured format with tags
      enhanced = components.map(c => c.content).join('\n\n');
    } else {
      // Lighter enhancement for already well-formed prompts
      enhanced = prompt.trim();
      
      if (!analysis.hasFormat) {
        enhanced += '\n\n' + this.getFormatSuggestion(intent).trim();
      }
      
      if (qualityMarkers.length > 0 && !analysis.hasQuality) {
        enhanced += '\n\n' + qualityMarkers.map(m => `• ${m}`).join('\n');
      }
    }

    // Ensure we don't over-enhance
    if (enhanced.length > prompt.length * this.config.maxEnhancementRatio) {
      // Fall back to lighter enhancement
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

  // Analyze what improvements were made
  getImprovements(original, enhanced) {
    const improvements = [];
    const originalAnalysis = this.analyzeStructure(original);
    const enhancedLower = enhanced.toLowerCase();
    
    if (enhanced.includes('[ROLE]')) {
      improvements.push('Added role context');
    }
    if (enhanced.includes('[CONTEXT]')) {
      improvements.push('Added industry context');
    }
    if (enhanced.includes('[FORMAT]') || (!originalAnalysis.hasFormat && enhancedLower.includes('structure'))) {
      improvements.push('Output format');
    }
    if (enhanced.includes('[QUALITY]') || enhancedLower.includes('specific') || enhancedLower.includes('examples')) {
      improvements.push('Quality criteria');
    }
    if (enhanced.length > original.length * 1.3) {
      improvements.push('Added detail');
    }
    
    // Ensure at least one improvement is shown
    if (improvements.length === 0) {
      improvements.push('Optimized structure');
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
