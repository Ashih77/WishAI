import { getStore } from "@netlify/blobs";

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
        const { image, stateParams } = body;
        
        if (!image) {
            return new Response(JSON.stringify({ error: 'Missing image data' }), { status: 400, headers });
        }

        // Connect to the global store "wishai_generations"
        const store = getStore("wishai_generations");

        const safeOccasion = (stateParams?.occasion || 'card').replace(/[^a-z0-9]/gi, '_');
        const timestamp = Date.now();
        const fileKey = `WishAI-${safeOccasion}-${timestamp}`;

        // Save base64 image data to the blob store 
        await store.set(fileKey, image, {
            metadata: {
                timestamp,
                ...stateParams // save name, style, details, etc.
            }
        });

        console.log(`[WishAI-Cloud] Successfully saved tracking image: ${fileKey}`);

        return new Response(JSON.stringify({ ok: true, fileKey }), { status: 200, headers });

    } catch (err) {
        console.error('Error saving to cloud:', err);
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers });
    }
};

export const config = {
    path: "/api/save-cloud"
};
