const VERSIONS = ['v1beta', 'v1'];
const FALLBACK_MODELS = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro',
    'gemini-pro'
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

        if (!apiKey) return { statusCode: 401, headers, body: JSON.stringify({ error: 'API Key Missing in Netlify' }) };

        // 🛡️ INVINCIBLE RETRY LOOP
        // We try the requested model first, then fallbacks, across all API versions.
        const modelsToTry = [...new Set([model, ...FALLBACK_MODELS])].filter(Boolean);
        let lastResponse = null;
        let lastErrorData = null;

        for (const m of modelsToTry) {
            for (const v of VERSIONS) {
                try {
                    const url = `https://generativelanguage.googleapis.com/${v}/models/${m}:generateContent?key=${apiKey}`;
                    console.log(`Trying: ${v} / ${m}`);
                    
                    const res = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ contents, generationConfig })
                    });

                    const data = await res.json();

                    if (res.ok) {
                        return { statusCode: 200, headers, body: JSON.stringify(data) };
                    }
                    
                    lastResponse = res;
                    lastErrorData = data;
                    
                    // If it's a 429 (Quota) or 401 (Auth), don't keep trying other models, they will fail too.
                    if (res.status === 429 || res.status === 401 || res.status === 403) {
                        return { statusCode: res.status, headers, body: JSON.stringify(data) };
                    }
                } catch (e) {
                    console.error(`Fetch failed for ${m} on ${v}:`, e.message);
                }
            }
        }

        // If we reach here, all combinations failed
        return {
            statusCode: lastResponse ? lastResponse.status : 404,
            headers,
            body: JSON.stringify({
                error: 'All Gemini routes failed.',
                googleError: lastErrorData || 'Is the API key valid?'
            })
        };

    } catch (error) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal Function Crash', details: error.message }) };
    }
};
