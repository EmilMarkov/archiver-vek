import React, { useEffect, useState } from 'react';
import ListFiles from '../../../ListFiles';
import PathShower from '../../../PathShower';
import { MD5 } from 'crypto-js';

let sep: string;

if (navigator.appVersion.indexOf('Win') !== -1) {
    sep = '\\';
} else {
    sep = '/';
}

import { 
    Container,
    Props,
    FileEntry,
    FolderEntry,
    Entry
} from './styles';

import { invoke } from '@tauri-apps/api';

interface DiskData {
    diskPath: string;
    maxCapacity: number;
    minCapacity: number;
}

async function getAllDisks(): Promise<DiskData[]> {
    try {
        const disksData: Array<[string, number, number]> = await invoke('get_all_disks');
        const disks: DiskData[] = disksData.map(([diskPath, maxCapacity, minCapacity]) => ({
            diskPath,
            maxCapacity,
            minCapacity,
        }));

        return disks;
    } catch (error) {
        console.error('Error fetching disks:', error);
        return [];
    }
}

const FileManagerPage: React.FC<Props> = ({ pageName, visible }) => {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [currentPath, setCurrentPath] = useState<string>('');
    const [isPathDisk, setIsPathDisk] = useState<boolean>(false);

    async function fetchData(path: string) {
        try {
            if (navigator.appVersion.indexOf('Win') !== -1 && path.endsWith(':')) {
                path += '\\';
            }
            
            const filesResult: FileEntry[] = await invoke('scan_files', { path });
            const foldersResult: FolderEntry[] = await invoke('scan_folders', { path });

            const combinedEntries: Entry[] = [
                ...foldersResult.map((folder) => ({
                    id: parseInt(MD5(folder.path).toString().substring(0, 8), 16),
                    path: folder.path,
                    name: folder.name,
                    size: '--',
                    created_at: folder.created_at,
                    type: 'folder' as 'folder',
                })),
                ...filesResult.map((file) => ({
                    id: parseInt(MD5(file.path).toString().substring(0, 8), 16),
                    path: file.path,
                    name: file.name,
                    size: file.size,
                    created_at: file.created_at,
                    type: 'file' as 'file',
                })),
            ];

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

    const handleGoUp = async () => {
        const parts = currentPath.split(sep);

        if (parts[parts.length - 1] === '') {
            parts.pop();
        }

        if (parts[0] === '' && parts.length === 2) {
            parts.shift();
        }

        if (parts.length !== 1) {
            setIsPathDisk(false);
            parts.pop();
            const parentPath = parts.join(sep);
            fetchData(parentPath);
        } else {
            try {
                setIsPathDisk(true);
                const disksData: DiskData[] = await getAllDisks();
    
                if (disksData.length > 0) {
                    const disksEntries: Entry[] = disksData.map((disk) => ({
                        id: parseInt(MD5(disk.diskPath).toString().substring(0, 8), 16),
                        path: disk.diskPath,
                        name: disk.diskPath,
                        created_at: disk.minCapacity.toString(),
                        size: disk.maxCapacity.toString(),
                        type: 'disk' as 'disk',
                    }));
    
                    setEntries(disksEntries);
                    setCurrentPath(currentPath);
                }
            } catch (error) {
                console.error('Error fetching disks:', error);
            }
        }
    };
    

    const handleItemDoubleClick = (id: number) => {
        console.log(id)
        const item = entries.find((item) => item.id === id);
        if (item && (item.type === 'folder' || item.type === 'disk')) {
            setIsPathDisk(false);
            let newPath = item.path;
            fetchData(newPath);
        }
    };    
    

    return (
        <Container className={`app-container-column ${visible ? '' : 'hide-page'}`}>
            <PathShower path={currentPath} onNavigate={handleNavigate} onGoUp={handleGoUp} />
            <section className="app-section flex-1">
                <ul style={{ width: `${100}%`, height: `${100}%` }}>
                    <ListFiles entries={entries} onItemDoubleClick={handleItemDoubleClick} isPathDisk={isPathDisk} />
                </ul>
            </section>
        </Container>
    );
};

export default FileManagerPage;