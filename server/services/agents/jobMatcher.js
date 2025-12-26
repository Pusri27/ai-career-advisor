import openrouterService from '../gemini.js';
import { PROMPTS } from '../../utils/prompts.js';

class JobMatcherAgent {
    constructor() {
        this.name = 'Job Matcher';
        this.description = 'Matches job listings to user profiles';
    }

    async matchJobs(profile, jobs) {
        try {
            if (!jobs || jobs.length === 0) {
                return {
                    success: true,
                    agent: this.name,
                    data: {
                        rankedJobs: [],
                        overallMarketFit: 'No jobs to analyze',
                        skillsInDemand: []
                    }
                };
            }

            const prompt = PROMPTS.JOB_MATCHER.matchJobs(profile, jobs);
            const result = await openrouterService.generateJSON(prompt, PROMPTS.JOB_MATCHER.system);
            return {
                success: true,
                agent: this.name,
                data: result
            };
        } catch (error) {
            console.error('Job Matcher Error:', error);
            return {
                success: false,
                agent: this.name,
                error: error.message
            };
        }
    }
}

export default new JobMatcherAgent();
