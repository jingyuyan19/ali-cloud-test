import { cookies } from "next/headers";
import FileUploadForm from "./FileUploadForm";

export default function FileUploader() {
  const cookieStore = cookies();
  const selectedBucket = cookieStore.get("selectedBucket")?.value || "";
  console.log("Selected bucket in FileUploader:", selectedBucket);

  return (
    <div>
      <h2>File Uploader</h2>
      <p>Selected Bucket: {selectedBucket}</p>
      <FileUploadForm bucket={selectedBucket} />
    </div>
  );
}
