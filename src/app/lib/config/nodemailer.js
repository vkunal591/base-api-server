import nodemailer from "nodemailer";

/**
 * Create reusable transporter (AliMail SMTP)
 */
// const transporter = nodemailer.createTransport({
//   host: process.env.MAIL_HOST,
//   port: Number(process.env.MAIL_PORT),
//   secure: process.env.MAIL_SECURE === "true", // true for 465
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS,
//   },
// });

// import env from "#configs/env";
// import nodemailer from "nodemailer";
// lib/config/nodemailer.js


const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.PASSWORD,
  },
});

/**
 * Send Email Function
 */
export async function sendEmailAlert(toEmail, subject, textMessage, htmlMessage) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: toEmail,
      subject,
      text: textMessage,
      html: htmlMessage,
    });

    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
}
