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
        if (body.action === 'heartbeat') {
            return { statusCode: 200, headers, body: JSON.stringify({ status: 'OK', keyLen: apiKey.length }) };
        }

        const isImage = body.action === 'generate';

        // 📝 TEXT: Use gemini-2.0-flash (VERIFIED to exist in your account)
        // NOT gemini-1.5-pro (which does NOT exist and causes the 404)
        if (!isImage) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: body.contents,
                    generationConfig: { temperature: 0.8 }
                })
            });
            const data = await res.json();
            return { statusCode: 200, headers, body: JSON.stringify({ ok: res.ok, data }) };
        }

        // 🎨 IMAGE: Nano Banana 2 ONLY (nano-banana-pro-preview)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/nano-banana-pro-preview:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: body.contents,
                generationConfig: { responseModalities: ["IMAGE"], temperature: 1.0 }
            })
        });
        const data = await res.json();

        if (res.ok) {
            return { statusCode: 200, headers, body: JSON.stringify({ ok: true, data, used: 'nano-banana-pro-preview' }) };
        }

        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ 
                ok: false, 
                error: 'NANO_BANANA_DENIED', 
                message: data.error?.message || 'Quota exceeded' 
            }) 
        };

    } catch (err) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'PROXY_CRASH', details: err.message }) };
    }
};
