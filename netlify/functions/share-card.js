import { getStore } from "@netlify/blobs";

function escapeHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export default async (req) => {
    const url = new URL(req.url);
    const key = url.searchParams.get('id') || url.searchParams.get('key');

    if (!key) {
        return new Response('Missing card id', { status: 400 });
    }

    const origin = url.origin;
    const imageUrl = `${origin}/api/get-cloud-image?key=${encodeURIComponent(key)}`;
    let title = 'WishAI Greeting Card';
    let description = 'بطاقة تهنئة صممت بواسطة WishAI';

    try {
        const store = getStore("wishai_generations");
        const blobInfo = await store.getMetadata(key);
        const metadata = blobInfo?.metadata || {};
        const greeting = metadata.greeting;
        const name = metadata.name;
        if (greeting) title = greeting;
        if (name) description = `${greeting || 'بطاقة تهنئة'} — ${name}`;
    } catch {
        // Metadata is optional. The image itself is the share payload.
    }

    const safeTitle = escapeHtml(title);
    const safeDescription = escapeHtml(description);
    const safeImageUrl = escapeHtml(imageUrl);

    const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDescription}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDescription}">
  <meta property="og:image" content="${safeImageUrl}">
  <meta property="og:image:secure_url" content="${safeImageUrl}">
  <meta property="og:image:alt" content="${safeTitle}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDescription}">
  <meta name="twitter:image" content="${safeImageUrl}">
  <style>
    body{margin:0;min-height:100vh;display:grid;place-items:center;background:#080b18;color:#fff;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    main{width:min(92vw,520px);padding:24px;text-align:center}
    img{width:100%;height:auto;border-radius:18px;box-shadow:0 24px 70px rgba(0,0,0,.45)}
    a{display:inline-block;margin-top:18px;color:#c4b5fd;text-decoration:none;font-weight:700}
  </style>
</head>
<body>
  <main>
    <img src="${safeImageUrl}" alt="${safeTitle}">
    <a href="/">صمم بطاقة جديدة مع WishAI</a>
  </main>
</body>
</html>`;

    return new Response(html, {
        status: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600'
        }
    });
};

export const config = {
    path: "/share"
};
