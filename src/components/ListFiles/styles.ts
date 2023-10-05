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
  id: number;
  path: string;
  name: string;
  size: string;
  created_at: string;
  type: 'file' | 'folder' | 'disk';
}

export interface Props {
  entries: Entry[];
  onItemDoubleClick: (index: number) => void;
  isPathDisk: boolean;
}

export const Container = styled.div`
  & {
    width: 100%;
    height: 100%;
  }
`

export const InfoBar = styled.div`
  & {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    padding: 6px;
  }
`

export const Left = styled.div`
  & {
    width: 60%;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`

export const Center = styled.div`
  & {
    text-align: left;
    flex: 1;
  }
`

export const Right = styled.div`
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
    width: 2px;
    cursor: col-resize;
    background-color: ${props => props.theme.colors.color_1};
    margin-right: 5px;
  }
`

export const ListContainer = styled.div`
    & {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        height: 100%;
        padding-bottom: 20px;
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