import React from "react";

interface ImageProps {
    index: number;
    type: string;
    medalLevel?: number;
}

const AwardImage = ({index, type, medalLevel = 0}: ImageProps) => {
    const awardHeight = (type === 'ribbon') ? 24 : 64
    const spriteOffset = index * awardHeight;

    let filename = type;
    if (type === 'badge') {
        filename += medalLevel
    } else {
        if (medalLevel === 0) filename += 0
        else filename += 1
    }

    return (<div style={{
        width: '64px',
        height: `${awardHeight}px`,
        backgroundImage: `url('/assets/img/awards/${filename}.png')`,
        backgroundPosition: `0px -${spriteOffset}px`,
        backgroundSize: '100%',
    }} />)
}

export default AwardImage;