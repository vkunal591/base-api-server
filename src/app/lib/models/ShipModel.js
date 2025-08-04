import mongoose from "mongoose";

const shipDetailsSchema = new mongoose.Schema(
  {
    vesselName: { type: String },
    vesselImoNo: { type: String },
    companyName: { type: String },
    invoiceNumber: { type: String },
    yardName: { type: String },
    repairedMonth: { type: String },
    sudInvoiceToOwners: { type: String },
    actualPaymentDate: { type: String },
    actualPayment: { type: String },
    bankCharges: { type: String },
    dueDate: { type: String },
    portsNo: { type: String },
    portsName: { type: String },
    portsWorkStartDate: { type: String },
    yardInvoiceToSUD: { type: String },
    yardActualPaymentDate: { type: String },
    yardPaymentDueDate: { type: String },
    arrival: { type: String },
    departure: { type: String },
    vendorDetails: [
      {
        vendorInvoiceToSUD: { type: String },
        vendorActualPaymentDate: { type: String },
        vendorPaymentDueDate: { type: String },
        _id: false, // Optional: if you don't want auto _id for each subdoc
      },
    ],
    street: { type: String },
    landmark: { type: String },
    city: { type: String },
    state: { type: String },
    pinCode: { type: String },
    country: { type: String },
    accountNo: { type: String },
    bankName: { type: String },
    branchAddress: { type: String },
    ifscCode: { type: String },
    remarks: { type: String },
  },
  { timestamps: true }
);

const Ship = mongoose.models.Ship || mongoose.model("Ship", shipDetailsSchema);
export default Ship;
