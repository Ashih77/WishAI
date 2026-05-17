exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };

    try {
        const body = JSON.parse(event.body);
        const getEnv = (key) => {
            const value = globalThis.Netlify?.env?.get?.(key) || process.env[key] || '';
            return value.trim().replace(/["']/g, '');
        };
        const geminiApiKey = getEnv('GEMINI_API_KEY');
        const openAiApiKey = getEnv('OPENAI_API_KEY') || getEnv('OPENAIAPIKEY');

        // 🔹 Heartbeat
        if (body.action === 'heartbeat') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    status: geminiApiKey ? 'OK' : 'GEMINI_API_KEY_MISSING',
                    keyLen: geminiApiKey.length,
                    openAiKeyLen: openAiApiKey.length
                })
            };
        }

        const isImage = body.action === 'generate';
        const requestedImageModel = body.imageModel === 'openai-image-2' ? 'openai-image-2' : 'nano-banana-2';

        if (isImage && requestedImageModel === 'openai-image-2') {
            if (!openAiApiKey) {
                return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'OPENAI_API_KEY_MISSING' }) };
            }

            const prompt = body.contents?.[0]?.parts?.map(part => part.text || '').join('\n').trim();
            if (!prompt) {
                return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'PROMPT_MISSING' }) };
            }

            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openAiApiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-image-2',
                    prompt,
                    size: '1024x1536',
                    quality: 'medium',
                    output_format: 'png'
                })
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ ok: true, data, used: 'gpt-image-2' })
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    ok: false,
                    error: 'OPENAI_IMAGE_2_FAILED',
                    message: data.error?.message || 'Unknown'
                })
            };
        }

        if (!geminiApiKey) {
            return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'GEMINI_API_KEY_MISSING' }) };
        }

        // 📝 TEXT: gemini-2.5-flash (VERIFIED WORKING with new key)
        // 🎨 IMAGE: nano-banana-pro-preview (VERIFIED WORKING with new key)
        const model = isImage ? 'nano-banana-pro-preview' : 'gemini-2.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: body.contents,
                generationConfig: isImage 
                    ? { responseModalities: ["IMAGE"], temperature: 1.0 }
                    : (body.action === 'evaluate' ? { temperature: 0.1, responseMimeType: "application/json" } : { temperature: 0.8 })
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

        return { 
            statusCode: 200, 
            headers, 
            body: JSON.stringify({ 
                ok: false, 
                error: isImage ? 'NANO_BANANA_DENIED' : 'TEXT_FAILED', 
                message: data.error?.message || 'Unknown' 
            }) 
        };

    } catch (err) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: false, error: 'PROXY_CRASH', details: err.message }) };
    }
};
