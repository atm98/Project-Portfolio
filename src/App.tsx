import { useState } from 'react';
import './App.css';
import Terminal from './Terminal';
import Portfolio from './components/Portfolio/Portfolio';
import { themes } from './themes';
import { ThemeProvider } from './context/ThemeContext';
import { useGoogleAnalytics } from './hooks/useGoogleAnalytics';
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
    const { trackEvent } = useGoogleAnalytics();

    const handleCommand = (command: string) => {
        const cmd = command.toLowerCase().trim();
        switch (cmd) {
            case 'about':
                setActiveSection('about');
                trackEvent('section_view', { section: 'about' });
                break;
            case 'skills':
                setActiveSection('skills');
                trackEvent('section_view', { section: 'skills' });
                break;
            case 'experience':
                setActiveSection('experience');
                trackEvent('section_view', { section: 'experience' });
                break;
            case 'education':
                setActiveSection('education');
                trackEvent('section_view', { section: 'education' });
                break;
            case 'contact':
                setActiveSection('contact');
                trackEvent('section_view', { section: 'contact' });
                break;
            case 'projects':
                setActiveSection('projects');
                trackEvent('section_view', { section: 'projects' });
                break;
            case 'clear':
                const terminal = document.querySelector('.terminal-output');
                if (terminal) terminal.innerHTML = '';
                break;
            case 'help':
            case 'theme':
            case 'ls':
            case 'pwd':
            case 'whoami':
            case 'cd':
            case 'resume':
                // These commands don't need to scroll to any section
                break;
            default:
                // Unknown command - no section change needed
                break;
        }
    };

    return (
        <ThemeProvider>
            <div className="app" style={{ backgroundColor: currentTheme.background }}>
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
