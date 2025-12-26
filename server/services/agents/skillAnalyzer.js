import openrouterService from '../gemini.js';
import { PROMPTS } from '../../utils/prompts.js';

class SkillAnalyzerAgent {
    constructor() {
        this.name = 'Skill Analyzer';
        this.description = 'Analyzes skills and identifies gaps for career goals';
    }

    async analyze(profile) {
        try {
            const prompt = PROMPTS.SKILL_ANALYZER.analyze(profile);
            const result = await openrouterService.generateJSON(prompt, PROMPTS.SKILL_ANALYZER.system);
            return {
                success: true,
                agent: this.name,
                data: result
            };
        } catch (error) {
            console.error('Skill Analyzer Error:', error);
            return {
                success: false,
                agent: this.name,
                error: error.message
            };
        }
    }
}

export default new SkillAnalyzerAgent();
