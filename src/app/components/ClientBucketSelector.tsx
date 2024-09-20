"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientBucketSelectorProps {
  bucketList: string[];
}

export default function ClientBucketSelector({
  bucketList,
}: ClientBucketSelectorProps) {
  const [selectedBucket, setSelectedBucket] = useState("");

  useEffect(() => {
    const storedBucket = localStorage.getItem("selectedBucket");
    if (storedBucket) {
      setSelectedBucket(storedBucket);
    }
  }, []);

  const handleBucketChange = (newBucket: string) => {
    setSelectedBucket(newBucket);
    localStorage.setItem("selectedBucket", newBucket);
    window.dispatchEvent(new Event("bucketChanged"));
  };

  return (
    <Select onValueChange={handleBucketChange} value={selectedBucket}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a bucket" />
      </SelectTrigger>
      <SelectContent>
        {bucketList.map((bucket) => (
          <SelectItem key={bucket} value={bucket}>
            {bucket}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
