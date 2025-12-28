// import { NextResponse } from "next/server";
// import { dbConnect } from '@/app/lib/config/db';
// import InvoiceModel from "../../lib/models/InvoiceModel";

// export async function GET(req) {
//   await dbConnect();

//   // Use a base URL if req.url is relative
//   const url = new URL(req.url, process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000");
//   const searchParams = url.searchParams;

//   // Get pagination values
//   const page = parseInt(searchParams.get("page")) || 1;
//   const limit = parseInt(searchParams.get("limit")) || 10;

//   let query = {};

//   // Object to hold grouped date range parameters
//   let dateRangeQueries = {};

//   // Loop through each query parameter
//   for (const [key, value] of searchParams.entries()) {
//     if (key === "page" || key === "limit") continue;

//     // Check for date range parameters (ends with "From" or "To")
//     if (key.endsWith("From") || key.endsWith("To")) {
//       // Determine base field name (e.g. "invoiceDate" from "invoiceDateFrom")
//       const baseField = key.replace(/(From|To)$/, "");
//       if (!dateRangeQueries[baseField]) {
//         dateRangeQueries[baseField] = {};
//       }
//       if (key.endsWith("From")) {
//         dateRangeQueries[baseField].from = value;
//       } else {
//         dateRangeQueries[baseField].to = value;
//       }
//     } else {
//       // For non-range parameters: if the field name indicates a date
//       if (key.toLowerCase().includes("date")) {
//         const date = new Date(value);
//         if (!isNaN(date.getTime())) {
//           // Single date: create a range that covers the entire day
//           const nextDate = new Date(date);
//           nextDate.setDate(date.getDate() + 1);
//           query[key] = { $gte: date, $lt: nextDate };
//         } else {
//           // If not a valid date, use an exact match
//           query[key] = value;
//         }
//       } else {
//         // For all other fields, use a case‑insensitive regex for partial matches
//         query[key] = { $regex: value, $options: "i" };
//       }
//     }
//   }

//   console.log(dateRangeQueries)
//   // Process any collected date range queries
//   for (const field in dateRangeQueries) {
//     const range = dateRangeQueries[field];
//     let rangeQuery = {};
//     if (range.from) {
//       const fromDate = new Date(range.from);
//       if (!isNaN(fromDate.getTime())) {
//         rangeQuery.$gte = fromDate;
//       }
//     }
//     if (range.to) {
//       const toDate = new Date(range.to);
//       if (!isNaN(toDate.getTime())) {
//         rangeQuery.$lte = toDate;
//       }
//     }
//     if (Object.keys(rangeQuery).length > 0) {
//       query[field] = rangeQuery;
//     }
//   }

//   console.log("Constructed Query:", query);

//   try {
//     // Fetch invoices based on the dynamic query with pagination
//     const invoices = await InvoiceModel.find(query)
//       .skip((page - 1) * limit)
//       .limit(limit);
//     console.log(invoices)
//     const total = await InvoiceModel.countDocuments(query);

//     return NextResponse.json({
//       data: {
//         result: invoices,
//         // pagination: { totalItems:total, page, limit },
//         // pagination: { currentPage:page, totalPages: Math.ceil(total / limit), totalItems: total },
//         pagination: { currentPage: page, totalPages: Math.ceil(total / limit), itemsPerPage: limit, totalItems: total }
//       },
//       success: true,
//     });
//   } catch (error) {
//     console.error("Error fetching invoices:", error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req) {
//   try {
//     await dbConnect();

//     const body = await req.json();
//     const { invoiceNumber } = body;

//     if (!invoiceNumber) {
//       return NextResponse.json(
//         { message: 'invoiceNumber is required' },
//         { status: 400 }
//       );
//     }

//     // Check if an invoice with the same invoiceNumber already exists
//     const isExist = await InvoiceModel.findOne({ invoiceNumber });

//     if (isExist) {
//       return NextResponse.json(
//         { message: 'Invoice with this invoiceNumber already exists' },
//         { status: 409 }
//       );
//     }

//     const newInvoice = new InvoiceModel(body);
//     await newInvoice.save();

//     return NextResponse.json(
//       { data: { result: newInvoice, success: true } },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('POST /invoice error:', error);
//     return NextResponse.json(
//       { message: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }
















