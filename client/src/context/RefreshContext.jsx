import { createContext, useContext, useState, useCallback } from 'react';

const RefreshContext = createContext();

export function RefreshProvider({ children }) {
    const [refreshTriggers, setRefreshTriggers] = useState({
        profile: 0,
        skills: 0,
        goals: 0,
        applications: 0,
        all: 0
    });

    // Trigger refresh for specific data type
    const triggerRefresh = useCallback((type = 'all') => {
        setRefreshTriggers(prev => ({
            ...prev,
            [type]: prev[type] + 1,
            all: prev.all + 1
        }));
    }, []);

    // Trigger multiple refreshes at once
    const triggerMultipleRefresh = useCallback((types = []) => {
        setRefreshTriggers(prev => {
            const updates = { all: prev.all + 1 };
            types.forEach(type => {
                updates[type] = prev[type] + 1;
            });
            return { ...prev, ...updates };
        });
    }, []);

    const value = {
        refreshTriggers,
        triggerRefresh,
        triggerMultipleRefresh
    };

    return (
        <RefreshContext.Provider value={value}>
            {children}
        </RefreshContext.Provider>
    );
}

export function useRefresh() {
    const context = useContext(RefreshContext);
    if (!context) {
        throw new Error('useRefresh must be used within RefreshProvider');
    }
    return context;
}

// Custom hook for auto-refresh on data changes
export function useAutoRefresh(callback, dependencies = ['all']) {
    const { refreshTriggers } = useRefresh();

    // Create dependency array from refresh triggers
    const triggerValues = dependencies.map(dep => refreshTriggers[dep]);

    // Use effect will run when any of the specified triggers change
    return triggerValues;
}
