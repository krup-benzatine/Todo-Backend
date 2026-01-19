import nodemailer from "nodemailer";

interface Nodemailer {
    to: string;
    subject: string;
    text: string;
}

const sendEmail = async ({ to, subject, text }:Nodemailer) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "krup@benzatine.com",
      pass: "oqin zvro fbma jxit"
    }
  });

  await transporter.sendMail({
    from: "krup@benzatine.com",
    to,
    subject,
    text
  });
};

export default sendEmail;
