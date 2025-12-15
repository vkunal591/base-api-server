import { NextResponse } from "next/server";
import { r2 } from "../../../../hooks/r2";

export const runtime = "nodejs"; // REQUIRED


export async function GET(req,context) {
  // Await params before using
  const params = await context.params;
  const key = decodeURIComponent(params.id);
  console.log(params, key)
  if (!key) {
    return NextResponse.json(
      { error: "No file key provided" },
      { status: 400 }
    );
  }

  const fileName = key.split("/").pop();

  try {
    const object = await r2
      .getObject({
        Bucket: process.env.R2_BUCKET,
        Key: key,
      })
      .promise();

    if (!object.Body) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return new Response(object.Body, {
      headers: {
        "Content-Type": object.ContentType || "application/pdf",
        "Content-Disposition": `inline; filename="${fileName}"`,
      },
    });
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json(
      { error: "Failed to load file" },
      { status: 500 }
    );
  }
}
