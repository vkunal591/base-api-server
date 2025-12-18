import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { dbConnect } from "@/app/lib/config/db";
import Ship from "@/app/lib/models/ShipModel";

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Read Excel
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return NextResponse.json(
        { success: false, message: "Excel file is empty" },
        { status: 400 }
      );
    }

    // Map Excel rows to MongoDB schema
    const ships = rows.map((row) => ({
      vesselName: row.vesselName ?? "",
      vesselImoNo: row.vesselImoNo ?? "",
      companyName: row.companyName ?? "",
      invoiceNumber: row.invoiceNumber ?? "",
      yardName: row.yardName ?? "",
      repairedMonth: row.repairedMonth ?? "",
      sudInvoiceToOwners: row.sudInvoiceToOwners ?? "",
      actualPaymentDate: row.actualPaymentDate ?? "",
      actualPayment: row.actualPayment ?? "",
      bankCharges: row.bankCharges ?? "",
      dueDate: row.dueDate ?? "",
      portsNo: row.portsNo ?? "",
      portsName: row.portsName ?? "",
      portsWorkStartDate: row.portsWorkStartDate ?? "",
      yardInvoiceToSUD: row.yardInvoiceToSUD ?? "",
      yardActualPaymentDate: row.yardActualPaymentDate ?? "",
      yardPaymentDueDate: row.yardPaymentDueDate ?? "",
      arrival: row.arrival ?? "",
      departure: row.departure ?? "",
      remarks: row.remarks ?? "",
    }));

    await Ship.insertMany(ships);

    return NextResponse.json({
      success: true,
      message: `${ships.length} records uploaded successfully`,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
