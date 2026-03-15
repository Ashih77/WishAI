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
        const originalPrompt = body.contents?.[0]?.parts?.[0]?.text || '';

        // 📝 TEXT SUGGESTIONS: Gemini 1.5 Flash
        if (!isImage) {
            try {
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
            } catch (e) {
                return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'AI_OFFLINE' }) };
            }
        }

        // 🎨 IMAGE GENERATION: Gemini (Primary) -> Flux (Failsafe)
        const models = ['gemini-1.5-flash-002', 'gemini-1.5-flash'];
        for (const model of models) {
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
                if (res.ok) return { statusCode: 200, headers, body: JSON.stringify({ ok: true, data }) };
            } catch (e) { continue; }
        }

        // 🛡️ THE FAILSAFE: FLUX (Pollinations AI)
        // Cleanup prompt for artistic clarity in Flux
        const fluxPrompt = originalPrompt
            .replace(/Create a stunning.*vertical greeting card\./gi, '')
            .replace(/Style:.*?\./gi, '')
            .replace(/Quality:.*?\./gi, '')
            .replace(/Instructions:.*?\./gi, '')
            .replace(/TEXT TO RENDER:.*?\./gi, '')
            .replace(/Ensure.*?text is clear and artistic\./gi, '')
            .trim();

        const finalFluxPrompt = `${fluxPrompt || 'Greeting Card'}, stunning design, cinematic lighting, vertical card, 8k, bokeh photography.`;
        const fluxUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalFluxPrompt)}?model=flux&width=800&height=1200&nologo=true&seed=${Math.floor(Math.random()*1000000)}`;

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
