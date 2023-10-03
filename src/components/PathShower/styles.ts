import styled from 'styled-components';

export interface Props {
  id?: string;
  ref?: any;
  path: string;
  onNavigate: (newPath: string) => void; // onNavigate принимает строку (новый путь)
  onGoUp: () => void; // onGoUp не принимает аргументы
}  

export const Container = styled.div`
  & {
    display: flex;
    align-items: center;
    padding: 0 4px;
    font-size: 16px;
    width: 100%;
    height: 34px;
    background-color: ${props => props.theme.colors.background_6};
    border-radius: 10px;
  }
`;

export const GoUpButton = styled.div`
  & {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 6px;
  }

  &:hover {
    transition: background-color 0.3s;
    background-color: ${props => props.theme.colors.buttonBgColor};
    cursor: pointer;
  }
`;

export const PartButton = styled.div`
  & {
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    height: 24px;
    background-color: ${props => props.theme.colors.background};
    border-radius: 6px;
    padding: 0 6px;
    margin: 0 3px;
  }
`;

export const PartsContainer = styled.div`
    & {
        display: flex;
        width: 100%;
        overflow: hidden;
        overflow-x: overlay;
        white-space: nowrap;
        padding-top: 5px;
        height: 100%;
    }

    &::-webkit-scrollbar {
        height: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: ${props => props.theme.colors.accentColor};
        border: solid 3px transparent;
        border-radius: 4px;
    }

    ::-webkit-scrollbar-track{
        border: solid 3px transparent;
    }

    &::-webkit-scrollbar:horizontal {
        margin-top: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background-color: ${props => props.theme.colors.accentColor_dark};
    }
`