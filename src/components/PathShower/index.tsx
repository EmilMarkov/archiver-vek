import React, { useState } from 'react';

let sep: string;

if (navigator.appVersion.indexOf('Win') !== -1) {
    sep = '\\';
} else {
    sep = '/';
}

import {
    Props,
    Container,
    GoUpButton,
    PartButton,
    PartsContainer
} from './styles'

import { 
    SvgIconUp
} from '../SvgIcon'

const PathShower: React.FC<Props> = ({
    path,
    onNavigate,
    onGoUp
}) => {
    const svgIconUp = <SvgIconUp size={'16'} />

    const pathParts = path.split(sep);

    const handleNavigate = (index: number) => {
        const newPath = pathParts.slice(0, index + 1).join(sep);
        onNavigate(newPath);
    };

    return (
        <Container>
            <GoUpButton onClick={onGoUp}>{svgIconUp}</GoUpButton>
            <PartsContainer>
                {pathParts.map((part, index) => (
                    <span key={index}>
                        {part.trim() && (
                            <PartButton onClick={() => handleNavigate(index)}>{part}</PartButton>
                        )}
                    </span>
                ))}
            </PartsContainer>
        </Container>
    );
};

export default PathShower;