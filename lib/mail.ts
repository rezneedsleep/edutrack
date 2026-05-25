import nodemailer from "nodemailer"

// Supabase SMTP Configuration
// Get these from Supabase Dashboard -> Settings -> Authentication -> SMTP Settings
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || "smtp.supabase.com",
  port: Number(process.env.EMAIL_SERVER_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function sendPasswordResetEmail(email: string, token: string) {
  // Check if SMTP is configured
  if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
    console.log("------------------------------------------")
    console.log("📧 EMAIL SIMULATION (SMTP NOT CONFIGURED)")
    console.log(`To: ${email}`)
    console.log(`Verification Code: ${token}`)
    console.log("------------------------------------------")
    return
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"EduTrack" <noreply@edutrack.com>',
    to: email,
    subject: "Kode Verifikasi Reset Password - EduTrack",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #0A84FF; text-transform: uppercase; font-style: italic; font-weight: 900;">EduTrack</h2>
        <p>Anda menerima email ini karena kami menerima permintaan reset password untuk akun Anda.</p>
        <p>Gunakan kode verifikasi di bawah ini untuk mengatur ulang password Anda:</p>
        <div style="margin: 32px 0; text-align: center;">
          <div style="background-color: #f3f4f6; color: #000; padding: 24px; font-size: 32px; font-weight: 900; letter-spacing: 0.5em; border-radius: 8px; border: 1px dashed #0A84FF;">
            ${token}
          </div>
        </div>
        <p style="color: #6b7280; font-size: 12px;">Kode ini akan kedaluwarsa dalam 1 jam.</p>
        <p style="color: #6b7280; font-size: 12px;">Jika Anda tidak meminta reset password, abaikan email ini.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #9ca3af; font-size: 10px; text-align: center;">© ${new Date().getFullYear()} EDUTRACK ECOSYSTEM</p>
      </div>
    `,
  })
}
