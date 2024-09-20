"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FileUploadForm({ bucket }: { bucket: string }) {
  console.log("Received bucket in FileUploadForm:", bucket);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log("Bucket prop in FileUploadForm:", bucket);
  }, [bucket]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      console.log("File selected:", e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    console.log("Form submitted, file:", file?.name, "bucket:", bucket);
    if (!file || !bucket) {
      console.log(
        "No file or bucket selected. File:",
        !!file,
        "Bucket:",
        bucket
      );
      setError("Please select a file and a bucket");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", bucket);

    try {
      console.log("Sending request to /api/oss");
      const response = await fetch("/api/oss", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.ok) {
        console.log("Upload success");
        router.refresh();
        setFile(null);
      } else {
        console.error("Upload failed", responseData);
        setError(
          `Upload failed: ${responseData.error}. Details: ${responseData.details}`
        );
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Error uploading file. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input type="file" onChange={handleFileChange} />
      <Button type="submit" disabled={!file || !bucket}>
        Upload
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}
