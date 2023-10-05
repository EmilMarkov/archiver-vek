import React, { useContext } from 'react';

import {
    Props,
    ModalContent,
    ContentContainer
} from './styles';

const ArchiveModal: React.FC<Props> = ({ data }) => {
    return (
        <ModalContent>
            <ContentContainer>
                <div style={{ fontSize: `${56}px` }}>Content</div>
            </ContentContainer>
        </ModalContent>
    );
};

export default ArchiveModal;