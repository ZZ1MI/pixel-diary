'use client';

import { useEffect, useState } from 'react';
import { Diary } from '@/types/diary';
import { saveDiary, getDiaries, deleteDiary } from '@/lib/db';
import PixelCanvas from '@/components/PixelCanvas/PixelCanvas';
import UploadImage from '@/components/UploadImage/UploadImage';
import DiaryCard from '@/components/DiaryCard/DiaryCard';

// * IndexedDB 사용으로 제거
// const STORAGE_KEY = 'pixel-diary';

export default function Home() {
    const [imageUrl, setImageUrl] = useState('');
    const [pixelSize, setPixelSize] = useState(32);
    const [content, setContent] = useState('');
    const [diaries, setDiaries] = useState<Diary[]>([]);
    const [selectedDate, setSelectedDate] = useState('');

    // 다이어리 작성용 날짜 (지난 날짜도 작성이 가능하도록)
    const [diaryDate, setDiaryDate] = useState(new Date().toISOString().split('T')[0]);

    // 이미지 변환용 상태값
    const [generatedImage, setGeneratedImage] = useState(''); // ai가 만들어준 결과
    const [isGenerating, setIsGenerating] = useState(false); // ai 작업중인지 여부

    // * IndexedDB 사용으로 수정

    const handleSave = async () => {
        if (!imageUrl || !content.trim()) {
            alert('이미지와 일기를 입력해주세요.');
            return;
        }

        const newDiary: Diary = {
            id: crypto.randomUUID(),
            date: diaryDate,
            imageUrl,
            generatedImage: generatedImage || imageUrl,
            content,
            pixelSize,
            createdAt: new Date().toISOString(),
        };

        await saveDiary(newDiary);

        setDiaries((prev) => [newDiary, ...prev]);

        setContent('');
        setImageUrl('');
        setGeneratedImage('');
    };

    // 최초 렌더링 시 저장된 일기 목록 불러오기
    useEffect(() => {
        const loadDiaries = async () => {
            const diaries = await getDiaries();

            diaries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setDiaries(diaries);
        };

        loadDiaries();
    }, []);

    const handleDelete = async (id: string) => {
        await deleteDiary(id);

        const updatedDiaries = diaries.filter((diary) => diary.id !== id);

        setDiaries(updatedDiaries);
    };

    const filteredDiaries = selectedDate ? diaries.filter((diary) => diary.date === selectedDate) : diaries;

    // 임시 ai 함수
    const handleGenerate = async () => {
        const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imageUrl,
            }),
        });

        const data = await response.json();

        console.log(data);

        // setGeneratedImage(data.imageUrl);
    };

    useEffect(() => {
        setGeneratedImage('');
    }, [imageUrl]);

    return (
        <main>
            <h1>Pixel Diary</h1>

            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />

            <label>일기 날짜</label>

            <input type="date" value={diaryDate} onChange={(e) => setDiaryDate(e.target.value)} />

            <UploadImage imageUrl={imageUrl} setImageUrl={setImageUrl} />

            <div>
                <label>Pixel size: {pixelSize}</label>

                <input type="range" min="8" max="128" step="8" value={pixelSize} onChange={(event) => setPixelSize(Number(event.target.value))} />
            </div>

            {imageUrl && <PixelCanvas imageUrl={imageUrl} pixelSize={pixelSize} />}

            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="오늘 하루를 기록해보세요." />

            <button type="button" onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? 'AI 변환 중...' : 'AI 그림 생성'}
            </button>

            {generatedImage && (
                <>
                    <h2>AI 결과</h2>

                    <img src={generatedImage} alt="AI 생성 결과" width={256} />
                </>
            )}

            <button type="button" onClick={handleSave}>
                저장
            </button>

            {/* 결과 확인용 */}
            {filteredDiaries.map((diary) => (
                <DiaryCard key={diary.id} diary={diary} onDelete={handleDelete} />
            ))}
        </main>
    );
}
