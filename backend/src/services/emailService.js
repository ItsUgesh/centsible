const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

const sendVerificationEmail = async (to, name, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`

  const { error } = await resend.emails.send({
    from: 'Centsible <noreply@mail.ugeshsimkhada.com.np>',
    to,
    subject: 'Verify your Centsible account',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 32px;">
          <span style="font-size: 24px; font-weight: 800; color: #10b981;">Centsible</span>
        </div>

        <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 8px;">
          Verify your email 👋
        </h1>
        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">
          Hey ${name}, thanks for signing up! Click the button below to verify your email address and get started.
        </p>

        <a href="${verifyUrl}"
           style="display: inline-block; background: linear-gradient(135deg, #10b981, #06b6d4); color: white; text-decoration: none; font-weight: 600; font-size: 15px; padding: 14px 32px; border-radius: 12px;">
          Verify my email
        </a>

        <p style="color: #9ca3af; font-size: 13px; margin-top: 32px;">
          This link expires in 24 hours. If you didn't create an account, you can ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">© 2026 Centsible. All rights reserved.</p>
      </div>
    `
  })

  if (error) throw new Error(error.message)
}

const sendPasswordResetEmail = async (to, name, token) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`

  const { error } = await resend.emails.send({
    from: 'Centsible <noreply@mail.ugeshsimkhada.com.np>',
    to,
    subject: 'Reset your Centsible password',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 32px;">
          <span style="font-size: 24px; font-weight: 800; color: #10b981;">Centsible</span>
        </div>

        <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 8px;">
          Reset your password 🔒
        </h1>
        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">
          Hey ${name || 'there'}, we received a request to reset your Centsible password. Click the button below to choose a new password:
        </p>

        <a href="${resetUrl}"
           style="display: inline-block; background: linear-gradient(135deg, #10b981, #06b6d4); color: white; text-decoration: none; font-weight: 600; font-size: 15px; padding: 14px 32px; border-radius: 12px;">
          Reset password
        </a>

        <p style="color: #9ca3af; font-size: 13px; margin-top: 32px;">
          This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">© 2026 Centsible. All rights reserved.</p>
      </div>
    `
  })

  if (error) throw new Error(error.message)
}

const sendGoogleAccountNoticeEmail = async (to, name) => {
  const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`

  const { error } = await resend.emails.send({
    from: 'Centsible <noreply@mail.ugeshsimkhada.com.np>',
    to,
    subject: 'Centsible Sign-In Method',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 32px;">
          <span style="font-size: 24px; font-weight: 800; color: #10b981;">Centsible</span>
        </div>

        <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 8px;">
          Google Account Sign-In 🔑
        </h1>
        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">
          Hey ${name || 'there'}, we received a password reset request for this email address. However, your Centsible account was created using <strong>Google Sign-In</strong>, so you do not have a password.
        </p>

        <a href="${loginUrl}"
           style="display: inline-block; background: linear-gradient(135deg, #10b981, #06b6d4); color: white; text-decoration: none; font-weight: 600; font-size: 15px; padding: 14px 32px; border-radius: 12px;">
          Sign in with Google
        </a>

        <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">© 2026 Centsible. All rights reserved.</p>
      </div>
    `
  })

  if (error) throw new Error(error.message)
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendGoogleAccountNoticeEmail }
