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

        // 🎯 Top 1% Engineering: Hybrid Model Discovery Matrix
        // Tries v1 (Stable) first, then v1beta (Experimental)
        const candidates = [
            { v: 'v1', m: 'gemini-1.5-flash' },
            { v: 'v1beta', m: 'gemini-1.5-flash' },
            { v: 'v1beta', m: 'imagen-3.0-generate-001' }
        ];

        let lastResult = null;

        for (const candidate of candidates) {
            try {
                const url = `https://generativelanguage.googleapis.com/${candidate.v}/models/${candidate.m}:generateContent?key=${apiKey}`;
                const isImageRequest = (body.action !== 'suggestions');
                
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: body.contents,
                        generationConfig: isImageRequest ? {
                            responseModalities: ["IMAGE"],
                            temperature: 1.0
                        } : { temperature: 0.7 }
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    return { 
                        statusCode: 200, 
                        headers, 
                        body: JSON.stringify({ 
                            ok: true, 
                            data: data, 
                            used: `${candidate.v}/${candidate.m}` 
                        }) 
                    };
                }
                lastResult = data;
            } catch (e) { continue; }
        }

        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ 
                ok: false, 
                error: 'NANO_BANANA_UNREACHABLE', 
                message: lastResult?.error?.message || 'Check Quota/Region' 
            }) 
        };

    } catch (err) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'PROXY_CRASH', details: err.message }) };
    }
};
