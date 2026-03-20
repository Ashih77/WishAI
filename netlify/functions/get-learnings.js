import { getStore } from "@netlify/blobs";

export default async (req, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
    }

    try {
        const store = getStore("wishai_generations");
        const list = await store.list();
        
        if (!list || !list.blobs || list.blobs.length === 0) {
            return new Response(JSON.stringify({ ok: true, rules: [] }), { status: 200, headers });
        }

        // Get the top 10 most recent blobs
        const recentBlobs = list.blobs.sort((a, b) => b.key.localeCompare(a.key)).slice(0, 10);
        
        let allAdvice = [];
        
        // Fetch their metadata in parallel
        await Promise.all(recentBlobs.map(async (blobMeta) => {
            const meta = await store.getMetadata(blobMeta.key);
            if (meta && meta.ai_adherence === false && Array.isArray(meta.ai_advice)) {
                allAdvice.push(...meta.ai_advice);
            }
        }));

        // Keep only unique advice to prevent prompt bloating
        const uniqueAdvice = [...new Set(allAdvice)].slice(0, 3); // Max 3 rules

        // Provide translation or context wrapper for the English prompt
        // Since ai_advice is in Arabic, we can just tell the image generator to address these Arabic concerns.
        const translatedRules = uniqueAdvice.map(adv => `Fix this issue from previous generations: ${adv}`);

        return new Response(JSON.stringify({ ok: true, rules: translatedRules }), { status: 200, headers });
    } catch (err) {
        console.error('Error fetching learnings:', err);
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers });
    }
};

export const config = {
    path: "/api/get-learnings"
};
