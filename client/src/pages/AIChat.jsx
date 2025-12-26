import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, User, Bot, MessageSquare } from 'lucide-react';
import { useAgent } from '../hooks/useAgent';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import ReactMarkdown from 'react-markdown';

const suggestedQuestions = [
    "What skills should I focus on for a Senior Frontend role?",
    "How can I transition from backend to full-stack?",
    "Review my current skill set and suggest improvements",
    "Prepare me for a React technical interview"
];

export default function AIChat() {
    const { chat } = useAgent();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sessionId, setSessionId] = useState(null);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (messageText = input) => {
        if (!messageText.trim() || sending) return;

        const userMessage = { role: 'user', content: messageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setSending(true);

        try {
            const response = await chat(messageText, sessionId);
            if (response.success) {
                setSessionId(response.sessionId);
                const aiMessage = {
                    role: 'assistant',
                    content: response.response || response.data || 'No response'
                };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.'
                }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, an error occurred. Please try again.'
            }]);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-[var(--color-bg-primary)]">
            <Navbar />

            <main className="flex-1 pt-16 flex flex-col overflow-hidden relative">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto w-full">
                    <div className="max-w-[760px] mx-auto px-4 pb-32 pt-10">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                                <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] flex items-center justify-center mb-6">
                                    <Sparkles className="w-8 h-8 text-[var(--color-accent)]" />
                                </div>
                                <h1 className="heading-3 mb-3">AI Career Advisor</h1>
                                <p className="body text-[var(--color-text-secondary)] mb-8 max-w-md">
                                    I analyze your profile to provide personalized career guidance, skill recommendations, and job matches.
                                </p>

                                <div className="grid sm:grid-cols-2 gap-3 w-full max-w-2xl">
                                    {suggestedQuestions.map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSend(q)}
                                            className="p-4 rounded-xl text-left bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-primary)] transition-all group"
                                        >
                                            <p className="body-small font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                                                {q}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex gap-4 ${msg.role === 'assistant' ? 'bg-[var(--color-bg-secondary)] -mx-4 px-4 py-8 md:bg-transparent md:px-0 md:py-0' : ''}`}>
                                        <div className="flex-shrink-0 mt-0.5">
                                            {msg.role === 'assistant' ? (
                                                <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
                                                    <Bot className="w-5 h-5 text-white" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-tertiary)] flex items-center justify-center">
                                                    <User className="w-5 h-5 text-[var(--color-text-secondary)]" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <p className="font-semibold text-sm">
                                                {msg.role === 'assistant' ? 'AI Advisor' : 'You'}
                                            </p>
                                            <div className={`prose prose-sm max-w-none ${msg.role === 'assistant' ? 'text-[var(--color-text-secondary)]' : 'text-[var(--color-text-primary)]'}`}>
                                                {msg.role === 'assistant' ? (
                                                    <ReactMarkdown
                                                        components={{
                                                            // Custom styling for markdown elements
                                                            h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-3 text-[var(--color-text-primary)]" {...props} />,
                                                            h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2 text-[var(--color-text-primary)]" {...props} />,
                                                            h3: ({ node, ...props }) => <h3 className="text-base font-semibold mb-2 text-[var(--color-text-primary)]" {...props} />,
                                                            p: ({ node, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
                                                            ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
                                                            ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />,
                                                            li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                                                            strong: ({ node, ...props }) => <strong className="font-semibold text-[var(--color-text-primary)]" {...props} />,
                                                            em: ({ node, ...props }) => <em className="italic" {...props} />,
                                                            code: ({ node, inline, ...props }) =>
                                                                inline ?
                                                                    <code className="px-1.5 py-0.5 bg-[var(--color-bg-tertiary)] rounded text-sm font-mono text-[var(--color-accent)]" {...props} /> :
                                                                    <code className="block p-3 bg-[var(--color-bg-tertiary)] rounded-lg text-sm font-mono overflow-x-auto mb-3" {...props} />,
                                                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-[var(--color-accent)] pl-4 italic my-3" {...props} />,
                                                            a: ({ node, ...props }) => <a className="text-[var(--color-accent)] hover:underline" {...props} target="_blank" rel="noopener noreferrer" />,
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                ) : (
                                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {sending && (
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
                                            <Bot className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex items-center gap-1 h-8">
                                            <span className="w-2 h-2 bg-[var(--color-text-tertiary)] rounded-full animate-bounce" />
                                            <span className="w-2 h-2 bg-[var(--color-text-tertiary)] rounded-full animate-bounce delay-75" />
                                            <span className="w-2 h-2 bg-[var(--color-text-tertiary)] rounded-full animate-bounce delay-150" />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Input Area */}
                <div className="w-full bg-[var(--color-bg-primary)] border-t border-[var(--color-border-primary)] p-4">
                    <div className="max-w-[760px] mx-auto">
                        <div className="relative flex items-end gap-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-xl p-2 focus-within:ring-2 focus-within:ring-[var(--color-accent-light)] focus-within:border-[var(--color-accent)] transition-all shadow-sm">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                                placeholder="Ask advice about your career path, skills, or job market..."
                                className="flex-1 max-h-[200px] min-h-[44px] py-2.5 px-3 bg-transparent border-none resize-none focus:ring-0 text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] text-sm leading-6"
                                rows={1}
                            />
                            <Button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || sending}
                                size="sm"
                                className={`mb-1 transition-all ${!input.trim() ? 'opacity-50' : 'opacity-100'}`}
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                        <p className="text-center text-xs text-[var(--color-text-tertiary)] mt-3">
                            AI Advisors can make mistakes. Consider checking important information.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
