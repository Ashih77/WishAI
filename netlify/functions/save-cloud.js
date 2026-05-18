import { getStore } from "@netlify/blobs";

export default async (req, context) => {
    // CORS Headers
    const headers = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    });

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
    }

    try {
        if (req.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers });
        }

        const body = await req.json();
        const { fileKey: requestedFileKey, image, stateParams } = body;
        
        if (!image) {
            return new Response(JSON.stringify({ error: 'Missing image data' }), { status: 400, headers });
        }

        // Connect to the global store "wishai_generations"
        const store = getStore("wishai_generations");

        const safeOccasion = (stateParams?.occasion || 'card').replace(/[^a-z0-9]/gi, '_');
        const timestamp = Date.now();
        const fallbackFileKey = `WishAI-${safeOccasion}-${timestamp}`;
        const fileKey = requestedFileKey || fallbackFileKey;

        const metadata = {
            timestamp,
            ai_evaluation_status: 'pending',
            ...stateParams
        };

        // Save first and return quickly so the generated card appears in Admin
        // and the client can show the rating form without waiting on AI analysis.
        await store.set(fileKey, image, {
            metadata
        });

        console.log(`[WishAI-Cloud] Successfully saved image: ${fileKey}`);

        const origin = new URL(req.url).origin;
        const imageUrl = `${origin}/api/get-cloud-image?key=${encodeURIComponent(fileKey)}`;
        const shareUrl = `${origin}/share?id=${encodeURIComponent(fileKey)}`;
        const evaluationTask = fetch(`${origin}/api/evaluate-card`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileKey, metadata })
        }).catch((evalErr) => {
            console.error(`[WishAI-Cloud] Queued AI evaluation failed for ${fileKey}:`, evalErr);
        });

        if (context?.waitUntil) {
            context.waitUntil(evaluationTask);
        }

        return new Response(JSON.stringify({
            ok: true,
            fileKey,
            imageUrl,
            shareUrl,
            aiEvaluationStatus: 'pending'
        }), { status: 200, headers });

    } catch (err) {
        console.error('Error saving to cloud:', err);
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers });
    }
};

export const config = {
    path: "/api/save-cloud"
};
