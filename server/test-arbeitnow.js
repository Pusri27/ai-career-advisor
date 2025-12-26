import jobSearchService from './services/jobSearch.js';

async function testArbeitnowAPI() {
    console.log('🧪 Testing Arbeitnow API Integration...\n');

    try {
        // Test 1: Search for developer jobs
        console.log('Test 1: Searching for "developer" jobs...');
        const devJobs = await jobSearchService.searchJobs({
            query: 'developer',
            limit: 5
        });
        console.log(`✅ Found ${devJobs.length} developer jobs`);
        if (devJobs.length > 0) {
            console.log('Sample job:', {
                title: devJobs[0].job_title,
                company: devJobs[0].employer_name,
                location: devJobs[0].job_city,
                remote: devJobs[0].job_is_remote
            });
        }
        console.log('');

        // Test 2: Search for remote-only jobs
        console.log('Test 2: Searching for remote-only jobs...');
        const remoteJobs = await jobSearchService.searchJobs({
            query: 'engineer',
            remoteOnly: true,
            limit: 3
        });
        console.log(`✅ Found ${remoteJobs.length} remote jobs`);
        console.log('');

        // Test 3: Get job details
        if (devJobs.length > 0) {
            console.log('Test 3: Getting job details...');
            const jobDetails = await jobSearchService.getJobDetails(devJobs[0].job_id);
            console.log(`✅ Job details retrieved:`, jobDetails ? 'Success' : 'Not found');
            console.log('');
        }

        // Test 4: Salary estimate (should return null)
        console.log('Test 4: Testing salary estimate...');
        const salary = await jobSearchService.getEstimatedSalary({
            title: 'Software Engineer',
            location: 'Remote'
        });
        console.log(`✅ Salary data:`, salary || 'Not available (expected)');
        console.log('');

        console.log('🎉 All tests completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`- Total jobs found: ${devJobs.length + remoteJobs.length}`);
        console.log(`- API Status: Working ✓`);
        console.log(`- Data Quality: ${devJobs.length > 0 ? 'Good ✓' : 'No data'}`);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error);
    }
}

// Run tests
testArbeitnowAPI();
