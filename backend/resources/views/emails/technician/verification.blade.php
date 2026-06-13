<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Technician Verification</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f3f4f6; font-family: 'Segoe UI', Arial, sans-serif; color: #374151; }
  .wrapper { max-width: 600px; margin: 40px auto; }
  .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
  .header { background: #1D234F; padding: 32px; text-align: center; }
  .header .logo { color: #FFD530; font-size: 26px; font-weight: 800; }
  .header .tagline { color: rgba(255,255,255,.6); font-size: 13px; margin-top: 4px; }
  .hero-verified  { background: linear-gradient(135deg, #059669, #047857); }
  .hero-rejected  { background: linear-gradient(135deg, #dc2626, #b91c1c); }
  .hero { padding: 28px 32px; text-align: center; }
  .hero .icon { font-size: 48px; }
  .hero h1 { color: #fff; font-size: 22px; font-weight: 700; margin-top: 12px; }
  .hero p { color: rgba(255,255,255,.8); font-size: 14px; margin-top: 6px; }
  .body { padding: 32px; }
  .steps { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0; }
  .steps h3 { color: #166534; font-size: 15px; margin-bottom: 12px; }
  .step { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 10px; font-size: 14px; color: #374151; }
  .step-num { background: #059669; color: #fff; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
  .alert-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 14px; line-height: 1.6; color: #991b1b; }
  .badge { display: inline-block; background: #059669; color: #fff; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; margin: 8px 0; }
  .btn { display: block; width: fit-content; margin: 24px auto 0; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; color: #ffffff; background: #1C9AD6; }
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

    <div class="hero hero-{{ $technician->verification_status }}">
      @if($technician->verification_status === 'verified')
        <div class="icon">✅</div>
        <h1>Account Verified!</h1>
        <p>You're now a verified FundiConnect technician</p>
      @else
        <div class="icon">❌</div>
        <h1>Verification Unsuccessful</h1>
        <p>Your application could not be approved at this time</p>
      @endif
    </div>

    <div class="body">
      <p style="font-size:15px;color:#111827;">Hi <strong>{{ $technician->user->name }}</strong>,</p>

      @if($technician->verification_status === 'verified')
        <p style="font-size:14px;line-height:1.7;color:#4b5563;margin-top:12px;">
          Congratulations! Your FundiConnect technician account has been reviewed and <strong>approved</strong>.
          You can now receive bookings from customers across Tanzania.
        </p>

        <div class="steps">
          <h3>🚀 Get Started in 3 Steps</h3>
          <div class="step">
            <div class="step-num">1</div>
            <span>Complete your profile — add a bio, photo, and set your hourly rate</span>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <span>Set your availability and service area so customers can find you</span>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <span>Wait for your first booking — respond quickly to build your rating!</span>
          </div>
        </div>

        <div style="text-align:center;margin:16px 0;">
          <span class="badge">✓ Verified Technician</span>
        </div>

      @else
        <p style="font-size:14px;line-height:1.7;color:#4b5563;margin-top:12px;">
          Unfortunately, your technician application was not approved after review.
        </p>

        @if($technician->rejection_reason)
          <div class="alert-box">
            <strong>Reason:</strong> {{ $technician->rejection_reason }}
          </div>
        @endif

        <p style="font-size:14px;color:#4b5563;margin-top:12px;">
          You may re-apply after addressing the issue above. If you believe this is an error,
          please contact our support team.
        </p>
      @endif

      <a href="{{ env('FRONTEND_URL') }}/dashboard/technician" class="btn">
        {{ $technician->verification_status === 'verified' ? 'Go to Dashboard' : 'Contact Support' }}
      </a>

      <p style="font-size:13px;color:#9ca3af;text-align:center;margin-top:20px;">
        Questions? <a href="mailto:support@fundiconnect.co.tz" style="color:#1C9AD6;">support@fundiconnect.co.tz</a>
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
