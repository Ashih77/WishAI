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

        // 🛡️ The Matrix: Multiple attempts to find the correct Model/Version combo
        // This solves the "Not Found for v1beta" error radically.
        const routes = [
            { v: 'v1beta', m: 'gemini-1.5-flash' },
            { v: 'v1', m: 'gemini-1.5-flash' },
            { v: 'v1beta', m: 'imagen-3.0-generate-001' },
            { v: 'v1beta', m: 'gemini-1.5-pro' }
        ];

        let lastError = null;

        for (const route of routes) {
            try {
                const url = `https://generativelanguage.googleapis.com/${route.v}/models/${route.m}:generateContent?key=${apiKey}`;
                
                // Construct payload based on action
                const payload = {
                    contents: body.contents,
                    generationConfig: body.action === 'suggestions' 
                        ? { temperature: 0.7 } 
                        : { responseModalities: ["IMAGE"], temperature: 1.0 }
                };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok) {
                    return { 
                        statusCode: 200, 
                        headers, 
                        body: JSON.stringify({ ok: true, data: data, usedRoute: `${route.v}/${route.m}` }) 
                    };
                }
                
                lastError = data.error?.message || JSON.stringify(data);
                console.warn(`[WishAI] Failed route ${route.v}/${route.m}: ${lastError}`);
            } catch (e) {
                lastError = e.message;
                continue;
            }
        }

        // Final failure: No routes worked
        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ 
                ok: false, 
                error: 'ALL_ROUTES_FAILED', 
                details: lastError 
            }) 
        };

    } catch (err) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'PROXY_EXCEPTION', details: err.message }) };
    }
};
