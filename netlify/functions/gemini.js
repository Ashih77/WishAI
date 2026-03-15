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
        const promptText = body.contents?.[0]?.parts?.[0]?.text || 'Greeting card';

        // 📝 Text Requests: Use Stable 1.5 Flash
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
                if (res.ok) return { statusCode: 200, headers, body: JSON.stringify({ ok: true, data }) };
            } catch (e) {}
            
            // Text Fallback
            return { 
                statusCode: 200, 
                headers, 
                body: JSON.stringify({ 
                    ok: true, 
                    data: { candidates: [{ content: { parts: [{ text: "يوم جميل يشبه نقاء قلبك\nعام مليء بالسعادة والنجاح\nمبروك التخرج وفخورون بك جداً" }] } }] } 
                }) 
            };
        }

        // 🎨 Image Requests: Try Google, then Auto-Fallback to Flux
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-002:generateContent?key=${apiKey}`;
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
        } catch (e) {}

        // 🛡️ THE FAILSAFE: Flux Engine (Pollinations)
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
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'FAILSAFE_ERROR', details: err.message }) };
    }
};
