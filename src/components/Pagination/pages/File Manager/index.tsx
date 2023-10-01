import React, { useEffect, useRef, useState } from 'react'
import { Container, Props } from './styles'
import FileItem from '../../../FileItem'  // Импортируйте компонент FileItem
import { SvgIconPlus, SvgIconReload } from '../../../SvgIcon'
import usePersistedState from '../../../../utils/userPersistedState'
import { DefaultTheme } from 'styled-components'
import { Settings } from '../../../../Settings'
import { invoke } from '@tauri-apps/api';

const FileManagerPage: React.FC<Props> = ({pageName, visible}) => {
    interface FileEntry {
        path: string;
        name: string;
        size: string;
        created_at: string;
    }
      
    interface FolderEntry {
        path: string;
        name: string;
        created_at: string;
    }

    interface Entry {
        path: string;
        name: string;
        size: string;
        created_at: string;
        type: 'file' | 'folder';
    }

    // Set useContext
    const [ theme, setTheme ] = usePersistedState<DefaultTheme>('theme', Settings.appDefaultTheme)
    const [ files, setFiles ] = useState<FileEntry[]>([])
    const [ folders, setFolders ] = useState<FolderEntry[]>([])
    const [entries, setEntries] = useState<Entry[]>([]);

    function formatFileSize(size: number): string {
        if (size < 1024) {
          return size + ' B';
        } else if (size < 1024 * 1024) {
          return (size / 1024).toFixed(2) + ' KB';
        } else if (size < 1024 * 1024 * 1024) {
          return (size / (1024 * 1024)).toFixed(2) + ' MB';
        } else {
          return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
        }
    }

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
                    {entries.map((item, index) => (
                        <li key={index}>
                            <FileItem
                                name={item.name}
                                creationDate={item.created_at}
                                size={item.type === 'folder' ? '--' : formatFileSize(parseInt(item.size))}
                            />
                        </li>
                    ))}
                </ul>
            </section>
        </Container>
    )
}

export default FileManagerPage