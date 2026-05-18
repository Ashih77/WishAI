import { getStore } from "@netlify/blobs";

function safeKey(value) {
    return String(value || 'unknown').toLowerCase().replace(/[^a-z0-9._-]/g, '_');
}

export default async (req) => {
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
        const user = body.user || {};
        const eventType = body.eventType || 'login';
        const email = String(user.email || '').trim().toLowerCase();
        const provider = user.provider || 'unknown';
        const userId = user.id || email;

        if (!email && !userId) {
            return new Response(JSON.stringify({ error: 'Missing user identity' }), { status: 400, headers });
        }

        const store = getStore("wishai_users");
        const key = `${safeKey(provider)}-${safeKey(email || userId)}`;
        const now = new Date().toISOString();
        let existing = {};

        try {
            existing = JSON.parse(await store.get(key, { type: 'text' }) || '{}');
        } catch {
            existing = {};
        }

        const generationCount = Number(existing.generationCount || 0) + (eventType === 'generation' ? 1 : 0);
        const loginCount = Number(existing.loginCount || 0) + (eventType === 'login' ? 1 : 0);
        const record = {
            id: userId,
            email,
            name: user.name || existing.name || '',
            provider,
            photo: user.photo || existing.photo || '',
            firstSeenAt: existing.firstSeenAt || now,
            lastSeenAt: now,
            lastGeneratedAt: eventType === 'generation' ? now : existing.lastGeneratedAt || null,
            loginCount,
            generationCount,
            lastApp: body.app || existing.lastApp || {}
        };

        await store.set(key, JSON.stringify(record), {
            metadata: {
                email: record.email,
                name: record.name,
                provider: record.provider,
                lastSeenAt: record.lastSeenAt,
                lastGeneratedAt: record.lastGeneratedAt,
                loginCount: record.loginCount,
                generationCount: record.generationCount
            }
        });

        return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    } catch (err) {
        console.error('Error saving user analytics:', err);
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers });
    }
};

export const config = {
    path: "/api/save-user"
};
