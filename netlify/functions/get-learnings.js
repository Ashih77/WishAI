import { getStore } from "@netlify/blobs";

const BASELINE_RULES = [
    'When tashkeel is false, do not add Arabic diacritics/harakat to any Arabic greeting or name.',
    'Render the requested greeting and name exactly once; do not duplicate the name, translate it, transliterate it, or add extra decorative words.',
    'Honor the requested name position exactly and keep enough quiet space around the name for readability.',
    'Match the selected style and sub-style closely; for minimalist cards, reduce visual elements and preserve negative space even when detail level is high.',
    'Never return a blank image, solid color placeholder, or image that does not look like a finished greeting card.'
];

function readMetadata(metadataResponse) {
    return metadataResponse?.metadata || metadataResponse || {};
}

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
            return new Response(JSON.stringify({ ok: true, rules: BASELINE_RULES }), { status: 200, headers });
        }

        const metadataItems = await Promise.all(list.blobs.map(async (blobMeta) => {
            const meta = readMetadata(await store.getMetadata(blobMeta.key).catch(() => null));
            return { key: blobMeta.key, meta, timestamp: Number(meta.timestamp || 0) };
        }));

        const recentItems = metadataItems
            .sort((a, b) => b.timestamp - a.timestamp || b.key.localeCompare(a.key))
            .slice(0, 20);

        let allAdvice = [];

        recentItems.forEach(({ meta }) => {
            if (meta && meta.ai_adherence === false && Array.isArray(meta.ai_advice)) {
                allAdvice.push(...meta.ai_advice);
            }
        });

        // Keep only unique advice to prevent prompt bloating
        const uniqueAdvice = [...new Set(allAdvice)].slice(0, 3); // Max 3 dynamic rules

        // Provide translation or context wrapper for the English prompt
        // Since ai_advice is in Arabic, we can just tell the image generator to address these Arabic concerns.
        const translatedRules = BASELINE_RULES
            .concat(uniqueAdvice.map(adv => `Fix this issue from previous generations: ${adv}`))
            .slice(0, 8);

        return new Response(JSON.stringify({ ok: true, rules: translatedRules }), { status: 200, headers });
    } catch (err) {
        console.error('Error fetching learnings:', err);
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers });
    }
};

export const config = {
    path: "/api/get-learnings"
};
