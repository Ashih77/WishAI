import { getStore } from "@netlify/blobs";

export default async (req, context) => {
    const url = new URL(req.url);
    const key = url.searchParams.get('key');

    const headers = new Headers({
        'Access-Control-Allow-Origin': '*'
    });

    if (!key) {
        return new Response('Missing key', { status: 400 });
    }

    try {
        const store = getStore("wishai_generations");
        const imageData = await store.get(key);
        
        if (!imageData) {
            return new Response('Not found', { status: 404 });
        }

        // Our stored image format might be raw base64 string or dataURL.
        // We will just return the string as text, and frontend can put it in an <img> src.
        return new Response(imageData, { status: 200, headers: new Headers({ 'Content-Type': 'text/plain' }) });

    } catch (err) {
        return new Response(err.message, { status: 500 });
    }
};

export const config = {
    path: "/api/get-cloud-image"
};
