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

        // 🛡️ The Ultimate Auto-Discovery Matrix for Nano Banana 2 (Imagen 3)
        // These are the ONLY paths that reliably render Arabic text correctly
        const probes = [
            { v: 'v1beta', m: 'gemini-1.5-flash' }, // Mode 1: Multimodal Flash
            { v: 'v1beta', m: 'gemini-1.5-flash-002' }, // Mode 2: Latest Optimized
            { v: 'v1beta', m: 'imagen-3.0-generate-001' } // Mode 3: Direct Imagen 3
        ];

        let lastData = null;
        let success = false;

        for (const probe of probes) {
            try {
                const url = `https://generativelanguage.googleapis.com/${probe.v}/models/${probe.m}:generateContent?key=${apiKey}`;
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: body.contents,
                        generationConfig: {
                            responseModalities: ["IMAGE"],
                            temperature: 1.0 
                        }
                    })
                });

                const data = await res.json();
                if (res.ok) {
                    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, data: data, version: probe.v, model: probe.m }) };
                }
                lastData = data;
                console.warn(`[WishAI] Probe Failed: ${probe.m} - ${res.status}`);
            } catch (e) { continue; }
        }

        // If all Imagen paths fail, return the error to the frontend for diagnostic
        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ 
                ok: false, 
                error: 'NANO_BANANA_OFFLINE', 
                googleMessage: lastData?.error?.message || 'Check Region Restrictions' 
            }) 
        };

    } catch (err) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'SYSTEM_CRASH', details: err.message }) };
    }
};
