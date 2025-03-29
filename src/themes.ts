export interface TerminalTheme {
    name: string;
    background: string;
    foreground: string;
    prompt: string;
    header: {
        background: string;
        foreground: string;
        border: string;
    };
    selection: string;
    cursor: string;
}

export const themes: { [key: string]: TerminalTheme } = {
    'matrix': {
        name: 'Matrix',
        background: '#000000',
        foreground: '#00ff00',
        prompt: '#00ff00',
        header: {
            background: '#1a1a1a',
            foreground: '#00ff00',
            border: '#333333'
        },
        selection: '#00ff00',
        cursor: '#00ff00'
    },
    'dracula': {
        name: 'Dracula',
        background: '#282a36',
        foreground: '#f8f8f2',
        prompt: '#bd93f9',
        header: {
            background: '#44475a',
            foreground: '#f8f8f2',
            border: '#6272a4'
        },
        selection: '#44475a',
        cursor: '#f8f8f2'
    },
    'nord': {
        name: 'Nord',
        background: '#2e3440',
        foreground: '#d8dee9',
        prompt: '#88c0d0',
        header: {
            background: '#3b4252',
            foreground: '#d8dee9',
            border: '#434c5e'
        },
        selection: '#434c5e',
        cursor: '#d8dee9'
    },
    'solarized-dark': {
        name: 'Solarized Dark',
        background: '#002b36',
        foreground: '#839496',
        prompt: '#268bd2',
        header: {
            background: '#073642',
            foreground: '#839496',
            border: '#586e75'
        },
        selection: '#586e75',
        cursor: '#839496'
    },
    'monokai': {
        name: 'Monokai',
        background: '#272822',
        foreground: '#f8f8f2',
        prompt: '#a6e22e',
        header: {
            background: '#1e1f1c',
            foreground: '#f8f8f2',
            border: '#3e3d32'
        },
        selection: '#3e3d32',
        cursor: '#f8f8f2'
    },
    'unknown': {
        name: 'Default',
        background: '#1e1e1e',
        foreground: '#ffffff',
        prompt: '#00ff00',
        header: {
            background: '#2d2d2d',
            foreground: '#ffffff',
            border: '#404040'
        },
        selection: '#404040',
        cursor: '#ffffff'
    }
}; 