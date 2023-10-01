import React from 'react';
import {
  Props,
  Container,
  FileName,
  FileCreationDate,
  FileSize
} from './styles'; // Импортируйте стили

const FileItem: React.FC<Props> = ({ name, creationDate, size }) => {
  return (
    <Container>
      <FileName>{name}</FileName>
      <FileCreationDate>{creationDate}</FileCreationDate>
      <FileSize>{size}</FileSize>
    </Container>
    // <FileItemContainer>
    //   <FileType>{type}</FileType>
    //   <FileDetails>
    //     <FileName>{name}</FileName>
    //     <FileCreationDate>Created on: {creationDate}</FileCreationDate>
    //     {type === 'file' && <FileSize>Size: {size}</FileSize>}
    //   </FileDetails>
    // </FileItemContainer>
  );
};

export default FileItem;
