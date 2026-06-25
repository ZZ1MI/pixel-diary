import { Diary } from '@/types/diary';
import style from './DiaryCard.module.css';
import PixelCanvas from '../PixelCanvas/PixelCanvas';

interface DiaryCardProps {
    diary: Diary;
    onDelete: (id: string) => void;
}

export default function DiaryCard({ diary, onDelete }: DiaryCardProps) {
    return (
        <article className={style.card}>
            <p className={style.date}>{diary.date}</p>

            <PixelCanvas imageUrl={diary.imageUrl} pixelSize={diary.pixelSize} />

            <p>{diary.content}</p>

            <button type="button" className={style.btnDelete} onClick={() => onDelete(diary.id)}>
                삭제
            </button>
        </article>
    );
}
