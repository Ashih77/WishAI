import { getStore } from "@netlify/blobs";

const DEFAULT_CYCLE = {
    id: "baseline",
    label: "الدورة الحالية",
    startedAt: 0,
    createdAt: null,
    notes: ""
};

function readJson(store, key, fallback) {
    return store.get(key, { type: "json" }).catch(() => fallback);
}

function getTimestamp(item) {
    return Number(item?.metadata?.timestamp || 0);
}

function summarize(items = []) {
    const rated = items.filter(item => item.metadata?.rating);
    const aiItems = items.filter(item => item.metadata?.ai_score !== undefined);
    const adherenceItems = aiItems.filter(item => item.metadata?.ai_adherence);
    const chipCounts = {};
    const advice = [];

    rated.forEach(item => {
        (item.metadata?.chips || []).forEach(chip => {
            chipCounts[chip] = (chipCounts[chip] || 0) + 1;
        });
    });

    aiItems.forEach(item => {
        (item.metadata?.ai_advice || []).forEach(entry => {
            if (entry && advice.length < 30) advice.push(String(entry));
        });
    });

    const ratingSum = rated.reduce((sum, item) => sum + Number(item.metadata.rating || 0), 0);
    const aiScoreSum = aiItems.reduce((sum, item) => sum + Number(item.metadata.ai_score || 0), 0);

    return {
        totalGenerations: items.length,
        totalRatings: rated.length,
        averageRating: rated.length ? Number((ratingSum / rated.length).toFixed(2)) : 0,
        totalAiEvaluations: aiItems.length,
        averageAiScore: aiItems.length ? Number((aiScoreSum / aiItems.length).toFixed(2)) : 0,
        adherenceRate: aiItems.length ? Number(((adherenceItems.length / aiItems.length) * 100).toFixed(1)) : 0,
        issueCounts: chipCounts,
        advice
    };
}

async function listGenerations() {
    const store = getStore("wishai_generations", { consistency: "strong" });
    const { blobs } = await store.list();
    const generations = [];

    for (const blob of blobs) {
        const { metadata } = await store.getMetadata(blob.key);
        generations.push({ key: blob.key, metadata: metadata || {} });
    }

    return generations.sort((a, b) => getTimestamp(b) - getTimestamp(a));
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

    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });

    try {
        const url = new URL(req.url);
        const settingsStore = getStore("wishai_settings", { consistency: "strong" });
        const archiveStore = getStore("wishai_admin_archives", { consistency: "strong" });
        const settings = {
            ...(await readJson(settingsStore, "app", {})),
        };
        const activeCycle = settings.activeCycle || DEFAULT_CYCLE;

        if (req.method === "GET") {
            const pass = url.searchParams.get("pass");
            if (pass !== ADMIN_PASS) {
                return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), { status: 401, headers });
            }

            const { blobs } = await archiveStore.list();
            const archives = [];
            for (const blob of blobs) {
                const archive = await archiveStore.get(blob.key, { type: "json" }).catch(() => null);
                if (archive) archives.push(archive);
            }
            archives.sort((a, b) => Number(b.createdAtMs || 0) - Number(a.createdAtMs || 0));

            return new Response(JSON.stringify({ ok: true, activeCycle, archives }), { status: 200, headers });
        }

        if (req.method !== "POST") {
            return new Response(JSON.stringify({ ok: false, error: "Method Not Allowed" }), { status: 405, headers });
        }

        const body = await req.json();
        if (body.pass !== ADMIN_PASS) {
            return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), { status: 401, headers });
        }

        const now = Date.now();
        const generations = await listGenerations();
        const periodItems = generations.filter(item => getTimestamp(item) >= Number(activeCycle.startedAt || 0));
        const archiveId = `archive-${now}`;
        const nextCycleId = `cycle-${now}`;
        const archive = {
            id: archiveId,
            label: body.archiveLabel || activeCycle.label || "دورة تطوير محفوظة",
            createdAt: new Date(now).toISOString(),
            createdAtMs: now,
            periodStart: Number(activeCycle.startedAt || 0),
            periodEnd: now,
            previousCycle: activeCycle,
            reportNotes: body.reportNotes || "",
            improvementNotes: body.improvementNotes || "",
            summary: summarize(periodItems),
            itemKeys: periodItems.map(item => item.key)
        };

        const nextCycle = {
            id: nextCycleId,
            label: body.nextLabel || `دورة تطوير ${new Date(now).toLocaleDateString("ar-EG")}`,
            startedAt: now,
            createdAt: new Date(now).toISOString(),
            previousArchiveId: archiveId,
            notes: body.improvementNotes || ""
        };

        await archiveStore.setJSON(archiveId, archive);
        await settingsStore.setJSON("app", {
            ...settings,
            activeCycle: nextCycle,
            updatedAt: new Date(now).toISOString()
        });

        return new Response(JSON.stringify({ ok: true, activeCycle: nextCycle, archive }), { status: 200, headers });
    } catch (err) {
        console.error("Error handling admin cycle:", err);
        return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500, headers });
    }
};

export const config = {
    path: "/api/admin-cycle"
};
