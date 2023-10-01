import styled from 'styled-components';

export interface Props {
  id?: string
  ref?: any
  name: string
  creationDate: string
  size: string
}

export const Container = styled.div`
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

export const FileCreationDate = styled.div`
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