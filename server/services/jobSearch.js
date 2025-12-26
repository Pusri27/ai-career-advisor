import axios from 'axios';

class JobSearchService {
    constructor() {
        this.baseURL = 'https://www.arbeitnow.com/api/job-board-api';
    }

    /**
     * Search jobs using Arbeitnow API
     * @param {Object} options - Search options
     * @param {string} options.query - Job title or keywords
     * @param {string} options.location - Location (not used by Arbeitnow, but kept for compatibility)
     * @param {boolean} options.remoteOnly - Filter remote jobs only
     * @param {number} options.limit - Number of results (default: 10)
     * @returns {Promise<Array>} Array of job listings
     */
    async searchJobs(options = {}) {
        try {
            // Support both object and string parameter for backward compatibility
            const query = typeof options === 'string' ? options : (options.query || '');
            const limit = options.limit || 10;
            const remoteOnly = options.remoteOnly || false;

            console.log(`[JobSearch] Searching jobs with query: "${query}", remoteOnly: ${remoteOnly}`);

            // Arbeitnow API endpoint
            const response = await axios.get(this.baseURL, {
                timeout: 10000,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.data || !response.data.data) {
                console.error('[JobSearch] Invalid response structure');
                return [];
            }

            let jobs = response.data.data;


            // Filter by query if provided
            if (query && query.trim()) {
                // Split query into keywords for better matching
                const keywords = query.toLowerCase()
                    .split(/\s+/)
                    .filter(word => word.length > 2); // Filter out short words like "in", "of"

                if (keywords.length > 0) {
                    jobs = jobs.filter(job => {
                        const title = (job.title || '').toLowerCase();
                        const description = (job.description || '').toLowerCase();
                        const tags = (job.tags || []).join(' ').toLowerCase();
                        const searchText = `${title} ${description} ${tags}`;

                        // Match if ANY keyword is found (more lenient)
                        return keywords.some(keyword => searchText.includes(keyword));
                    });
                }
            }


            // Filter remote only if requested
            if (remoteOnly) {
                jobs = jobs.filter(job => job.remote === true);
            }

            // If filtering resulted in no jobs, return all jobs (fallback)
            if (jobs.length === 0 && response.data.data.length > 0) {
                console.log('[JobSearch] No matches found, returning all available jobs');
                jobs = response.data.data.slice(0, limit);
            } else {
                // Limit results
                jobs = jobs.slice(0, limit);
            }

            // Transform to our format
            const transformedJobs = jobs.map(job => this.transformJob(job));

            console.log(`[JobSearch] Found ${transformedJobs.length} jobs`);
            return transformedJobs;

        } catch (error) {
            console.error('[JobSearch] Error fetching jobs:', error.message);

            // Return empty array on error instead of throwing
            // This prevents the entire job matching feature from breaking
            return [];
        }
    }

    /**
     * Transform Arbeitnow job format to our standard format
     * @param {Object} job - Raw job data from Arbeitnow
     * @returns {Object} Transformed job object
     */
    transformJob(job) {
        return {
            job_id: job.slug || job.id || `job-${Date.now()}-${Math.random()}`,
            job_title: job.title || 'Untitled Position',
            employer_name: job.company_name || 'Company',
            employer_logo: job.company_logo || null,
            job_description: this.cleanDescription(job.description || ''),
            job_city: job.location || 'Remote',
            job_country: this.extractCountry(job.location),
            job_employment_type: job.job_types?.[0] || 'Full-time',
            job_is_remote: job.remote || true,
            job_apply_link: job.url || '#',
            job_publisher: 'Arbeitnow',
            job_posted_at: job.created_at || new Date().toISOString(),
            tags: job.tags || [],
            // Arbeitnow doesn't provide salary data
            job_min_salary: null,
            job_max_salary: null,
            // Additional metadata
            _source: 'arbeitnow',
            _raw_location: job.location
        };
    }

    /**
     * Clean HTML from job description
     * @param {string} description - Raw description (may contain HTML)
     * @returns {string} Cleaned text
     */
    cleanDescription(description) {
        if (!description) return '';

        // Remove HTML tags
        let cleaned = description.replace(/<[^>]*>/g, ' ');

        // Remove extra whitespace
        cleaned = cleaned.replace(/\s+/g, ' ').trim();

        // Limit length for display
        if (cleaned.length > 500) {
            cleaned = cleaned.substring(0, 500) + '...';
        }

        return cleaned;
    }

    /**
     * Extract country from location string
     * @param {string} location - Location string
     * @returns {string} Country name or 'Remote'
     */
    extractCountry(location) {
        if (!location) return 'Remote';

        // Common patterns
        const parts = location.split(',').map(p => p.trim());

        // If location is just "Remote" or similar
        if (location.toLowerCase().includes('remote')) {
            return 'Remote';
        }

        // Last part is usually country
        if (parts.length > 1) {
            return parts[parts.length - 1];
        }

        return location;
    }

    /**
     * Get job details by slug/id
     * @param {string} slug - Job slug or ID
     * @returns {Promise<Object|null>} Job details or null
     */
    async getJobDetails(slug) {
        try {
            // Arbeitnow doesn't have a single job endpoint
            // So we fetch all and filter
            const allJobs = await this.searchJobs('', 100);
            const job = allJobs.find(j => j.job_id === slug);

            return job || null;
        } catch (error) {
            console.error('[JobSearch] Error fetching job details:', error.message);
            return null;
        }
    }

    /**
     * Get estimated salary for a job title
     * Note: Arbeitnow doesn't provide salary data, so this returns null
     * @param {Object} options - Salary query options
     * @param {string} options.title - Job title
     * @param {string} options.location - Location
     * @returns {Promise<Object|null>} Salary estimate or null
     */
    async getEstimatedSalary(options = {}) {
        console.log('[JobSearch] Salary data not available from Arbeitnow API');

        // Return null since Arbeitnow doesn't provide salary data
        // In the future, this could integrate with another API for salary estimates
        return null;
    }
}

// Export singleton instance
export default new JobSearchService();
