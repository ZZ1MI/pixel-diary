import { openDB } from 'idb';
import { Diary } from '@/types/diary';

const DB_NAME = 'pixel-diary-db';
const STORE_NAME = 'diaries';

async function getDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, {
                    keyPath: 'id',
                });
            }
        },
    });
}

export async function saveDiary(diary: Diary) {
    const db = await getDB();

    await db.put(STORE_NAME, diary);
}

export async function getDiaries(): Promise<Diary[]> {
    const db = await getDB();

    return db.getAll(STORE_NAME);
}

export async function deleteDiary(id: string) {
    const db = await getDB();

    await db.delete(STORE_NAME, id);
}