import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/config/db";
import InvoiceModel from "../../lib/models/InvoiceModel";

export async function GET(req) {
  await dbConnect();

  const url = new URL(
    req.url,
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  );

  const searchParams = url.searchParams;

  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;

  let query = {};
  let dateRangeQueries = {};

  // Allowed string fields for regex search  
  const stringFields = [
    "invoiceNumber",
    "invoiceType",
    "portsName",
    "businessMail",
    "to",
    "vesselImoNo",
    "vesselName",
    "co",
    "remarks",
    "customize",
    "paymentNumber",
    "billingTo.companyName",
    "billingTo.streetAddress",
    "billingTo.secondStreetAddress",
    "billingTo.landmark",
    "billingTo.city",
    "billingTo.country",
    "billingTo.pincode",
    "billingTo.email",
    "billingTo.phoneNumber",
    "billingFrom.companyName",
    "billingFrom.streetAddress",
    "billingFrom.landmark",
    "billingFrom.city",
    "billingFrom.country",
    "billingFrom.pincode",
    "billingFrom.email",
    "billingFrom.phoneNumber",
    "bankDetails.accountName",
    "bankDetails.accountNumber",
    "bankDetails.accountHolderName",
    "bankDetails.swiftAddress",
    "bankDetails.bankAddress",
  ];

  // Allowed date fields for date filtering
  const dateFields = [
    "invoiceDate",
    "dueDate",
    "yardPaymentDueDate",
    "paymentStages.paymentDate",
  ];

  // Read all query params
  for (const [key, value] of searchParams.entries()) {
    if (["page", "limit"].includes(key)) continue;

    // Handle date ranges: invoiceDateFrom, invoiceDateTo
    if (key.endsWith("From") || key.endsWith("To")) {
      const baseField = key.replace(/(From|To)$/, "");
      if (!dateRangeQueries[baseField]) dateRangeQueries[baseField] = {};

      if (key.endsWith("From")) dateRangeQueries[baseField].from = value;
      else dateRangeQueries[baseField].to = value;

      continue;
    }

    // Handle pure date filters
    if (dateFields.includes(key)) {
      const parsed = new Date(value);
      if (!isNaN(parsed)) {
        const next = new Date(parsed);
        next.setDate(parsed.getDate() + 1);

        query[key] = { $gte: parsed, $lt: next };
      }
      continue;
    }

    // Boolean fields
    if (key === "isASAgentOnly") {
      query[key] = value === "true";
      continue;
    }

    // Number fields
    if (["totalAmount"].includes(key)) {
      query[key] = Number(value);
      continue;
    }

    // String regex fields
    if (stringFields.includes(key)) {
      query[key] = { $regex: value, $options: "i" };
      continue;
    }
  }

  // Process range queries
  for (const field in dateRangeQueries) {
    const range = dateRangeQueries[field];
    let obj = {};

    if (range.from) {
      const fromDate = new Date(range.from);
      if (!isNaN(fromDate)) obj.$gte = fromDate;
    }

    if (range.to) {
      const toDate = new Date(range.to);
      if (!isNaN(toDate)) obj.$lte = toDate;
    }

    if (Object.keys(obj).length > 0) query[field] = obj;
  }

  console.log("Final Query →", query);

  try {
    const invoices = await InvoiceModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await InvoiceModel.countDocuments(query);

    return NextResponse.json({
      data: {
        result: invoices,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          itemsPerPage: limit,
          totalItems: total,
        },
      },
      success: true,
    });
  } catch (error) {
    console.error("GET /invoice error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { invoiceNumber } = body;

    if (!invoiceNumber) {
      return NextResponse.json(
        { message: "invoiceNumber is required" },
        { status: 400 }
      );
    }

    const existing = await InvoiceModel.findOne({ invoiceNumber });

    if (existing) {
      return NextResponse.json(
        { message: "Invoice with this invoiceNumber already exists" },
        { status: 409 }
      );
    }

    const newInvoice = new InvoiceModel(body);
    await newInvoice.save();

    return NextResponse.json(
      { data: { result: newInvoice, success: true ,message:"Invoice Created Successfully"} },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /invoice error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
