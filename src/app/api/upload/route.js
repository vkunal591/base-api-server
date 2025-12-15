// import { NextResponse } from "next/server";
// import { r2 } from "../../../hooks/r2";

// export async function POST(req) {
//   try {
//     const form = await req.formData();
//     const file = form.get("file");

//     if (!file) {
//       return NextResponse.json({ error: "No file provided" }, { status: 400 });
//     }

//     const buffer = Buffer.from(await file.arrayBuffer());
//     const filename = `${Date.now()}-${file.name}`;

//     // Upload to R2
//     const upload = await r2.putObject({
//       Bucket: process.env.R2_BUCKET,
//       Key: filename,
//       Body: buffer,
//       ContentType: file.type,
//     }).promise();

//     // Public URL
//     const url = `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev/${filename}`;

//     return NextResponse.json({
//       success: true,
//       filename,
//       url,
//       etag: upload.ETag ?? null
//     });

//   } catch (error) {
//     console.error("R2 upload error:", error);
//     return NextResponse.json(
//       { error: "Upload failed", details: error.message },
//       { status: 500 }
//     );
//   }
// }
// /app/api/upload/route.ts
import { NextResponse } from "next/server";
import { r2 } from "../../../hooks/r2";

export async function POST(req) {
  try {
    const url = new URL(req.url);
    const prefix = url.searchParams.get("prefix") || "";

    const form = await req.formData();
    const files = form.getAll("file");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadedFiles = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = file.name;
      const key = prefix + filename;

      await r2.putObject({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }).promise();

      uploadedFiles.push(filename);
    }

    return NextResponse.json({ success: true, files: uploadedFiles });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
