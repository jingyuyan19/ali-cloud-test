import BucketSelector from "../components/BucketSelector";
import FileUploader from "../components/FileUploader";
import FileGrid from "../components/FileGrid";

export default async function TestPage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">OSS File Manager</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Bucket Selection</h2>
          <BucketSelector />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">File Upload</h2>
          <FileUploader />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Files</h2>
        <FileGrid />
      </div>
    </main>
  );
}
