import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function testOpenRouter() {
    try {
        console.log('🧪 Testing OpenRouter API...\n');

        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo',
                messages: [
                    { role: 'user', content: 'Say "Hello from AI Career Advisor!" in a friendly way.' }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:5000',
                    'X-Title': 'AI Career Advisor Test'
                }
            }
        );

        console.log('✅ API Key Valid!');
        console.log('📝 Model Used:', response.data.model || process.env.OPENROUTER_MODEL || 'openai/gpt-3.5-turbo');
        console.log('💬 Response:', response.data.choices[0].message.content);
        console.log('\n🎉 OpenRouter is working correctly!\n');

    } catch (error) {
        console.error('❌ Error testing OpenRouter:');
        console.error(error.response?.data || error.message);
        process.exit(1);
    }
}

testOpenRouter();
