// import mongoose from "mongoose";

// const Schema = new mongoose.Schema({
//   invoiceNumber: {
//     type: String,
//     unique: true,
//     required: true
//   },
//   invoiceType: {
//     type: String,
//     enum: ["PORTS", "DOCK"],
//     required: true,
//   },
//   portsName: {
//     type: String
//   },
//   businessMail: {
//     type: String
//   },
//   status: {
//     type: String,
//     enum: ["Paid", "Pending", "Unpaid", "Overdue"],
//     default: "Unpaid"
//   },
//   invoiceDate: {
//     type: Date
//   },
//   vesselName: {
//     type: String
//   },
//   vesselImoNo: {
//     type: String
//   },
//   co: {
//     type: String
//   },
//   to: {
//     type: String
//   },
//   dueDate: {
//     type: Date
//   },
//   yardPaymentDueDate: {
//     type: Date
//   },
//   totalAmount: {
//     type: Number
//   },
//   totalAmountInWords: {
//     type: String
//   },
//   remarks: {
//     type: String
//   },
//   billingTo: {
//     companyName: {
//       type: String
//     },
//     streetAddress: {
//       type: String
//     },
//     landmark: {
//       type: String
//     },
//     city: {
//       type: String
//     },
//     country: {
//       type: String
//     },
//     pincode: {
//       type: String
//     },
//     email: {
//       type: String
//     },
//     phoneNumber: {
//       type: String
//     },
//   },
//   billingFrom: {
//     companyName: {
//       type: String
//     },
//     streetAddress: {
//       type: String
//     },
//     landmark: {
//       type: String
//     },
//     city: {
//       type: String
//     },
//     country: {
//       type: String
//     },
//     pincode: {
//       type: String
//     },
//     email: {
//       type: String
//     },
//     phoneNumber: {
//       type: String
//     },
//   },
//   bankDetails: {
//     accountName: {
//       type: String
//     },
//     accountNumber: {
//       type: String
//     },
//     accountHolderName: {
//       type: String
//     },
//     swiftAddress: {
//       type: String
//     },
//     bankAddress: {
//       type: String
//     },
//   },
//   workDetails: [{
//     itemDesc: {
//       type: String
//     },
//     unit: {
//       type: String
//     },
//     unitCost: {
//       type: Number
//     },
//     quantity: {
//       type: Number
//     },
//     value: {
//       type: Number
//     },
//   }, ],
//   paymentStages: [{
//     key: {
//       type: String,
//       required: true
//     },
//     payment: {
//       type: String
//     },
//     payBy: {
//       type: String
//     },
//     paymentDate: {
//       type: Date
//     },
//   }, ],
// }, {
//   timestamps: true
// });

// const InvoiceModel = mongoose.models.Invoice || mongoose.model("Invoice", Schema);
// export default InvoiceModel;






// import mongoose from "mongoose";

// const InvoiceSchema = new mongoose.Schema(
//   {
//     invoiceNumber: {
//       type: String,
//       unique: true,
//       required: true,
//     },

//     invoiceType: {
//       type: String,
//       enum: ["PORTS", "DOCK"],
//       required: true,
//     },

//     portsName: { type: String },

//     invoiceDate: { type: Date },

//     paymentNumber: { type: String }, // ➜ Added from formData

//     businessMail: { type: String },

//     to: { type: String },

//     vesselImoNo: { type: String },

//     vesselName: { type: String },

//     co: { type: String },

//     dueDate: { type: Date },

//     yardPaymentDueDate: { type: Date },

//     totalAmount: { type: Number },

//     totalAmountInWords: { type: String },

//     remarks: { type: String },

//     isASAgentOnly: { type: Boolean, default: false }, // ➜ Added from formData

//     customize: { type: String }, // ➜ Added from formData

//     status: {
//       type: String,
//       enum: ["Paid", "Pending", "Unpaid", "Overdue"],
//       default: "Unpaid",
//     },

//     // -------------------
//     // Billing To
//     // -------------------
//     billingTo: {
//       companyName: String,
//       streetAddress: String,
//       secondStreetAddress: String, // ➜ Added (exists in formData)
//       landmark: String,
//       city: String,
//       country: String,
//       pincode: String,
//       email: String,
//       phoneNumber: String,
//     },

//     // -------------------
//     // Billing From
//     // -------------------
//     billingFrom: {
//       companyName: String,
//       streetAddress: String,
//       landmark: String,
//       city: String,
//       country: String,
//       pincode: String,
//       email: String,
//       phoneNumber: String,
//     },

//     // -------------------
//     // Bank Details
//     // -------------------
//     bankDetails: {
//       accountName: String,
//       accountNumber: String,
//       accountHolderName: String,
//       swiftAddress: String,
//       bankAddress: String,
//     },

//     // -------------------
//     // Work Details
//     // -------------------
//     workDetails: [
//       {
//         itemDesc: String,
//         unit: String,
//         unitCost: Number,
//         quantity: Number,
//         value: Number,
//       },
//     ],

//     // -------------------
//     // Payment Stages
//     // -------------------
//     paymentStages: [
//       {
//         key: { type: String, required: true },
//         payment: { type: String },
//         payBy: { type: String },
//         paymentDate: { type: Date },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// const InvoiceModel =
//   mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);

// export default InvoiceModel;






import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      required: true,
    },

    invoiceType: {
      type: String,
      enum: ["PORTS", "DOCK"],
      required: true,
    },

    portsName: String,
    businessMail: String,
    status: {
      type: String,
      enum: ["Paid", "Pending", "Unpaid", "Overdue"],
      default: "Unpaid",
    },

    invoiceDate: Date,
    vesselName: String,
    vesselImoNo: String,
    co: String,
    to: String,

    paymentNumber: String,
    customize: String,
    isASAgentOnly: Boolean,

    dueDate: Date,
    yardPaymentDueDate: Date,

    totalAmount: Number,
    totalAmountInWords: String,
    remarks: String,

    // ----------------------
    // BILLING TO  (No _id)
    // ----------------------
    billingTo: {
      _id: false,
      companyName: String,
      streetAddress: String,
      secondStreetAddress: String,
      landmark: String,
      city: String,
      country: String,
      pincode: String,
      email: String,
      phoneNumber: String,
    },

    // ----------------------
    // BILLING FROM (No _id)
    // ----------------------
    billingFrom: {
      _id: false,
      companyName: String,
      streetAddress: String,
      landmark: String,
      city: String,
      country: String,
      pincode: String,
      email: String,
      phoneNumber: String,
    },

    // ----------------------
    // BANK DETAILS (No _id)
    // ----------------------
    bankDetails: {
      _id: false,
      accountName: String,
      accountNumber: String,
      accountHolderName: String,
      swiftAddress: String,
      bankAddress: String,
    },

    // ----------------------
    // WORK DETAILS ARRAY (No _id)
    // ----------------------
    workDetails: [
      {
        _id: false,
        itemDesc: String,
        unit: String,
        unitCost: Number,
        quantity: Number,
        value: Number,
      },
    ],

    // ----------------------
    // PAYMENT STAGES ARRAY (No _id)
    // ----------------------
    paymentStages: [
      {
        _id: false,
        key: { type: String, required: true },
        payment: String,
        payBy: String,
        paymentDate: Date,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Invoice ||
  mongoose.model("Invoice", InvoiceSchema);
