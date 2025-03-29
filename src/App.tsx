import { useState } from 'react';
import './App.css';
import Terminal from './Terminal';
import Portfolio from './components/Portfolio/Portfolio';
import { themes, Theme } from './themes';

const getOS = () => {
    const userAgent = window.navigator.userAgent;
    if (userAgent.includes('Windows')) return 'windows';
    if (userAgent.includes('Mac')) return 'mac';
    if (userAgent.includes('Linux')) return 'linux';
    if (userAgent.includes('Android')) return 'android';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'ios';
    return 'unknown';
};

const App = () => {
    const [os] = useState(getOS());
    const [currentTheme] = useState<Theme>(themes.matrix);
    const [activeSection, setActiveSection] = useState<string>('');

    const handleCommand = (command: string) => {
        // Map terminal commands to portfolio sections
        const commandToSection: { [key: string]: string } = {
            'about': 'about',
            'skills': 'skills',
            'experience': 'experience',
            'education': 'education',
            'contact': 'contact'
        };

        if (commandToSection[command]) {
            setActiveSection(commandToSection[command]);
        }
    };

    return (
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
    );
};

export default App;
