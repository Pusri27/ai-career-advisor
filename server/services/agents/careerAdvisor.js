import openrouterService from '../gemini.js';
import { PROMPTS } from '../../utils/prompts.js';

class CareerAdvisorAgent {
    constructor() {
        this.name = 'Career Advisor';
        this.description = 'Provides strategic career path recommendations';
    }

    async advise(profile, question = '') {
        try {
            const prompt = PROMPTS.CAREER_ADVISOR.advise(profile, question);
            const result = await openrouterService.generateJSON(prompt, PROMPTS.CAREER_ADVISOR.system);
            return {
                success: true,
                agent: this.name,
                data: result
            };
        } catch (error) {
            console.error('Career Advisor Error:', error);
            return {
                success: false,
                agent: this.name,
                error: error.message
            };
        }
    }
}

export default new CareerAdvisorAgent();
