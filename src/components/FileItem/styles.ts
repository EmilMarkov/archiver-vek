import styled from 'styled-components';

export interface Props {
  id?: string;
  ref?: any;
  name: string;
  creationDate: string;
  size: string;
  selected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseEnter: (e: React.MouseEvent) => void;
  fileNameWidth: number;
}

export interface ContainerProps {
  selected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseEnter: (e: React.MouseEvent) => void;
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  padding: 6px;

  background-color: ${props => (props.selected ? props.theme.colors.background : 'transparent')};
  color: ${props => (props.selected ? props.theme.colors.color_1 : props.theme.colors.color)};

  &:hover {
    background-color: ${props => (props.selected ? props.theme.colors.background : props.theme.colors.background_3)};
    color: ${props => (props.selected ? props.theme.colors.color_1 : props.theme.colors.color)};
  }
`;

export const FileName = styled.div`
  width: 60%;
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const FileCreationDate = styled.div`
  text-align: left;
  flex: 1;
  margin-left: 5px;
`;

export const FileSize = styled.div`
  text-align: right;
`;