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

        // 📝 TEXT SUGGESTIONS: Pure Gemini 1.5 Flash (Sync with Frontend Fallback)
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
                // We return whatever Google says; if it fails, Frontend will use its synced FALLBACK_GREETINGS
                return { statusCode: 200, headers, body: JSON.stringify({ ok: res.ok, data }) };
            } catch (e) {
                return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'AI_OFFLINE' }) };
            }
        }

        // 🎨 IMAGE GENERATION: Gemini -> Flux Fallback
        // 1. Try Gemini (Flash v2 is more robust for regional quotas)
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

        // 🛡️ THE ULTIMATE FAILSAFE: FLUX (Pollinations AI)
        // Cleanup prompt: Remove technical instructions and keep only visual descriptions for Flux
        const fluxPrompt = originalPrompt
            .replace(/Create a stunning.*vertical greeting card\./gi, '')
            .replace(/Style:.*?\./gi, '')
            .replace(/Quality:.*?\./gi, '')
            .replace(/Instructions:.*?\./gi, '')
            .replace(/TEXT TO RENDER:.*?\./gi, '')
            .replace(/Ensure Arabic text is clear and artistic\./gi, '')
            .trim();

        const finalFluxPrompt = `Stunning ${fluxPrompt || 'Greeting Card'}, cinematic lighting, high resolution, 8k, professional photography style.`;
        
        // We use a specific seed and width/height for Pollinations to be more stable
        const fluxUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalFluxPrompt)}?model=flux&width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random()*1000000)}`;

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
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'CRITICAL_FAILURE', details: err.message }) };
    }
};
