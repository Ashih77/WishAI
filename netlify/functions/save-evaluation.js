import { getStore } from "@netlify/blobs";

function compactMetadata(metadata = {}) {
    const settings = metadata.settings || {};
    const user = metadata.user || {};

    return {
        timestamp: metadata.timestamp || Date.now(),
        name: metadata.name || '',
        occasion: metadata.occasion || '',
        greeting: metadata.greeting || '',
        instructions: metadata.instructions || '',
        style: metadata.style || '',
        subStyle: metadata.subStyle || '',
        details: metadata.details ?? '',
        colorIntensity: metadata.colorIntensity ?? '',
        palette: metadata.palette || '',
        imageModel: metadata.imageModel || settings.imageModel || 'nano-banana-2',
        settings: {
            imageModel: settings.imageModel || metadata.imageModel || 'nano-banana-2'
        },
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

export default async (req, context) => {
    const headers = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    });

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });

    try {
        if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers });

        const body = await req.json();
        const { fileKey, aiResult } = body;
        
        if (!fileKey || !aiResult) return new Response(JSON.stringify({ error: 'Missing fileKey or aiResult' }), { status: 400, headers });

        const store = getStore("wishai_generations");
        const existingMeta = await store.getMetadata(fileKey);
        
        if (!existingMeta) return new Response(JSON.stringify({ error: 'Image not found' }), { status: 404, headers });

        const metadata = compactMetadata(existingMeta.metadata || {});

        // Merge AI results
        metadata.ai_score = aiResult.score || 0;
        metadata.ai_adherence = !!aiResult.adherence;
        metadata.ai_summary = aiResult.summary || "";
        metadata.ai_advice = aiResult.advice || [];
        metadata.ai_extracted_text = aiResult.extracted_text || "";
        metadata.ai_text_position_analysis = aiResult.text_position_analysis || "";
        metadata.ai_evaluation_status = 'complete';
        metadata.ai_evaluated_at = new Date().toISOString();

        const imageBlob = await store.get(fileKey, { type: 'text' });
        await store.set(fileKey, imageBlob, { metadata });

        console.log(`[WishAI] Saved AI evaluation for ${fileKey} with score ${metadata.ai_score}`);
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    } catch (err) {
        console.error('Error saving evaluation:', err);
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers });
    }
};

export const config = {
    path: "/api/save-evaluation"
};
