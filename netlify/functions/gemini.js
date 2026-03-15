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
        const promptText = body.contents?.[0]?.parts?.[0]?.text || '';

        // 📝 Text Requests: Use Stable 1.5 Flash (High Quota)
        if (!isImage) {
            const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: body.contents,
                    generationConfig: { temperature: 0.7 }
                })
            });
            const data = await res.json();
            return { statusCode: 200, headers, body: JSON.stringify({ ok: res.ok, data }) };
        }

        // 🎨 Image Requests: Try Nano Banana First, then Auto-Fallback to Flux
        // This solves the "Quota Exceeded / Limit 0" issue permanently.
        const imageModels = ['nano-banana-pro-preview', 'gemini-1.5-flash-002'];
        
        for (const model of imageModels) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: body.contents,
                        generationConfig: { responseModalities: ["IMAGE"], temperature: 1.0 }
                    })
                });
                const data = await res.json();
                if (res.ok) return { statusCode: 200, headers, body: JSON.stringify({ ok: true, data, used: model }) };
            } catch (e) { continue; }
        }

        // 🛡️ THE FAILSAFE: Flux Engine (Pollinations)
        // If Google quota is hit (Limit 0), we jump here immediately.
        console.warn("[WishAI] Quota hit or failure, using Flux Fallback.");
        const fluxUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?model=flux&width=1024&height=1024&nologo=true`;
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                ok: true,
                isFallback: true,
                imageUrl: fluxUrl,
                data: { candidates: [{ content: { parts: [{ inlineData: { data: "FLUX", mimeType: "image/url" } }] } }] }
            })
        };

    } catch (err) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'PROXY_CRASH', details: err.message }) };
    }
};
