import openrouterService from './services/gemini.js';

async function testLearningPathJSON() {
    console.log('🧪 Testing Learning Path JSON Generation...\n');

    const testPrompt = `Generate a learning path for a Junior Frontend Developer who wants to become a Senior Frontend Developer.

Return ONLY valid JSON in this exact format:
{
  "learningPath": {
    "title": "Junior to Senior Frontend Developer",
    "duration": "6-12 months",
    "phases": [
      {
        "phase": 1,
        "title": "Foundation",
        "focus": "Core skills",
        "duration": "2 months",
        "resources": [
          {
            "name": "React Advanced Patterns",
            "type": "course",
            "provider": "Udemy",
            "estimatedTime": "20 hours",
            "isFree": false,
            "url": "https://example.com"
          }
        ]
      }
    ]
  },
  "quickWins": [
    {
      "skill": "TypeScript",
      "resource": "TypeScript Handbook",
      "time": "1 week"
    }
  ],
  "certifications": [],
  "dailyHabits": ["Code daily", "Read tech blogs"]
}

IMPORTANT: Return ONLY the JSON, no explanations.`;

    try {
        console.log('Sending request to OpenRouter...');
        const result = await openrouterService.generateJSON(testPrompt);

        console.log('✅ Success! Received valid JSON:');
        console.log(JSON.stringify(result, null, 2).substring(0, 500) + '...');

        console.log('\n📊 Structure check:');
        console.log('- learningPath:', result.learningPath ? '✓' : '✗');
        console.log('- quickWins:', result.quickWins ? '✓' : '✗');
        console.log('- certifications:', result.certifications ? '✓' : '✗');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('\nThis means the AI model is having trouble generating valid JSON.');
        console.error('Possible solutions:');
        console.error('1. Switch to a different model (e.g., gpt-3.5-turbo)');
        console.error('2. Use simpler prompts');
        console.error('3. Add more JSON repair logic');
    }
}

testLearningPathJSON();
