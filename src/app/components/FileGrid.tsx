"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

interface FileInfo {
  name: string;
  url: string;
  type: "image" | "video" | "other";
}

export default function FileGrid() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [bucket, setBucket] = useState<string | null>(null);

  useEffect(() => {
    const storedBucket = localStorage.getItem("selectedBucket");
    if (storedBucket) {
      setBucket(storedBucket);
      fetchFiles(storedBucket);
    }

    const handleBucketChange = () => {
      const newBucket = localStorage.getItem("selectedBucket");
      if (newBucket) {
        setBucket(newBucket);
        fetchFiles(newBucket);
      }
    };

    window.addEventListener("bucketChanged", handleBucketChange);

    return () => {
      window.removeEventListener("bucketChanged", handleBucketChange);
    };
  }, []);

  const fetchFiles = async (bucket: string) => {
    try {
      const response = await fetch(
        `/api/oss?action=listFiles&bucket=${bucket}`
      );
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  if (!bucket) {
    return <div>Please select a bucket to view files.</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((file) => (
        <Card key={file.name} className="overflow-hidden">
          <CardContent className="p-2">
            <AspectRatio ratio={1}>
              {file.type === "image" && (
                <Image
                  src={file.url}
                  alt={file.name}
                  fill
                  className="object-cover rounded-md"
                />
              )}
              {file.type === "video" && (
                <video
                  src={file.url}
                  className="w-full h-full object-cover rounded-md"
                  controls
                />
              )}
              {file.type === "other" && (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
                  <span className="text-sm text-gray-500">{file.name}</span>
                </div>
              )}
            </AspectRatio>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
