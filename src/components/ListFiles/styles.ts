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
  onItemDoubleClick: (index: number) => void;
}

export const Container = styled.div`
  & {
    
  }
`

export const InfoBar = styled.div`
  & {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    padding: 6px;
  }
`

export const FileName = styled.div`
  & {
    width: 60%;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`

export const CreatedAt = styled.div`
  & {
    text-align: left;
    flex: 1;
  }
`

export const FileSize = styled.div`
  & {
    text-align: right;
  }
`

export const DivLine = styled.div`
  & {
    flex: 1;
    max-height: 2px;
    height: 2px;
    background-color: ${props => props.theme.colors.color_1};
    margin-top: 5px;
    margin-bottom: 5px;
    margin-left: 8px;
    margin-right: 8px;
  }
`

export const ResizeHandle = styled.div`
  & {
    width: 2px; // Ширина полоски изменения
    cursor: col-resize; // Стиль курсора для указания, что можно менять ширину
    background-color: ${props => props.theme.colors.color_1}; // Цвет полоски изменения
    margin-right: 5px;
  }
`

export const ListContainer = styled.div`
    & {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        height: calc(100vh - 220px);
        overflow-y: auto;
    }

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: ${props => props.theme.colors.accentColor};
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background-color: ${props => props.theme.colors.accentColor_dark};
    }
`