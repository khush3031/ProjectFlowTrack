export function otpEmailTemplate({ otp, userName, expiryMinutes = 10 }) {
  return {
    subject: 'Your TrackFlow password reset code',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset your password</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0f2f5; }
  </style>
</head>
<body style="background:#f0f2f5; padding: 40px 16px;">

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center">

        <!-- Wrapper -->
        <table width="100%" style="max-width:520px;" cellpadding="0" cellspacing="0" role="presentation">

          <!-- Logo row -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background:#4f46e5; border-radius:10px; width:44px; height:44px; text-align:center; vertical-align:middle;">
                    <span style="color:#ffffff; font-size:16px; font-weight:700; letter-spacing:-0.5px; line-height:44px; display:block;">TF</span>
                  </td>
                  <td style="padding-left:10px; vertical-align:middle;">
                    <span style="font-size:18px; font-weight:700; color:#1a202c; letter-spacing:-0.3px;">TrackFlow</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff; border-radius:16px; border:1px solid #e2e8f0; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

              <!-- Card top accent -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); height:5px;"></td>
                </tr>
              </table>

              <!-- Card body -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding: 40px 40px 32px;">

                    <!-- Icon -->
                    <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px;">
                      <tr>
                        <td style="background:#ede9fe; border-radius:12px; width:52px; height:52px; text-align:center; vertical-align:middle;">
                          <span style="font-size:24px; line-height:52px; display:block;">🔐</span>
                        </td>
                      </tr>
                    </table>

                    <!-- Heading -->
                    <h1 style="font-size:22px; font-weight:700; color:#1a202c; margin-bottom:10px; letter-spacing:-0.4px; line-height:1.3;">
                      Reset your password
                    </h1>
                    <p style="font-size:14.5px; color:#4a5568; line-height:1.65; margin-bottom:28px;">
                      Hi ${userName ? `<strong style="color:#1a202c;">${userName}</strong>` : 'there'}, we received a request to reset your
                      TrackFlow account password. Use the code below to continue.
                    </p>

                    <!-- OTP box -->
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:28px;">
                      <tr>
                        <td style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%); border:1.5px solid #c4b5fd; border-radius:12px; padding: 24px 20px; text-align:center;">
                          <p style="font-size:11px; font-weight:600; color:#7c3aed; letter-spacing:2px; text-transform:uppercase; margin-bottom:10px;">
                            Verification Code
                          </p>
                          <p style="font-size:40px; font-weight:700; color:#4f46e5; letter-spacing:10px; font-family:'Courier New', monospace; line-height:1.2;">
                            ${otp}
                          </p>
                          <p style="font-size:12px; color:#6d28d9; margin-top:10px;">
                            Expires in <strong>${expiryMinutes} minutes</strong>
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- Steps -->
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:28px;">
                      <tr>
                        <td style="background:#f8fafc; border-radius:10px; padding:18px 20px;">
                          <p style="font-size:12.5px; font-weight:600; color:#475569; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.5px;">
                            What to do next
                          </p>
                          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td style="padding: 4px 0;">
                                <table cellpadding="0" cellspacing="0" role="presentation">
                                  <tr>
                                    <td style="width:20px; font-size:12px; color:#7c3aed; font-weight:700; vertical-align:top; padding-top:1px;">1.</td>
                                    <td style="font-size:13px; color:#4a5568; padding-left:4px;">Copy the 6-digit code above</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 4px 0;">
                                <table cellpadding="0" cellspacing="0" role="presentation">
                                  <tr>
                                    <td style="width:20px; font-size:12px; color:#7c3aed; font-weight:700; vertical-align:top; padding-top:1px;">2.</td>
                                    <td style="font-size:13px; color:#4a5568; padding-left:4px;">Return to the TrackFlow reset page</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 4px 0;">
                                <table cellpadding="0" cellspacing="0" role="presentation">
                                  <tr>
                                    <td style="width:20px; font-size:12px; color:#7c3aed; font-weight:700; vertical-align:top; padding-top:1px;">3.</td>
                                    <td style="font-size:13px; color:#4a5568; padding-left:4px;">Enter the code and choose a new password</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Warning -->
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="background:#fff7ed; border-left:3px solid #f97316; border-radius:0 8px 8px 0; padding:12px 16px;">
                          <p style="font-size:12.5px; color:#9a3412; line-height:1.5;">
                            <strong>Didn't request this?</strong> You can safely ignore this email — your password won't change unless you enter this code.
                          </p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 8px 8px; text-align:center;">
              <p style="font-size:12px; color:#94a3b8; line-height:1.6;">
                This email was sent by <strong style="color:#64748b;">TrackFlow</strong> &bull; Do not reply to this email
              </p>
              <p style="font-size:11px; color:#cbd5e1; margin-top:6px;">
                &copy; ${new Date().getFullYear()} TrackFlow. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`,
  }
}
