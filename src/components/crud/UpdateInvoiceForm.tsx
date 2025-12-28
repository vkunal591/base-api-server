import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function UpdateInvoiceForm({
  isOpen,
  onClose,
  invoiceId,
  currentStatus,
  fetchData,
  currentDueDate,
  currentYardPaymentDueDate,
}: any) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [dueDate, setDueDate] = useState(currentDueDate);
  const [yardPaymentDueDate, setYardPaymentDueDate] = useState(
    currentYardPaymentDueDate
  );
  const [error, setError] = useState("");
  useEffect(() => {
    if (currentDueDate) {
      setDueDate(dayjs(currentDueDate).format("YYYY-MM-DD"));
      setYardPaymentDueDate(dayjs(currentYardPaymentDueDate).format("YYYY-MM-DD"));
    }
  }, [currentDueDate]);

  console.log(currentDueDate);
  const handleUpdate = async () => {
    console.log(currentDueDate);

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/invoice/${invoiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, dueDate, yardPaymentDueDate }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Invoice Updated Successfully");
        setDueDate("");
        setStatus("");
        setYardPaymentDueDate("");
        fetchData();
        onClose(true); // Close modal & trigger refresh if needed
      }
      if (!res.ok) throw new Error(data.error || "Failed to update status");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-[5000000] inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Update Invoice Status</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <label className="block text-sm text-left font-medium text-gray-700">
          Status
        </label>
        <select
          className="w-full mt-1 p-2 border rounded mb-4"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Overdue">Overdue</option>
        </select>
        <div className="flex items-center justify-between gap-4 mb-4">
          <label className="block text-sm text-left font-medium text-gray-700">
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className=""
            placeholder="Due Date"
          />
        </div>
        {/* <div className="flex items-center justify-between gap-4 mb-4">
          <label className="block text-sm text-left font-medium text-gray-700">
            Yard Payment Due Date
          </label>
          <input
            type="date"
            name="yardPaymentDueDate"
            value={yardPaymentDueDate}
            onChange={(e) => setYardPaymentDueDate(e.target.value)}
            className=""
            placeholder="Yard Payment Due Date"
          />
        </div> */}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => onClose(false)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
