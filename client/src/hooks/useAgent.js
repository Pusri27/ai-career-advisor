import { useState, useCallback } from 'react';
import { agentAPI } from '../services/api';

export const useAgent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const analyzeSkills = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await agentAPI.analyzeSkills();
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to analyze skills');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getCareerAdvice = useCallback(async (question = '') => {
        setLoading(true);
        setError(null);
        try {
            const response = await agentAPI.getCareerAdvice(question);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to get career advice');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const matchJobs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await agentAPI.matchJobs();
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to match jobs');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getLearningPath = useCallback(async (skillGaps = []) => {
        setLoading(true);
        setError(null);
        try {
            const response = await agentAPI.getLearningPath(skillGaps);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to get learning path');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const runFullAnalysis = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await agentAPI.fullAnalysis();
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to run full analysis');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const chat = useCallback(async (message, sessionId = null) => {
        setLoading(true);
        setError(null);
        try {
            const response = await agentAPI.chat(message, sessionId);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        analyzeSkills,
        getCareerAdvice,
        matchJobs,
        getLearningPath,
        runFullAnalysis,
        chat
    };
};
