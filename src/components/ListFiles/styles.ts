import styled from 'styled-components';

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
  path: string;
  name: string;
  size: string;
  created_at: string;
  type: 'file' | 'folder';
}

export interface Props {
  entries: Entry[];
}

export const Container = styled.div`
  & {
    
  }
`