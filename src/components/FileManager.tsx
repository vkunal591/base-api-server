"use client";
import { useEffect, useState } from "react";

interface FileType {
  key: string;
  url: string;
  size: number;
  modified: string;
}

export default function FilesList() {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch files from API
  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await fetch("/api/file"); // make sure API route is /api/files
        const data = await res.json();

        if (data.files) {
          setFiles(data.files);
        }
      } catch (err) {
        console.error("Error fetching files:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFiles();
  }, []);

  if (loading) return <p>Loading files...</p>;
  if (files.length === 0) return <p>No files found.</p>;

  return (
    <div className="p-4 border rounded space-y-2">
      <h2 className="text-lg font-bold mb-2">Uploaded Files</h2>
      <ul className="space-y-1">
        {files.map((file) => (
          <li key={file.key} className="flex justify-between items-center border p-2 rounded">
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline truncate"
              title={file.key}
            >
              {file.key}
            </a>
            <span className="text-sm text-gray-500">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
