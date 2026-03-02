import { NextResponse } from "next/server";
import { dbConnect } from "../../lib/config/db";
import InvoiceModel from "../../lib/models/InvoiceModel";
import UserModel from "../../lib/models/UserModel";
import { sendEmailAlert } from "../../lib/config/nodemailer";

export async function GET() {
  try {
    await dbConnect();

    const user = await UserModel.findOne({ email: "sud@gmail.com" });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Check if already mailed today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    if (
      user.lastMailedAt &&
      user.lastMailedAt >= startOfToday &&
      user.lastMailedAt <= endOfToday
    ) {
      return NextResponse.json(
        { success: true, message: "Mail already sent today" },
        { status: 200 }
      );
    }

    // ✅ Date Handling
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);
    threeDaysLater.setHours(23, 59, 59, 999);

    // ✅ Fetch invoices
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

    // ✅ Calculate total amount
    const totalAmountSum = invoices.reduce(
      (acc, inv) => acc + (inv.totalAmount || 0),
      0
    );

    const todayDate = new Date().toLocaleDateString();

    // ✅ Build table rows
    const tableRows = invoices
      .map((inv, index) => {
        const dueDate = inv.dueDate
          ? new Date(inv.dueDate).toLocaleDateString()
          : "N/A";

        const amount = (inv.totalAmount || 0).toFixed(2);

        return `
          <tr>
            <td style="padding:8px;border:1px solid #ddd;">${index + 1}</td>
            <td style="padding:8px;border:1px solid #ddd;">${inv.invoiceNumber || "N/A"}</td>
            <td style="padding:8px;border:1px solid #ddd;">${inv.vesselName} (${inv.vesselImoNo})</td>
            <td style="padding:8px;border:1px solid #ddd;">${inv.to} </td>
            <td style="padding:8px;border:1px solid #ddd;">${dueDate}</td>
            <td style="padding:8px;border:1px solid #ddd;">$${amount}</td>
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
              <th style="padding:8px;border:1px solid #ddd;">Vessel Name/IMO</th>
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
          Total Due Amount: $${totalAmountSum.toFixed(2)}
        </h3>


      </div>
    `;

    const textMessage = `
Invoice Due Summary (${todayDate})

Total Invoices: ${invoices.length}
Total Amount: $${totalAmountSum.toFixed(2)}

Please check the HTML version for detailed breakdown.
`;

    const subject = `Invoice Reminder - Due Within 3 Days (${todayDate})`;

    // ✅ Multiple Recipients
    const recipients = [
      "sese@sudgroup.cn",
      "rana@sudgroup.cn",
      "biz1@sudgroup.cn"
    ];

    // Send to all emails (single send with multiple recipients)
    const emailSent = await sendEmailAlert(
      recipients.join(","), // comma separated emails
      subject,
      textMessage,
      htmlMessage
    );

    if (!emailSent) {
      return NextResponse.json(
        { success: false, message: "Email sending failed." },
        { status: 500 }
      );
    }

    // ✅ Update last mailed date
    user.lastMailedAt = new Date();
    await user.save();

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