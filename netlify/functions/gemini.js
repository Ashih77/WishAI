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
        
        // 🔹 Heartbeat
        if (body.action === 'heartbeat') return { statusCode: 200, headers, body: JSON.stringify({ status: 'OK', keyLen: apiKey.length }) };

        const isImage = body.action === 'generate';
        
        // 🎯 THE SURGICAL FIX: Strictly separate Text and Image models
        // Text models CANNOT generate images, and Image models CANNOT generate suggestions.
        const textRoutes = [
            { v: 'v1', m: 'gemini-1.5-flash' },
            { v: 'v1beta', m: 'gemini-1.5-flash' }
        ];

        const imageRoutes = [
            { v: 'v1beta', m: 'imagen-3.0-generate-001' },
            { v: 'v1beta', m: 'gemini-1.5-flash-002' },
            { v: 'v1beta', m: 'gemini-1.5-flash' }
        ];

        const routes = isImage ? imageRoutes : textRoutes;
        let lastError = null;

        for (const route of routes) {
            try {
                const url = `https://generativelanguage.googleapis.com/${route.v}/models/${route.m}:generateContent?key=${apiKey}`;
                
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: body.contents,
                        generationConfig: isImage 
                            ? { responseModalities: ["IMAGE"], temperature: 1.0 }
                            : { temperature: 0.7 }
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    return { 
                        statusCode: 200, 
                        headers, 
                        body: JSON.stringify({ ok: true, data, used: `${route.v}/${route.m}` }) 
                    };
                }
                lastError = data.error?.message || JSON.stringify(data);
                console.warn(`[WishAI] Route Failed: ${route.v}/${route.m} - ${lastError}`);
            } catch (e) {
                lastError = e.message;
                continue;
            }
        }

        // Final response if all targeted routes fail
        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ 
                ok: false, 
                error: 'PROVIDER_REJECTION', 
                message: lastError,
                type: isImage ? 'IMAGE_GEN_FAILED' : 'TEXT_GEN_FAILED'
            }) 
        };

    } catch (err) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'INTERNAL_ERROR', details: err.message }) };
    }
};
