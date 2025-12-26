import axios from 'axios';

class OpenRouterService {
    constructor() {
        this.baseURL = 'https://openrouter.ai/api/v1';
    }

    // Lazy-load API key to ensure dotenv is loaded first
    get apiKey() {
        return process.env.OPENROUTER_API_KEY;
    }

    get chatModel() {
        return process.env.OPENROUTER_MODEL_CHAT || 'xiaomi/mimo-v2-flash:free';
    }

    get jsonModel() {
        return process.env.OPENROUTER_MODEL_JSON || 'openai/gpt-3.5-turbo';
    }

    // Backward compatibility
    get model() {
        return this.chatModel;
    }

    async generateResponse(prompt, context = '') {
        try {
            const fullPrompt = context ? `${context}\n\n${prompt}` : prompt;

            const response = await axios.post(
                `${this.baseURL}/chat/completions`,
                {
                    model: this.model,
                    messages: [
                        { role: 'user', content: fullPrompt }
                    ]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'http://localhost:5001',
                        'X-Title': 'AI Career Advisor'
                    }
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('OpenRouter API Error:', error.response?.data || error.message);
            throw new Error('Failed to generate AI response');
        }
    }

    async generateJSON(prompt, context = '', useGPT = false) {
        try {
            // Only use GPT-3.5 if explicitly requested (for Learning Path)
            const modelToUse = useGPT ? this.jsonModel : this.chatModel;
            console.log(`[OpenRouter] Using model for JSON: ${modelToUse} (useGPT: ${useGPT})`);
            const jsonPrompt = `${prompt}\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, just pure JSON.`;
            const fullPrompt = context ? `${context}\n\n${jsonPrompt}` : jsonPrompt;

            const response = await axios.post(
                `${this.baseURL}/chat/completions`,
                {
                    model: modelToUse,
                    messages: [
                        { role: 'user', content: fullPrompt }
                    ]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'http://localhost:5001',
                        'X-Title': 'AI Career Advisor'
                    }
                }
            );

            const text = response.data.choices[0].message.content;

            // Clean up response - remove markdown code blocks if present
            let cleanedText = text
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();

            // Try to parse JSON
            try {
                return JSON.parse(cleanedText);
            } catch (parseError) {
                console.log('[OpenRouter] Initial JSON parse failed, attempting repair...');

                // Attempt to repair common JSON issues
                // 1. Remove trailing commas
                cleanedText = cleanedText.replace(/,(\s*[}\]])/g, '$1');

                // 2. Try to find valid JSON object/array
                const jsonMatch = cleanedText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
                if (jsonMatch) {
                    try {
                        return JSON.parse(jsonMatch[0]);
                    } catch (e) {
                        console.error('[OpenRouter] JSON repair failed');
                    }
                }

                // 3. Last resort: try to extract partial valid JSON
                console.error('[OpenRouter] Could not parse JSON response:', cleanedText.substring(0, 500));
                throw new Error('Failed to generate structured AI response');
            }
        } catch (error) {
            console.error('OpenRouter JSON Error:', error.response?.data || error.message);
            throw new Error('Failed to generate structured AI response');
        }
    }

    async chat(messages) {
        try {
            // Clean messages - only keep role and content
            const cleanMessages = messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            console.log('OpenRouter Request - API Key exists:', !!this.apiKey);
            console.log('OpenRouter Request - Model:', this.model);

            const response = await axios.post(
                `${this.baseURL}/chat/completions`,
                {
                    model: this.model,
                    messages: cleanMessages
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'http://localhost:5001',
                        'X-Title': 'AI Career Advisor'
                    }
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('OpenRouter Chat Error:', error.response?.data || error.message);
            throw new Error('Failed to generate chat response');
        }
    }
}

export default new OpenRouterService();
