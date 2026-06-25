'use client';

import Image from 'next/image';
import { ChangeEvent } from 'react';
import style from './UploadImage.module.css';

interface UploadImageProps {
    imageUrl: string;
    setImageUrl: (value: string) => void;
}

export default function UploadImage({ imageUrl, setImageUrl }: UploadImageProps) {
    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            setImageUrl(reader.result as string);
        };

        reader.readAsDataURL(file);
    };

    return (
        <div className={style.container}>
            <input type="file" accept="image/*" onChange={handleImageChange} />

            {imageUrl && <Image src={imageUrl} alt="Uploaded preview" width={160} height={160} unoptimized className={style.preview} />}
        </div>
    );
}
