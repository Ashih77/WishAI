import { getStore } from "@netlify/blobs";

function getEnv(key) {
    const value = globalThis.Netlify?.env?.get?.(key) || process.env[key] || '';
    return value.trim().replace(/["']/g, '');
}

function parseJsonText(value) {
    const clean = String(value || '').replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(clean);
}

async function imageToInlineData(image) {
    if (!image) throw new Error('IMAGE_MISSING');

    if (image.startsWith('data:')) {
        const [header, data] = image.split(',');
        const mimeType = header.match(/^data:([^;]+)/)?.[1] || 'image/png';
        return { mimeType, data };
    }

    if (/^https?:\/\//i.test(image)) {
        const response = await fetch(image);
        if (!response.ok) throw new Error('IMAGE_FETCH_FAILED');
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const buffer = Buffer.from(await response.arrayBuffer());
        return { mimeType: contentType.split(';')[0], data: buffer.toString('base64') };
    }

    return { mimeType: 'image/png', data: image };
}

function normalizeAiResult(result) {
    const score = Math.max(0, Math.min(10, Number(result.score || result.ai_score || 0)));
    const advice = Array.isArray(result.advice) ? result.advice : [];
    return {
        score,
        adherence: Boolean(result.adherence),
        summary: String(result.summary || result.ai_summary || ''),
        advice: advice.map(item => String(item)).slice(0, 5)
    };
}

function compactMetadata(metadata = {}) {
    const settings = metadata.settings || {};
    const user = metadata.user || {};

    return {
        timestamp: metadata.timestamp || Date.now(),
        name: metadata.name || '',
        nameSubtitle: metadata.nameSubtitle || '',
        occasion: metadata.occasion || '',
        greeting: metadata.greeting || '',
        instructions: metadata.instructions || '',
        style: metadata.style || '',
        subStyle: metadata.subStyle || metadata.effectiveSubStyle || '',
        effectiveSubStyle: metadata.effectiveSubStyle || metadata.subStyle || '',
        details: metadata.details ?? '',
        colorIntensity: metadata.colorIntensity ?? '',
        palette: metadata.palette || '',
        imageModel: metadata.imageModel || settings.imageModel || 'nano-banana-2',
        cycleId: metadata.cycleId || '',
        cycleLabel: metadata.cycleLabel || '',
        cycleStartedAt: metadata.cycleStartedAt || 0,
        settings: {
            imageModel: settings.imageModel || metadata.imageModel || 'nano-banana-2'
        },
        contentElements: Array.isArray(metadata.contentElements) ? metadata.contentElements.slice(0, 8) : [],
        tashkeel: !!metadata.tashkeel,
        zakhrafa: !!metadata.zakhrafa,
        namePosition: metadata.namePosition || '',
        user: {
            id: user.id || '',
            name: user.name || '',
            email: user.email || '',
            provider: user.provider || ''
        },
        rating: metadata.rating,
        feedback: metadata.feedback || '',
        chips: Array.isArray(metadata.chips) ? metadata.chips.slice(0, 8) : []
    };
}

async function saveEvaluation(fileKey, aiResult) {
    const store = getStore("wishai_generations", { consistency: "strong" });
    const existingMeta = await store.getMetadata(fileKey).catch(() => null);
    const imageData = await store.get(fileKey, { type: 'text' }).catch(() => null);
    if (!existingMeta || !imageData) throw new Error('IMAGE_NOT_FOUND');

    const metadata = compactMetadata(existingMeta.metadata || {});
    metadata.ai_score = aiResult.score;
    metadata.ai_adherence = aiResult.adherence;
    metadata.ai_summary = aiResult.summary;
    metadata.ai_advice = aiResult.advice;
    metadata.ai_evaluated_at = new Date().toISOString();
    metadata.ai_evaluation_status = 'complete';
    metadata.ai_evaluation_error = '';

    await store.set(fileKey, imageData, { metadata });
}

async function saveEvaluationFailure(fileKey, error) {
    if (!fileKey) return;

    try {
        const store = getStore("wishai_generations", { consistency: "strong" });
        const existingMeta = await store.getMetadata(fileKey).catch(() => null);
        const imageData = await store.get(fileKey, { type: 'text' }).catch(() => null);
        if (!existingMeta || !imageData) return;

        const metadata = compactMetadata(existingMeta.metadata || {});
        metadata.ai_evaluation_status = 'failed';
        metadata.ai_evaluation_error = String(error?.message || error || 'AI_EVALUATION_FAILED');
        metadata.ai_evaluated_at = new Date().toISOString();

        await store.set(fileKey, imageData, { metadata });
    } catch (saveErr) {
        console.error('Error saving evaluation failure status:', saveErr);
    }
}

export default async (req) => {
    const headers = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    });

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
    }

    let fileKeyForFailure = '';

    try {
        if (req.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers });
        }

        const body = await req.json();
        const { fileKey } = body;
        fileKeyForFailure = fileKey || '';
        if (!fileKey) {
            return new Response(JSON.stringify({ ok: false, error: 'FILE_KEY_MISSING' }), { status: 400, headers });
        }

        const apiKey = getEnv('GEMINI_API_KEY');
        if (!apiKey) {
            await saveEvaluationFailure(fileKey, 'GEMINI_API_KEY_MISSING');
            return new Response(JSON.stringify({ ok: false, error: 'GEMINI_API_KEY_MISSING' }), { status: 200, headers });
        }

        const store = getStore("wishai_generations", { consistency: "strong" });
        const image = body.image || await store.get(fileKey, { type: 'text' });
        const metadataResponse = await store.getMetadata(fileKey);
        const metadata = compactMetadata(body.metadata || metadataResponse?.metadata || {});
        const inlineData = await imageToInlineData(image);

        const prompt = `أنت خبير تقييم بطاقات تهنئة مولدة بالذكاء الاصطناعي.
قيّم الصورة المرفقة مقابل معطيات الطلب التالية:
${JSON.stringify(metadata, null, 2)}

أرجع JSON صالح فقط بدون markdown وبدون شرح خارج JSON، وبالمفاتيح التالية بالضبط:
{
  "score": 8,
  "summary": "ملخص عربي قصير من جملتين عن جودة البطاقة ومدى مطابقتها للطلب",
  "adherence": true,
  "advice": ["نصيحة عملية قصيرة", "نصيحة عملية قصيرة"]
}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const evalResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: 'user',
                    parts: [
                        { text: prompt },
                        { inlineData }
                    ]
                }],
                generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
            })
        });

        const data = await evalResponse.json();
        if (!evalResponse.ok) {
            await saveEvaluationFailure(fileKey, data.error?.message || 'AI_EVALUATION_FAILED');
            return new Response(JSON.stringify({
                ok: false,
                error: 'AI_EVALUATION_FAILED',
                message: data.error?.message || 'Unknown'
            }), { status: 200, headers });
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        const aiResult = normalizeAiResult(parseJsonText(aiText));
        await saveEvaluation(fileKey, aiResult);

        return new Response(JSON.stringify({ ok: true, aiResult }), { status: 200, headers });
    } catch (err) {
        console.error('Error evaluating card:', err);
        await saveEvaluationFailure(fileKeyForFailure, err);
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers });
    }
};

export const config = {
    path: "/api/evaluate-card"
};
