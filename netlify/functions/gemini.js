const API_V1BETA = 'https://generativelanguage.googleapis.com/v1beta/models';
const API_V1 = 'https://generativelanguage.googleapis.com/v1/models';

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: 'JSON.stringify({error: "Method Not Allowed"})' };

    try {
        const { model, contents, generationConfig } = JSON.parse(event.body);
        
        // 🔒 Clean API Key: Remove whitespace and quotes
        const rawKey = process.env.GEMINI_API_KEY || '';
        const apiKey = rawKey.trim().replace(/["']/g, '').replace(/\s/g, '');

        if (!apiKey || apiKey.length < 10) {
            return { statusCode: 401, headers, body: JSON.stringify({ error: 'GEMINI_API_KEY is missing or invalid in Netlify settings.' }) };
        }

        // Try v1beta first (most features)
        let url = `${API_V1BETA}/${model}:generateContent?key=${apiKey}`;
        let response = await fetch(url, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents, generationConfig })
        });

        // Fallback to v1 if 404
        if (response.status === 404) {
            url = `${API_V1}/${model}:generateContent?key=${apiKey}`;
            response = await fetch(url, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents, generationConfig })
            });
        }

        const data = await response.json();
        return { statusCode: response.status, headers, body: JSON.stringify(data) };

    } catch (error) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Backend Error', details: error.message }) };
    }
};
