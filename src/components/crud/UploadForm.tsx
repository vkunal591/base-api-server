"use client";
import { useState } from "react";

interface Props {
  onUpload: (files: FileList) => void;
}

export default function UploadForm() {
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const input: any = e.currentTarget.querySelector('input[name="file"]') as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      alert("No file selected");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setLoading(false);

      // onUpload(input.files);
      alert("Uploaded ✔ Filename: " + data.filename);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleUpload} className="p-4 border rounded">
      <input type="file" name="file" required />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 px-4 py-2 text-white rounded ml-2"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}
