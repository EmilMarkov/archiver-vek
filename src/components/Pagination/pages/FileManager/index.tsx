import React, { useEffect, useState } from 'react';
import ListFiles from '../../../ListFiles';
import PathShower from '../../../PathShower';

import { 
    Container,
    Props,
    FileEntry,
    FolderEntry,
    Entry
} from './styles';

import { invoke } from '@tauri-apps/api';

const FileManagerPage: React.FC<Props> = ({ pageName, visible }) => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [currentPath, setCurrentPath] = useState<string>('/');

    async function fetchData(path: string) {
        try {
            const filesResult: FileEntry[] = await invoke('scan_files', { path });
            const foldersResult: FolderEntry[] = await invoke('scan_folders', { path });

            // Создаем массив, объединяя файлы и папки и добавляя тип
            const combinedEntries: Entry[] = [
                ...foldersResult.map((folder) => ({
                    path: folder.path,
                    name: folder.name,
                    size: '--', // Устанавливаем '--' для размера папок
                    created_at: folder.created_at,
                    type: 'folder' as 'folder', // Явно указываем TS тип для 'folder'
                })),
                ...filesResult.map((file) => ({
                    path: file.path,
                    name: file.name,
                    size: file.size,
                    created_at: file.created_at,
                    type: 'file' as 'file', // Явно указываем TS тип для 'file'
                })),
            ];

            // Сортируем объединенный массив по названию
            combinedEntries.sort((a, b) => a.name.localeCompare(b.name));

            // Устанавливаем объединенный массив и текущий путь в состояние
            setEntries(combinedEntries);
            setCurrentPath(path);
        } catch (error) {
            console.error('Error scanning files or folders:', error);
        }
    }

    useEffect(() => {
        invoke('get_home_dir').then((homeDir) => {
            fetchData(homeDir as string);
        });
    }, []);

    const handleNavigate = (newPath: string) => {
        fetchData(newPath);
    };

    const handleGoUp = () => {
        const parts = currentPath.split('/');
        if (parts.length !== 1) {
            parts.pop();
            const parentPath = parts.join('/');
            fetchData(parentPath);
            console.log(parts)
        } 
    };

    const handleItemDoubleClick = (index: number) => {
        const item = entries[index];
        if (item.type === 'folder') {
            const newPath = item.path;
            fetchData(newPath);
        }
    };

    return (
        <Container className={`app-container-column ${visible ? '' : 'hide-page'}`}>
            <PathShower path={currentPath} onNavigate={handleNavigate} onGoUp={handleGoUp} />
            <section className="app-section flex-1">
                <ul>
                    <ListFiles entries={entries} onItemDoubleClick={handleItemDoubleClick} />
                </ul>
            </section>
        </Container>
    );
};

export default FileManagerPage;