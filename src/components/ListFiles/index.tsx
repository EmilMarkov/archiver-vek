import React, { useState, useEffect, useRef, useMemo } from 'react';
import FileItem from '../FileItem';
import ContextMenu from '../ContextMenu';

import {
    Props,
    Container,
    InfoBar,
    FileName,
    CreatedAt,
    FileSize,
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

const ListFiles: React.FC<Props> = ({ entries, onItemDoubleClick }) => {
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [isDragging, setDragging] = useState(false);
    const listContainerRef = useRef<HTMLDivElement | null>(null);
    const [startSelectionIndex, setStartSelectionIndex] = useState<number | null>(null);
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });
    const [fileNameWidth, setFileNameWidth] = useState(60);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeStartX, setResizeStartX] = useState(0);

    const formattedEntries = useMemo(() => {
        return entries.map((item) => ({
            ...item,
            size: item.type === 'folder' ? '--' : formatFileSize(parseInt(item.size))
        }));
    }, [entries]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (listContainerRef.current && !listContainerRef.current.contains(e.target as Node)) {
                setSelectedItems([]);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleDocumentClick = (e: MouseEvent) => {
            if (contextMenuOpen) {
                const contextMenu = document.getElementById('context-menu');
                if (contextMenu && !contextMenu.contains(e.target as Node)) {
                    setContextMenuOpen(false);
                }
            }
        };

        document.addEventListener('click', handleDocumentClick);
        return () => document.removeEventListener('click', handleDocumentClick);
    }, [contextMenuOpen]);

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

    const handleContextMenuClose = () => {
        setContextMenuOpen(false);
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

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUpResize);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUpResize);
        };
    }, [isResizing]);

    const handleItemDoubleClick = (index: number) => {
        onItemDoubleClick(index);
    };

    return (
        <Container ref={listContainerRef} onMouseUp={handleMouseUp}>
            <InfoBar>
                {/* ... остальной код ... */}
            </InfoBar>
            <DivLine />
            <ListContainer>
                {formattedEntries.map((item, index) => (
                    <li
                        key={item.path}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`FileItem ${selectedItems.includes(index) ? 'shiftSelected' : ''} ${
                            isDragging ? 'dragging' : ''
                        }`}
                        onDoubleClick={() => handleItemDoubleClick(index)}
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
                onClose={handleContextMenuClose}
            />
        </Container>
    );
};

export default ListFiles;