// app/api/send-due-invoices/route.js

import { NextResponse } from "next/server";
import { dbConnect } from "../../lib/config/db";
import InvoiceModel from "../../lib/models/InvoiceModel";
import { sendEmailAlert } from "../../lib/config/nodemailer";

export async function GET() {
  try {
    await dbConnect();

    // ✅ Date Handling (Time Safe)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);
    threeDaysLater.setHours(23, 59, 59, 999);

    // ✅ Fetch Overdue + Next 3 Days
    const invoices = await InvoiceModel.find({
      dueDate: { $lte: threeDaysLater },
      status: { $in: ["Unpaid", "Overdue", "Pending"] },
    }).lean();

    if (!invoices.length) {
      return NextResponse.json(
        { success: true, message: "No upcoming or overdue invoices found." },
        { status: 200 }
      );
    }

    // ✅ Calculate Total Amount
    const totalAmountSum = invoices.reduce(
      (acc, inv) => acc + (inv.totalAmount || 0),
      0
    );

    const todayDate = new Date().toLocaleDateString();

    // ✅ Build Table Rows
    const tableRows = invoices
      .map((inv, index) => {
        const dueDate = inv.dueDate
          ? new Date(inv.dueDate).toLocaleDateString()
          : "N/A";

        const amount = (inv.totalAmount || 0).toFixed(2);

        return `
          <tr>
            <td style="padding:8px;border:1px solid #ddd;">${index + 1}</td>
            <td style="padding:8px;border:1px solid #ddd;">${inv.invoiceNumber}</td>
            <td style="padding:8px;border:1px solid #ddd;">${inv.vesselName || "N/A"}</td>
            <td style="padding:8px;border:1px solid #ddd;">${dueDate}</td>
            <td style="padding:8px;border:1px solid #ddd;">₹${amount}</td>
            <td style="padding:8px;border:1px solid #ddd;">${inv.status}</td>
          </tr>
        `;
      })
      .join("");

    // ✅ HTML Email
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color:#d9534f;">Upcoming & Overdue Invoice Summary</h2>
        <p>Date: ${todayDate}</p>
        <p>The following invoices are due within the next 3 days or already overdue:</p>

        <table style="border-collapse: collapse; width: 100%; margin-top: 15px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding:8px;border:1px solid #ddd;">#</th>
              <th style="padding:8px;border:1px solid #ddd;">Invoice No</th>
              <th style="padding:8px;border:1px solid #ddd;">Company</th>
              <th style="padding:8px;border:1px solid #ddd;">Due Date</th>
              <th style="padding:8px;border:1px solid #ddd;">Amount</th>
              <th style="padding:8px;border:1px solid #ddd;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <h3 style="margin-top:20px;">
          Total Due Amount: ₹${totalAmountSum.toFixed(2)}
        </h3>

        <p style="margin-top:20px;">
          Kindly ensure timely payment to avoid service interruption.
        </p>

        <p style="margin-top:30px;font-size:12px;color:#777;">
          This is an automated system generated email.
        </p>
      </div>
    `;

    // ✅ Text Fallback
    const textMessage = `
Invoice Due Summary (${todayDate})

Total Invoices: ${invoices.length}
Total Amount: ₹${totalAmountSum.toFixed(2)}

Please check the HTML version for detailed breakdown.
`;

    const subject = `Invoice Reminder - Due Within 3 Days (${todayDate})`;

    // ✅ Send Static Email
    const emailSent = await sendEmailAlert(
      "vkunal591@gmail.com",
      subject,
      textMessage,
      htmlMessage
    );

    if (!emailSent) {
      return NextResponse.json(
        { success: false, message: "Email sending failed.",emailSent },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Invoice reminder email sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
