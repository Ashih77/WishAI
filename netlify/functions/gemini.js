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
        
        if (body.action === 'heartbeat') {
            return { statusCode: 200, headers, body: JSON.stringify({ status: 'OK', keyLen: apiKey.length }) };
        }

        // 🛡️ Top Engineering: Try multiple model/version combinations for Imagen 3 (Nano Banana 2)
        const attempts = [
            { v: 'v1beta', m: 'gemini-1.5-flash' },
            { v: 'v1', m: 'gemini-1.5-flash' },
            { v: 'v1beta', m: 'imagen-3.0-generate-001' }
        ];

        let lastResult = null;

        for (const attempt of attempts) {
            try {
                const url = `https://generativelanguage.googleapis.com/${attempt.v}/models/${attempt.m}:generateContent?key=${apiKey}`;
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: body.contents,
                        generationConfig: body.generationConfig || {
                            responseModalities: ["IMAGE"],
                            temperature: 1.0
                        }
                    })
                });

                const data = await res.json();
                if (res.ok) {
                    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, data: data }) };
                }
                lastResult = { status: res.status, data: data };
            } catch (e) {
                console.error(`Attempt with ${attempt.m} failed`);
            }
        }

        // Return the last error details if all failed
        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ 
                ok: false, 
                data: lastResult?.data || 'All model variations failed.',
                status: lastResult?.status || 404
            }) 
        };

    } catch (err) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'PROXY_CRASH', details: err.message }) };
    }
};
