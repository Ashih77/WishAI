exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };

    // 🛡️ EMERGENCY BACKUP: High-quality Arabic greetings if AI fails
    const FALLBACK_SUGGESTIONS = [
        "يوم جميل يشبه نقاء قلبك",
        "أتمنى لك عاماً مليئاً بالنجاح والسعادة",
        "مبروك التخرج، وفخورون جداً بك",
        "رمضان كريم، أعاده الله عليك بالخير والبركات",
        "كل عام وأنت بخير بمناسبة عيد ميلادك"
    ];

    try {
        const apiKey = (process.env.GEMINI_API_KEY || '').trim().replace(/["']/g, '');
        if (!apiKey) return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'API_KEY_MISSING' }) };

        const body = JSON.parse(event.body);
        if (body.action === 'heartbeat') return { statusCode: 200, headers, body: JSON.stringify({ status: 'OK', keyLen: apiKey.length }) };

        const isImage = body.action === 'generate';
        
        // 🎯 THE ULTIMATE PROBE: Multi-Model Discovery for both Text and Image
        const textModels = [
            { v: 'v1', m: 'gemini-1.5-flash' },
            { v: 'v1beta', m: 'gemini-1.5-flash' },
            { v: 'v1', m: 'gemini-pro' }
        ];

        const imageModels = [
            { v: 'v1beta', m: 'imagen-3.0-generate-001' },
            { v: 'v1beta', m: 'gemini-1.5-flash-002' },
            { v: 'v1beta', m: 'gemini-1.5-flash' }
        ];

        const routes = isImage ? imageModels : textModels;
        let lastError = null;

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
                if (response.ok) return { statusCode: 200, headers, body: JSON.stringify({ ok: true, data, used: `${route.v}/${route.m}` }) };
                lastError = data.error?.message || 'Unknown Error';
            } catch (e) {
                lastError = e.message;
            }
        }

        // 🚨 CRITICAL RECOVERY: If Text fails, return fallback suggestions so the UI never stays empty
        if (!isImage) {
            console.warn("[WishAI] Text AI failed, providing emergency fallback suggestions.");
            return { 
                statusCode: 200, 
                headers, 
                body: JSON.stringify({ 
                    ok: true, 
                    isFallback: true,
                    data: {
                        candidates: [{ content: { parts: [{ text: FALLBACK_SUGGESTIONS.join('\n') }] } }]
                    }
                }) 
            };
        }

        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'SERVICE_UNAVAILABLE', details: lastError }) };

    } catch (err) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'CRITICAL_CRASH', details: err.message }) };
    }
};
