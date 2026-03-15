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
        const isImage = body.action === 'generate';

        // 🎯 TARGET: Nano Banana 2 ONLY for Image Generation
        // This is the specific model the user is demanding.
        const model = isImage ? 'nano-banana-pro-preview' : 'gemini-1.5-pro';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: body.contents,
                generationConfig: isImage 
                    ? { responseModalities: ["IMAGE"], temperature: 1.0 }
                    : { temperature: 0.8 }
            })
        });

        const data = await response.json();

        if (response.ok) {
            return { 
                statusCode: 200, 
                headers, 
                body: JSON.stringify({ ok: true, data, used: model }) 
            };
        }

        // Return the RAW error from Google if it fails, no fallbacks allowed.
        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ 
                ok: false, 
                error: 'NANO_BANANA_DENIED', 
                message: data.error?.message || 'Check Quota' 
            }) 
        };

    } catch (err) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'PROXY_CRASH', details: err.message }) };
    }
};
