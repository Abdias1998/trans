/* global process */

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  service: process.env.SERVICE,
  port: Number(process.env.EMAIL_PORT),
  secure: Boolean(process.env.SECURE),
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});
/**Function principale d'envoi d'email */
module.exports.sendEmail = async (email, subject, text) => {
  try {
    await transporter.sendMail({
      from: `NeoActivation <${process.env.USER}>`,
      to: email,
      subject: subject,
      html: text,
    });

    console.log("Email envoyé");
  } catch (error) {
    console.log("Email not sent" + error);
  }
};
