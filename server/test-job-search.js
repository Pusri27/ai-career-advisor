import jobSearchService from './services/jobSearch.js';

async function testJobSearchVariations() {
    console.log('🧪 Testing Job Search with Various Queries...\n');

    const testCases = [
        { query: 'developer', expected: 'Should find developer jobs' },
        { query: 'Senior Software Developer', expected: 'Should find jobs with keywords' },
        { query: 'frontend', expected: 'Should find frontend jobs' },
        { query: 'engineer', expected: 'Should find engineer jobs' },
        { query: '', expected: 'Should return all jobs (no filter)' },
        { query: 'xyz123nonexistent', expected: 'Should fallback to all jobs' }
    ];

    for (const testCase of testCases) {
        console.log(`\n📋 Test: "${testCase.query || '(empty)'}"`);
        console.log(`   Expected: ${testCase.expected}`);

        try {
            const jobs = await jobSearchService.searchJobs({
                query: testCase.query,
                limit: 3
            });

            console.log(`   ✅ Result: Found ${jobs.length} jobs`);
            if (jobs.length > 0) {
                console.log(`   📌 Sample: "${jobs[0].job_title}" at ${jobs[0].employer_name}`);
            }
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
    }

    console.log('\n\n🎉 All tests completed!');
}

testJobSearchVariations();
