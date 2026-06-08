<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to FundiConnect</title>
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
  .steps { margin: 24px 0; }
  .step { display: flex; align-items: flex-start; gap: 14px; padding: 14px 0; border-bottom: 1px solid #f3f4f6; }
  .step:last-child { border-bottom: none; }
  .step-num { flex-shrink: 0; width: 32px; height: 32px; background: #e0f2fe; color: #1C9AD6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
  .step-text h3 { font-size: 14px; font-weight: 600; color: #111827; }
  .step-text p { font-size: 13px; color: #6b7280; margin-top: 2px; line-height: 1.5; }
  .badge-role { display: inline-block; padding: 3px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .badge-customer { background: #dbeafe; color: #1d4ed8; }
  .badge-technician { background: #d1fae5; color: #065f46; }
  .btn { display: block; width: fit-content; margin: 28px auto 0; background: #1C9AD6; color: #ffffff; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; }
  .info-text { font-size: 13px; color: #6b7280; text-align: center; margin-top: 20px; line-height: 1.6; }
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
      <div class="icon">🎉</div>
      <h1>Welcome aboard, {{ $user->name }}!</h1>
      <p>Your account has been created successfully</p>
    </div>
    <div class="body">
      <p class="greeting">
        Hi <strong>{{ $user->name }}</strong>,
        <span class="badge-role {{ $user->role === 'technician' ? 'badge-technician' : 'badge-customer' }}">
          {{ ucfirst($user->role) }}
        </span>
      </p>
      <p style="font-size:14px;line-height:1.7;color:#4b5563;">
        @if($user->role === 'technician')
          Thanks for joining FundiConnect as a technician. Complete your profile and wait for admin verification — once approved, clients will start finding you.
        @else
          Thanks for joining FundiConnect! You can now browse verified technicians and book services across Tanzania.
        @endif
      </p>

      <div class="steps">
        @if($user->role === 'technician')
          <div class="step">
            <div class="step-num">1</div>
            <div class="step-text">
              <h3>Complete your profile</h3>
              <p>Add your bio, hourly rate, city, and skills so clients can find you.</p>
            </div>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <div class="step-text">
              <h3>Wait for verification</h3>
              <p>Our admin team will review and verify your account within 24 hours.</p>
            </div>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <div class="step-text">
              <h3>Start receiving jobs</h3>
              <p>Once verified, clients will be able to book you directly.</p>
            </div>
          </div>
        @else
          <div class="step">
            <div class="step-num">1</div>
            <div class="step-text">
              <h3>Browse technicians</h3>
              <p>Find verified professionals by service category or city.</p>
            </div>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <div class="step-text">
              <h3>Book a service</h3>
              <p>Choose your preferred technician and schedule a convenient time.</p>
            </div>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <div class="step-text">
              <h3>Rate your experience</h3>
              <p>Leave a review after the job is done to help others choose confidently.</p>
            </div>
          </div>
        @endif
      </div>

      <a href="{{ env('FRONTEND_URL') }}/dashboard" class="btn">Go to Dashboard</a>

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
