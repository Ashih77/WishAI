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
        if (!apiKey) return { statusCode: 401, headers, body: JSON.stringify({ error: 'CONFIG_MISSING' }) };

        const body = JSON.parse(event.body);
        
        // 🔹 Heartbeat Diagnostic
        if (body.action === 'heartbeat') {
            return { statusCode: 200, headers, body: JSON.stringify({ status: 'OK', keyLen: apiKey.length }) };
        }

        // 🔹 Nano Banana 2 (Imagen 3) Dedicated Protocol
        // In AI Studio, Imagen 3 is accessed via gemini-1.5-flash + responseModalities: ["IMAGE"]
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: body.contents,
                generationConfig: body.generationConfig || {
                    temperature: 0.7,
                    responseModalities: ["IMAGE"]
                },
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
                ]
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('[Google API Error]', JSON.stringify(data));
            return { 
                statusCode: response.status, 
                headers, 
                body: JSON.stringify({ error: 'GOOGLE_REJECTED', details: data.error || data }) 
            };
        }

        return { statusCode: 200, headers, body: JSON.stringify(data) };

    } catch (err) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'PROXY_CRASH', message: err.message }) };
    }
};
