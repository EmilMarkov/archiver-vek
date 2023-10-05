export interface FileEntry {
    path: string;
    name: string;
    size: string;
    created_at: string;
}

export interface FolderEntry {
    path: string;
    name: string;
    created_at: string;
}

export interface Entry {
    id: number;
    path: string;
    name: string;
    size: string;
    created_at: string;
    type: 'file' | 'folder' | 'disk';
}