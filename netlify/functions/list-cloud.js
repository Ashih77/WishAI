import { getStore } from "@netlify/blobs";

export default async (req, context) => {
    // Simple basic admin password (in a real app, use environment variables)
    const ADMIN_PASS = 'wishai-admin-2026';

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
        // Connect to the global store "wishai_generations"
        const store = getStore("wishai_generations");

        // List keys
        const { blobs } = await store.list();
        
        // Fetch metadata and compile results
        const generations = [];
        for (const blob of blobs) {
            const { metadata } = await store.getMetadata(blob.key);
            generations.push({
                key: blob.key,
                etag: blob.etag,
                metadata: metadata || {}
            });
        }

        // Sort by timestamp descending
        generations.sort((a, b) => (b.metadata.timestamp || 0) - (a.metadata.timestamp || 0));

        return new Response(JSON.stringify({ ok: true, generations }), { status: 200, headers });

    } catch (err) {
        console.error('Error fetching from cloud:', err);
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers });
    }
};

export const config = {
    path: "/api/list-cloud"
};
