import { getStore } from "@netlify/blobs";

export default async (req, context) => {
    const url = new URL(req.url);
    const key = url.searchParams.get('key');
    // Basic password check to prevent public scraping of images
    const ADMIN_PASS = 'wishai-admin-2026';
    const pass = url.searchParams.get('pass');

    const headers = new Headers({
        'Access-Control-Allow-Origin': '*'
    });

    if (pass !== ADMIN_PASS) {
        return new Response('Unauthorized', { status: 401, headers });
    }

    if (!key) {
        return new Response('Missing key', { status: 400 });
    }

    try {
        const store = getStore("wishai_generations");
        const imageData = await store.get(key);
        
        if (!imageData) {
            return new Response('Not found', { status: 404 });
        }

        // imageData is a base64 Data URL (e.g. data:image/png;base64,iVBO...)
        let base64 = imageData;
        let mimeType = 'image/png';

        if (imageData.startsWith('data:')) {
            const parts = imageData.split(',');
            mimeType = parts[0].split(';')[0].replace('data:', '') || 'image/png';
            base64 = parts[1];
        }

        // Decode base64 to binary
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        return new Response(bytes, { 
            status: 200, 
            headers: new Headers({ 
                'Content-Type': mimeType,
                'Cache-Control': 'public, max-age=31536000'
            }) 
        });

    } catch (err) {
        return new Response(err.message, { status: 500 });
    }
};

export const config = {
    path: "/api/get-cloud-image"
};
