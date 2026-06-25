'use client';

import { useState } from 'react';
import PixelCanvas from '@/components/PixelCanvas/PixelCanvas';
import UploadImage from '@/components/UploadImage/UploadImage';

export default function Home() {
    const [imageUrl, setImageUrl] = useState('');
    const [pixelSize, setPixelSize] = useState(32);

    return (
        <main>
            <h1>Pixel Diary</h1>
            <UploadImage imageUrl={imageUrl} setImageUrl={setImageUrl} />

            <div>
                <label>Pixel size: {pixelSize}</label>

                <input type="range" min="8" max="128" step="8" value={pixelSize} onChange={(event) => setPixelSize(Number(event.target.value))} />
            </div>

            {imageUrl && <PixelCanvas imageUrl={imageUrl} pixelSize={pixelSize} />}
        </main>
    );
}
