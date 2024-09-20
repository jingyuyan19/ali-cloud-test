"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const bucket = localStorage.getItem("selectedBucket");
    if (!bucket) {
      alert("Please select a bucket first");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileContent = e.target?.result as string;
      try {
        const response = await fetch("/api/oss", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bucket,
            fileName: file.name,
            fileContent: fileContent.split(",")[1], // Remove data URL prefix
          }),
        });
        if (response.ok) {
          alert("File uploaded successfully");
          setFile(null);
        } else {
          alert("Error uploading file");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center space-x-2">
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!file}>
        Upload
      </Button>
    </div>
  );
}
