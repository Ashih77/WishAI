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

        const isImage = body.action === 'generate';
        const promptText = body.contents?.[0]?.parts?.[0]?.text || '';

        // 🎯 THE INVINCIBLE PROBE: Every possible Nano Banana 2 (Imagen 3) route
        const routes = isImage ? [
            { v: 'v1beta', m: 'imagen-3.0-generate-001' },
            { v: 'v1beta', m: 'gemini-1.5-flash-002' },
            { v: 'v1beta', m: 'gemini-1.5-flash' },
            { v: 'v1', m: 'gemini-1.5-flash' }
        ] : [
            { v: 'v1', m: 'gemini-1.5-flash' },
            { v: 'v1beta', m: 'gemini-1.5-flash' }
        ];

        let lastResult = null;

        for (const route of routes) {
            try {
                const url = `https://generativelanguage.googleapis.com/${route.v}/models/${route.m}:generateContent?key=${apiKey}`;
                
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: body.contents,
                        generationConfig: isImage 
                            ? { responseModalities: ["IMAGE"], temperature: 1.0 }
                            : { temperature: 0.7 }
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    return { 
                        statusCode: 200, 
                        headers, 
                        body: JSON.stringify({ ok: true, data, usedRoute: `${route.v}/${route.m}` }) 
                    };
                }
                lastResult = data;
            } catch (e) { continue; }
        }

        // 🛡️ THE ABSOLUTE FALLBACK (Flux Engine): Never return an error to the user
        // This ensures the site always produces a high-quality image if Google fails.
        if (isImage) {
            console.warn("[WishAI] Gemini Failed, triggering Flux Fallback...");
            const fluxUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?model=flux&width=1024&height=1024&nologo=true`;
            
            // We return a "fake" Gemini response structure that the frontend already understands
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    ok: true,
                    isFallback: true,
                    imageUrl: fluxUrl, // Direct image URL for the frontend to use
                    data: { // Mocking the Gemini structure
                        candidates: [{
                            content: { parts: [{ inlineData: { data: "FALLBACK", mimeType: "image/url" } }] }
                        }]
                    }
                })
            };
        }

        // Final failure for suggestions (return a friendly error)
        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ 
                ok: false, 
                error: 'AI_REJECTED', 
                message: lastResult?.error?.message || 'Region/Account Restriction' 
            }) 
        };

    } catch (err) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'SYSTEM_CRASH', details: err.message }) };
    }
};
