import { NextResponse } from "next/server";
import { dbConnect } from "../../lib/config/db";
import InvoiceModel from "../../lib/models/InvoiceModel";
import NotificationModel from "../../lib/models/NotificationModel";
import CompanyModel from "../../lib/models/CompanyModel";
import nodemailer from "nodemailer";

async function sendEmailAlert(companyEmail, alertMessage) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: companyEmail,
    subject: "Invoice Due Date Alert",
    text: alertMessage,
  });
}

export async function POST(req) {
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
          (invoice.dueDate - now) / (1000 * 60 * 60 * 24)
        );

        if (
          daysBeforeDue === notification.daysBeforeDue && 
          daysBeforeDue >= 0
        ) {
          const company = await CompanyModel.findById(notification.company);

          await sendEmailAlert(company.email, notification.alertMessage);

          //  PREVENT DUPLICATE EMAILS
          await InvoiceModel.findByIdAndUpdate(invoice._id, {
            reminderSent: true,
          });

          await NotificationModel.findByIdAndUpdate(notification._id, {
            $push: { notificationsSent: { status: "Sent", date: new Date() } },
          });
        }
      }
    }

    return NextResponse.json({ message: "Notifications sent successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error sending notifications" },
      { status: 500 }
    );
  }
}
