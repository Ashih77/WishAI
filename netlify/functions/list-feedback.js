import { getStore } from "@netlify/blobs";

export default async (req, context) => {
    // Read password from env var if available, otherwise fallback
    const ADMIN_PASS = process.env.VITE_ADMIN_PASSWORD || 'wishai-admin-2026';

    const url = new URL(req.url);
    const pass = url.searchParams.get('pass');

    const headers = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    });

    if (pass !== ADMIN_PASS) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
    }

    try {
        const store = getStore("wishai_feedback");

        const { blobs } = await store.list();
        
        const feedbacks = [];
        for (const blob of blobs) {
            const { metadata } = await store.getMetadata(blob.key);
            const text = await store.get(blob.key);
            feedbacks.push({
                key: blob.key,
                text: text,
                metadata: metadata || {}
            });
        }

        // Sort by timestamp descending
        feedbacks.sort((a, b) => (b.metadata.timestamp || 0) - (a.metadata.timestamp || 0));

        return new Response(JSON.stringify({ ok: true, feedbacks }), { status: 200, headers });

    } catch (err) {
        console.error('Error fetching feedbacks:', err);
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers });
    }
};

export const config = {
    path: "/api/list-feedback"
};
