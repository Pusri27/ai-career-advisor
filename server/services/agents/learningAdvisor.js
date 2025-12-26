import openrouterService from '../gemini.js';
import { PROMPTS } from '../../utils/prompts.js';

class LearningAdvisorAgent {
    constructor() {
        this.name = 'Learning Advisor';
        this.description = 'Recommends learning paths and resources';
    }

    async recommend(profile, skillGaps = []) {
        try {
            const prompt = `Based on this career profile, create a personalized learning path with REAL course recommendations:

Profile:
- Current Role: ${profile.currentRole || 'Not specified'}
- Target Role: ${profile.targetRole || 'Not specified'}
- Skills: ${profile.skills?.map(s => `${s.name} (${s.level}%)`).join(', ') || 'None'}
- Experience: ${profile.yearsOfExperience || 0} years

CRITICAL: Provide COMPLETE, WORKING URLs. Here are EXACT examples:

GOOD URL Examples:
- "https://www.udemy.com/course/react-the-complete-guide/"
- "https://www.coursera.org/learn/machine-learning"
- "https://www.youtube.com/watch?v=Ke90Tje7VS0"
- "https://www.freecodecamp.org/learn/responsive-web-design/"
- "https://www.codecademy.com/learn/learn-python-3"

BAD URL Examples (DO NOT USE):
- "udemy.com/course/[course-name]" ❌
- "search on platform" ❌
- "https://platform.com/course-name" ❌

For each course, use REAL course names and COMPLETE URLs from these platforms:
1. Udemy - Find actual course URLs like: https://www.udemy.com/course/the-complete-web-development-bootcamp/
2. Coursera - Use real course slugs: https://www.coursera.org/learn/python
3. YouTube - Link to actual playlists or videos: https://www.youtube.com/watch?v=PkZNo7MFNFg
4. FreeCodeCamp - Use their curriculum: https://www.freecodecamp.org/learn/
5. Codecademy - Real course paths: https://www.codecademy.com/learn/learn-javascript

Generate a JSON response with this EXACT structure:
{
    "recommendedCourses": [
        {
            "title": "The Complete Web Development Bootcamp",
            "platform": "Udemy",
            "url": "https://www.udemy.com/course/the-complete-web-development-bootcamp/",
            "duration": "65 hours",
            "level": "Beginner",
            "description": "Learn HTML, CSS, JavaScript, Node, React, MongoDB and more"
        }
    ],
    "learningPriorities": ["Master JavaScript fundamentals", "Build real projects", "Learn modern frameworks"],
    "estimatedTimeframe": "3-6 months with consistent practice"
}

Provide 5-8 courses with COMPLETE, WORKING URLs. Double-check each URL is valid!`;
            const result = await openrouterService.generateJSON(prompt, PROMPTS.LEARNING_ADVISOR.system, true); // Use GPT-3.5 for reliable JSON
            return {
                success: true,
                agent: this.name,
                data: result
            };
        } catch (error) {
            console.error('Learning Advisor Error:', error);
            return {
                success: false,
                agent: this.name,
                error: error.message
            };
        }
    }
}

export default new LearningAdvisorAgent();
