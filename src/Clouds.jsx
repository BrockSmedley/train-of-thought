import React, { useState, useEffect } from 'react';
import { Animate } from 'react-move';

const colors = [
    "#333", "#444", "#777", "#999", "#AAA"
]

const useTick = (delay, initialIndex) => {
    const [tick, setTick] = useState(initialIndex ? initialIndex : 0);
    useEffect(() => {
        const interval = setInterval(() => {
            if (!document.hidden) {
                setTick((tick) => tick + 1);
            }
        }, delay);
        return () => clearInterval(interval);
    }, [delay]);
    return tick;
}

const Bar = ({ x, y, width, height, fill, tickTiming }) => {
    return (
        <Animate start={{ height }} enter={{ height: [height], timing: tickTiming }} update={{ height: [height], timing: tickTiming }}>
            {(state) => <rect x={x} y={y} width={width} height={height} fill={fill}></rect>}
        </Animate>
    );
}

const Clouds = () => {
    const delay = 41;
    const maxIndex = 9001;
    const index = useTick(delay, 0) % maxIndex;
    let calculatedHeight = 20 * (Math.sin(index / 24) + 1) + 1;

    return (
        <div style={{ width: 300, position: "absolute", top: 155, left: 820 }}>
            <svg version="1.1" viewBox="0 0 180 150">
                <g id="root">
                    <g>
                        {[36, 26, 9, 9, 26].map((d, i) => <Bar key={i} tickTiming={index} x={60 * (1 - i / 4) + 24 * i + 50} y={90 + i * 4 + (i * (calculatedHeight / 5)) * Math.cos(i * 10 + calculatedHeight / 4)} width={16} height={calculatedHeight / 1.5 + 10} fill={`${colors[i]}${7}`} />)}
                    </g>
                </g>
            </svg>
        </div>
    )
};

export default Clouds;