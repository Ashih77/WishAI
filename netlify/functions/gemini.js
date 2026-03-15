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

        // 🎯 THE FINAL PROBE: Targeted Nano Banana 2 (Imagen 3) Integration
        // We try the two most likely successful paths for Imagen 3
        const models = [
            { v: 'v1beta', m: 'imagen-3.0-generate-001' },
            { v: 'v1beta', m: 'gemini-1.5-flash' }
        ];

        let lastError = null;

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
                    return { 
                        statusCode: 200, 
                        headers, 
                        body: JSON.stringify({ ok: true, data: data, active_model: model.m }) 
                    };
                }
                lastError = data.error?.message || 'Unknown Error';
            } catch (e) {
                lastError = e.message;
            }
        }

        // Return a detailed diagnostic instead of a raw 404
        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ 
                ok: false, 
                error: 'NANO_BANANA_DENIED', 
                message: lastError 
            }) 
        };

    } catch (err) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'INTERNAL_CRASH', details: err.message }) };
    }
};
