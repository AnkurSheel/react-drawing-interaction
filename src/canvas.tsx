import React, { useCallback, useEffect, useRef, useState } from 'react';

interface CanvasProps {
    width: number;
    height: number;
}

const Canvas = ({ width, height }: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPainting, setIsPainting] = useState(false);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    const startPaint = useCallback((event: MouseEvent) => {
        const coordinates = getCoordinates(event);
        if (coordinates) {
            setIsPainting(true);
            setX(coordinates[0]);
            setY(coordinates[1]);
        }
    }, []);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener('mousedown', startPaint);
        return () => {
            canvas.removeEventListener('mousedown', startPaint);
        };
    }, [startPaint]);

    const paint = useCallback(
        (event: MouseEvent) => {
            if (isPainting) {
                let [newX, newY] = getCoordinates(event) || [0, 0];
                drawLine(x, y, newX, newY);
                setX(newX);
                setY(newY);
            }
        },
        [isPainting, x, y]
    );

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        canvas.addEventListener('mousemove', paint);
        return () => {
            canvas.removeEventListener('mousemove', paint);
        };
    }, [paint]);

    const getCoordinates = (event: MouseEvent) => {
        if (!canvasRef.current) {
            return;
        }

        if (['mousedown', 'mousemove'].includes(event.type)) {
            const canvas: HTMLCanvasElement = canvasRef.current;
            return [event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop];
        }
    };

    const drawLine = (firstX: number, firstY: number, secondX: number, secondY: number) => {
        if (!canvasRef.current) {
            return;
        }
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) {
            context.strokeStyle = 'red';
            context.lineJoin = 'round';
            context.lineWidth = 5;

            context.beginPath();
            context.moveTo(secondX, secondY);
            context.lineTo(firstX, firstY);
            context.closePath();

            context.stroke();
        }
    };

    return <canvas ref={canvasRef} height={height} width={width} />;
};

Canvas.defaultProps = {
    width: window.innerWidth,
    height: window.innerHeight,
};

export default Canvas;
