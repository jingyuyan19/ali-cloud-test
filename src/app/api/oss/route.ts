import { NextResponse } from "next/server";
import OSS from "ali-oss";

const ossClient = new OSS({
  region: "oss-cn-beijing",
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const bucket = searchParams.get("bucket");

  if (action === "listFiles" && bucket) {
    try {
      const client = new OSS({
        ...ossClient.options,
        bucket: bucket,
      });
      const result = await client.list();
      const files = await Promise.all(
        result.objects.map(async (obj: any) => ({
          name: obj.name,
          url: await client.signatureUrl(obj.name, { expires: 3600 }), // URL valid for 1 hour
          type: getFileType(obj.name),
        }))
      );
      return NextResponse.json({ files });
    } catch (error) {
      return NextResponse.json(
        { error: "Error listing files" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function POST(request: Request) {
  const { bucket, fileName, fileContent } = await request.json();

  if (!bucket || !fileName || !fileContent) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const client = new OSS({
      ...ossClient.options,
      bucket: bucket,
    });
    await client.put(fileName, Buffer.from(fileContent));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}

function getFileType(fileName: string): "image" | "video" | "other" {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) return "image";
  if (["mp4", "webm", "ogg"].includes(ext || "")) return "video";
  return "other";
}
