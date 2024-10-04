import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "kyleigh.batz@ethereal.email",
      pass: "fNNZSjYdNprVayT3tM",
    },
});

export async function sendEmail(to, subject, text, html) {
    const info = await transporter.sendMail({
        from: '"Admin" <kyleigh.batz@ethereal.email>',
        to: to,
        subject: subject,
        text: text,
        html: html,
    });
    const url = nodemailer.getTestMessageUrl(info);
    const messageId = info.messageId;
    return {messageId, url};
}