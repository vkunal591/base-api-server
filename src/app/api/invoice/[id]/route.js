

import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/config/db";
import InvoiceModel from "../../../lib/models/InvoiceModel";


// ===============================
// 📌 GET - Fetch Single Invoice
// ===============================
export async function GET(req, { params }) {
  await dbConnect();

  const invoice = await InvoiceModel.findById(params.id);

  if (!invoice)
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  return NextResponse.json({ data: { result: invoice }, success: true });
}



// ===============================
// 📌 PUT - Update Invoice (Full or Partial)
// ===============================
// Supports both:
// - updating only status/dueDate
// - updating full invoice object
export async function PUT(req, { params }) {
  await dbConnect();

  let body = await req.json();

  // 🟢 Convert known date fields to Date objects if present
  const dateFields = [
    "invoiceDate",
    "dueDate",
    "yardPaymentDueDate",
  ];

  for (let field of dateFields) {
    if (body[field]) {
      const parsed = new Date(body[field]);
      if (!isNaN(parsed)) body[field] = parsed;
    }
  }

  // 🟢 Convert paymentStages dates if array exists
  if (Array.isArray(body.paymentStages)) {
    body.paymentStages = body.paymentStages.map((stage) => ({
      ...stage,
      paymentDate: stage?.paymentDate ? new Date(stage.paymentDate) : null,
    }));
  }

  // 🟢 Perform update (partial or full)
  const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
    params.id,
    { $set: body },
    { new: true, runValidators: true }
  );

  if (!updatedInvoice)
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  return NextResponse.json({ data: { updatedInvoice }, success: true });
}



// ===============================
// 📌 DELETE - Remove an Invoice
// ===============================
export async function DELETE(req, { params }) {
  await dbConnect();

  const deletedInvoice = await InvoiceModel.findByIdAndDelete(params.id);

  if (!deletedInvoice)
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  return NextResponse.json({ message: "Invoice deleted successfully", success: true });
}
