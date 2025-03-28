import React, { useState, useEffect, useRef } from "react";
import resumeData from "./resume.json";
import "./Terminal.css";
import ASCIIArt from "./components/ASCIIArt/ASCIIArt";
import { themes, Theme } from "./themes";

interface FileSystemNode {
    type: 'file' | 'directory';
    name: string;
    content?: string;
    children?: { [key: string]: FileSystemNode };
}

interface FileSystem {
    [key: string]: FileSystemNode;
}

const virtualFS: FileSystem = {
    '/': {
        type: 'directory',
        name: '/',
        children: {
            'home': {
                type: 'directory',
                name: 'home',
                children: {
                    'user': {
                        type: 'directory',
                        name: 'user',
                        children: {
                            'Documents': {
                                type: 'directory',
                                name: 'Documents',
                                children: {
                                    'resume.pdf': {
                                        type: 'file',
                                        name: 'resume.pdf',
                                        content: 'Resume file'
                                    }
                                }
                            },
                            'Projects': {
                                type: 'directory',
                                name: 'Projects',
                                children: {
                                    'portfolio': {
                                        type: 'directory',
                                        name: 'portfolio',
                                        children: {}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

const getOS = () => {
    const userAgent = window.navigator.userAgent;
    if (userAgent.includes('Windows')) return 'windows';
    if (userAgent.includes('Mac')) return 'mac';
    if (userAgent.includes('Linux')) return 'linux';
    if (userAgent.includes('Android')) return 'android';
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'ios';
    return 'unknown';
};

const getHeaderStyle = (os: string) => {
    switch (os) {
        case 'windows':
            return {
                backgroundColor: '#0078D4',
                color: '#ffffff',
                fontFamily: 'Segoe UI, sans-serif',
                padding: '8px 12px',
                borderRadius: '6px 6px 0 0',
                borderBottom: '2px solid #0078D4'
            };
        case 'mac':
            return {
                backgroundColor: '#E0E0E0',
                color: '#000000',
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                padding: '8px 12px',
                borderRadius: '6px 6px 0 0',
                borderBottom: '2px solid #E0E0E0'
            };
        case 'linux':
            return {
                backgroundColor: '#2D2D2D',
                color: '#ffffff',
                fontFamily: 'Ubuntu, sans-serif',
                padding: '8px 12px',
                borderRadius: '6px 6px 0 0',
                borderBottom: '2px solid #2D2D2D'
            };
        case 'ios':
            return {
                backgroundColor: '#000000',
                color: '#ffffff',
                fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                padding: '8px 12px',
                borderRadius: '6px 6px 0 0',
                borderBottom: '2px solid #000000'
            };
        case 'android':
            return {
                backgroundColor: '#3DDC84',
                color: '#ffffff',
                fontFamily: 'Roboto, sans-serif',
                padding: '8px 12px',
                borderRadius: '6px 6px 0 0',
                borderBottom: '2px solid #3DDC84'
            };
        default:
            return {
                backgroundColor: '#2D2D2D',
                color: '#ffffff',
                fontFamily: 'monospace',
                padding: '8px 12px',
                borderRadius: '6px 6px 0 0',
                borderBottom: '2px solid #2D2D2D'
            };
    }
};

interface TerminalProps {
    onCommand: (command: string) => void;
}

const Terminal: React.FC<TerminalProps> = ({ onCommand }) => {
    const [history, setHistory] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [displayingText, setDisplayingText] = useState(false);
    const [cursorVisible, setCursorVisible] = useState(true);
    const [hostname, setHostname] = useState("localhost");
    const [currentTheme, setCurrentTheme] = useState<Theme>(themes.matrix);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [currentPath, setCurrentPath] = useState('/home/user');
    const [fileSystem] = useState<FileSystem>(virtualFS);
    const [os] = useState(getOS());
    const headerStyle = getHeaderStyle(os);

    useEffect(() => {
        // Set the hostname when component mounts
        setHostname(window.location.hostname);
    }, []);

    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setCursorVisible((prev) => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
    }, []);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    const formatLinks = (text: string) => {
        return text.replace(/(https?:\/\/\S+)/g, '<a href="$1" target="_blank">$1</a>')
            .replace(/([\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1">$1</a>')
            .replace(/(\+?\d[\d\s().-]{8,}\d)/g, '<a href="tel:$1">$1</a>');
    };

    const downloadResume = async () => {
        try {
            const response = await fetch('/resume.pdf');
            const reader = response.body?.getReader();
            const contentLength = +(response.headers.get('Content-Length') || 0);
            let receivedLength = 0;
            let lastUpdate = Date.now();
            const chunks = [];

            if (reader) {
                while(true) {
                    const {done, value} = await reader.read();
                    if (done) break;
                    
                    chunks.push(value);
                    receivedLength += value.length;
                    
                    // Calculate and show current speed
                    const now = Date.now();
                    const timeDiff = (now - lastUpdate) / 1000;
                    const bytesPerSecond = value.length / timeDiff;
                    const speed = bytesPerSecond > 1024 * 1024 
                        ? `${(bytesPerSecond / (1024 * 1024)).toFixed(2)} MB/s`
                        : `${(bytesPerSecond / 1024).toFixed(2)} KB/s`;
                    
                    setHistory(prev => {
                        const newHistory = [...prev];
                        const lastLine = newHistory[newHistory.length - 1];
                        if (lastLine && lastLine.includes('Downloading file now')) {
                            newHistory[newHistory.length - 1] = `Downloading file now... ${speed}`;
                        } else {
                            newHistory.push(`Downloading file now... ${speed}`);
                        }
                        return newHistory;
                    });
                    
                    lastUpdate = now;
                }

                // Create and trigger download
                const blob = new Blob(chunks, { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'Aditya_Narayan_Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Download failed:', error);
            setHistory(prev => [...prev, '\n❌ Download failed. Please try again.\n']);
        }
    };

    const getCurrentDirectory = () => {
        const pathParts = currentPath.split('/').filter(Boolean);
        let current = fileSystem['/'];
        
        for (const part of pathParts) {
            if (current.children && current.children[part]) {
                current = current.children[part];
            } else {
                return null;
            }
        }
        
        return current;
    };

    const commands: { [key: string]: (arg?: string) => string | void } = {
        help: () => `\n📚 Available commands:\n   🔹 help - Show available commands\n   🔹 about - About me\n   🔹 skills - My technical skills\n   🔹 experience - Work history\n   🔹 education - Academic background\n   🔹 contact - Get in touch\n   🔹 projects - List my projects\n   🔹 resume - Download my resume (PDF)\n   🔹 theme - List available themes\n   🔹 theme <name> - Change theme\n   🔹 ls - List files\n   🔹 pwd - Show current directory\n   🔹 whoami - Show user info\n   🔹 clear - Clear terminal\n`,
        about: () => `\n👋 Hello! I'm ${resumeData.name}, a passionate ${resumeData.experience[0].position} based in ${resumeData.location}. ` +
            `With a strong foundation in ${resumeData.skills.languages.slice(0, 3).join(", ")}, I specialize in building robust and scalable applications. ` +
            `My journey in software development has been driven by a deep interest in creating efficient solutions that make a difference.\n\n` +
            `Currently working as a ${resumeData.experience[0].position} at ${resumeData.experience[0].company}, ` +
            `I focus on ${resumeData.experience[0].responsibilities.slice(0, 2).join(" and ")}. ` +
            `My expertise spans across ${resumeData.skills.technologies.slice(0, 3).join(", ")}, ` +
            `and I'm particularly passionate about ${resumeData.skills.devops_ci_cd.slice(0, 2).join(" and ")}.\n\n` +
            `When I'm not coding, I'm constantly exploring new technologies and contributing to the developer community. ` +
            `I believe in writing clean, maintainable code and following best practices in software development.\n\n` +
            `Feel free to connect with me through:\n` +
            `   ${formatLinks(`Email: ${resumeData.contact.email}\n` +
            `   LinkedIn: ${resumeData.contact.linkedin}\n` +
            `   GitHub: ${resumeData.contact.github}`)}\n`,
        skills: () => `\n🛠️ Languages:\n   ${resumeData.skills.languages.join(" | ")}\n\n⚙️ Technologies:\n   ${resumeData.skills.technologies.join(" | ")}\n\n🚀 DevOps & CI/CD:\n   ${resumeData.skills.devops_ci_cd.join(" | ")}\n\n☁️ Cloud & Infrastructure:\n   ${resumeData.skills.cloud_infrastructure.join(" | ")}\n`,
        experience: () => resumeData.experience.map(exp => `\n🔹 ${exp.position} at ${exp.company} (${exp.duration})\n   📍 ${exp.location}\n   📝 Responsibilities:\n   ${exp.responsibilities.map(resp => `     - ${resp}`).join("\n")}\n`).join(""),
        education: () => `\n🎓 ${resumeData.education.degree}\n   🏢 ${resumeData.education.institution}\n   🗓️ ${resumeData.education.duration}\n`,
        contact: () => formatLinks(`\n📧 Email: ${resumeData.contact.email}\n🔗 LinkedIn: ${resumeData.contact.linkedin}\n🐙 GitHub: ${resumeData.contact.github}\n📞 Phone: ${resumeData.contact.phone}\n`),
        resume: () => {
            downloadResume();
            return ""; // Return empty string since we're handling the output in downloadResume
        },
        theme: (themeName?: string) => {
            if (!themeName) {
                return `\nAvailable themes:\n${Object.keys(themes).map(name => `   ${name}`).join('\n')}\n\nCurrent theme: ${currentTheme.name}\n`;
            }
            if (themes[themeName]) {
                setCurrentTheme(themes[themeName]);
                return `\nTheme changed to: ${themes[themeName].name}\n`;
            }
            return `\n❌ Theme not found: ${themeName}\n`;
        },
        ls: (path?: string) => {
            const targetPath = path ? path.startsWith('/') ? path : `${currentPath}/${path}` : currentPath;
            const targetDir = path ? getDirectoryFromPath(targetPath) : getCurrentDirectory();
            
            if (!targetDir) {
                return `\n❌ ls: cannot access '${path}': No such file or directory\n`;
            }

            if (targetDir.type !== 'directory') {
                return `\n❌ ls: cannot access '${path}': Not a directory\n`;
            }

            const items = Object.values(targetDir.children || {});
            const output = items.map(item => {
                const icon = item.type === 'directory' ? '📂' : '📄';
                return `${icon} ${item.name}`;
            }).join('  ');

            return `\n${output}\n`;
        },
        pwd: () => `\n${currentPath}\n`,
        whoami: () => `\n${resumeData.name}\n`,
        clear: () => {
            setHistory([]);
        },
        cd: (path?: string) => {
            if (!path) {
                setCurrentPath('/home/user');
                return "";
            }

            const targetPath = path.startsWith('/') ? path : `${currentPath}/${path}`;
            const targetDir = getDirectoryFromPath(targetPath);

            if (!targetDir) {
                return `\n❌ cd: no such file or directory: ${path}\n`;
            }

            if (targetDir.type !== 'directory') {
                return `\n❌ cd: not a directory: ${path}\n`;
            }

            setCurrentPath(targetPath);
            return "";
        }
    };

    const typeText = (text: string, callback: () => void) => {
        let i = 0;
        setDisplayingText(true);
        setHistory((prev) => [...prev, ""]);
        const interval = setInterval(() => {
            setHistory((prev) => {
                const lastEntry = prev[prev.length - 1] || "";
                return [...prev.slice(0, -1), lastEntry + (text[i] || "")];
            });
            i++;
            if (i === text.length) {
                clearInterval(interval);
                setDisplayingText(false);
                callback();
            }
        }, 20);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[commandHistory.length - 1 - newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[commandHistory.length - 1 - newIndex]);
            } else {
                setHistoryIndex(-1);
                setInput('');
            }
        }
    };

    const handleCommand = (cmd: string) => {
        const [command, ...args] = cmd.trim().split(' ');
        setHistory((prev) => [...prev, `$ ${cmd}`]);
        
        // Add command to history if it's not empty and not the same as the last command
        if (cmd.trim() && (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== cmd.trim())) {
            setCommandHistory(prev => [...prev, cmd.trim()]);
        }
        
        if (command === "clear") {
            commands[command]();
            return;
        }
        const response = commands[command] ? commands[command](args[0]) : `\n❌ Command not found: ${command}\n`;
        if (response) {
            typeText(response, () => { });
        }
        onCommand(command);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !displayingText) {
            handleCommand(input.trim());
            setInput("");
        }
    };

    const getDirectoryFromPath = (path: string): FileSystemNode | null => {
        const pathParts = path.split('/').filter(Boolean);
        let current = fileSystem['/'];
        
        for (const part of pathParts) {
            if (current.children && current.children[part]) {
                current = current.children[part];
            } else {
                return null;
            }
        }
        
        return current;
    };

    return (
        <div 
            className="terminal" 
            ref={terminalRef} 
            onClick={() => inputRef.current?.focus()}
            style={{
                backgroundColor: currentTheme.background,
                color: currentTheme.foreground,
                borderColor: currentTheme.header.border
            }}
        >
            <ASCIIArt theme={currentTheme} />
            <pre className="terminal-line">Welcome to Aditya Narayan's Portfolio Terminal! Type 'help' to get started.</pre>
            <div className="history">
                {history.map((line, index) => (
                    <pre key={index} className="terminal-line" dangerouslySetInnerHTML={{ __html: line }}></pre>
                ))}
            </div>
            {!displayingText && (
                <form onSubmit={handleSubmit} className="input-form">
                    <span className="prompt" style={{ color: currentTheme.prompt }}>portfolio@{hostname}:{currentPath}$</span>
                    <div className="input-wrapper">
                        <input
                            id="input"
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            style={{
                                color: currentTheme.foreground,
                                backgroundColor: 'transparent',
                                caretColor: currentTheme.foreground
                            }}
                        />
                    </div>
                </form>
            )}
        </div>
    );
};

export default Terminal;
