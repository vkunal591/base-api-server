import { FormField } from "@/hooks/types";

export const ShipType: FormField[] = [
  { type: "br", name: "shipDetails", label: "Ship Details", widthFull: true },
  {
    name: "vesselName",
    type: "text",

    label: "Vessel Name",
    placeholder: "Enter Vessel Name",
  },
  {
    name: "vesselImoNo",
    type: "text",

    label: "Vessel (IMO NO)",
    placeholder: "Enter Vessel IMO No",
  },
  {
    name: "companyName",
    type: "text",

    label: "Company Name",
    placeholder: "Enter company name",
  },
  {
    name: "yardName",
    type: "text",

    label: "Yard Name",
    placeholder: "Enter yard name",
  },
  {
    name: "repairedMonth",
    type: "text",
    label: "Repaired Month",
    placeholder: "Enter repaired month",
  },
  {
    name: "arrival",
    type: "date",
    label: "Arrival Date",
    placeholder: "Enter repaired month",
  },
  {
    name: "departure",
    type: "date",
    label: "Departure Date",
    placeholder: "Enter repaired month",
  },
  {
    type: "br",
    name: "sudToOwner",
    label: "SUD Invoice To Owner (USD) CR",
    widthFull: true,
  },
  {
    name: "invoiceNumber",
    type: "text",

    label: "Invoice Number",
    placeholder: "Enter invoice number",
  },

  {
    name: "sudInvoiceToOwners",
    type: "text",

    label: "SUD Invoice to Owners (USD) CR",
    placeholder: "Enter SUD Invoice Amount",
  },
  {
    name: "actualPaymentDate",
    type: "date",

    label: "Actual Payment Date",
    placeholder: "Select actual payment date",
  },
  {
    name: "actualPayment",
    type: "text",

    label: "Actual Payment",
    placeholder: "Enter actual payment",
  },
  {
    name: "bankCharges",
    type: "text",

    label: "Bank Charges",
    placeholder: "Enter bank charges",
  },
  {
    name: "dueDate",
    type: "date",

    label: "Due Date",
    placeholder: "Select due date",
  },
  {
    type: "br",
    name: "yardToSud",
    label: "Yard To SUD Payment (Invoice) Details",
    widthFull: true,
  },
  {
    name: "yardInvoiceToSUD",
    type: "text",
    label: "Yard Invoice To SUD",
    placeholder: "Enter yard invoice to SUD",
  },
  {
    name: "yardActualPaymentDate",
    type: "date",
    label: "Yard Actual Payment Date",
    placeholder: "Select yard actual payment date",
  },
  {
    name: "yardPaymentDueDate",
    type: "date",
    label: "Yard Payment Due Date",
    placeholder: "Enter yard payment due date",
  },
  {
    type: "br",
    name: "protsDetails",
    label: "Ports Details",
    widthFull: true,
  },
  {
    name: "portsNo",
    type: "text",
    label: "Ports No",
    placeholder: "Enter ports no",
  },
  {
    name: "portsName",
    type: "text",
    label: "Ports Name",
    placeholder: "Enter ports name",
  },
  {
    name: "portsWorkStartDate",
    type: "date",
    label: "Ports WorK Start Date",
    placeholder: "Ports Work Start Date",
  },
  {
    type: "br",
    name: "vendortosud",
    label: "Vendor To SUD Payment (Invoice) Details",
    widthFull: true,
  },

  {
    name: "vendorDetails",
    type: "group",
    label: "Vendor Details",
    placeholder: "Enter Vendor Details",
    widthFull: true,
    fields: [
      {
        name: "vendorInvoiceToSUD",
        type: "text",
        label: "Vendor Invoice To SUD",
        placeholder: "Enter vendor invoice to SUD",
      },
      {
        name: "vendorActualPaymentDate",
        type: "date",

        label: "Vendor Actual Payment Date",
        placeholder: "Select vendor actual payment date",
      },
      {
        name: "vendorPaymentDueDate",
        type: "text",

        label: "Vendor Name",
        placeholder: "Select vendor payment due date",
      },
    ],
  },
  {
    name: "remarks",
    type: "textarea",
    label: "Remarks",
    placeholder: "Enter remarks",
    widthFull: true,
  },
];
