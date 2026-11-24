import nodemailer from "nodemailer";

type PasswordChangeVerificationEmail = {
  recipientEmail: string;
  verificationCode: string;
};

const getRequiredEmailConfiguration = (name: string) => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
};

const getEmailTransporter = () => {
  const port = Number(getRequiredEmailConfiguration("SMTP_PORT"));

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("SMTP_PORT must be a valid port number.");
  }

  return nodemailer.createTransport({
    host: getRequiredEmailConfiguration("SMTP_HOST"),
    port,
    secure: port === 465,
    auth: {
      user: getRequiredEmailConfiguration("SMTP_USER"),
      pass: getRequiredEmailConfiguration("SMTP_PASSWORD"),
    },
  });
};

export const sendPasswordChangeVerificationEmail = async ({
  recipientEmail,
  verificationCode,
}: PasswordChangeVerificationEmail) => {
  const transporter = getEmailTransporter();

  await transporter.sendMail({
    from: getRequiredEmailConfiguration("SMTP_FROM"),
    to: recipientEmail,
    subject: "MediConnect password change verification code",
    text: `Your MediConnect password change verification code is ${verificationCode}. It expires in 10 minutes. Do not share this code with anyone.`,
  });
};
