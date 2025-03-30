import React, { useState, useEffect } from 'react';

interface TypingTextProps {
    text: string;
    speed?: number;
    onComplete?: () => void;
    isPrompt?: boolean;
}

const TypingText: React.FC<TypingTextProps> = ({ text, speed = 30, onComplete, isPrompt = false }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (isPrompt) {
            // For prompts, display immediately without typing effect
            setDisplayedText(text);
            if (onComplete) onComplete();
            return;
        }

        if (currentIndex < text.length) {
            const timer = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);

            return () => clearTimeout(timer);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentIndex, text, speed, onComplete, isPrompt]);

    return <pre className={`terminal-line ${isPrompt ? 'prompt-line' : ''}`}>{displayedText}</pre>;
};

export default TypingText; 