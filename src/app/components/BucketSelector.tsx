"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BucketSelector() {
  const [buckets, setBuckets] = useState<string[]>([]);
  const [selectedBucket, setSelectedBucket] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Fetch buckets from your API
    fetch("/api/oss?action=listBuckets")
      .then((res) => res.json())
      .then((data) => setBuckets(data.buckets));
  }, []);

  const handleBucketChange = async (value: string) => {
    setSelectedBucket(value);
    document.cookie = `selectedBucket=${value}; path=/; max-age=3600`; // Set cookie to expire in 1 hour
    console.log("Selected bucket:", value);
    router.refresh();
  };

  return (
    <Select onValueChange={handleBucketChange} value={selectedBucket}>
      <SelectTrigger>
        <SelectValue placeholder="Select a bucket" />
      </SelectTrigger>
      <SelectContent>
        {buckets.map((bucket) => (
          <SelectItem key={bucket} value={bucket}>
            {bucket}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
