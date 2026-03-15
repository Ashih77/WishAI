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
        
        // 🎯 THE SCIENTIFIC ACCURACY: Targeted Models from Account Audit
        // Use Gemini 2.0 for instantaneous Text, and the verified Nano Banana for Images.
        const TEXT_MODEL = 'gemini-2.0-flash-latest';
        const IMAGE_MODEL = 'nano-banana-pro-preview'; 

        const selectedModel = isImage ? IMAGE_MODEL : TEXT_MODEL;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;

        const payload = {
            contents: body.contents,
            generationConfig: isImage 
                ? { responseModalities: ["IMAGE"], temperature: 1.0 }
                : { temperature: 0.7 }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            return { 
                statusCode: 200, 
                headers, 
                body: JSON.stringify({ ok: true, data, used: selectedModel }) 
            };
        }

        // 🛡️ High-Tier Resilience: Fallback to Multimodal Gamma if Nano Banana is busy
        if (isImage) {
            const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-latest:generateContent?key=${apiKey}`;
            const fallbackRes = await fetch(fallbackUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const fallbackData = await fallbackRes.json();
            if (fallbackRes.ok) return { statusCode: 200, headers, body: JSON.stringify({ ok: true, data: fallbackData, used: 'gemini-2.0-fallback' }) };
        }

        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ 
                ok: false, 
                error: 'PROVIDER_ISSUE', 
                message: data.error?.message || 'Check Quota' 
            }) 
        };

    } catch (err) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'PROXY_CRASH', details: err.message }) };
    }
};
