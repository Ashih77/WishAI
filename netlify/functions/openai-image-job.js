import { getStore } from "@netlify/blobs";

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
};

export default async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
    }

    try {
        const url = new URL(req.url);
        const jobId = url.searchParams.get('id');

        if (!jobId) {
            return new Response(JSON.stringify({ ok: false, error: 'JOB_ID_MISSING' }), { status: 400, headers });
        }

        const store = getStore("wishai_openai_jobs");
        const job = await store.get(jobId, { type: 'json' });

        if (!job) {
            return new Response(JSON.stringify({ ok: true, status: 'queued' }), { status: 200, headers });
        }

        return new Response(JSON.stringify({ ok: true, ...job }), { status: 200, headers });
    } catch (err) {
        return new Response(JSON.stringify({ ok: false, error: 'JOB_STATUS_FAILED', message: err.message }), { status: 500, headers });
    }
};

export const config = {
    path: "/api/openai-image-job"
};
