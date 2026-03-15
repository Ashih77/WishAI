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
         * This matrix tries all regional and publisher variations to find Nano Banana 2.
         */
        const strategies = [
            { v: 'v1beta', m: 'imagen-3.0-generate-001', p: 'publishers/google/models/' },
            { v: 'v1beta', m: 'gemini-1.5-flash', p: 'models/' },
            { v: 'v1', m: 'gemini-1.5-flash', p: 'models/' },
            { v: 'v1beta', m: 'imagen-3.0-generate-001', p: 'models/' }
        ];

        let lastData = null;

        for (const s of strategies) {
            try {
                const url = `https://generativelanguage.googleapis.com/${s.v}/${s.p}${s.m}:generateContent?key=${apiKey}`;
                
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
                        body: JSON.stringify({ ok: true, data, route: `${s.v}/${s.m}` }) 
                    };
                }
                lastData = data;
            } catch (e) { continue; }
        }

        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ 
                ok: false, 
                error: 'ALL_ROUTES_FAILED', 
                message: lastData?.error?.message || 'Region blockage detected.' 
            }) 
        };

    } catch (err) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'CRITICAL_EXCEPTION', details: err.message }) };
    }
};
