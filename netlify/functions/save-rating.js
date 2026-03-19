import { getStore } from "@netlify/blobs";

export default async (req, context) => {
    // CORS Headers
    const headers = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    });

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers });
    }

    try {
        if (req.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers });
        }

        const body = await req.json();
        const { fileKey, rating, feedback } = body;
        
        if (!fileKey || !rating) {
            return new Response(JSON.stringify({ error: 'Missing fileKey or rating' }), { status: 400, headers });
        }

        // Connect to the global store "wishai_generations"
        const store = getStore("wishai_generations");

        // Fetch the existing metadata
        const metadataResponse = await store.getMetadata(fileKey);
        
        if (!metadataResponse) {
             return new Response(JSON.stringify({ error: 'Image not found in cloud' }), { status: 404, headers });
        }

        const metadata = metadataResponse.metadata || {};

        // Add the new rating data
        metadata.rating = rating;
        metadata.feedback = feedback || '';

        // Update the blob's metadata
        const imageBlob = await store.get(fileKey, { type: 'blob' });
        
        await store.set(fileKey, imageBlob, { metadata });

        console.log(`[WishAI-Cloud] Successfully saved rating for: ${fileKey}`);

        return new Response(JSON.stringify({ ok: true }), { status: 200, headers });

    } catch (err) {
        console.error('Error saving rating:', err);
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers });
    }
};

export const config = {
    path: "/api/save-rating"
};
