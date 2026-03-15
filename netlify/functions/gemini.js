const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

exports.handler = async (event) => {
    // Basic security: only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { action, model, contents, generationConfig } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.replace(/\s/g, '') : null;

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'GEMINI_API_KEY is not configured in Netlify environment variables.' })
            };
        }

        console.log(`Calling Gemini API for model: ${model}`);
        let url = `${API_BASE}/${model}:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents, generationConfig })
        });

        const data = await response.json();

        return {
            statusCode: response.status,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' // Optional, depending on your setup
            },
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Function Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error', details: error.message })
        };
    }
};
