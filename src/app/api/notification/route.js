import { NextResponse } from "next/server";
import { dbConnect } from "../../lib/config/db";
import InvoiceModel from "../../lib/models/InvoiceModel";
import NotificationModel from "../../lib/models/NotificationModel";
import CompanyModel from "../../lib/models/CompanyModel";
import nodemailer from "nodemailer";



/**
 * POST API
 */
export async function POST() {
  await dbConnect();

  try {
    const notifications = await NotificationModel.find({ isEnabled: true });
    const now = new Date();

    for (const notification of notifications) {
      const invoices = await InvoiceModel.find({
        company: notification.company,
        dueDate: { $gte: now },
        status: { $in: ["Unpaid", "Pending"] },
        reminderSent: { $ne: true },
      });

      for (const invoice of invoices) {
        const daysBeforeDue = Math.ceil(
          (new Date(invoice.dueDate) - now) / (1000 * 60 * 60 * 24)
        );

        if (
          daysBeforeDue === notification.daysBeforeDue &&
          daysBeforeDue >= 0
        ) {
          const company = await CompanyModel.findById(notification.company);

          if (!company?.email) continue;

          const emailSent = await sendEmailAlert(
            company.email,
            notification.alertMessage
          );

          if (emailSent) {
            // Prevent duplicate emails
            await InvoiceModel.findByIdAndUpdate(invoice._id, {
              reminderSent: true,
            });

            await NotificationModel.findByIdAndUpdate(notification._id, {
              $push: {
                notificationsSent: {
                  status: "Sent",
                  date: new Date(),
                },
              },
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Notifications processed successfully",
    });
  } catch (error) {
    console.error("Server Error:", error);

    return NextResponse.json(
      { success: false, message: "Error sending notifications" },
      { status: 500 }
    );
  }
}
