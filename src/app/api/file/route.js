import { NextResponse } from "next/server";
import { r2 } from "../../../hooks/r2";

export async function GET(req) {
  const url = new URL(req.url);
  const prefix = url.searchParams.get("prefix") || "";
  const maxKeys = parseInt(url.searchParams.get("limit") || "20", 10);
  const continuationToken = url.searchParams.get("token") || undefined;

  try {
    const data = await r2
      .listObjectsV2({
        Bucket: process.env.R2_BUCKET,
        Prefix: prefix,
        Delimiter: "/",
        MaxKeys: maxKeys,
        ContinuationToken: continuationToken,
      })
      .promise();

    const folders = (data.CommonPrefixes || []).map((f) => ({
      key: f.Prefix,
      type: "folder",
    }));

    const files = (data.Contents || [])
      .filter((f) => f.Key !== prefix)
      .map((f) => ({
        key: f.Key,
        size: f.Size,
        modified: f.LastModified,
        type: "file",
      }));

    return NextResponse.json({
      folders,
      files,
      nextToken: data.NextContinuationToken || null,
    });
  } catch (err) {
    console.error("List error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { key, type, action } = body;

    if (action === "delete") {
      if (type === "file") {
        await r2.deleteObject({ Bucket: process.env.R2_BUCKET, Key: key }).promise();
      } else if (type === "folder") {
        const list = await r2.listObjectsV2({ Bucket: process.env.R2_BUCKET, Prefix: key }).promise();
        if (list.Contents && list.Contents.length > 0) {
          const objects = list.Contents.map((obj) => ({ Key: obj.Key }));
          await r2.deleteObjects({ Bucket: process.env.R2_BUCKET, Delete: { Objects: objects } }).promise();
        }
      }
    } else if (action === "createFolder") {
      await r2.putObject({
        Bucket: process.env.R2_BUCKET,
        Key: key.endsWith("/") ? key : key + "/",
      }).promise();
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
