import { NextResponse, NextRequest } from "next/server";
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

  if (action === "listBuckets") {
    try {
      const result = await ossClient.listBuckets();
      return NextResponse.json({
        buckets: result.buckets.map((b: any) => b.name),
      });
    } catch (error) {
      return NextResponse.json(
        { error: "Error listing buckets" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function POST(request: NextRequest) {
  console.log("POST request received");
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const bucket = formData.get("bucket") as string;

    console.log("Received file:", file?.name);
    console.log("Received bucket:", bucket);

    if (!file) {
      console.log("No file uploaded");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!bucket) {
      console.log("No bucket specified");
      return NextResponse.json(
        { error: "No bucket specified" },
        { status: 400 }
      );
    }

    const client = new OSS({
      ...ossClient.options,
      bucket: bucket,
    });

    console.log("OSS client configuration:", {
      region: client.options.region,
      accessKeyId: client.options.accessKeyId ? "***" : undefined,
      accessKeySecret: client.options.accessKeySecret ? "***" : undefined,
      bucket: bucket,
    });

    const buffer = await file.arrayBuffer();
    const objectName = `uploads/${Date.now()}-${file.name}`;
    const result = await client.put(objectName, Buffer.from(buffer));
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error uploading to OSS:", error);
    return NextResponse.json(
      {
        error: "Error uploading file",
        details: error.message || "Unknown error",
      },
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
