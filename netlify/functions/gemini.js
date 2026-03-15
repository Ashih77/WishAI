const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };

    try {
        const { contents, generationConfig } = JSON.parse(event.body);
        const apiKey = (process.env.GEMINI_API_KEY || '').trim().replace(/["']/g, '').replace(/\s/g, '');

        if (!apiKey) return { statusCode: 401, headers, body: JSON.stringify({ error: 'API Key Missing' }) };

        // 🎯 Single shot with the most compatible endpoint
        const url = `${ENDPOINT}?key=${apiKey}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents, generationConfig })
        });

        const data = await res.json();

        if (!res.ok) {
            console.error('⚠️ Google API Error:', res.status, JSON.stringify(data));
            return {
                statusCode: res.status,
                headers,
                body: JSON.stringify({ 
                    error: data.error?.message || 'Google AI Error',
                    status: res.status,
                    code: data.error?.status || 'UNKNOWN'
                })
            };
        }

        return { statusCode: 200, headers, body: JSON.stringify(data) };

    } catch (err) {
        console.error('🔥 Proxy Crash:', err);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal Server Error', details: err.message }) };
    }
};
