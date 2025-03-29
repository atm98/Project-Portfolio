import React, { useState, useEffect, useRef } from "react";
import resumeData from "./resume.json";
import "./Terminal.css";
import ASCIIArt from "./components/ASCIIArt/ASCIIArt";
import { themes, Theme } from "./themes";
import { virtualFS } from './fileSystem';

interface TerminalProps {
    onCommand: (command: string) => void;
}

interface FileSystem {
    [key: string]: {
        type: 'file' | 'directory';
        name: string;
        content?: string;
        children?: FileSystem;
    };
}

const Terminal: React.FC<TerminalProps> = ({ onCommand }) => {
    const [history, setHistory] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [displayingText, setDisplayingText] = useState(false);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [currentPath, setCurrentPath] = useState('/home/user');
    const [fileSystem] = useState<FileSystem>(virtualFS['/'].children || {});
    const [hostname, setHostname] = useState("localhost");
    const [currentTheme, setCurrentTheme] = useState<Theme>(themes.matrix);

    useEffect(() => {
        setHostname(window.location.hostname);
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
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            setHistory(prev => [...prev, text]);
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
                setInputValue(commandHistory[commandHistory.length - 1 - newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInputValue(commandHistory[commandHistory.length - 1 - newIndex]);
            } else {
                setHistoryIndex(-1);
                setInputValue('');
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
        if (inputValue.trim() && !displayingText) {
            handleCommand(inputValue.trim());
            setInputValue('');
        }
    };

    const getDirectoryFromPath = (path: string): { type: 'file' | 'directory'; name: string; content?: string; children?: FileSystem } | null => {
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
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
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
