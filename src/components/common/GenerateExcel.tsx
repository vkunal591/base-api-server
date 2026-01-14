import React from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

const GenerateExcelButton = ({ data }: { data: any }) => {
  const handleGenerateExcel = () => {
    if (data.length === 0)
      return toast.warn("No data available to generate Excel file.");

    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Items");

      const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
      const filename = `${timestamp}.xlsx`;

      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error("Error generating Excel file:", error);
      toast.error(
        "An error occurred while generating the Excel file. Please try again."
      );
    }
  };

  return (
    <div className="flex">
      <button
        onClick={handleGenerateExcel}
        className="bg-secondary px-4 rounded-xl text-white"
      >
        Download Excel Formate 
      </button>
    </div>
  );
};

export default GenerateExcelButton;
