import { S3 } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;

  const s3Client = new S3({
    region: "eu-west-1",
    endpoint: "http://localhost:9000",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
    forcePathStyle: true,
  });

  try {
    const data = await s3Client.getObject({ Bucket: "media", Key: key });
    if (!data.Body) {
      return new NextResponse("Image not found", { status: 404 });
    }
    const body = await data.Body.transformToByteArray();
    const headers = new Headers();
    headers.set("Content-Type", data.ContentType || "image/jpeg");
    return new NextResponse(body, { status: 200, headers });
  } catch (error) {
    console.error("Error fetching image from S3:", error);
    return new NextResponse("Error fetching image from S3", { status: 500 });
  }
}
