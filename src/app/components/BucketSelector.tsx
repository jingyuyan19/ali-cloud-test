import OSS from "ali-oss";
import ClientBucketSelector from "./ClientBucketSelector";

async function getBuckets() {
  const ossClient = new OSS({
    region: "oss-cn-beijing",
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  });

  try {
    const result = await ossClient.listBuckets();
    return result.buckets.map((bucket: { name: string }) => bucket.name);
  } catch (error) {
    console.error("Error fetching buckets:", error);
    return [];
  }
}

export default async function BucketSelector() {
  const bucketList = await getBuckets();

  return <ClientBucketSelector bucketList={bucketList} />;
}
