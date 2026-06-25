'use client';

import { useState } from 'react';
import PixelCanvas from '@/components/PixelCanvas/PixelCanvas';
import UploadImage from '@/components/UploadImage/UploadImage';

export default function Home() {
    const [imageUrl, setImageUrl] = useState('');
    const [pixelSize, setPixelSize] = useState(32);
    const [content, setContent] = useState('');

    // 처음엔 localStorage 사용
    const handleSave = () => {
        const diary = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            imageUrl,
            content,
            createdAt: new Date().toISOString(),
        };

        console.log(diary);
    };

    return (
        <main>
            <h1>Pixel Diary</h1>
            <UploadImage imageUrl={imageUrl} setImageUrl={setImageUrl} />

            <div>
                <label>Pixel size: {pixelSize}</label>

                <input type="range" min="8" max="128" step="8" value={pixelSize} onChange={(event) => setPixelSize(Number(event.target.value))} />
            </div>

            {imageUrl && <PixelCanvas imageUrl={imageUrl} pixelSize={pixelSize} />}

            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="오늘 하루를 기록해보세요." />

            <button type="button" onClick={handleSave}>
                저장
            </button>
        </main>
    );
}
