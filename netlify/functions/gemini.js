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

        const isImage = body.action === 'generate';
        
        /**
         * 🎯 THE 1% MASTER PROBE
         * Tries all possible Imagen 3 (Nano Banana 2) variants including the "Publisher" path.
         */
        const strategies = isImage ? [
            { v: 'v1beta', m: 'imagen-3.0-generate-001', p: 'models/' },
            { v: 'v1beta', m: 'imagen-3.0-generate-001', p: 'publishers/google/models/' },
            { v: 'v1beta', m: 'gemini-1.5-flash', p: 'models/' },
            { v: 'v1', m: 'gemini-1.5-flash', p: 'models/' }
        ] : [
            { v: 'v1', m: 'gemini-1.5-flash', p: 'models/' },
            { v: 'v1beta', m: 'gemini-1.5-flash', p: 'models/' }
        ];

        let lastRes = null;

        for (const s of strategies) {
            try {
                const url = `https://generativelanguage.googleapis.com/${s.v}/${s.p}${s.m}:generateContent?key=${apiKey}`;
                
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: body.contents,
                        generationConfig: isImage ? { responseModalities: ["IMAGE"], temperature: 1.0 } : { temperature: 0.7 }
                    })
                });

                const data = await response.json();
                if (response.ok) return { statusCode: 200, headers, body: JSON.stringify({ ok: true, data, mode: s.m }) };
                lastRes = data;
            } catch (e) { continue; }
        }

        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ 
                ok: false, 
                error: 'NANO_BANANA_UNREACHABLE', 
                details: lastRes || 'All endpoints failed' 
            }) 
        };

    } catch (err) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'PROXY_CRASH', details: err.message }) };
    }
};
