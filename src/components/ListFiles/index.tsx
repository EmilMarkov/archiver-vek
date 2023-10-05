import React, { useState, useEffect, useMemo } from 'react';
import FileItem from '../FileItem';
import ContextMenu from '../ContextMenu';
import Modals from '../modals';
import { Settings } from '../../Settings';

import {
    Props,
    Container,
    InfoBar,
    Left,
    Center,
    Right,
    DivLine,
    ResizeHandle,
    ListContainer
} from './styles';

function formatFileSize(size: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
  
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
  
    const formattedSize = size % 1 === 0 ? size.toFixed(0) : size.toFixed(2);
  
    return `${formattedSize} ${units[unitIndex]}`;
}  

const ListFiles: React.FC<Props> = ({ entries, onItemDoubleClick, isPathDisk }) => {
    /** US_ListFiles */
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [fileNameWidth, setFileNameWidth] = useState(60);

    /** US_ContextMenu */
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });

    /** US_Modals */
    const [selectedModal, setSelectedModal] = useState<string | null>(null);

    /** US_MouseEvents */
    const [isDragging, setDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeStartX, setResizeStartX] = useState(0);
    const [startSelectionIndex, setStartSelectionIndex] = useState<number | null>(null);

    /* =============================================================================== */

    /** $Entries */
    const formattedEntries = useMemo(() => {
        return entries.map((item) => ({
            ...item,
            size: item.type === 'folder' ? '--' : (item.type === 'disk' ? `${parseInt(item.size)} GB` : formatFileSize(parseInt(item.size))),
        }));
    }, [entries]);

    const filteredEntries = useMemo(() => {
        if (Settings.isShowHiddenFolders) {
            return formattedEntries;
        } else {
            return formattedEntries.filter((item) => !item.name.startsWith('.'));
        }
    }, [formattedEntries]);

    /* =============================================================================== */

    /** $MouseEvents */
    const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
        e.preventDefault();
        if (e.button === 2) {
            if (!selectedItems.includes(index)) {
                setSelectedItems([index]);
            }
            setContextMenuOpen(true);
            setContextMenuPosition({ top: e.clientY, left: e.clientX });
        } else if (e.ctrlKey) {
            if (selectedItems.includes(index)) {
                setSelectedItems(selectedItems.filter((i) => i !== index));
            } else {
                setSelectedItems([...selectedItems, index]);
            }
        } else if (e.shiftKey) {
            if (startSelectionIndex !== null) {
                const minIndex = Math.min(startSelectionIndex, index);
                const maxIndex = Math.max(startSelectionIndex, index);
                setSelectedItems(Array.from({ length: maxIndex - minIndex + 1 }, (_, i) => minIndex + i));
            } else {
                setSelectedItems([index]);
                setStartSelectionIndex(index);
            }
        } else {
            setSelectedItems([index]);
            setStartSelectionIndex(index);
        }
        setDragging(true);
    };

    const handleMouseEnter = (index: number) => (e: React.MouseEvent) => {
        if (isDragging && startSelectionIndex !== null && selectedItems.length > 0) {
            const minIndex = Math.min(startSelectionIndex, index);
            const maxIndex = Math.max(startSelectionIndex, index);
            setSelectedItems(Array.from({ length: maxIndex - minIndex + 1 }, (_, i) => minIndex + i));
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    const handleResizeMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
        setResizeStartX(e.clientX);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isResizing) {
            const deltaX = e.clientX - resizeStartX;
            const newWidth = fileNameWidth + (deltaX / window.innerWidth) * 100;
            const clampedWidth = Math.min(60, Math.max(20, newWidth));
            setFileNameWidth(clampedWidth);
        }
    };

    const handleMouseUpResize = () => {
        setIsResizing(false);
    };    

    /* =============================================================================== */

    /** $HandleFunctions */
    const handleItemDoubleClick = (index: number) => {
        onItemDoubleClick(index);
    };

    const handleOpenModal = (modalName: string) => {
        setSelectedModal(modalName);
        setContextMenuOpen(false);
    };

    const handleCloseModal = () => {
        setSelectedModal(null);
    };

    /* =============================================================================== */

    /** UseEffects */
    useEffect(() => {
        const handleDocumentClick = (e: MouseEvent) => {
            const contextMenu = document.getElementById('context-menu');
            const listContainer = document.getElementById('list-container');
            if (contextMenu && !contextMenu.contains(e.target as Node)) {
                setContextMenuOpen(false);
            }
            if (listContainer && !listContainer.contains(e.target as Node)) {
                setSelectedItems([]);
            }
        };

        document.addEventListener('click', handleDocumentClick);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, [contextMenuOpen]);

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUpResize);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUpResize);
        };
    }, [isResizing]);

    /* =============================================================================== */

    return (
        <Container onMouseUp={handleMouseUp}>
            <InfoBar>
                <Left style={{ width: `${fileNameWidth}%` }}>
                    {isPathDisk ? "Disk Name" : "File Name"}
                </Left>
                <ResizeHandle onMouseDown={handleResizeMouseDown} />
                <Center>
                    {isPathDisk ? "Available Size" : "Created At"}
                </Center>
                <Right>
                    {isPathDisk ? "Free Size" : "File Size"}
                </Right>
            </InfoBar>
            <DivLine />
            <ListContainer id='list-container'>
                {filteredEntries.map((item, index) => (
                    <li
                        key={item.id}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`FileItem ${selectedItems.includes(index) ? 'shiftSelected' : ''} ${
                            isDragging ? 'dragging' : ''
                        }`}
                        onDoubleClick={() => handleItemDoubleClick(item.id)}
                    >
                        <FileItem
                            name={item.name}
                            creationDate={item.created_at}
                            size={item.size}
                            selected={selectedItems.includes(index)}
                            onMouseDown={handleMouseDown(index)}
                            onMouseEnter={handleMouseEnter(index)}
                            fileNameWidth={fileNameWidth}
                            type={item.type}
                        />
                    </li>
                ))}
            </ListContainer>
            <ContextMenu
                isOpen={contextMenuOpen}
                position={contextMenuPosition}
                onOpenModal={handleOpenModal}
            />
            <Modals
                setModal={selectedModal}
                closeModal={handleCloseModal}
                data={filteredEntries}
            />
        </Container>
    );
};

export default ListFiles;