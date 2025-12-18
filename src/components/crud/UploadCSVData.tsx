"use client";

import { useState } from "react";
import { endpoints } from "@/data/endpoints";
import { Fetch } from "@/hooks/apiUtils";

interface UploadCSVDataProps {
  setFilteredData: (data: any[]) => void;
  setPaginate: (pagination: any) => void;
  onClose: () => void;
  formType: string; // Added prop to select the endpoint
}

export default function UploadCSVData({ setFilteredData, setPaginate, formType, onClose }: UploadCSVDataProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;

    if (selectedFile && !selectedFile.name.endsWith(".xlsx")) {
      setError("Only .xlsx files are allowed");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select an Excel (.xlsx) file");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/ships/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      // Fetch updated data from endpoint
      if (!formType || !endpoints[formType]) {
        throw new Error("Invalid formType for fetching data.");
      }

      const fetchUrl = endpoints[formType].fetchAll;
      const resp: any = await Fetch(fetchUrl, {}, 5000, true, false);

      if (resp?.success) setFilteredData(resp?.data?.result || []);
      if (resp?.success && resp?.data?.pagination) setPaginate(resp?.data?.pagination);

      setSuccess(data.message || "File uploaded successfully!");
      setFile(null);
      setTimeout(() => {
        onClose()
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto rounded-xl bg-white p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-center text-gray-800">
        Upload Ships Excel
      </h2>
      <p className="text-center text-sm text-gray-500 mb-6">
        Upload an <span className="font-medium">.xlsx</span> file to import ship records
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* File Upload Box */}
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-6 text-center hover:bg-blue-100 transition">
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="hidden"
          />

          <svg
            className="mb-3 h-8 w-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16v-8m0 0-3 3m3-3 3 3m4 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2v-1"
            />
          </svg>

          <p className="text-sm font-medium text-gray-700">
            {file ? file.name : "Click to select Excel file"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Only .xlsx files are supported
          </p>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-lg px-4 py-2 font-semibold text-white transition
              ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            }
            `}
        >
          {loading ? "Uploading..." : "Upload File"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-4 rounded-lg bg-green-100 px-4 py-2 text-sm text-green-700">
          {success}
        </div>
      )}
    </div>
  );
}
