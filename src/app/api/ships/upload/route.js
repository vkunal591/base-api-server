import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { dbConnect } from "@/app/lib/config/db";
import Ship from "@/app/lib/models/ShipModel";

/* ============================
   DATE HELPERS (DO NOT CHANGE)
   ============================ */

// Universal Excel → JS Date (NO timezone shift)
function parseExcelDate(value) {
  if (!value) return null;

  // Case 1: JS Date object
  if (value instanceof Date) {
    return new Date(
      value.getUTCFullYear(),
      value.getUTCMonth(),
      value.getUTCDate()
    );
  }

  // Case 2: Excel serial number
  if (typeof value === "number") {
    const d = XLSX.SSF.parse_date_code(value);
    if (!d) return null;
    return new Date(d.y, d.m - 1, d.d);
  }

  // Case 3: String "DD-MM-YYYY"
  if (typeof value === "string" && value.includes("-")) {
    const [dd, mm, yyyy] = value.split("-");
    if (dd && mm && yyyy) {
      return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    }
  }

  return null;
}

// Jan-24 → 2024-01
function parseRepairedMonth(value) {
  if (!value) return null;

  // Excel serial
  if (typeof value === "number") {
    const d = XLSX.SSF.parse_date_code(value);
    return `${d.y}-${String(d.m).padStart(2, "0")}`;
  }

  // String like "Jan-24"
  if (typeof value === "string") {
    const [mon, yr] = value.split("-");
    const map = {
      Jan: "01", Feb: "02", Mar: "03", Apr: "04",
      May: "05", Jun: "06", Jul: "07", Aug: "08",
      Sep: "09", Oct: "10", Nov: "11", Dec: "12"
    };
    if (map[mon]) {
      return `20${yr}-${map[mon]}`;
    }
  }

  return null;
}

/* ============================
   POST API
   ============================ */

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

    // File → Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // IMPORTANT: Disable auto date parsing
    const workbook = XLSX.read(buffer, {
      type: "buffer",
      cellDates: false,
    });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet, {
      raw: true,
      defval: null,
    });

    if (!rows.length) {
      return NextResponse.json(
        { success: false, message: "Excel file is empty" },
        { status: 400 }
      );
    }

    const ships = rows.map((row) => ({
      vesselName: row.vesselName ?? "",
      vesselImoNo: String(row.vesselImoNo ?? ""),
      companyName: row.companyName ?? "",
      invoiceNumber: row.invoiceNumber ?? "",
      yardName: row.yardName ?? "",

      repairedMonth: parseRepairedMonth(row.repairedMonth),

      sudInvoiceToOwners: Number(row.sudInvoiceToOwners ?? 0),
      actualPaymentDate: parseExcelDate(row.actualPaymentDate),
      actualPayment: Number(row.actualPayment ?? 0),
      bankCharges: Number(row.bankCharges ?? 0),
      dueDate: parseExcelDate(row.dueDate),

      portsNo: Number(row.portsNo ?? 0),
      portsName: row.portsName ?? "",
      portsWorkStartDate: parseExcelDate(row.portsWorkStartDate),

      yardInvoiceToSUD: Number(row.yardInvoiceToSUD ?? 0),
      yardActualPaymentDate: parseExcelDate(row.yardActualPaymentDate),
      yardPaymentDueDate: parseExcelDate(row.yardPaymentDueDate),

      arrival: parseExcelDate(row.arrival),
      departure: parseExcelDate(row.departure),

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
