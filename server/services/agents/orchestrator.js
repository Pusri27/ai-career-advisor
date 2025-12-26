import skillAnalyzer from './skillAnalyzer.js';
import careerAdvisor from './careerAdvisor.js';
import jobMatcher from './jobMatcher.js';
import learningAdvisor from './learningAdvisor.js';
import openrouterService from '../gemini.js';
import { PROMPTS } from '../../utils/prompts.js';

class AgentOrchestrator {
    constructor() {
        this.agents = {
            skillAnalyzer,
            careerAdvisor,
            jobMatcher,
            learningAdvisor
        };
    }

    async runSkillAnalysis(profile) {
        return await this.agents.skillAnalyzer.analyze(profile);
    }

    async runCareerAdvice(profile, question = '') {
        return await this.agents.careerAdvisor.advise(profile, question);
    }

    async runJobMatching(profile, jobs) {
        return await this.agents.jobMatcher.matchJobs(profile, jobs);
    }

    async runLearningRecommendation(profile, skillGaps = []) {
        return await this.agents.learningAdvisor.recommend(profile, skillGaps);
    }

    // Run comprehensive analysis with all agents
    async runFullAnalysis(profile, jobs = []) {
        const results = await Promise.all([
            this.runSkillAnalysis(profile),
            this.runCareerAdvice(profile),
            this.runJobMatching(profile, jobs),
            this.runLearningRecommendation(profile)
        ]);

        return {
            skillAnalysis: results[0],
            careerAdvice: results[1],
            jobMatching: results[2],
            learningPath: results[3],
            timestamp: new Date().toISOString()
        };
    }

    // General chat with career context
    async chat(profile, messages) {
        try {
            console.log('=== Chat Debug ===');
            console.log('Profile:', profile ? 'exists' : 'NULL');
            console.log('Messages count:', messages.length);
            console.log('First message:', messages[0]);

            // Add system context as first user message if this is the start of conversation
            const chatMessages = [];

            if (messages.length === 1 && profile) {
                // First message - add context
                const context = PROMPTS.GENERAL_CHAT.system + '\n\n' + PROMPTS.GENERAL_CHAT.context(profile);
                chatMessages.push({
                    role: 'system',
                    content: context
                });
            }

            // Add all user/assistant messages
            chatMessages.push(...messages);

            console.log('Sending to OpenRouter:', chatMessages.length, 'messages');
            const response = await openrouterService.chat(chatMessages);
            console.log('Got response:', response ? 'success' : 'null');

            return {
                success: true,
                response
            };
        } catch (error) {
            console.error('Chat Error:', error);
            console.error('Error details:', error.response?.data);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new AgentOrchestrator();
