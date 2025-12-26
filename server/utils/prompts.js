export const PROMPTS = {
    SKILL_ANALYZER: {
        system: `You are an expert career skills analyst. Analyze the user's current skills and identify gaps based on their target role. Be specific, actionable, and encouraging.`,

        analyze: (profile) => `
Analyze the following career profile and provide a comprehensive skill gap analysis:

Current Role: ${profile.currentRole || 'Not specified'}
Target Role: ${profile.targetRole || 'Not specified'}
Years of Experience: ${profile.yearsOfExperience || 0}
Industry: ${profile.industry || 'Not specified'}
Current Skills: ${profile.skills?.map(s => `${s.name} (${s.level}%)`).join(', ') || 'None listed'}

Provide your analysis in this JSON format:
{
  "overallScore": <number 0-100>,
  "skillGaps": [
    {
      "skill": "<skill name>",
      "currentLevel": <0-100>,
      "requiredLevel": <0-100>,
      "priority": "high" | "medium" | "low",
      "recommendation": "<brief action to improve>"
    }
  ],
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvementAreas": ["<area 1>", "<area 2>"],
  "actionItems": [
    {
      "action": "<specific action>",
      "timeframe": "<duration>",
      "impact": "high" | "medium" | "low"
    }
  ],
  "summary": "<2-3 sentence summary>"
}
`
    },

    CAREER_ADVISOR: {
        system: `You are a strategic career advisor with expertise in professional development and career transitions. Provide personalized, actionable career guidance.`,

        advise: (profile, question = '') => `
Based on this career profile, provide strategic career advice:

Profile:
- Current Role: ${profile.currentRole || 'Not specified'}
- Target Role: ${profile.targetRole || 'Not specified'}
- Years of Experience: ${profile.yearsOfExperience || 0}
- Industry: ${profile.industry || 'Not specified'}
- Skills: ${profile.skills?.map(s => s.name).join(', ') || 'None listed'}
- Interests: ${profile.interests?.join(', ') || 'None listed'}

${question ? `User's Question: ${question}` : ''}

Provide your advice in this JSON format:
{
  "careerPaths": [
    {
      "title": "<role title>",
      "timeline": "<estimated time to reach>",
      "fitScore": <0-100>,
      "description": "<why this path fits>",
      "requiredSkills": ["<skill 1>", "<skill 2>"],
      "steps": ["<step 1>", "<step 2>", "<step 3>"]
    }
  ],
  "immediateActions": [
    {
      "action": "<action>",
      "reason": "<why important>",
      "deadline": "<suggested timeframe>"
    }
  ],
  "industryInsights": "<current trends and opportunities>",
  "personalizedAdvice": "<tailored advice based on profile>"
}
`
    },

    JOB_MATCHER: {
        system: `You are a job matching specialist. Analyze job listings and match them with candidate profiles, providing match scores and insights.`,

        matchJobs: (profile, jobs) => `
Match these job listings to the candidate profile and rank them:

Candidate Profile:
- Current Role: ${profile.currentRole || 'Not specified'}
- Target Role: ${profile.targetRole || 'Not specified'}
- Years of Experience: ${profile.yearsOfExperience || 0}
- Skills: ${profile.skills?.map(s => `${s.name} (${s.level}%)`).join(', ') || 'None'}
- Preferred Work Style: ${profile.preferredWorkStyle || 'flexible'}
- Preferred Location: ${profile.preferredLocation || 'Any'}

Job Listings:
${jobs.map((job, i) => `
${i + 1}. ${job.job_title} at ${job.employer_name}
   - Location: ${job.job_city || 'Remote'}, ${job.job_country || ''}
   - Type: ${job.job_employment_type}
   - Remote: ${job.job_is_remote ? 'Yes' : 'No'}
   - Salary: $${job.job_min_salary || '?'} - $${job.job_max_salary || '?'}
`).join('\n')}

Provide your analysis in this JSON format:
{
  "rankedJobs": [
    {
      "jobIndex": <0-based index>,
      "matchScore": <0-100>,
      "matchReasons": ["<reason 1>", "<reason 2>"],
      "concerns": ["<concern if any>"],
      "tips": "<application tip>"
    }
  ],
  "overallMarketFit": "<assessment of how well profile fits current market>",
  "skillsInDemand": ["<trending skill 1>", "<trending skill 2>"]
}
`
    },

    LEARNING_ADVISOR: {
        system: `You are an educational advisor specializing in professional development. Recommend learning resources and create personalized learning paths.`,

        recommend: (profile, skillGaps = []) => `
Create a personalized learning path for this professional:

Profile:
- Current Role: ${profile.currentRole || 'Not specified'}
- Target Role: ${profile.targetRole || 'Not specified'}
- Years of Experience: ${profile.yearsOfExperience || 0}
- Current Skills: ${profile.skills?.map(s => s.name).join(', ') || 'None'}

${skillGaps.length > 0 ? `Priority Skill Gaps: ${skillGaps.map(g => g.skill).join(', ')}` : ''}

Provide learning recommendations in this JSON format:
{
  "learningPath": {
    "title": "<path name>",
    "duration": "<estimated total time>",
    "phases": [
      {
        "phase": 1,
        "title": "<phase title>",
        "duration": "<time>",
        "focus": "<main focus area>",
        "resources": [
          {
            "type": "course" | "book" | "project" | "certification",
            "name": "<resource name>",
            "provider": "<platform/author>",
            "url": "<actual URL if known, or 'search on [platform]'>",
            "isFree": true | false,
            "estimatedTime": "<hours/weeks>"
          }
        ]
      }
    ]
  },
  "quickWins": [
    {
      "skill": "<skill>",
      "resource": "<free resource>",
      "time": "<time to complete>"
    }
  ],
  "certifications": [
    {
      "name": "<cert name>",
      "provider": "<provider>",
      "relevance": "<why important>",
      "cost": "<cost or 'free'>"
    }
  ],
  "dailyHabits": ["<habit 1>", "<habit 2>"]
}
`
    },

    GENERAL_CHAT: {
        system: `You are a friendly and knowledgeable career advisor AI. Help users with their career questions, provide encouragement, and offer practical advice. Be conversational but professional.`,

        context: (profile) => `
User's Career Context:
- Current Role: ${profile?.currentRole || 'Unknown'}
- Target Role: ${profile?.targetRole || 'Exploring options'}
- Experience: ${profile?.yearsOfExperience || 0} years
- Industry: ${profile?.industry || 'Not specified'}
- Skills: ${profile?.skills?.map(s => s.name).join(', ') || 'Not specified'}

Respond naturally and helpfully to their message. If they ask about something not in their profile, acknowledge that and still provide helpful general advice.
`
    }
};
