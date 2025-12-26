import toast from 'react-hot-toast';

// Custom toast configurations
const toastConfig = {
    success: {
        duration: 3000,
        style: {
            background: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border-primary)',
            borderRadius: '12px',
            padding: '16px',
        },
        iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
        },
    },
    error: {
        duration: 4000,
        style: {
            background: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-primary)',
            border: '1px solid #ef4444',
            borderRadius: '12px',
            padding: '16px',
        },
        iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
        },
    },
    loading: {
        style: {
            background: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border-primary)',
            borderRadius: '12px',
            padding: '16px',
        },
    },
};

// Toast helpers
export const showToast = {
    success: (message) => toast.success(message, toastConfig.success),
    error: (message) => toast.error(message, toastConfig.error),
    loading: (message) => toast.loading(message, toastConfig.loading),
    promise: (promise, messages) => {
        return toast.promise(
            promise,
            {
                loading: messages.loading,
                success: messages.success,
                error: messages.error,
            },
            {
                style: toastConfig.success.style,
            }
        );
    },
    dismiss: (toastId) => toast.dismiss(toastId),
};

export default showToast;
