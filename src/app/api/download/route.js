// /app/api/download/route.ts
import { NextResponse } from "next/server";
import { r2 } from "../../../hooks/r2";

export async function GET(req) {
    const url = new URL(req.url);
    const key = url.searchParams.get("key");

    if (!key) return NextResponse.json({ error: "No key provided" }, { status: 400 });

    const signedUrl = await r2.getSignedUrl("getObject", {
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Expires: 60 * 5, // 5 minutes
    });

    return NextResponse.json({ url: signedUrl });
}
