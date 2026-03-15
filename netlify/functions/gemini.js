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
        
        // 🔹 Heartbeat Diagnostic
        if (body.action === 'heartbeat') {
            return { statusCode: 200, headers, body: JSON.stringify({ status: 'OK', keyLen: apiKey.length }) };
        }

        // 🎯 THE ELITE MATRIX: Multi-version discovery for Imagen 3 (Nano Banana 2)
        // This solves the "Not Found for v1beta" error radically.
        const candidates = [
            { v: 'v1beta', m: 'imagen-3.0-generate-001' },
            { v: 'v1beta', m: 'gemini-1.5-flash' },
            { v: 'v1', m: 'gemini-1.5-flash' }
        ];

        let lastData = null;

        for (const c of candidates) {
            try {
                const url = `https://generativelanguage.googleapis.com/${c.v}/models/${c.m}:generateContent?key=${apiKey}`;
                
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
                        body: JSON.stringify({ ok: true, data, source: `${c.v}/${c.m}` }) 
                    };
                }
                lastData = data;
                console.warn(`[WishAI] Probe ${c.v}/${c.m} failed:`, data.error?.message);
            } catch (e) {
                continue;
            }
        }

        // If all routes fail, return a descriptive diagnostic body (Status 200 to ensure frontend sees it)
        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ 
                ok: false, 
                error: 'ALL_ROUTES_REJECTED', 
                message: lastData?.error?.message || 'Check Google Cloud billing and region quotas.' 
            }) 
        };

    } catch (err) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'PROXY_CRASH', details: err.message }) };
    }
};
