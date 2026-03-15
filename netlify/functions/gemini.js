const ENDPOINTS = [
    'https://generativelanguage.googleapis.com/v1beta/models',
    'https://generativelanguage.googleapis.com/v1/models'
];

exports.handler = async (event) => {
    const headers = { 
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Headers': 'Content-Type', 
        'Content-Type': 'application/json' 
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };

    try {
        const { model, contents, generationConfig } = JSON.parse(event.body);
        const apiKey = (process.env.GEMINI_API_KEY || '').trim().replace(/["']/g, '').replace(/\s/g, '');

        if (!apiKey) return { statusCode: 401, headers, body: JSON.stringify({ error: 'API Key Missing' }) };

        // 🚀 SMART RETRY SYSTEM: Try different models and endpoints until success
        const modelsToTry = [model, 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
        let lastError = null;

        for (const modelId of modelsToTry) {
            for (const apiBase of ENDPOINTS) {
                try {
                    const url = `${apiBase}/${modelId}:generateContent?key=${apiKey}`;
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ contents, generationConfig })
                    });

                    const data = await response.json();
                    
                    if (response.ok) {
                        console.log(`✅ Success with ${modelId} on ${apiBase}`);
                        return { statusCode: 200, headers, body: JSON.stringify(data) };
                    }
                    
                    lastError = data.error || { message: 'Unknown Error' };
                    console.warn(`⚠️ Failed: ${modelId} on ${apiBase} - ${response.status}`);
                } catch (e) {
                    console.error(`❌ Network error with ${modelId}:`, e.message);
                }
            }
        }

        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ 
                error: 'All models and endpoints failed.', 
                details: lastError?.message || 'Check your API Key and Region.'
            })
        };

    } catch (error) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal Crash', details: error.message }) };
    }
};
