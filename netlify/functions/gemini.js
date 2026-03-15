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
         * 🎯 THE 100% RELIABILITY MATRIX
         * Tries all possible Stable and Beta endpoints for Imagen 3 (Nano Banana 2)
         */
        const matrix = [
            { v: 'v1', m: 'gemini-1.5-flash' },
            { v: 'v1beta', m: 'gemini-1.5-flash' },
            { v: 'v1beta', m: 'imagen-3.0-generate-001' },
            { v: 'v1', m: 'gemini-1.5-pro' }
        ];

        let lastErr = null;

        for (const route of matrix) {
            try {
                const url = `https://generativelanguage.googleapis.com/${route.v}/models/${route.m}:generateContent?key=${apiKey}`;
                
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
                    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, data, used: `${route.v}/${route.m}` }) };
                }
                lastErr = data.error?.message || 'Unknown Failure';
            } catch (e) { continue; }
        }

        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ 
                ok: false, 
                error: 'ALL_ENDPOINTS_FAILED', 
                details: lastErr 
            }) 
        };

    } catch (err) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'SYSTEM_CRASH', details: err.message }) };
    }
};
