import { getStore } from "@netlify/blobs";

const BLOB_METADATA_MAX_BYTES = 900;

function truncateText(value, maxLength) {
    const text = String(value || '').trim();
    if (text.length <= maxLength) return text;
    return `${text.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
}

function metadataByteLength(metadata) {
    return Buffer.byteLength(JSON.stringify(metadata), 'utf8');
}

function fitMetadataForBlob(metadata) {
    const fitted = JSON.parse(JSON.stringify(metadata || {}));

    const truncations = [
        ['instructions', 180],
        ['feedback', 140],
        ['ai_summary', 220],
        ['ai_extracted_text', 160],
        ['ai_text_position_analysis', 160],
        ['greeting', 160],
        ['nameSubtitle', 60],
        ['cycleLabel', 60],
        ['subStyle', 40],
        ['effectiveSubStyle', 40]
    ];

    truncations.forEach(([key, maxLength]) => {
        if (fitted[key] !== undefined) fitted[key] = truncateText(fitted[key], maxLength);
    });

    if (Array.isArray(fitted.ai_advice)) {
        fitted.ai_advice = fitted.ai_advice.map(item => truncateText(item, 90)).slice(0, 3);
    }

    if (Array.isArray(fitted.chips)) fitted.chips = fitted.chips.slice(0, 5);

    const optionalKeys = [
        'feedback',
        'chips',
        'cycleLabel',
        'nameSubtitle',
        'instructions',
        'ai_extracted_text',
        'ai_text_position_analysis',
        'effectiveSubStyle',
        'subStyle',
        'palette',
        'colorIntensity',
        'details',
        'namePosition'
    ];

    if (fitted.user && metadataByteLength(fitted) > BLOB_METADATA_MAX_BYTES) {
        fitted.user = {
            name: truncateText(fitted.user.name, 40),
            email: truncateText(fitted.user.email, 80)
        };
    }

    while (metadataByteLength(fitted) > BLOB_METADATA_MAX_BYTES && optionalKeys.length) {
        delete fitted[optionalKeys.shift()];
    }

    if (metadataByteLength(fitted) > BLOB_METADATA_MAX_BYTES) {
        fitted.ai_summary = truncateText(fitted.ai_summary, 120);
        fitted.ai_advice = Array.isArray(fitted.ai_advice) ? fitted.ai_advice.slice(0, 1) : [];
        fitted.greeting = truncateText(fitted.greeting, 100);
        fitted.name = truncateText(fitted.name, 40);
    }

    if (metadataByteLength(fitted) <= BLOB_METADATA_MAX_BYTES) return fitted;

    return {
        timestamp: fitted.timestamp || Date.now(),
        name: truncateText(fitted.name, 40),
        occasion: truncateText(fitted.occasion, 40),
        greeting: truncateText(fitted.greeting, 80),
        imageModel: truncateText(fitted.imageModel || fitted.settings?.imageModel || 'nano-banana-2', 40),
        settings: {
            imageModel: truncateText(fitted.settings?.imageModel || fitted.imageModel || 'nano-banana-2', 40)
        },
        rating: fitted.rating,
        ai_score: fitted.ai_score,
        ai_adherence: fitted.ai_adherence,
        ai_summary: truncateText(fitted.ai_summary, 100),
        ai_advice: Array.isArray(fitted.ai_advice) ? fitted.ai_advice.slice(0, 1).map(item => truncateText(item, 80)) : [],
        ai_evaluated_at: fitted.ai_evaluated_at,
        ai_evaluation_status: fitted.ai_evaluation_status || 'complete'
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
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
    });

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });

    try {
        if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers });

        const body = await req.json();
        const { fileKey, aiResult } = body;
        
        if (!fileKey || !aiResult) return new Response(JSON.stringify({ error: 'Missing fileKey or aiResult' }), { status: 400, headers });

        const store = getStore("wishai_generations", { consistency: "strong" });
        const existingMeta = await store.getMetadata(fileKey).catch(() => null);
        const imageData = await store.get(fileKey, { type: 'text' }).catch(() => null);
        
        if (!existingMeta || !imageData) return new Response(JSON.stringify({ error: 'Image not found' }), { status: 404, headers });

        const metadata = compactMetadata(existingMeta.metadata || {});

        // Merge AI results
        metadata.ai_score = aiResult.score || 0;
        metadata.ai_adherence = !!aiResult.adherence;
        metadata.ai_summary = truncateText(aiResult.summary, 240);
        metadata.ai_advice = Array.isArray(aiResult.advice) ? aiResult.advice.map(item => truncateText(item, 100)).slice(0, 3) : [];
        metadata.ai_extracted_text = truncateText(aiResult.extracted_text, 180);
        metadata.ai_text_position_analysis = truncateText(aiResult.text_position_analysis, 180);
        metadata.ai_evaluation_status = 'complete';
        metadata.ai_evaluated_at = new Date().toISOString();

        await store.set(fileKey, imageData, { metadata: fitMetadataForBlob(metadata) });

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
