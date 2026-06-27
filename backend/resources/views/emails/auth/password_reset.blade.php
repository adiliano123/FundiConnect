<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reset Your Password</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f3f4f6; font-family: 'Segoe UI', Arial, sans-serif; color: #374151; }
  .wrapper { max-width: 600px; margin: 40px auto; }
  .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
  .header { background: #1D234F; padding: 32px; text-align: center; }
  .header .logo { color: #FFD530; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
  .header .tagline { color: rgba(255,255,255,.6); font-size: 13px; margin-top: 4px; }
  .hero { background: linear-gradient(135deg, #1C9AD6, #1D234F); padding: 28px 32px; text-align: center; }
  .hero .icon { font-size: 48px; }
  .hero h1 { color: #ffffff; font-size: 22px; font-weight: 700; margin-top: 12px; }
  .hero p { color: rgba(255,255,255,.8); font-size: 14px; margin-top: 6px; }
  .body { padding: 32px; }
  .greeting { font-size: 15px; color: #111827; margin-bottom: 16px; }
  .message { font-size: 14px; line-height: 1.7; color: #4b5563; margin-bottom: 24px; }
  .btn { display: block; width: fit-content; margin: 0 auto; background: #1C9AD6; color: #ffffff; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; }
  .divider { border: none; border-top: 1px solid #f3f4f6; margin: 28px 0; }
  .link-fallback { font-size: 12px; color: #9ca3af; text-align: center; margin-top: 20px; line-height: 1.8; word-break: break-all; }
  .link-fallback a { color: #1C9AD6; }
  .warning { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 14px 16px; margin-top: 24px; }
  .warning p { font-size: 13px; color: #92400e; line-height: 1.6; }
  .warning strong { color: #78350f; }
  .info-text { font-size: 13px; color: #6b7280; text-align: center; margin-top: 28px; line-height: 1.6; }
  .info-text a { color: #1C9AD6; text-decoration: none; }
  .footer { text-align: center; padding: 24px; font-size: 12px; color: #9ca3af; }
  .footer a { color: #1C9AD6; text-decoration: none; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="card">

    <div class="header">
      <div class="logo">⚡ FundiConnect</div>
      <div class="tagline">Tanzania's Trusted Technician Marketplace</div>
    </div>

    <div class="hero">
      <div class="icon">🔐</div>
      <h1>Reset Your Password</h1>
      <p>We received a request to reset your password</p>
    </div>

    <div class="body">
      <p class="greeting">Hi <strong>{{ $user->name }}</strong>,</p>

      <p class="message">
        Someone (hopefully you) requested a password reset for your FundiConnect account.
        Click the button below to set a new password. This link will expire in
        <strong>60 minutes</strong>.
      </p>

      <a href="{{ $resetUrl }}" class="btn">Reset My Password</a>

      <hr class="divider">

      <div class="warning">
        <p>
          <strong>Didn't request this?</strong> You can safely ignore this email.
          Your password will not change unless you click the link above.
          If you're concerned about your account security, please contact us immediately.
        </p>
      </div>

      <div class="link-fallback">
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <a href="{{ $resetUrl }}">{{ $resetUrl }}</a>
      </div>

      <p class="info-text">
        Need help? Contact us at
        <a href="mailto:support@fundiconnect.co.tz">support@fundiconnect.co.tz</a>
      </p>
    </div>

    <div class="footer">
      © {{ date('Y') }} FundiConnect Tanzania · All rights reserved<br>
      <a href="{{ env('FRONTEND_URL') }}">fundiconnect.co.tz</a>
    </div>

  </div>
</div>
</body>
</html>
