exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };

    try {
        const apiKey = (process.env.GEMINI_API_KEY || '').trim().replace(/["']/g, '');
        if (!apiKey) return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'API Key is missing in Netlify settings.' }) };

        const body = JSON.parse(event.body);
        if (body.action === 'heartbeat') return { statusCode: 200, headers, body: JSON.stringify({ status: 'OK', keyLen: apiKey.length }) };

        // 🎯 The Expert Probe: Exhaustive list of Imagen 3 / Nano Banana 2 Paths
        const variations = [
            { v: 'v1beta', m: 'gemini-1.5-flash' },
            { v: 'v1beta', m: 'imagen-3.0-generate-001' },
            { v: 'v1', m: 'gemini-1.5-flash' },
            { v: 'v1', m: 'imagen-3.0-generate-001' },
            { v: 'v1beta', m: 'publishers/google/models/imagen-3.0-generate-001' }
        ];

        for (const v of variations) {
            try {
                const url = `https://generativelanguage.googleapis.com/${v.v}/models/${v.m}:generateContent?key=${apiKey}`;
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: body.contents,
                        generationConfig: body.generationConfig || { responseModalities: ["IMAGE"], temperature: 1.0 }
                    })
                });

                const data = await res.json();
                if (res.ok) return { statusCode: 200, headers, body: JSON.stringify({ ok: true, data: data, modelUsed: v.m }) };
                
                // If text fallback is requested and image fails
                if (body.fallbackToText && data.error) {
                    continue; // try next model
                }
            } catch (e) { continue; }
        }

        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'All models failed', details: 'Check Google Cloud Billing or Region restrictions.' }) };

    } catch (err) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'Proxy Exception', details: err.message }) };
    }
};
