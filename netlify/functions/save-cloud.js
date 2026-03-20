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
        const { fileKey: clientFileKey, image, stateParams } = body;
        
        if (!image) {
            return new Response(JSON.stringify({ error: 'Missing image data' }), { status: 400, headers });
        }

        // Connect to the global store "wishai_generations"
        const store = getStore("wishai_generations");

        const safeOccasion = (stateParams?.occasion || 'card').replace(/[^a-z0-9]/gi, '_');
        const timestamp = Date.now();
        const fileKey = clientFileKey || `WishAI-${safeOccasion}-${timestamp}`;

        // Save image IMMEDIATELY so frontend can submit ratings right away without 404
        await store.set(fileKey, image, {
            metadata: {
                timestamp,
                ...stateParams // save name, style, details, etc.
            }
        });

        // --------- AUTOMATIC AI EVALUATION ---------
        let ai_score = 0;
        let ai_summary = "";
        let ai_adherence = false; 
        let ai_advice = [];
        let ai_extracted_text = "";
        let ai_text_position_analysis = "";

        try {
            const apiKey = (process.env.GEMINI_API_KEY || '').trim().replace(/["']/g, '');
            if (apiKey) {
                const base64data = image.includes(',') ? image.split(',')[1] : image;
                const prompt = `أنت خبير ذكاء اصطناعي يقوم بتقييم بطاقة تهنئة تم توليدها.
المعطيات (JSON) التي طلبها المستخدم:
\`\`\`json
${JSON.stringify(stateParams, null, 2)}
\`\`\`
يرجى مطابقة الصورة مع المعطيات، وإعطاء التقييم بناءً على: مدى الالتزام بـ (المناسبة، الأسلوب، التشكيل، موقع الاسم، التعليمات).
مهم جداً (التحليل البصري):
1. قم باستخراج النص المكتوب في الصورة تماماً كما هو (OCR) لمعرفة ما إذا كان المولد قد أضاف حرفاً زائداً أو نسى التشكيل أو أضافه بالخطأ.
2. حدد إحداثيات ومكان النص الفعلي في الصورة بدقة وقارنه مع المطلوب في المعطيات (namePosition أو instructions).
يجب أن ترجع النتيجة كـ JSON صارم فقط، بهذا الشكل بالضبط:
{
  "score": 8,
  "summary": "نص التلخيص",
  "adherence": true,
  "advice": ["نصيحة 1", "نصيحة 2"],
  "extracted_text": "النص المستخرج من الصورة بالضبط",
  "text_position_analysis": "تحليل موقع النص في الصورة مقارنة بالمطلوب"
}`;
                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
                const evalResponse = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            role: 'user',
                            parts: [
                                { text: prompt },
                                { inlineData: { mimeType: 'image/jpeg', data: base64data } }
                            ]
                        }],
                        generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
                    })
                });

                const data = await evalResponse.json();
                if (evalResponse.ok && data.candidates && data.candidates[0].content.parts[0].text) {
                    const aiResult = JSON.parse(data.candidates[0].content.parts[0].text);
                    ai_score = aiResult.score || 0;
                    ai_summary = aiResult.summary || "لا يوجد تقييم";
                    ai_adherence = !!aiResult.adherence;
                    if (Array.isArray(aiResult.advice)) ai_advice = aiResult.advice;
                    ai_extracted_text = aiResult.extracted_text || "";
                    ai_text_position_analysis = aiResult.text_position_analysis || "";
                }
            }
        } catch (evalErr) {
            console.error('[WishAI-Cloud] Automatic AI eval failed:', evalErr);
        }

        // Fetch meta again in case the user submitted a rating while Gemini was evaluating!
        const existingMeta = await store.getMetadata(fileKey);
        const currentMeta = existingMeta ? existingMeta.metadata : { timestamp, ...stateParams };

        // Save AI results merged with any existing data (like user rating)
        await store.set(fileKey, image, {
            metadata: {
                ...currentMeta,
                ai_score,
                ai_summary,
                ai_adherence,
                ai_advice,
                ai_extracted_text,
                ai_text_position_analysis
            }
        });

        console.log(`[WishAI-Cloud] Successfully evaluated tracking image: ${fileKey} with AI Score: ${ai_score}`);

        return new Response(JSON.stringify({ ok: true, fileKey }), { status: 200, headers });

    } catch (err) {
        console.error('Error saving to cloud:', err);
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers });
    }
};

export const config = {
    path: "/api/save-cloud"
};
