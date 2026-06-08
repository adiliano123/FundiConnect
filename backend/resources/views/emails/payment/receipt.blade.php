<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Payment Receipt</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f3f4f6; font-family: 'Segoe UI', Arial, sans-serif; color: #374151; }
  .wrapper { max-width: 600px; margin: 40px auto; }
  .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
  .header { background: #1D234F; padding: 32px; text-align: center; }
  .header .logo { color: #FFD530; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
  .header .tagline { color: rgba(255,255,255,.6); font-size: 13px; margin-top: 4px; }
  .hero { background: linear-gradient(135deg, #059669, #1D234F); padding: 28px 32px; text-align: center; }
  .hero .icon { font-size: 48px; }
  .hero h1 { color: #ffffff; font-size: 22px; font-weight: 700; margin-top: 12px; }
  .hero p { color: rgba(255,255,255,.8); font-size: 14px; margin-top: 6px; }
  .amount-badge { display: inline-block; background: rgba(255,255,255,.15); color: #fff; font-size: 28px; font-weight: 800; padding: 10px 24px; border-radius: 50px; margin-top: 12px; }
  .body { padding: 32px; }
  .greeting { font-size: 15px; color: #111827; margin-bottom: 16px; }
  .detail-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
  .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { color: #6b7280; font-weight: 500; }
  .detail-value { color: #111827; font-weight: 600; text-align: right; }
  .badge-success { display: inline-block; background: #d1fae5; color: #065f46; padding: 3px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .method-badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
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
      <div class="icon">🧾</div>
      <h1>Payment Received</h1>
      <div class="amount-badge">TZS {{ number_format($payment->amount, 0) }}</div>
      <p style="margin-top:10px;">Your payment has been confirmed</p>
    </div>
    <div class="body">
      <p class="greeting">Hi <strong>{{ $payment->customer->name }}</strong>,</p>
      <p style="font-size:14px;line-height:1.7;color:#4b5563;">
        Thank you for your payment. Below are your transaction details for your records.
      </p>

      <div class="detail-box">
        <div class="detail-row">
          <span class="detail-label">Receipt Reference</span>
          <span class="detail-value" style="color:#1C9AD6; font-family: monospace;">{{ $payment->reference }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Booking Number</span>
          <span class="detail-value" style="font-family: monospace;">{{ $payment->booking->booking_number }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Service</span>
          <span class="detail-value">{{ $payment->booking->category->name }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Technician</span>
          <span class="detail-value">{{ $payment->booking->technician->user->name }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Amount Paid</span>
          <span class="detail-value">TZS {{ number_format($payment->amount, 0) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Payment Method</span>
          <span class="detail-value"><span class="method-badge">{{ $payment->payment_method }}</span></span>
        </div>
        @if($payment->transaction_id)
        <div class="detail-row">
          <span class="detail-label">Transaction ID</span>
          <span class="detail-value" style="font-family: monospace; font-size: 12px;">{{ $payment->transaction_id }}</span>
        </div>
        @endif
        <div class="detail-row">
          <span class="detail-label">Date & Time</span>
          <span class="detail-value">{{ $payment->paid_at->format('D, d M Y \a\t H:i') }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Status</span>
          <span class="detail-value"><span class="badge-success">✓ Paid</span></span>
        </div>
      </div>

      <a href="{{ env('FRONTEND_URL') }}/dashboard/customer/bookings" class="btn">View Booking</a>

      <p class="info-text">
        Keep this email as proof of payment.<br>
        Need help? Contact <a href="mailto:support@fundiconnect.co.tz">support@fundiconnect.co.tz</a>
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
