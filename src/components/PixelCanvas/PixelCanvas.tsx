'use client';

import { useEffect, useRef } from 'react';

interface PixelCanvasProps {
    imageUrl: string;
    pixelSize: number;
}

export default function PixelCanvas({ imageUrl, pixelSize }: PixelCanvasProps) {
    // DOM 접근
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // 이미지 변경 감지
    useEffect(() => {
        if (!imageUrl) return;

        const canvas = canvasRef.current;

        if (!canvas) return;

        // canvas 그리기
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const img = new Image();

        img.src = imageUrl;

        img.onload = () => {
            // * 픽셀 사이즈 슬라이더 구현을 위해 부모로 상태를 올려야 함으로 주석처리
            // * const pixelSize = 16;

            canvas.width = 256;
            canvas.height = 256;

            // 확대 시 블러 제거
            ctx.imageSmoothingEnabled = false;

            // 작은 캔버스 생성
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');

            if (!tempCtx) return;

            tempCanvas.width = pixelSize;
            tempCanvas.height = pixelSize;

            // 원본 → 16x16

            tempCtx.drawImage(img, 0, 0, pixelSize, pixelSize);

            // 16x16 → 256x256
            ctx.drawImage(tempCanvas, 0, 0, 256, 256);
        };
    }, [imageUrl, pixelSize]);

    return <canvas ref={canvasRef} />;
}
