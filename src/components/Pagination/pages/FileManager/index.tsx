import React, { useEffect, useRef, useState } from 'react'
import { Container, Props } from './styles'
import FileItem from '../../../FileItem'
import ListFiles from '../../../ListFiles'
import { SvgIconPlus, SvgIconReload } from '../../../SvgIcon'
import usePersistedState from '../../../../utils/userPersistedState'
import { DefaultTheme } from 'styled-components'
import { Settings } from '../../../../Settings'
import { invoke } from '@tauri-apps/api';

import {
    FileEntry,
    FolderEntry,
    Entry
} from './styles';

const FileManagerPage: React.FC<Props> = ({pageName, visible}) => {
    const [ theme, setTheme ] = usePersistedState<DefaultTheme>('theme', Settings.appDefaultTheme)
    const [ files, setFiles ] = useState<FileEntry[]>([])
    const [ folders, setFolders ] = useState<FolderEntry[]>([])
    const [entries, setEntries] = useState<Entry[]>([]);

    async function scanFiles() {
        try {
          const result: FileEntry[] = await invoke('scan_files');
          setFiles(result);
        } catch (error) {
          console.error('Error scanning files:', error);
        }
    }
      
    async function scanFolders() {
        try {
          const result: FolderEntry[] = await invoke('scan_folders');
          setFolders(result);
        } catch (error) {
          console.error('Error scanning folders:', error);
        }
    }

    scanFiles()
    scanFolders()

    useEffect(() => {
        async function fetchData() {
            try {
                const filesResult: FileEntry[] = await invoke('scan_files');
                const foldersResult: FolderEntry[] = await invoke('scan_folders');

                // Создаем массив, объединяя файлы и папки и добавляя тип
                const combinedEntries: Entry[] = [
                    ...foldersResult.map(folder => ({
                        path: folder.path,
                        name: folder.name,
                        size: '--', // Устанавливаем '--' для размера папок
                        created_at: folder.created_at,
                        type: 'folder' as 'folder', // Явно указываем TS тип для 'folder'
                    })),
                    ...filesResult.map(file => ({
                        path: file.path,
                        name: file.name,
                        size: file.size,
                        created_at: file.created_at,
                        type: 'file' as 'file', // Явно указываем TS тип для 'file'
                    })),
                ];

                // Сортируем объединенный массив по названию
                combinedEntries.sort((a, b) => a.name.localeCompare(b.name));

                // Устанавливаем объединенный массив в состояние
                setEntries(combinedEntries);
            } catch (error) {
                console.error('Error scanning files or folders:', error);
            }
        }

        fetchData();
    }, []);

    return (
        <Container className={`app-container-column ${visible ? "" : "hide-page"}`}>
            <section className="app-section flex-1">
                <ul>
                    <ListFiles entries={entries} />
                </ul>
            </section>
        </Container>
    )
}

export default FileManagerPage