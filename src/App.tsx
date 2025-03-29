import { useState } from 'react';
import './App.css';
import Terminal from './Terminal';
import Portfolio from './components/Portfolio/Portfolio';
import { themes } from './themes';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import './styles/global.css';

type OS = 'windows' | 'mac' | 'linux' | 'ios' | 'android' | 'unknown';

const getOS = (): OS => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes('win')) return 'windows';
    if (userAgent.includes('mac')) return 'mac';
    if (userAgent.includes('linux')) return 'linux';
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'ios';
    if (userAgent.includes('android')) return 'android';
    return 'unknown';
};

const App = () => {
    const [activeSection, setActiveSection] = useState('about');
    const os = getOS();
    const currentTheme = themes[os] || themes.unknown;

    const handleCommand = (command: string) => {
        const cmd = command.toLowerCase().trim();
        if (cmd === 'about') setActiveSection('about');
        else if (cmd === 'skills') setActiveSection('skills');
        else if (cmd === 'projects') setActiveSection('projects');
        else if (cmd === 'contact') setActiveSection('contact');
        else if (cmd === 'clear') {
            const terminal = document.querySelector('.terminal-output');
            if (terminal) terminal.innerHTML = '';
        }
    };

    return (
        <ThemeProvider>
            <div className="app" style={{ backgroundColor: currentTheme.background }}>
                <ThemeToggle />
                <div className="app-container" style={{ backgroundColor: currentTheme.background }}>
                    <div className="terminal-section">
                        <div className={`terminal-header ${os}`} style={{
                            backgroundColor: currentTheme.header.background,
                            borderBottom: `1px solid ${currentTheme.header.border}`
                        }}>
                            <div className="terminal-title" style={{ color: currentTheme.header.foreground }}>
                                {os === 'windows' && 'Windows Terminal'}
                                {os === 'mac' && 'Terminal.app'}
                                {os === 'linux' && 'Linux Terminal'}
                                {os === 'ios' && 'iOS Terminal'}
                                {os === 'android' && 'Android Terminal'}
                                {os === 'unknown' && 'Terminal'}
                            </div>
                            <div className="terminal-controls">
                                <span className="control close"></span>
                                <span className="control minimize"></span>
                                <span className="control maximize"></span>
                            </div>
                        </div>
                        <Terminal onCommand={handleCommand} />
                    </div>
                    <Portfolio activeSection={activeSection} />
                </div>
            </div>
        </ThemeProvider>
    );
};

export default App;
