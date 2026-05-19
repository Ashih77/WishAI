import { getStore } from "@netlify/blobs";

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
        ai_score: metadata.ai_score,
        ai_adherence: metadata.ai_adherence,
        ai_summary: metadata.ai_summary || '',
        ai_advice: Array.isArray(metadata.ai_advice) ? metadata.ai_advice.slice(0, 5) : [],
        ai_evaluation_status: metadata.ai_evaluation_status || '',
        ai_evaluation_error: metadata.ai_evaluation_error || '',
        ai_evaluated_at: metadata.ai_evaluated_at || ''
    };
}

function jsonResponse(body, status, headers) {
    return new Response(JSON.stringify(body), { status, headers });
}

function normalizeRating(value) {
    const rating = Number(value);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return null;
    return rating;
}

function normalizeChips(chips) {
    if (!Array.isArray(chips)) return [];
    return chips
        .map(item => String(item || '').trim())
        .filter(Boolean)
        .slice(0, 8);
}

export default async (req, context) => {
    // CORS Headers
    const headers = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
    });

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
    }

    try {
        if (req.method !== 'POST') {
            return jsonResponse({ ok: false, error: 'Method Not Allowed' }, 405, headers);
        }

        const body = await req.json();
        const { fileKey, rating, feedback, chips } = body;
        const normalizedRating = normalizeRating(rating);
        
        if (!fileKey || !normalizedRating) {
            return jsonResponse({ ok: false, error: 'Missing fileKey or rating' }, 400, headers);
        }

        // Connect to the global store "wishai_generations"
        const store = getStore("wishai_generations", { consistency: "strong" });

        // Fetch the existing metadata
        const metadataResponse = await store.getMetadata(fileKey).catch(() => null);
        const imageData = await store.get(fileKey, { type: 'text' }).catch(() => null);
        
        if (!metadataResponse || !imageData) {
            return jsonResponse({ ok: false, error: 'Image not found in cloud' }, 404, headers);
        }

        const metadata = compactMetadata(metadataResponse.metadata || {});

        // Add the new rating data
        metadata.rating = normalizedRating;
        metadata.feedback = String(feedback || '').slice(0, 1000);
        metadata.rated_at = new Date().toISOString();
        metadata.chips = normalizeChips(chips);

        // Update the blob's metadata
        await store.set(fileKey, imageData, { metadata });

        console.log(`[WishAI-Cloud] Successfully saved rating for: ${fileKey}`);

        return jsonResponse({ ok: true }, 200, headers);

    } catch (err) {
        console.error('Error saving rating:', err);
        return jsonResponse({ ok: false, error: err.message }, 500, headers);
    }
};

export const config = {
    path: "/api/save-rating"
};
