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
        if (!apiKey) return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'API_KEY_MISSING' }) };

        const body = JSON.parse(event.body);
        if (body.action === 'heartbeat') return { statusCode: 200, headers, body: JSON.stringify({ status: 'OK', keyLen: apiKey.length }) };

        /**
         * 🎯 THE 1% ELITE PROBE
         * Tries stable v1 paths first to avoid the 404 error, then fallbacks to v1beta.
         */
        const models = [
            { v: 'v1', m: 'gemini-1.5-flash' },     // Attempt 1: Stable v1 (Most likely to succeed)
            { v: 'v1beta', m: 'gemini-1.5-flash' }, // Attempt 2: Beta version
            { v: 'v1beta', m: 'imagen-3.0-generate-001' } // Attempt 3: Direct Imagen 3
        ];

        let lastRes = null;

        for (const model of models) {
            try {
                const url = `https://generativelanguage.googleapis.com/${model.v}/models/${model.m}:generateContent?key=${apiKey}`;
                
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: body.contents,
                        generationConfig: body.action === 'suggestions' 
                            ? { temperature: 0.7 }
                            : { responseModalities: ["IMAGE"], temperature: 1.0 }
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, data, used: model.m }) };
                }
                lastRes = data;
            } catch (e) { continue; }
        }

        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ 
                ok: false, 
                error: 'ALL_MODELS_FAILED', 
                details: lastRes?.error?.message || 'Check Billing/Region'
            }) 
        };

    } catch (err) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'PROXY_CRASH', details: err.message }) };
    }
};
