import styled from 'styled-components'

export interface Props {
    pageName?: string
    visible?: boolean
}

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

export const Container = styled.div`
    & {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow-y: auto;
        user-select: none;
        min-width: 400px;
    }
`