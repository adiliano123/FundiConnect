<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Booking Confirmed</title>
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
  .detail-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
  .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { color: #6b7280; font-weight: 500; }
  .detail-value { color: #111827; font-weight: 600; text-align: right; }
  .badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .btn { display: block; width: fit-content; margin: 24px auto 0; background: #1C9AD6; color: #ffffff; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; }
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
      <div class="icon">✅</div>
      <h1>Booking Confirmed!</h1>
      <p>Your service request has been submitted successfully</p>
    </div>
    <div class="body">
      <p class="greeting">Hi <strong>{{ $booking->customer->name }}</strong>,</p>
      <p style="font-size:14px;line-height:1.7;color:#4b5563;">
        Your booking has been submitted and the technician has been notified. You'll receive another email once they respond — usually within 1 hour.
      </p>

      <div class="detail-box">
        <div class="detail-row">
          <span class="detail-label">Booking Number</span>
          <span class="detail-value" style="color:#1C9AD6;">{{ $booking->booking_number }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Technician</span>
          <span class="detail-value">{{ $booking->technician->user->name }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Service</span>
          <span class="detail-value">{{ $booking->category->name }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date & Time</span>
          <span class="detail-value">{{ \Carbon\Carbon::parse($booking->scheduled_at)->format('D, d M Y \a\t H:i') }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Location</span>
          <span class="detail-value">{{ $booking->address }}, {{ $booking->city }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Status</span>
          <span class="detail-value"><span class="badge">Pending Review</span></span>
        </div>
      </div>

      <a href="{{ env('FRONTEND_URL') }}/dashboard/customer/bookings" class="btn">Track Your Booking</a>

      <p class="info-text">
        Questions? Reply to this email or contact us at
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
