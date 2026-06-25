import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: 'Today I ate ramen and',
            }),
        });

        const data = await response.json();

        console.log(data);

        return NextResponse.json(data);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: 'API 호출 실패',
            },
            {
                status: 500,
            },
        );
    }
}
