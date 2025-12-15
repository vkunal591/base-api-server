"use client";
import Image from "next/image";
import { IoDocument, IoSend } from "react-icons/io5";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { handleDownloadPDF } from "@/hooks/pdfFormat";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import mongoose from "mongoose";

const InvoiceForm = ({ responseData }: any) => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    invoiceNumber: responseData?.invoiceNumber || "",
    invoiceType: responseData?.invoiceType || "",
    portsName: responseData?.portsName || "",
    invoiceDate: "",
    paymentNumber: "",
    to: responseData?.companyName || "",
    vesselImoNo: responseData?.vesselImoNo || "",
    vesselName: responseData?.vesselName || "",
    co: "",
    dueDate: dayjs(responseData?.dueDate).format("YYYY-MM-DD") || "",
    yardPaymentDueDate:
      dayjs(responseData?.yardPaymentDueDate).format("YYYY-MM-DD") || "",
    totalAmount: responseData?.sudInvoiceToOwners || "",
    totalAmountInWords: "",
    remarks: responseData?.remarks || "",
    businessMail: "",
    isASAgentOnly: false,
    customize: responseData?.customize || "",
    billingTo: {
      companyName: responseData?.companyName || "",
      streetAddress: responseData?.street || "",
      secondStreetAddress: responseData?.street || "",
      landmark: responseData?.landmark || "",
      city: responseData?.city || "",
      country: responseData?.country || "",
      pincode: responseData?.pinCode || "",
      email: responseData?.email || "",
      phoneNumber: responseData?.mobileNo || "",
    },
    billingFrom: {
      companyName: "",
      streetAddress: dayjs(responseData?.arrival).format('D MMMM YYYY') || "",
      landmark: dayjs(responseData?.departure).format('D MMMM YYYY') || "",
      city: "",
      country: "",
      pincode: "",
      email: "",
      phoneNumber: "",
    },
    bankDetails: {
      accountName: "",
      accountNumber: "",
      accountHolderName: "",
      swiftAddress: "",
      bankAddress: "",
    },
    workDetails: responseData?.workDetails || [
      { itemDesc: "", unit: "", unitCost: 0, quantity: 0, value: 0 },
    ],
    paymentStages: [
      {
        key: "1ST",
        payment: responseData?.billingFrom?.city || "",
        payBy: "",
        paymentDate: "",
      },
      {
        key: "2ND",
        payment: responseData?.billingFrom?.country || "",
        payBy: "",
        paymentDate: "",
      },
      {
        key: "3RD",
        payment: responseData?.billingFrom?.pincode || "",
        payBy: "",
        paymentDate: "",
      },
      {
        key: "4TH",
        payment: responseData?.billingFrom?.email || "",
        payBy: "",
        paymentDate: "",
      },
      {
        key: "5TH",
        payment: responseData?.billingFrom?.phoneNumber || "",
        payBy: "",
        paymentDate: "",
      },
      {
        key: "6TH",
        payment: responseData?.billingTo?.landmark || "",
        payBy: "",
        paymentDate: "",
      },
      {
        key: "7TH",
        payment: responseData?.billingTo?.city || "",
        payBy: "",
        paymentDate: "",
      },
      {
        key: "8TH",
        payment: responseData?.billingTo?.country || "",
        payBy: "",
        paymentDate: "",
      },
      {
        key: "9TH",
        payment: responseData?.billingTo?.pincode || "",
        payBy: "",
        paymentDate: "",
      },
      {
        key: "10TH",
        payment: responseData?.billingTo?.email || "",
        payBy: "",
        paymentDate: "",
      },
      {
        key: "FINAL",
        payment: responseData?.bankDetails?.accountName || "",
        payBy: "",
        paymentDate: "",
      },
    ],
  });

  useEffect(() => {
    if (responseData) {
      setFormData((prevData) => ({
        ...prevData,
        ...responseData,
        billingTo: { ...prevData?.billingTo, ...responseData?.billingTo },
        billingFrom: { ...prevData?.billingFrom, ...responseData?.billingFrom },
        bankDetails: { ...prevData?.bankDetails, ...responseData?.bankDetails },
        workDetails: responseData?.workDetails || prevData?.workDetails,
        isASAgentOnly: responseData?.isASAgentOnly || prevData?.isASAgentOnly,
        paymentStages: prevData?.paymentStages.map((stage, index) => ({
          ...stage,
          payment:
            index === 0
              ? responseData?.billingFrom?.city || stage?.payment
              : index === 1
                ? responseData?.billingFrom?.country || stage?.payment
                : index === 2
                  ? responseData?.billingFrom?.pincode || stage?.payment
                  : index === 3
                    ? responseData?.billingFrom?.email || stage?.payment
                    : index === 4
                      ? responseData?.billingFrom?.phoneNumber || stage?.payment
                      : index === 5
                        ? responseData?.billingTo?.landmark || stage?.payment
                        : index === 6
                          ? responseData?.billingTo?.city || stage?.payment
                          : index === 7
                            ? responseData?.billingTo?.country || stage?.payment
                            : index === 8
                              ? responseData?.billingTo?.pincode || stage?.payment
                              : index === 9
                                ? responseData?.billingTo?.email || stage?.payment
                                : index === 10
                                  ? responseData?.bankDetails?.accountName || stage?.payment
                                  : stage?.payment,
        })),
      }));
    }
  }, [responseData]);

  const


    handleChange = (e: any, workDetailIndex?: number) => {
      const { name, value, checked, type } = e?.target;
      const newValue = type === "checkbox" ? checked : value;

      setFormData((prevData) => {
        // Handle nested fields like billingTo, billingFrom, bankDetails
        if (name.startsWith("billingTo.")) {
          return {
            ...prevData,
            billingTo: {
              ...prevData.billingTo,
              [name.split(".")[1]]: value.toUpperCase(),
            },
          };
        }
        if (name.startsWith("billingFrom.")) {
          return {
            ...prevData,
            billingFrom: {
              ...prevData.billingFrom,
              [name.split(".")[1]]: value.toUpperCase(),
            },
          };
        }
        if (name.startsWith("bankDetails.")) {
          return {
            ...prevData,
            bankDetails: {
              ...prevData.bankDetails,
              [name.split(".")[1]]: value?.toUpperCase(),
            },
          };
        }
        // Handle workDetails fields
        if (name.startsWith("workDetails.")) {
          const field = name.split(".")[1];
          const updatedWorkDetails = [...prevData.workDetails];
          updatedWorkDetails[workDetailIndex!] = {
            ...updatedWorkDetails[workDetailIndex!],
            [field]:
              field === "unitCost" || field === "quantity" || field === "value"
                ? Number(value) || 0
                : value?.toUpperCase(),
          };
          return {
            ...prevData,
            workDetails: updatedWorkDetails,
          };
        }
        // Handle paymentStages fields
        if (name.startsWith("paymentStages[")) {
          const match = name.match(/paymentStages\[(\d+)\]\.(\w+)/);
          if (match) {
            const index = parseInt(match[1], 10);
            const field = match[2];
            const updatedPaymentStages = [...prevData.paymentStages];
            updatedPaymentStages[index] = {
              ...updatedPaymentStages[index],
              [field]: value?.toUpperCase(),
            };
            return {
              ...prevData,
              paymentStages: updatedPaymentStages,
            };
          }
        }

        if (name === "isASAgentOnly") {
          return {
            ...prevData,
            isASAgentOnly: newValue,
          };
        }
        // Handle top-level fields
        return {
          ...prevData,
          [name]: value?.toUpperCase(),
        };
      });
    };

  const handleAddWorkDetail = () => {
    setFormData((prevData) => ({
      ...prevData,
      workDetails: [
        ...prevData.workDetails,
        { itemDesc: "", unit: "", unitCost: 0, quantity: 0, value: 0 },
      ],
    }));
  };

  const handleRemoveWorkDetail = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      workDetails: prevData.workDetails.filter((_: any, i: any) => i !== index),
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const response = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      if (response.ok) {
        toast.success("Invoice Created");
        const fetchUrl = `/api/invoice?page=1&limit=10`;
        const resp = await fetch(fetchUrl);
        const data = await resp.json();
        router.push("/dashboard/billing");
      } else {
        toast.error(responseData?.message || "Something went wrong! Please check invoice number");
      }
    } catch (error: any) {
      console.error("Error: ", error);
      toast.error(error?.message || "Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedIndex = formData.paymentStages.findIndex(
    (stage) => stage.key === formData.paymentNumber
  );

  return (
    <div className="lg:flex lg:gap-4 p-2 px-2">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="lg:flex justify-between items-start gap-4">
            <div className="lg:w-2/3">
              <div className="flex mb-2">
                <label className="inline-block w-1/4 mb-1 text-sm">
                  Invoice Number:
                </label>
                <input
                  autoComplete="off"
                  placeholder="Enter invoice number"
                  className="w-3/4 text-primary outline text-sm outline-gray-100 px-4 py-1 placeholder:text-gray-400 bg-white rounded"
                  type="text"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="flex mb-2">
                <label className="inline-block w-1/4 mb-1 text-sm">
                  Invoice Type:
                </label>
                <select
                  autoComplete="off"
                  className="w-3/4 text-primary outline text-sm outline-gray-100 px-4 py-1 placeholder:text-gray-400 bg-white rounded"
                  name="invoiceType"
                  value={formData.invoiceType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Invoice Type</option>
                  <option value="PORTS">PORTS</option>
                  <option value="DOCK">DOCK</option>
                </select>
              </div>
              {formData.invoiceType === "DOCK" && (
                <div className="flex mb-2">
                  <label className="inline-block w-1/4 mb-1 text-sm">
                    Payment No:
                  </label>
                  <select
                    autoComplete="off"
                    className="w-3/4 text-primary outline text-sm outline-gray-100 px-4 py-1 placeholder:text-gray-400 bg-white rounded"
                    name="paymentNumber"
                    value={formData.paymentNumber}
                    onChange={handleChange}
                  >
                    <option value="">Select Payment Stage</option>
                    {formData.paymentStages.map((stage) => (
                      <option key={stage.key} value={stage.key}>
                        {stage.key}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex mb-2">
                <label className="inline-block w-1/4 mb-1 text-sm">To:</label>
                <input
                  autoComplete="off"
                  placeholder="Enter company name"
                  className="w-3/4 text-primary outline text-sm outline-gray-100 px-4 py-1 placeholder:text-gray-400 bg-white rounded"
                  type="text"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                />
              </div>

              {formData?.invoiceType === "PORTS" &&
                <div className="flex mb-2">
                  <label className="inline-block w-1/4 mb-1 text-sm">Remark & PO Number:</label>
                  <input
                    autoComplete="off"
                    placeholder="Enter remarks & po number"
                    className="w-3/4 text-primary outline text-sm outline-gray-100 px-4 py-1 placeholder:text-gray-400 bg-white rounded"
                    type="text"
                    name="portsName"
                    value={formData.portsName}
                    onChange={handleChange}
                  />
                </div>
              }
            </div>
            <div className="lg:w-2/3">
              <div className="flex mb-2">
                <label className="inline-block w-1/4 mb-1 text-sm">
                  Issued Date:
                </label>
                <input
                  autoComplete="off"
                  placeholder="Select issued date"
                  className="w-3/4 text-primary outline text-sm outline-gray-100 px-4 py-1 placeholder:text-gray-400 bg-white rounded"
                  type="date"
                  name="invoiceDate"
                  value={formData.invoiceDate}
                  onChange={handleChange}
                />
              </div>
              <div className="flex mb-2">
                <label className="inline-block w-1/4 mb-1 text-sm">
                  Vessel IMO Number:
                </label>
                <input
                  autoComplete="off"
                  placeholder="Enter vessel IMO number"
                  className="w-3/4 text-primary outline text-sm outline-gray-100 px-4 py-1 placeholder:text-gray-400 bg-white rounded"
                  type="text"
                  name="vesselImoNo"
                  value={formData.vesselImoNo}
                  onChange={handleChange}
                />
              </div>
              <div className="flex mb-2">
                <label className="inline-block w-1/4 mb-1 text-sm">
                  Vessel Name:
                </label>
                <input
                  autoComplete="off"
                  placeholder="Enter vessel name"
                  className="w-3/4 text-primary outline text-sm outline-gray-100 px-4 py-1 placeholder:text-gray-400 bg-white rounded"
                  type="text"
                  name="vesselName"
                  value={formData.vesselName}
                  onChange={handleChange}
                />
              </div>
              <div className="flex mb-2">
                <label className="inline-block w-1/4 mb-1 text-sm">C/O:</label>
                <input
                  autoComplete="off"
                  placeholder="Enter C/O"
                  className="w-3/4 text-primary outline text-sm outline-gray-100 px-4 py-1 placeholder:text-gray-400 bg-white rounded"
                  type="text"
                  name="co"
                  value={formData.co}
                  onChange={handleChange}
                />
              </div>
              {formData?.invoiceType === "PORTS" &&
                <div className="flex mb-2">
                  <label className="inline-block w-1/4 mb-1 text-sm">Email:</label>
                  <input
                    autoComplete="off"
                    placeholder="Enter enter email"
                    className="w-3/4 text-primary outline text-sm outline-gray-100 px-4 py-1 placeholder:text-gray-400 bg-white rounded"
                    type="text"
                    name="businessMail"
                    value={formData.businessMail}
                    onChange={handleChange}
                  />
                </div>}
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">Second Address:</h3>
            <input
              type="text"
              placeholder="Second Address"
              name="billingTo.secondStreetAddress"
              value={formData.billingTo.secondStreetAddress}
              onChange={handleChange}
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <h3 className="font-bold mb-2">Billing To Address:</h3>
            <input
              type="text"
              placeholder="Street Address"
              name="billingTo.streetAddress"
              value={formData.billingTo.streetAddress}
              onChange={handleChange}
              className="w-full p-2 mb-2 border border-gray-300 rounded"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 mt-4">
            <div>
              {formData.invoiceType === "DOCK" && (
                <>
                  <h3 className="font-bold mb-2">Invoice Details:</h3>
                  <input
                    type="text"
                    placeholder="Yard Name"
                    name="billingFrom.companyName"
                    value={formData.billingFrom.companyName}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Arrival Date"
                    name="billingFrom.streetAddress"
                    value={formData.billingFrom.streetAddress}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                  />
                </>
              )}
              {formData.paymentNumber === "FINAL" && (
                <input
                  type="text"
                  placeholder="Departure Date"
                  name="billingFrom.landmark"
                  value={formData.billingFrom.landmark}
                  onChange={handleChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
              )}
            </div>
          </div>

          {formData.invoiceType === "PORTS" && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">Work Details:</h3>
              {formData.workDetails.map((work: any, index: number) => (
                <div
                  key={index}
                  className="grid grid-cols-6 gap-2 mb-2 border p-2 rounded"
                >
                  <input
                    type="text"
                    placeholder="Item Description"
                    name="workDetails.itemDesc"
                    value={work.itemDesc}
                    onChange={(e) => handleChange(e, index)}
                    className="col-span-2 p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Unit"
                    name="workDetails.unit"
                    value={work.unit}
                    onChange={(e) => handleChange(e, index)}
                    className="col-span-1 p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Unit Cost"
                    name="workDetails.unitCost"
                    value={work.unitCost}
                    onChange={(e) => handleChange(e, index)}
                    className="col-span-1 p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    name="workDetails.quantity"
                    value={work.quantity}
                    onChange={(e) => handleChange(e, index)}
                    className="col-span-1 p-2 border border-gray-300 rounded"
                  />
                  <div className="col-span-1 flex items-center">
                    {/* <input
                      type="number"
                      placeholder="Value"
                      name="workDetails.value"
                      value={work.value}
                      onChange={(e) => handleChange(e, index)}
                      className="w-full p-2 border border-gray-300 rounded"
                    /> */}
                    {formData.workDetails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveWorkDetail(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddWorkDetail}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Work Detail
              </button>
            </div>
          )}

          <div className="mt-4">
            <h3 className="font-bold mb-2">Payment Terms:</h3>
            {formData.paymentNumber !== "FINAL" &&
              formData.invoiceType === "DOCK" &&
              formData.paymentStages
                .filter((stage) => stage.key === formData.paymentNumber)
                .map((stage, index) => (
                  <div key={stage.key} className="flex items-center gap-4 mb-2">
                    <input
                      type={
                        stage.key === "9TH" || stage.key === "10TH"
                          ? "email"
                          : "text"
                      }
                      placeholder={stage.key}
                      name={`paymentStages[${formData.paymentStages.findIndex(
                        (s) => s.key === stage.key
                      )}].payment`}
                      value={stage.payment}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Pay By"
                      name={`paymentStages[${formData.paymentStages.findIndex(
                        (s) => s.key === stage.key
                      )}].payBy`}
                      value={stage.payBy}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="date"
                      placeholder="Payment Date"
                      name={`paymentStages[${formData.paymentStages.findIndex(
                        (s) => s.key === stage.key
                      )}].paymentDate`}
                      value={stage.paymentDate}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                ))}
            {formData.paymentNumber === "FINAL" &&
              formData.invoiceType === "DOCK" &&
              formData.paymentStages.map((stage, index) => {
                if (selectedIndex >= index) {
                  return (
                    <div
                      key={stage.key}
                      className="flex items-center gap-4 mb-2"
                    >
                      <input
                        type={
                          stage.key === "9TH" || stage.key === "10TH"
                            ? "email"
                            : "text"
                        }
                        placeholder={stage.key}
                        name={`paymentStages[${index}].payment`}
                        value={stage.payment}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Pay By"
                        name={`paymentStages[${index}].payBy`}
                        value={stage.payBy}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      <input
                        type="date"
                        placeholder="Payment Date"
                        name={`paymentStages[${index}].paymentDate`}
                        value={stage.paymentDate}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  );
                }
                return null;
              })}
          </div>

          <div className="bg-primary text-white mt-4 p-4 rounded mb-6">
            <div className="flex justify-between mb-2">
              <label className="inline-block w-2/4 mb-1 text-sm font-bold">
                Due Date:
              </label>
              <input
                placeholder="Select due date"
                className="lg:w-2/4 text-primary outline text-sm outline-gray-100 px-4 py-2 placeholder:text-gray-400 bg-white rounded"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label className="inline-block lg:w-2/4 mb-1 text-md font-semibold">
                Total Amount ($):
              </label>
              <input
                autoComplete="off"
                placeholder="Enter total amount"
                className="lg:w-2/4 text-primary outline text-sm outline-gray-100 px-4 py-2 placeholder:text-gray-400 bg-white rounded"
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label className="inline-block lg:w-2/4 mb-1 text-md font-semibold">
                Total Amount in Words (USD):
              </label>
              <input
                autoComplete="off"
                placeholder="Enter total amount in words"
                className="lg:w-2/4 text-primary outline text-sm outline-gray-100 px-4 py-2 placeholder:text-gray-400 bg-white rounded"
                type="text"
                name="totalAmountInWords"
                value={formData.totalAmountInWords}
                onChange={handleChange}
              />
            </div>
          </div>

          {formData.paymentNumber === "FINAL" && (
            <div>
              <div>
                <h2 className="mb-2">Client Signature:</h2>
                <input
                  type="text"
                  placeholder="Enter name for client signature"
                  name="billingTo.companyName"
                  value={formData.billingTo.companyName}
                  onChange={handleChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <h2 className="mb-2">Costomize (Optional):</h2>
                <input
                  type="text"
                  placeholder="Enter name for client signature"
                  name="customize"
                  value={formData.customize}
                  onChange={handleChange}
                  className="w-full p-2 mb-2 border border-gray-300 rounded"
                />
              </div>

              {/* Checkbox for AS Agents only */}
              <div className="mt-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="isASAgentOnly"
                    checked={formData.isASAgentOnly || false}
                    onChange={(e) => handleChange({
                      target: {
                        name: 'isASAgentOnly',
                        value: e.target.checked
                      }
                    })}
                    className="form-checkbox"
                  />
                  <span className="ml-2">AS Agents Only</span>
                </label>
              </div>
            </div>
          )}


          <div className="lg:flex lg:justify-between">
            <div className="flex space-x-4 mt-4 ml-auto">
              <button
                className="bg-primary flex text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={() => handleDownloadPDF(formData)}
                type="button"
              >
                Save As PDF
                <IoDocument width={15} height={15} className="m-auto ml-2" />
              </button>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="p-2 bg-primary flex text-white rounded"
                type="submit"
                disabled={submitting}
              >
                Save Invoice
                <IoSend width={15} height={15} className="m-auto ml-2" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
