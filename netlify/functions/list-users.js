import { getStore } from "@netlify/blobs";

export default async (req) => {
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
        const store = getStore("wishai_users");
        const { blobs } = await store.list();
        const users = [];

        for (const blob of blobs) {
            let record = null;
            try {
                record = JSON.parse(await store.get(blob.key, { type: 'text' }) || 'null');
            } catch {
                const { metadata } = await store.getMetadata(blob.key);
                record = metadata || null;
            }

            if (record) {
                users.push({
                    key: blob.key,
                    ...record
                });
            }
        }

        users.sort((a, b) => new Date(b.lastSeenAt || 0) - new Date(a.lastSeenAt || 0));

        return new Response(JSON.stringify({ ok: true, users }), { status: 200, headers });
    } catch (err) {
        console.error('Error listing users:', err);
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers });
    }
};

export const config = {
    path: "/api/list-users"
};
