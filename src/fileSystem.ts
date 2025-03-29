export interface FileSystemNode {
    type: 'file' | 'directory';
    name: string;
    content?: string;
    children?: {
        [key: string]: FileSystemNode;
    };
}

export interface FileSystem {
    '/': FileSystemNode;
}

export const virtualFS: FileSystem = {
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