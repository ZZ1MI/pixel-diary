'use client';

import { useEffect, useState } from 'react';
import PixelCanvas from '@/components/PixelCanvas/PixelCanvas';
import UploadImage from '@/components/UploadImage/UploadImage';
import { Diary } from '@/types/diary';

const STORAGE_KEY = 'pixel-diary';

export default function Home() {
    const [imageUrl, setImageUrl] = useState('');
    const [pixelSize, setPixelSize] = useState(32);
    const [content, setContent] = useState('');
    const [diaries, setDiaries] = useState<Diary[]>([]);

    const handleSave = () => {
        // 이미지 또는 내용이 없으면 저장하지 않음
        if (!imageUrl || !content.trim()) {
            alert('이미지와 일기를 입력해주세요.');
            return;
        }

        const newDiary: Diary = {
            id: crypto.randomUUID(),
            date: new Date().toISOString().split('T')[0],
            imageUrl,
            content,
            createdAt: new Date().toISOString(),
        };

        // 이전 상태(prev)를 기준으로 안전하게 업데이트
        setDiaries((prev) => {
            const updatedDiaries = [newDiary, ...prev];

            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDiaries));

            return updatedDiaries;
        });

        // 저장 후 입력값 초기화
        setContent('');
        setImageUrl('');
    };

    // 최초 렌더링 시 저장된 일기 목록 불러오기
    useEffect(() => {
        const storedData = localStorage.getItem(STORAGE_KEY);

        if (!storedData) return;

        try {
            setDiaries(JSON.parse(storedData));
        } catch (error) {
            console.error('일기 데이터를 불러오는데 실패했습니다.', error);
        }
    }, []);

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

            {/* 결과 확인용 */}
            {diaries.map((diary) => (
                <div key={diary.id}>
                    <p>{diary.date}</p>
                    <img src={diary.imageUrl} alt="일기 이미지" width={150} />
                    <p>{diary.content}</p>
                </div>
            ))}
        </main>
    );
}
