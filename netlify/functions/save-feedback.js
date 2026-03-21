import { getStore } from "@netlify/blobs";

export default async (req, context) => {
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
        const { text, deviceInfo } = body;
        
        if (!text) {
            return new Response(JSON.stringify({ error: 'Missing feedback text' }), { status: 400, headers });
        }

        const store = getStore("wishai_feedback");
        const timestamp = Date.now();
        const fileKey = `Feedback-${timestamp}`;

        await store.set(fileKey, text, {
            metadata: {
                timestamp,
                deviceInfo: deviceInfo || 'unknown'
            }
        });

        console.log(`[WishAI-Feedback] Successfully saved feedback: ${fileKey}`);

        return new Response(JSON.stringify({ ok: true, fileKey }), { status: 200, headers });

    } catch (err) {
        console.error('Error saving feedback:', err);
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers });
    }
};

export const config = {
    path: "/api/save-feedback"
};
