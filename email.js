const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "anilpadghane12@gmail.com",
    pass: "frit eaiz hamw ytsl",
  },
});

const sendOTP = async (gmail, otp) => {
  const info = await transporter.sendMail({
    from: ' <anilpadghane12@gmail.com>',
    to: gmail,
    subject: "Your OTP Code",
    html: ` Hello ${gmail} <b>Your OTP is: ${otp}</b>`,
  });

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendOTP; // ✅ Ensure this line exists
