import { NextResponse } from "next/server";
import { dbConnect } from '@/app/lib/config/db';
import InvoiceModel from "../../../lib/models/InvoiceModel";


// api/invoice/[id]/route.ts
export async function GET(req, { params }) {
  await dbConnect();
  const invoice = await InvoiceModel.findById(params.id);
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  return NextResponse.json({ data: { invoice }, success: true });
}

export async function PUT(req, { params }) {
  await dbConnect();
  const body = await req.json();
  const updatedInvoice = await InvoiceModel.findByIdAndUpdate(params.id, body, { new: true });
  if (!updatedInvoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  return NextResponse.json({ data: { updatedInvoice }, success: true });
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const deletedInvoice = await InvoiceModel.findByIdAndDelete(params.id);
  if (!deletedInvoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  return NextResponse.json({ message: "Invoice deleted successfully" });
}
