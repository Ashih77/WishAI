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

        // 🎯 THE ELITE MATRIX: Try all possible Imagen 3 / Nano Banana 2 endpoints
        const variants = [
            { ver: 'v1beta', mod: 'gemini-1.5-flash' },
            { ver: 'v1', mod: 'gemini-1.5-flash' },
            { ver: 'v1beta', mod: 'imagen-3.0-generate-001' }
        ];

        let failureLogs = [];

        for (const variant of variants) {
            try {
                const url = `https://generativelanguage.googleapis.com/${variant.ver}/models/${variant.mod}:generateContent?key=${apiKey}`;
                
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: body.contents,
                        generationConfig: body.action === 'suggestions' 
                            ? { temperature: 0.7 } 
                            : { responseModalities: ["IMAGE"], temperature: 1.0 }
                    })
                });

                const data = await res.json();
                if (res.ok) {
                    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, data: data, route: `${variant.ver}/${variant.mod}` }) };
                }
                failureLogs.push(`${variant.ver}/${variant.mod}: ${data.error?.message || 'Unknown'}`);
            } catch (e) {
                failureLogs.push(`${variant.ver}/${variant.mod}: Proxy Error`);
            }
        }

        // Return a detailed diagnostic report if all fail
        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ 
                ok: false, 
                error: 'ALL_ENDPOINTS_REJECTED', 
                details: failureLogs.join(' | ') 
            }) 
        };

    } catch (err) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'SYSTEM_CRASH', details: err.message }) };
    }
};
