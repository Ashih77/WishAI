import { getStore } from "@netlify/blobs";

function getEnv(key) {
    const value = globalThis.Netlify?.env?.get?.(key) || process.env[key] || '';
    return value.trim().replace(/["']/g, '');
}

async function saveJob(jobId, data) {
    const store = getStore("wishai_openai_jobs");
    await store.setJSON(jobId, {
        ...data,
        updatedAt: new Date().toISOString()
    });
}

export default async (req) => {
    let jobId = '';

    try {
        const body = await req.json();
        jobId = body.jobId;
        const prompt = body.prompt;

        if (!jobId || !prompt) return;

        await saveJob(jobId, { status: 'processing' });

        const apiKey = getEnv('OPENAI_API_KEY') || getEnv('OPENAIAPIKEY');
        if (!apiKey) {
            await saveJob(jobId, { status: 'error', error: 'OPENAI_API_KEY_MISSING' });
            return;
        }

        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-image-2',
                prompt,
                size: '1024x1536',
                quality: 'medium',
                output_format: 'png'
            })
        });

        const data = await response.json();

        if (!response.ok) {
            await saveJob(jobId, {
                status: 'error',
                error: 'OPENAI_IMAGE_2_FAILED',
                message: data.error?.message || 'Unknown'
            });
            return;
        }

        const image = data.data?.[0]?.b64_json;
        if (!image) {
            await saveJob(jobId, {
                status: 'error',
                error: 'OPENAI_IMAGE_2_EMPTY_RESPONSE'
            });
            return;
        }

        await saveJob(jobId, {
            status: 'ready',
            used: 'gpt-image-2',
            image,
            mimeType: 'image/png'
        });
    } catch (err) {
        if (jobId) {
            await saveJob(jobId, {
                status: 'error',
                error: 'OPENAI_IMAGE_2_BACKGROUND_FAILED',
                message: err.message
            });
        }
    }
};

export const config = {
    path: "/api/openai-image-background"
};
