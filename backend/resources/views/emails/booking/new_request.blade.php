<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Booking Request</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f3f4f6; font-family: 'Segoe UI', Arial, sans-serif; color: #374151; }
  .wrapper { max-width: 600px; margin: 40px auto; }
  .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
  .header { background: #1D234F; padding: 32px; text-align: center; }
  .header .logo { color: #FFD530; font-size: 26px; font-weight: 800; }
  .header .tagline { color: rgba(255,255,255,.6); font-size: 13px; margin-top: 4px; }
  .hero { background: linear-gradient(135deg, #FFD530, #f59e0b); padding: 28px 32px; text-align: center; }
  .hero .icon { font-size: 48px; }
  .hero h1 { color: #1D234F; font-size: 22px; font-weight: 700; margin-top: 12px; }
  .hero p { color: rgba(29,35,79,.7); font-size: 14px; margin-top: 6px; }
  .body { padding: 32px; }
  .detail-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
  .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { color: #6b7280; font-weight: 500; }
  .detail-value { color: #111827; font-weight: 600; text-align: right; max-width: 300px; }
  .description-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 14px; line-height: 1.6; color: #92400e; }
  .actions { display: flex; gap: 12px; margin: 24px 0; }
  .btn-accept { flex: 1; text-align: center; background: #059669; color: #fff; padding: 14px 20px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; }
  .btn-dashboard { flex: 1; text-align: center; background: #1C9AD6; color: #fff; padding: 14px 20px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; }
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
      <div class="icon">🔔</div>
      <h1>New Job Request!</h1>
      <p>A customer wants to book your services</p>
    </div>
    <div class="body">
      <p style="font-size:15px;color:#111827;">Hi <strong>{{ $booking->technician->user->name }}</strong>,</p>
      <p style="font-size:14px;line-height:1.7;color:#4b5563;margin-top:12px;">
        You have a new booking request. Please log in to accept or reject it within <strong>2 hours</strong> to maintain your response rate.
      </p>

      <div class="detail-box">
        <div class="detail-row">
          <span class="detail-label">Booking Number</span>
          <span class="detail-value" style="color:#1C9AD6;">{{ $booking->booking_number }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Customer</span>
          <span class="detail-value">{{ $booking->customer->name }}</span>
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
      </div>

      <p style="font-size:13px;font-weight:600;color:#374151;margin-bottom:8px;">Job Description:</p>
      <div class="description-box">{{ $booking->description }}</div>

      <div class="actions">
        <a href="{{ env('FRONTEND_URL') }}/dashboard/technician" class="btn-accept">Accept Job</a>
        <a href="{{ env('FRONTEND_URL') }}/dashboard/technician" class="btn-dashboard">View Dashboard</a>
      </div>
    </div>
    <div class="footer">
      © {{ date('Y') }} FundiConnect Tanzania · All rights reserved<br>
      <a href="{{ env('FRONTEND_URL') }}">fundiconnect.co.tz</a>
    </div>
  </div>
</div>
</body>
</html>
