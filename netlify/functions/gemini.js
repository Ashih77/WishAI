const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

exports.handler = async (event) => {
    // 1. Correct Headers for CORS & JSON
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle OPTIONS request for CORS
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const body = JSON.parse(event.body);
        const { action, model, contents, generationConfig } = body;
        
        // 🔒 API KEY: Strict cleaning
        const rawKey = process.env.GEMINI_API_KEY || '';
        const apiKey = rawKey.trim().replace(/["']/g, '');

        if (!apiKey || apiKey.length < 10) {
            console.error('❌ CONFIG ERROR: Missing or invalid GEMINI_API_KEY');
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'API Key not configured correctly in Netlify Environment Variables.' })
            };
        }

        console.log(`🚀 Request: Action=${action}, Model=${model}`);

        // Construct Google API URL
        const url = `${API_BASE}/${model}:generateContent?key=${apiKey}`;

        // Forwarding to Google
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents, generationConfig })
        });

        const data = await response.json();

        // Log if Google returns an error
        if (!response.ok) {
            console.error('⚠️ Google API Error:', response.status, JSON.stringify(data));
        }

        return {
            statusCode: response.status,
            headers,
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('🔥 Function Crash:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal Server Error', details: error.message })
        };
    }
};
