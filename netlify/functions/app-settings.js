import { getStore } from "@netlify/blobs";

const SETTINGS_KEY = "app";
const DEFAULT_SETTINGS = {
    imageModel: "nano-banana-2",
    activeCycle: {
        id: "baseline",
        label: "الدورة الحالية",
        startedAt: 0,
        createdAt: null,
        notes: ""
    },
    updatedAt: null
};

function normalizeImageModel(model) {
    return model === "openai-image-2" ? "openai-image-2" : "nano-banana-2";
}

async function readSettings(store) {
    const saved = await store.get(SETTINGS_KEY, { type: "json" }).catch(() => null);
    return {
        ...DEFAULT_SETTINGS,
        ...(saved || {}),
        imageModel: normalizeImageModel(saved?.imageModel)
    };
}

export default async (req) => {
    const ADMIN_PASS = process.env.VITE_ADMIN_PASSWORD || "wishai-admin-2026";
    const headers = new Headers({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
    });

    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers });
    }

    try {
        const store = getStore("wishai_settings", { consistency: "strong" });

        if (req.method === "GET") {
            const settings = await readSettings(store);
            return new Response(JSON.stringify({ ok: true, settings }), { status: 200, headers });
        }

        if (req.method !== "POST") {
            return new Response(JSON.stringify({ ok: false, error: "Method Not Allowed" }), { status: 405, headers });
        }

        const body = await req.json();
        if (body.pass !== ADMIN_PASS) {
            return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), { status: 401, headers });
        }

        const current = await readSettings(store);
        const settings = {
            ...current,
            imageModel: normalizeImageModel(body.imageModel),
            updatedAt: new Date().toISOString()
        };

        await store.setJSON(SETTINGS_KEY, settings);
        return new Response(JSON.stringify({ ok: true, settings }), { status: 200, headers });
    } catch (err) {
        console.error("Error handling app settings:", err);
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers });
    }
};

export const config = {
    path: "/api/app-settings"
};
