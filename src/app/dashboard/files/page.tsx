"use client";

import Wrapper from "@/components/common/Wrapper";
import { useState, useEffect } from "react";

interface FileType {
  key: string;
  size?: number;
  modified?: string;
  type: "file" | "folder";
}

export default function CRMFileManager() {
  const [currentPrefix, setCurrentPrefix] = useState("");
  const [folders, setFolders] = useState<FileType[]>([]);
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [nextToken, setNextToken] = useState<string | null>(null);

  const fetchFiles = async (prefix = "", token: string | null = null) => {
    setLoading(true);
    try {
      const url = new URL(`/api/file`, location.origin);
      url.searchParams.append("prefix", prefix);
      if (token) url.searchParams.append("token", token);

      const res = await fetch(url.toString());
      const data = await res.json();

      setFolders(data.folders || []);
      setFiles(data.files || []);
      setNextToken(data.nextToken || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(currentPrefix);
  }, [currentPrefix]);

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("file", selectedFiles[i]);
    }

    const res = await fetch(`/api/upload?prefix=${currentPrefix}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (data.success) {
      setSelectedFiles(null);
      setShowUploadModal(false);
      fetchFiles(currentPrefix);
    } else {
      alert("Upload failed: " + data.error);
    }
  };

  const handleDownload = (key: string) => {
    const link: any = document.createElement("a");
    link.href = `/api/file/${encodeURIComponent(key)}`;
    link.download = key.split("/").pop();
    link.click();
  };

  const handleDelete = async (key: string, type: "file" | "folder") => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    const res = await fetch("/api/file", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, type, action: "delete" }),
    });
    const data = await res.json();
    if (data.success) fetchFiles(currentPrefix);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName) return;
    const key = currentPrefix + newFolderName + "/";
    const res = await fetch("/api/file", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, type: "folder", action: "createFolder" }),
    });
    const data = await res.json();
    if (data.success) {
      fetchFiles(currentPrefix);
      setShowFolderModal(false);
      setNewFolderName("");
    } else {
      alert("Failed to create folder: " + data.error);
    }
  };

  const breadcrumbs = currentPrefix
    ? currentPrefix.split("/").filter(Boolean).map((x, i, arr) => ({
      name: x,
      path: arr.slice(0, i + 1).join("/") + "/",
    }))
    : [];

  const filteredFiles = files.filter((f) => f.key.toLowerCase().includes(search.toLowerCase()));
  const filteredFolders = folders.filter((f) => f.key.toLowerCase().includes(search.toLowerCase()));

  return (
    <Wrapper>
      <div className="p-4 mx-auto space-y-6">
        {/* Breadcrumbs */}
        <nav className="text-gray-700 flex space-x-2">
          <span className="cursor-pointer hover:underline" onClick={() => setCurrentPrefix("")}>
            Home
          </span>
          {breadcrumbs.map((b) => (
            <span key={b.path}>
              /{" "}
              <span className="cursor-pointer hover:underline" onClick={() => setCurrentPrefix(b.path)}>
                {b.name}
              </span>
            </span>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex justify-between items-center mb-4 space-x-2">
          <input
            type="text"
            placeholder="Search files/folders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-1/2"
          />
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFolderModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              New Folder
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Upload Files
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFolders.map((f) => (
                <tr key={f.key} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4" onClick={() => setCurrentPrefix(f.key)}>
                    📁 {f.key.split("/").slice(-2, -1)[0]}
                  </td>
                  <td className="px-6 py-4">Folder</td>
                  <td className="px-6 py-4">-</td>
                  <td className="px-6 py-4">-</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(f.key, "folder")}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredFiles.map((f) => (
                <tr key={f.key} className="hover:bg-gray-50">
                  <td className="px-6 py-4">📄 {f.key.split("/").pop()}</td>
                  <td className="px-6 py-4">File</td>
                  <td className="px-6 py-4">{f.size ? (f.size / 1024).toFixed(1) + " KB" : "-"}</td>
                  <td className="px-6 py-4">{f.modified ? new Date(f.modified).toLocaleString() : "-"}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleDownload(f.key)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(f.key, "file")}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-2">
          {nextToken && (
            <button
              onClick={() => fetchFiles(currentPrefix, nextToken)}
              className="px-4 py-2 border rounded"
            >
              Next
            </button>
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/2">
              <h2 className="text-lg font-bold mb-4">Upload Files</h2>
              <input
                type="file"
                multiple
                onChange={(e) => setSelectedFiles(e.target.files)}
                className="border p-2 rounded w-full mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 rounded border"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFiles(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-blue-500 text-white"
                  onClick={handleUpload}
                  disabled={!selectedFiles || selectedFiles.length === 0}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Folder Modal */}
        {showFolderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-lg font-bold mb-4">Create New Folder</h2>
              <input
                type="text"
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="border p-2 rounded w-full mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 rounded border"
                  onClick={() => {
                    setShowFolderModal(false);
                    setNewFolderName("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-green-500 text-white"
                  onClick={handleCreateFolder}
                  disabled={!newFolderName}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
}
