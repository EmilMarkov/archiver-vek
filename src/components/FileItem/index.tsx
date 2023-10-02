import React from 'react';
import { Props, Container, FileName, FileCreationDate, FileSize } from './styles';

const FileItem: React.FC<Props> = ({
    name,
    creationDate,
    size,
    selected,
    onMouseDown,
    onMouseEnter,
}) => {
    const handleMouseDown = (e: React.MouseEvent) => {
        if (onMouseDown) {
            onMouseDown(e);
        }
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
        if (onMouseEnter) {
            onMouseEnter(e);
        }
    };

    return (
        <Container
            selected={selected}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
        >
            <FileName>{name}</FileName>
            <FileCreationDate>{creationDate}</FileCreationDate>
            <FileSize>{size}</FileSize>
        </Container>
    );
};

export default FileItem;