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
        if (body.action === 'heartbeat') return { statusCode: 200, headers, body: JSON.stringify({ status: 'OK', keyLen: apiKey.length }) };

        let url, payload;

        if (body.action === 'suggestions') {
            // 📝 Text Route: Stable v1 for instant suggestions
            url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            payload = {
                contents: body.contents,
                generationConfig: { temperature: 0.7 }
            };
        } else {
            // 🎨 Image Route: Nano Banana 2 (Imagen 3) Dedicated Path
            url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateContent?key=${apiKey}`;
            payload = {
                contents: body.contents,
                generationConfig: {
                    responseModalities: ["IMAGE"],
                    temperature: 1.0
                }
            };
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        // 🛡️ Failover: If Imagen 3 fails, try Multimodal Flash on v1beta
        if (!response.ok && body.action === 'generate') {
            const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            const fallbackRes = await fetch(fallbackUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const fallbackData = await fallbackRes.json();
            return { 
                statusCode: 200, 
                headers, 
                body: JSON.stringify({ ok: fallbackRes.ok, data: fallbackData }) 
            };
        }

        return { statusCode: 200, headers, body: JSON.stringify({ ok: response.ok, data: data }) };

    } catch (err) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'SYSTEM_ERROR', details: err.message }) };
    }
};
