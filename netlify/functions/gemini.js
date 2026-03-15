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
        if (!apiKey) return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'API Key Missing' }) };

        const body = JSON.parse(event.body);
        if (body.action === 'heartbeat') return { statusCode: 200, headers, body: JSON.stringify({ status: 'OK', keyLen: apiKey.length }) };

        /**
         * 🎯 THE 1% ELITE PROBE
         * Tries various Google Image Generation (Imagen 3) path formats.
         * Fixes the previous URL concatenation bug.
         */
        const attempts = [
            { version: 'v1beta', path: 'models/gemini-1.5-flash' }, // Mode: Multimodal Flash
            { version: 'v1beta', path: 'publishers/google/models/imagen-3.0-generate-001' }, // Mode: Explicit Imagen 3 (Nano Banana 2)
            { version: 'v1', path: 'models/gemini-1.5-flash' } // Mode: Stable Flash
        ];

        let lastFullError = null;

        for (const attempt of attempts) {
            try {
                // Correct URL construction: No double /models/
                const url = `https://generativelanguage.googleapis.com/${attempt.version}/${attempt.path}:generateContent?key=${apiKey}`;
                
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
                    return { 
                        statusCode: 200, 
                        headers, 
                        body: JSON.stringify({ ok: true, data: data, route: `${attempt.version}/${attempt.path}` }) 
                    };
                }
                lastFullError = data.error;
            } catch (e) {
                lastFullError = { message: e.message };
                continue;
            }
        }

        // Return a high-transparency diagnostic error
        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ 
                ok: false, 
                error: 'ALL_ENDPOINTS_FAILED', 
                details: lastFullError 
            }) 
        };

    } catch (err) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'PROXY_EXCEPTION', details: err.message }) };
    }
};
