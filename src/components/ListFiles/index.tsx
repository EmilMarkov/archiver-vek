import React, { useState, useEffect, useRef } from 'react';
import FileItem from '../FileItem';
import ContextMenu from '../ContextMenu';

import {
  Props,
  Container
} from './styles';

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

const ListFiles: React.FC<Props> = ({ entries }) => {
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [isDragging, setDragging] = useState(false);
    const listContainerRef = useRef<HTMLDivElement | null>(null);
    const contextMenuConteinerRef = useRef<HTMLDivElement | null>(null);
    const [startSelectionIndex, setStartSelectionIndex] = useState<number | null>(null);
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });

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
        }
        else if (e.ctrlKey) {
            if (selectedItems.includes(index)) {
                const newSelectedItems = selectedItems.filter((i) => i !== index);
                setSelectedItems(newSelectedItems);
            } else {
                setSelectedItems([...selectedItems, index]);
            }
        } else if (e.shiftKey) {
            const lastSelectedItemIndex = selectedItems[selectedItems.length - 1];
            if (lastSelectedItemIndex !== undefined) {
                const minIndex = Math.min(lastSelectedItemIndex, index);
                const maxIndex = Math.max(lastSelectedItemIndex, index);
                const newSelectedItems = Array.from(
                    { length: maxIndex - minIndex + 1 },
                    (_, i) => minIndex + i
                );
                setSelectedItems(newSelectedItems);
                return;
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
        if (isDragging && startSelectionIndex !== null) {
            const minIndex = Math.min(startSelectionIndex, index);
            const maxIndex = Math.max(startSelectionIndex, index);
            const newSelectedItems = Array.from(
                { length: maxIndex - minIndex + 1 },
                (_, i) => minIndex + i
            );
            setSelectedItems(newSelectedItems);
        }
    };
           

    const handleMouseUp = () => {
        setDragging(false);
    };

    return (
        <Container ref={listContainerRef} onMouseUp={handleMouseUp}>
            {entries.map((item, index) => (
                <li
                    key={index}
                    onContextMenu={(e) => e.preventDefault()}
                    className={`FileItem ${
                        selectedItems.includes(index) ? 'shiftSelected' : ''
                    } ${isDragging ? 'dragging' : ''}`}
                >
                    <FileItem
                        name={item.name}
                        creationDate={item.created_at}
                        size={
                            item.type === 'folder' ? '--' : formatFileSize(parseInt(item.size))
                        }
                        selected={selectedItems.includes(index)}
                        onMouseDown={handleMouseDown(index)}
                        onMouseEnter={handleMouseEnter(index)}
                    />
                </li>
            ))}
            <ContextMenu
                isOpen={contextMenuOpen}
                position={contextMenuPosition}
                onClose={handleContextMenuClose}
            />
        </Container>
    );
};

export default ListFiles;