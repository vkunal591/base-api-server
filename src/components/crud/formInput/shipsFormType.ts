import { FormField } from "@/hooks/types";
import { includes } from "@/hooks/polyfills";
import { bankNames, countries } from "@/data/data";
import { getSelectFormattedData } from "@/hooks/general";

export const ShipType: FormField[] = [
  { type: "br", name: "shipDetails", label: "Ship Details", widthFull: true },
  {
    name: "vesselImoNo",
    type: "text",
    // required: true,
    label: "Vessel (IMO NO)",
    placeholder: "Enter Vessel IMO No",
  },
  {
    name: "companyName",
    type: "text",
    // required: true,
    label: "Company Name",
    placeholder: "Enter company name",
  },
  {
    name: "gstNo",
    type: "text",
    label: "Goods and Services Tax Number",
    placeholder: "Enter GST Tax Number",
  },
  {
    name: "panNo",
    type: "text",
    label: "PAN Card Number",
    placeholder: "Enter PAN Card Number",
  },
  {
    name: "creditDays",
    type: "number",
    maxLength: 3,
    label: "Credit Days",
    placeholder: "Enter credit days",
  },
  {
    name: "creditLimit",
    type: "number",
    maxLength: 10,
    label: "Credit Limit",
    placeholder: "Enter credit limit",
  },
  {
    name: "contactPerson",
    type: "text",
    // required: true,
    label: "Primary Contact Person",
    placeholder: "Enter contact person's name",
  },
  {
    name: "email",
    type: "email",
    // required: true,
    label: "Email Address",
    placeholder: "Enter email address",
  },
  {
    name: "mobileNo",
    type: "number",
    // required: true,
    label: "Mobile Contact Number",
    placeholder: "Enter mobile number",
  },
  {
    name: "country",
    type: "text",
    // required: true,
    label: "Country of Operation",
    placeholder: "Enter country of operation",
  },
  {
    name: "state",
    type: "text",
    // required: true,
    label: "State/Province",
    placeholder: "Enter state or province",
  },
  {
    type: "br",
    name: "sudToOwner",
    label: "SUD To Owner Payment (Invoice) Details",
    widthFull: true,
  },
  {
    name: "invoiceNumber",
    type: "text",
    // required: true,
    label: "Invoice Number",
    placeholder: "Enter invoice number",
  },
  {
    name: "yardName",
    type: "text",
    // required: true,
    label: "Yard Name",
    placeholder: "Enter yard name",
  },
  {
    name: "repairedMonth",
    type: "text",
    // required: true,
    label: "Repaired Month",
    placeholder: "Enter repaired month",
  },
  {
    name: "sudInvoiceToOwners",
    type: "number",
    // required: true,
    label: "SUD Invoice to Owners (USD) CR",
    placeholder: "Enter SUD Invoice Amount",
  },
  {
    name: "actualPaymentDate",
    type: "date",
    // required: true,
    label: "Actual Payment Date",
    placeholder: "Select actual payment date",
  },
  {
    name: "actualPayment",
    type: "number",
    // required: true,
    label: "Actual Payment",
    placeholder: "Enter actual payment",
  },
  {
    name: "bankCharges",
    type: "number",
    // required: true,
    label: "Bank Charges",
    placeholder: "Enter bank charges",
  },
  {
    name: "dueDate",
    type: "date",
    // required: true,
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
    type: "number",
    // required: true,
    label: "Yard Invoice To SUD",
    placeholder: "Enter yard invoice to SUD",
  },
  {
    name: "yardActualPaymentDate",
    type: "date",
    // required: true,
    label: "Yard Actual Payment Date",
    placeholder: "Select yard actual payment date",
  },
  {
    name: "yardPaymentDueDate",
    type: "date",
    // required: true,
    label: "Yard Payment Due Date",
    placeholder: "Select yard payment due date",
  },
  {
    type: "br",
    name: "vendortosud",
    label: "Vendor To SUD Payment (Invoice) Details",
    widthFull: true,
  },
  {
    name: "vendorInvoiceToSUD",
    type: "number",
    // required: true,
    label: "Vendor Invoice To SUD",
    placeholder: "Enter vendor invoice to SUD",
  },
  {
    name: "vendorActualPaymentDate",
    type: "date",
    // required: true,
    label: "Vendor Actual Payment Date",
    placeholder: "Select vendor actual payment date",
  },
  {
    name: "vendorPaymentDueDate",
    type: "date",
    // required: true,
    label: "Vendor Payment Due Date",
    placeholder: "Select vendor payment due date",
  },
  { type: "br", name: "address", label: "Address Details", widthFull: true },
  {
    name: "line1",
    type: "text",
    // required: true,
    label: "Address 1",
    placeholder: "Enter Line 1",
  },
  {
    name: "street",
    type: "text",
    label: "Street Address",
    placeholder: "Enter street address",
  },
  {
    name: "city",
    type: "text",
    // required: true,
    label: "City",
    placeholder: "Enter city",
  },
  {
    name: "state",
    type: "text",
    // required: true,
    label: "State",
    placeholder: "Enter state",
  },
  {
    name: "pinCode",
    type: "stringNumeric",
    // required: true,
    maxLength: 15,
    label: "Pin Code",
    placeholder: "Enter pin code",
  },
  {
    name: "country",
    type: "select",
    // required: true,
    label: "Country",
    placeholder: "Select Country",
    options: getSelectFormattedData(countries),
  },
  {
    name: "landmark",
    type: "text",
    label: "Landmark",
    placeholder: "Enter landmark",
  },
  { type: "br", name: "bank", label: "Bank Details", widthFull: true },
  {
    name: "accountNo",
    type: "text",
    label: "Account Number",
    placeholder: "Enter account number",
  },
  {
    name: "bankName",
    type: "select",
    // required: true,
    label: "Bank Name",
    placeholder: "Select bank",
    options: getSelectFormattedData(bankNames),
  },
  {
    name: "branchAddress",
    type: "text",
    label: "Branch Address",
    placeholder: "Enter branch address",
  },
  {
    name: "ifscCode",
    type: "text",
    label: "IFSC Code",
    placeholder: "Enter IFSC Code",
  },
  {
    name: "remarks",
    type: "text",
    label: "Remarks",
    placeholder: "Enter remarks",
  },
];
