import styled from 'styled-components';

export interface Entry {
  id: number;
  path: string;
  name: string;
  size: string;
  created_at: string;
  type: 'file' | 'folder' | 'disk';
}

export interface Props {
  id?: any;
  ref?: any;
  isOpen: boolean;
  position: { top: number; left: number };
  onOpenModal: (modalName: string) => void;
}

export const Container = styled.div`
  position: fixed;
  min-width: 160px;
  background: ${props => props.theme.colors.background};
  border: 3px solid ${props => props.theme.colors.background_4};
  border-radius: 10px;
  z-index: 999;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;