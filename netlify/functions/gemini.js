const API_V1BETA = 'https://generativelanguage.googleapis.com/v1beta/models';
const API_V1 = 'https://generativelanguage.googleapis.com/v1/models';

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };

    try {
        const apiKey = (process.env.GEMINI_API_KEY || '').trim().replace(/["']/g, '');
        
        if (!apiKey) {
            console.error('[WishAI PROXY] CRITICAL: GEMINI_API_KEY is missing.');
            return { statusCode: 401, headers, body: JSON.stringify({ error: 'CONFIG_MISSING', message: 'API Key not found in Environment Variables' }) };
        }

        const body = JSON.parse(event.body);
        
        // 🔹 Action Dispatcher
        if (body.action === 'heartbeat') {
            return { statusCode: 200, headers, body: JSON.stringify({ status: 'OK', keyLength: apiKey.length }) };
        }

        // 🔹 Default to Gemini 1.5 Flash for maximum stability
        const model = body.model || 'gemini-1.5-flash';
        const url = `${API_V1BETA}/${model}:generateContent?key=${apiKey}`;

        console.log(`[WishAI PROXY] Calling Gemini: ${model}`);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: body.contents,
                generationConfig: body.generationConfig || { temperature: 0.7 }
            })
        });

        const data = await response.json();
        
        // Fallback to v1 if v1beta fails with 404
        if (response.status === 404) {
             const v1Url = `${API_V1}/${model}:generateContent?key=${apiKey}`;
             const v1Response = await fetch(v1Url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: body.contents })
             });
             return { statusCode: v1Response.status, headers, body: JSON.stringify(await v1Response.json()) };
        }

        return { statusCode: response.status, headers, body: JSON.stringify(data) };

    } catch (err) {
        console.error('[WishAI PROXY] Crash:', err.message);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'PROXY_CRASH', details: err.message }) };
    }
};
