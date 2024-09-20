"use client";

import { useState, useEffect } from "react";

export default function FileList() {
  const [fileList, setFileList] = useState<string[]>([]);
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
      setFileList(data.files.map((file: { name: string }) => file.name));
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  if (!bucket) {
    return <div>Please select a bucket to view files.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Files in Bucket: {bucket}</h2>
      {fileList.length === 0 ? (
        <p>No files found in this bucket.</p>
      ) : (
        <ul>
          {fileList.map((fileName) => (
            <li key={fileName}>{fileName}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
