// ===== Whisper AI - Advanced Template Library =====
// Universal templates optimized for ChatGPT, Claude, Gemini, and Grok

const ADVANCED_TEMPLATES = [
  // ===== CODING TEMPLATES =====
  {
    id: 'code-review',
    name: 'Code Review Pro',
    emoji: '🔍',
    category: 'coding',
    description: 'Comprehensive code review with prioritized issues',
    variables: ['language', 'code'],
    prompt: `[ROLE] Senior software engineer with 10+ years of experience in code review, security auditing, and performance optimization

[CONTEXT]
- Language: {{language}}
- Focus: Production-ready code quality

[TASK]
Review the following code comprehensively:

\`\`\`{{language}}
{{code}}
\`\`\`

[FORMAT]
## 🔴 Critical Issues (Must Fix)
List security vulnerabilities, bugs, or breaking issues

## 🟡 Warnings (Should Fix)
Performance issues, code smells, potential problems

## 🟢 Suggestions (Nice to Have)
Style improvements, best practices, optimizations

## 📊 Overall Assessment
- Code Quality Score: X/10
- Key Strengths:
- Priority Fixes:

For each issue: specify line number, explain problem, provide fix with code example.

[QUALITY]
- Be specific with line references
- Provide working code fixes
- Prioritize by severity and impact
- Consider maintainability and scalability`
  },
  {
    id: 'debug-helper',
    name: 'Debug Detective',
    emoji: '🐛',
    category: 'coding',
    description: 'Systematic debugging with root cause analysis',
    variables: ['error_message', 'code', 'expected', 'actual'],
    prompt: `[ROLE] Expert debugger and software diagnostician with deep knowledge of runtime errors, stack traces, and systematic debugging

[CONTEXT]
Error encountered in production/development environment

[PROBLEM]
Error Message:
\`\`\`
{{error_message}}
\`\`\`

Code:
\`\`\`
{{code}}
\`\`\`

Expected behavior: {{expected}}
Actual behavior: {{actual}}

[TASK]
1. Analyze the error and identify root cause
2. Explain why this error occurs
3. Provide step-by-step fix
4. Suggest prevention strategies

[FORMAT]
## 🔍 Root Cause Analysis
(What's actually happening and why)

## 🛠️ Step-by-Step Fix
\`\`\`
// Fixed code here
\`\`\`

## 💡 Explanation
(Why this fix works)

## 🛡️ Prevention
(How to avoid this in the future)

## 🧪 Testing
(How to verify the fix works)

[QUALITY]
- Explain the "why" not just the "what"
- Provide complete, working code
- Consider edge cases
- Include relevant documentation links if helpful`
  },
  {
    id: 'api-docs',
    name: 'API Documentation',
    emoji: '📚',
    category: 'coding',
    description: 'Generate comprehensive API documentation',
    variables: ['code', 'api_type'],
    prompt: `[ROLE] Technical writer and API documentation specialist with experience in developer experience (DX)

[CONTEXT]
Creating documentation for {{api_type:REST API}} endpoint/function

[CODE]
\`\`\`
{{code}}
\`\`\`

[TASK]
Generate comprehensive API documentation

[FORMAT]
## Overview
Brief description of what this endpoint/function does

## Endpoint/Signature
\`METHOD /path\` or \`function signature\`

## Parameters
| Name | Type | Required | Description | Default |
|------|------|----------|-------------|---------|

## Request Example
\`\`\`json
{
  // Example request body
}
\`\`\`

## Response
### Success (200)
\`\`\`json
{
  // Example response
}
\`\`\`

### Errors
| Code | Message | Description |
|------|---------|-------------|

## Usage Examples
### Basic Usage
### With Options
### Error Handling

## Notes & Best Practices

[QUALITY]
- Include realistic example values
- Cover edge cases
- Add copy-paste ready examples
- Follow OpenAPI/JSDoc conventions where applicable`
  },
  {
    id: 'refactor',
    name: 'Code Refactoring',
    emoji: '♻️',
    category: 'coding',
    description: 'Refactor code with best practices',
    variables: ['code', 'goals'],
    prompt: `[ROLE] Software architect specializing in clean code, design patterns, and refactoring legacy systems

[CONTEXT]
Refactoring existing code for: {{goals:improved readability, performance, and maintainability}}

[ORIGINAL CODE]
\`\`\`
{{code}}
\`\`\`

[TASK]
Refactor this code following SOLID principles and clean code practices

[FORMAT]
## 🎯 Refactoring Goals
What we're optimizing for

## 📊 Code Analysis
Current issues identified:
- Issue 1
- Issue 2

## ✨ Refactored Code
\`\`\`
// Fully refactored, production-ready code
\`\`\`

## 📝 Changes Made
| Change | Reason | Benefit |
|--------|--------|---------|

## 🧪 Testing Considerations
What to test after refactoring

## 📈 Metrics Improvement
- Readability: Before → After
- Maintainability: Before → After
- Performance: Before → After

[QUALITY]
- Preserve all functionality
- Add helpful comments
- Follow language conventions
- Consider backwards compatibility`
  },

  // ===== WRITING TEMPLATES =====
  {
    id: 'blog-post',
    name: 'Blog Post Pro',
    emoji: '📝',
    category: 'writing',
    description: 'SEO-optimized blog post with engagement hooks',
    variables: ['topic', 'audience', 'tone', 'word_count'],
    prompt: `[ROLE] Expert content strategist and SEO specialist with 10+ years in content marketing

[CONTEXT]
- Topic: {{topic}}
- Target Audience: {{audience:tech professionals}}
- Tone: {{tone:professional yet approachable}}
- Length: {{word_count:1500}} words

[TASK]
Write a comprehensive, engaging blog post that provides genuine value

[FORMAT]
## [Attention-Grabbing Headline]
(Include power words, numbers, or questions)

### Hook (First 2-3 sentences)
Start with a surprising stat, question, or relatable pain point

### Introduction
Set context and promise value (what reader will learn)

### Main Content
Use H2 headers for 3-5 main sections
Include:
- Practical examples
- Data/statistics where relevant
- [IMAGE SUGGESTION: description]
- Pull quotes for key insights

### Key Takeaways
- Bullet point summary
- Actionable next steps

### Call-to-Action
Specific next step for the reader

---
**SEO Elements:**
- Meta Description (155 chars):
- Target Keywords:
- Internal Link Opportunities: [LINK: topic]

[QUALITY]
- Lead with value, not fluff
- Every paragraph should teach something
- Include surprising insight or contrarian take
- Flesch reading score: 60+
- Scannable with subheadings every 300 words`
  },
  {
    id: 'email-pro',
    name: 'Email Composer',
    emoji: '📧',
    category: 'writing',
    description: 'Professional emails that get responses',
    variables: ['purpose', 'recipient', 'context', 'tone'],
    prompt: `[ROLE] Communication expert specializing in business writing and persuasion

[CONTEXT]
- Purpose: {{purpose}}
- Recipient: {{recipient}}
- Background: {{context}}
- Tone: {{tone:professional}}

[TASK]
Write an effective email that achieves the intended purpose

[FORMAT]
**Subject Line Options:**
1. [Direct approach]
2. [Curiosity-driven]
3. [Benefit-focused]

---

**Email:**

[Greeting]

[Opening: Context/connection - 1 sentence]

[Body: Main message - 2-3 short paragraphs]
- What you need/offering
- Why it matters to them
- Supporting details

[Clear Call-to-Action: Specific next step]

[Professional closing]

---

**Why This Works:**
- [Explanation of persuasion techniques used]

**Alternatives:**
- Shorter version for busy executives
- Follow-up version if no response

[QUALITY]
- Subject line under 50 characters
- Email readable in under 30 seconds
- One clear ask per email
- Mobile-friendly (short paragraphs)
- No jargon or filler words`
  },
  {
    id: 'explain-concept',
    name: 'Concept Explainer',
    emoji: '🧒',
    category: 'writing',
    description: 'Explain complex topics simply with analogies',
    variables: ['concept', 'audience_level', 'context'],
    prompt: `[ROLE] Expert educator known for making complex topics accessible through analogies and storytelling

[CONTEXT]
- Concept: {{concept}}
- Audience Level: {{audience_level:beginner with no prior knowledge}}
- Application Context: {{context:general understanding}}

[TASK]
Explain this concept in a way that creates genuine understanding, not just surface knowledge

[FORMAT]
## 🎯 One-Sentence Summary
(If you can only remember one thing...)

## 🏠 The Analogy
Real-world comparison that makes this click

## 📖 The Explanation
Build up from first principles:
1. Start with what they already know
2. Introduce new concept gradually
3. Connect back to the analogy

## 💡 Why It Matters
Practical implications and applications

## 🔧 Example in Action
Concrete scenario showing this concept

## ❓ Common Misconceptions
What people often get wrong

## 🎓 Going Deeper
For those who want to learn more:
- Next concepts to explore
- Resources

## ✅ Quick Check
"You understand this if you can explain why..."

[QUALITY]
- No jargon without definition
- Multiple analogies for different thinking styles
- Build on familiar concepts
- Test understanding, don't just inform`
  },

  // ===== ANALYSIS TEMPLATES =====
  {
    id: 'data-analysis',
    name: 'Data Analysis Pro',
    emoji: '📊',
    category: 'analysis',
    description: 'Comprehensive data analysis with insights',
    variables: ['data', 'context', 'goal'],
    prompt: `[ROLE] Senior data analyst with expertise in statistical analysis, pattern recognition, and business intelligence

[CONTEXT]
- Business Context: {{context}}
- Analysis Goal: {{goal}}

[DATA]
{{data}}

[TASK]
Perform comprehensive analysis and extract actionable insights

[FORMAT]
## 📋 Executive Summary
(3-4 bullet points - key findings only, for decision-makers)

## 📈 Key Metrics
| Metric | Value | vs Previous | Status |
|--------|-------|-------------|--------|

## 🔍 Detailed Analysis

### Trends
- Trend 1: [description with numbers]
- Trend 2: [description with numbers]

### Patterns
- Notable pattern with explanation

### Anomalies
- Any outliers or unexpected data points

### Correlations
- Relationships found (noting correlation ≠ causation)

## 💡 Insights & Recommendations
| Finding | Implication | Recommended Action | Priority |
|---------|-------------|-------------------|----------|

## ⚠️ Limitations & Caveats
- Data quality notes
- What this analysis cannot tell us

## 📋 Next Steps
1. Immediate actions
2. Further analysis needed

[QUALITY]
- Quantify all claims
- Distinguish correlation from causation
- Include confidence levels
- Make recommendations specific and actionable
- Consider statistical significance`
  },
  {
    id: 'swot-analysis',
    name: 'SWOT Analysis',
    emoji: '🎯',
    category: 'analysis',
    description: 'Strategic SWOT analysis with action items',
    variables: ['subject', 'context', 'goal'],
    prompt: `[ROLE] Strategic consultant with expertise in competitive analysis and business strategy

[CONTEXT]
- Subject: {{subject}}
- Context: {{context}}
- Strategic Goal: {{goal}}

[TASK]
Perform a comprehensive SWOT analysis with actionable strategies

[FORMAT]
## 📊 SWOT Matrix

### 💪 Strengths (Internal Positives)
| Strength | Evidence | Strategic Value |
|----------|----------|-----------------|
| 1. | | High/Medium/Low |

### 🎯 Weaknesses (Internal Negatives)
| Weakness | Impact | Urgency to Address |
|----------|--------|-------------------|
| 1. | | High/Medium/Low |

### 🚀 Opportunities (External Positives)
| Opportunity | Potential Impact | Feasibility |
|-------------|------------------|-------------|
| 1. | | High/Medium/Low |

### ⚠️ Threats (External Negatives)
| Threat | Likelihood | Mitigation Strategy |
|--------|------------|---------------------|
| 1. | | |

## 🎮 Strategic Recommendations

### SO Strategies (Strengths → Opportunities)
How to use strengths to capture opportunities

### WO Strategies (Weaknesses → Opportunities)
How to overcome weaknesses to capture opportunities

### ST Strategies (Strengths → Threats)
How to use strengths to avoid threats

### WT Strategies (Weaknesses → Threats)
How to minimize weaknesses and avoid threats

## 📋 Priority Action Plan
| Action | Type | Timeline | Owner | Success Metric |
|--------|------|----------|-------|----------------|

[QUALITY]
- Be specific, not generic
- Include evidence for each point
- Prioritize by impact and feasibility
- Make strategies actionable`
  },
  {
    id: 'meeting-summary',
    name: 'Meeting Summarizer',
    emoji: '📋',
    category: 'analysis',
    description: 'Extract key points and action items from meetings',
    variables: ['notes', 'meeting_type'],
    prompt: `[ROLE] Executive assistant expert in meeting facilitation and action item tracking

[CONTEXT]
Meeting Type: {{meeting_type:team sync}}

[MEETING NOTES/TRANSCRIPT]
{{notes}}

[TASK]
Extract structured summary with clear action items and decisions

[FORMAT]
## 📅 Meeting Summary

### 🎯 Purpose & Outcome
One sentence on what this meeting accomplished

### ✅ Decisions Made
| Decision | Rationale | Impact |
|----------|-----------|--------|

### 📋 Action Items
| # | Task | Owner | Deadline | Priority |
|---|------|-------|----------|----------|
| 1 | | | | 🔴/🟡/🟢 |

### 💬 Key Discussion Points
- **Topic 1**: Summary of discussion and conclusions
- **Topic 2**: Summary of discussion and conclusions

### ❓ Open Questions / Parking Lot
- Question 1 (needs follow-up by: person)

### 📅 Next Steps
- Next meeting: [date/topic if mentioned]
- Follow-ups needed before then

### 📎 References Mentioned
- Documents, links, or resources mentioned

[QUALITY]
- Action items must be specific and assignable
- Include context for each decision
- Note any disagreements or concerns raised
- Highlight blockers or dependencies`
  },

  // ===== CREATIVE TEMPLATES =====
  {
    id: 'brainstorm',
    name: 'Idea Generator',
    emoji: '💡',
    category: 'creative',
    description: 'Generate diverse ideas from safe to bold',
    variables: ['challenge', 'context', 'constraints'],
    prompt: `[ROLE] Creative strategist and innovation consultant with expertise in design thinking and ideation

[CONTEXT]
- Challenge: {{challenge}}
- Background: {{context}}
- Constraints: {{constraints:none specified}}

[TASK]
Generate diverse, actionable ideas ranging from safe to bold

[FORMAT]
## 🎯 Challenge Reframe
Alternative ways to think about this problem

## 💡 Ideas Spectrum

### 🟢 Safe Bets (Low risk, proven approaches)
| Idea | Why It Works | Effort | Impact |
|------|--------------|--------|--------|
| 1. | | Low/Med/High | Low/Med/High |

### 🟡 Strategic Moves (Moderate risk, good potential)
| Idea | Innovation | Effort | Impact |
|------|------------|--------|--------|
| 1. | | | |

### 🔴 Moonshots (High risk, high reward)
| Idea | What If... | Breakthrough Potential |
|------|------------|----------------------|
| 1. | | |

### 🎲 Wild Cards (Unexpected angles)
| Idea | Surprising Because... |
|------|----------------------|
| 1. | |

## ⭐ Top 3 Recommendations
Based on your constraints, I'd prioritize:
1. **[Idea]**: Because [reasoning]
2. **[Idea]**: Because [reasoning]
3. **[Idea]**: Because [reasoning]

## 🔄 Combination Ideas
Ideas that could work together for amplified effect

## 📋 Quick Start
Fastest path to testing the top idea

[QUALITY]
- At least 10 distinct ideas
- Range from obvious to unexpected
- Include rationale for each
- Consider resource constraints
- Suggest ways to test/validate`
  },
  {
    id: 'product-description',
    name: 'Product Copy Pro',
    emoji: '🛍️',
    category: 'creative',
    description: 'Persuasive product descriptions that convert',
    variables: ['product', 'target_customer', 'key_features', 'price_point'],
    prompt: `[ROLE] Conversion copywriter specializing in e-commerce and product marketing

[CONTEXT]
- Product: {{product}}
- Target Customer: {{target_customer}}
- Key Features: {{key_features}}
- Price Point: {{price_point:mid-range}}

[TASK]
Write compelling product copy that drives conversions

[FORMAT]
## 🏷️ Headlines (Pick One)
1. [Benefit-focused]
2. [Problem-solution]
3. [Social proof angle]

## 📝 Short Description (50 words)
For product cards and previews

## 📄 Full Description

### The Hook
(Address pain point or desire immediately)

### Key Benefits
✨ **[Benefit 1]**: [How it helps them]
✨ **[Benefit 2]**: [How it helps them]  
✨ **[Benefit 3]**: [How it helps them]

### Features That Matter
(Technical specs that support the benefits)

### Social Proof
[Testimonial format or usage statistics]

### Risk Reversal
[Guarantee, return policy, or trust builder]

### Call-to-Action
[Specific, urgent, clear]

## 📱 Variations
- **Instagram Caption**: 
- **Tweet**: 
- **Email Subject Line**: 

## 🎯 A/B Test Suggestions
Elements to test for optimization

[QUALITY]
- Benefits before features
- Sensory and emotional language
- Address objections preemptively
- Create urgency without being pushy
- Mobile-scannable formatting`
  },
  {
    id: 'story-writer',
    name: 'Story Crafter',
    emoji: '✨',
    category: 'creative',
    description: 'Creative storytelling with narrative structure',
    variables: ['genre', 'theme', 'setting', 'tone', 'length'],
    prompt: `[ROLE] Published author and creative writing instructor with expertise in {{genre}} fiction

[CONTEXT]
- Genre: {{genre}}
- Theme: {{theme}}
- Setting: {{setting}}
- Tone: {{tone:engaging}}
- Length: {{length:1000 words}}

[TASK]
Craft a compelling story with strong narrative structure

[FORMAT]
# [Story Title]

## Opening Hook
(First paragraph that demands the reader continues)

## Story
(Full narrative with:)
- Vivid sensory details
- Character with clear motivation
- Rising tension
- Meaningful dialogue (if appropriate)
- Satisfying resolution or thought-provoking ending

---

## 📝 Craft Notes
**Narrative Techniques Used:**
- [Technique 1]: How it serves the story
- [Technique 2]: How it serves the story

**Theme Exploration:**
How the theme is woven throughout

**Character Arc:**
Brief analysis of character development

[QUALITY]
- Show, don't tell
- Distinct character voices
- Sensory-rich descriptions
- Emotional resonance
- Memorable opening and closing lines
- Subtext and layers`
  },

  // ===== BUSINESS TEMPLATES =====
  {
    id: 'business-plan',
    name: 'Business Case Builder',
    emoji: '💼',
    category: 'business',
    description: 'Create compelling business cases and proposals',
    variables: ['initiative', 'problem', 'solution', 'investment'],
    prompt: `[ROLE] Management consultant and business strategist with expertise in ROI analysis and executive communication

[CONTEXT]
- Initiative: {{initiative}}
- Problem Being Solved: {{problem}}
- Proposed Solution: {{solution}}
- Investment Required: {{investment}}

[TASK]
Create a compelling business case that drives approval

[FORMAT]
## 📋 Executive Summary
(One paragraph: problem, solution, ROI, ask)

## 🎯 Problem Statement
### Current State
- Pain points with quantified impact
- Cost of inaction

### Desired State
- Vision of success
- Strategic alignment

## 💡 Proposed Solution
### Overview
### Key Components
### Implementation Approach

## 📊 Financial Analysis
| Category | Year 1 | Year 2 | Year 3 |
|----------|--------|--------|--------|
| Investment | | | |
| Benefits | | | |
| Net Value | | | |

**ROI**: X%
**Payback Period**: X months

## ⚖️ Risk Assessment
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|

## 📅 Implementation Timeline
| Phase | Duration | Key Milestones |
|-------|----------|----------------|

## ✅ Recommendation
Clear ask with specific next steps

## 📎 Appendix
Supporting data and assumptions

[QUALITY]
- Lead with business impact
- Quantify everything possible
- Address objections proactively
- Make the ask crystal clear
- Executive-scannable format`
  },
  {
    id: 'presentation-outline',
    name: 'Presentation Designer',
    emoji: '🎤',
    category: 'business',
    description: 'Structure impactful presentations',
    variables: ['topic', 'audience', 'duration', 'goal'],
    prompt: `[ROLE] Presentation coach and communication strategist who has helped executives deliver high-stakes presentations

[CONTEXT]
- Topic: {{topic}}
- Audience: {{audience}}
- Duration: {{duration:15 minutes}}
- Goal: {{goal}}

[TASK]
Design a presentation structure that engages, informs, and persuades

[FORMAT]
## 🎯 Presentation Strategy
**Core Message**: (One sentence the audience should remember)
**Audience Insight**: (What they care about, what they fear)
**Success Metric**: (How we know it worked)

## 📑 Slide Deck Structure

### Opening ({{opening_time}})
| Slide | Content | Notes |
|-------|---------|-------|
| 1 | Title + Hook | [Surprising stat or question] |
| 2 | Why This Matters | [Connect to audience's world] |

### Main Content ({{main_time}})
| Slide | Key Point | Visual Suggestion | Transition |
|-------|-----------|------------------|------------|
| 3 | | | |
| 4 | | | |
| 5 | | | |

### Close ({{close_time}})
| Slide | Content | Notes |
|-------|---------|-------|
| N-1 | Key Takeaways | [Rule of 3] |
| N | Call-to-Action | [Specific ask] |

## 🎤 Speaker Notes
### Opening Hook
[Word-for-word script for first 30 seconds]

### Key Transitions
- From [topic] to [topic]: "[transition phrase]"

### Memorable Phrases
- "[Quotable line]"

### Q&A Prep
| Likely Question | Suggested Response |
|-----------------|-------------------|

## 💡 Delivery Tips
- Pause after: [key moments]
- Gesture when: [specific points]
- Eye contact priority: [if hybrid/recorded]

[QUALITY]
- One idea per slide
- Visual > Text
- Story arc throughout
- End with clear action
- Rehearsal timing notes`
  }
];

// Export for use in extension
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ADVANCED_TEMPLATES;
}
