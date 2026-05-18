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

export default async (req, context) => {
    // CORS Headers
    const headers = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    });

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
    }

    try {
        if (req.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers });
        }

        const body = await req.json();
        const { fileKey, rating, feedback, chips } = body;
        
        if (!fileKey || !rating) {
            return new Response(JSON.stringify({ error: 'Missing fileKey or rating' }), { status: 400, headers });
        }

        // Connect to the global store "wishai_generations"
        const store = getStore("wishai_generations");

        // Fetch the existing metadata
        const metadataResponse = await store.getMetadata(fileKey);
        
        if (!metadataResponse) {
             return new Response(JSON.stringify({ error: 'Image not found in cloud' }), { status: 404, headers });
        }

        const metadata = compactMetadata(metadataResponse.metadata || {});

        // Add the new rating data
        metadata.rating = rating;
        metadata.feedback = feedback || '';
        metadata.rated_at = new Date().toISOString();
        if (chips && Array.isArray(chips)) {
            metadata.chips = chips;
        }

        // Update the blob's metadata
        const imageBlob = await store.get(fileKey, { type: 'text' });
        
        await store.set(fileKey, imageBlob, { metadata });

        console.log(`[WishAI-Cloud] Successfully saved rating for: ${fileKey}`);

        return new Response(JSON.stringify({ ok: true }), { status: 200, headers });

    } catch (err) {
        console.error('Error saving rating:', err);
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers });
    }
};

export const config = {
    path: "/api/save-rating"
};
