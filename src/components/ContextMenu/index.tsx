import React, { useContext } from 'react';
import { Props, Container } from './styles';
import { ThemeContext } from 'styled-components'
import TextRoundedButton from '../TextRoundedButton';

const ContextMenu: React.FC<Props> = ({ isOpen, position, onOpenModal }) => {

    const theme = useContext(ThemeContext)

    if (!isOpen) {
        return null;
    }

    return (
        <Container id="context-menu" style={{ top: position.top, left: position.left }}>
            <TextRoundedButton
              onClick={() => onOpenModal('archive') }
              title='Archive'
              width='100%'
              height='30px'
              text="Archive"
              colorDefault={theme.colors.background}
              colorHover={theme.colors.buttonBgHover}
              colorPressed={theme.colors.appColorYellow}
              highlightIcon={true}
              radius='10px'
            />
            <TextRoundedButton
              onClick={() => { console.log('Clicked') }}
              title='Properties'
              width='100%'
              height='30px'
              text="Properties"
              colorDefault={theme.colors.background}
              colorHover={theme.colors.buttonBgHover}
              colorPressed={theme.colors.appColorYellow}
              highlightIcon={true}
              radius='8px'
            />
        </Container>
    );
};

export default ContextMenu;