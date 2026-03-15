const VERSIONS = ['v1beta', 'v1'];
const MODELS = [
    'gemini-2.0-flash-exp',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
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

        // Try combinations
        const tryList = [...new Set([model, ...MODELS])].filter(Boolean);
        let errorResult = null;

        for (const m of tryList) {
            for (const v of VERSIONS) {
                try {
                    // Try both direct and publishers path
                    const paths = [`models/${m}`, `publishers/google/models/${m}`];
                    for (const p of paths) {
                        const url = `https://generativelanguage.googleapis.com/${v}/${p}:generateContent?key=${apiKey}`;
                        const res = await fetch(url, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ contents, generationConfig })
                        });

                        if (res.ok) {
                            const data = await res.json();
                            return { statusCode: 200, headers, body: JSON.stringify(data) };
                        }
                        
                        const errData = await res.json().catch(() => ({}));
                        errorResult = errData;

                        // If auth error, stop. If quota (429), try NEXT model/version
                        if (res.status === 401 || res.status === 403) {
                            return { statusCode: res.status, headers, body: JSON.stringify(errData) };
                        }
                    }
                } catch (e) {
                    console.error(`Retry failed for ${m} on ${v}`);
                }
            }
        }

        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'All Google routes failed.', details: errorResult })
        };

    } catch (err) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal Error', details: err.message }) };
    }
};
