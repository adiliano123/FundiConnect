<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Payment Received</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f3f4f6; font-family: 'Segoe UI', Arial, sans-serif; color: #374151; }
  .wrapper { max-width: 600px; margin: 40px auto; }
  .card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
  .header { background: #1D234F; padding: 32px; text-align: center; }
  .header .logo { color: #FFD530; font-size: 26px; font-weight: 800; }
  .header .tagline { color: rgba(255,255,255,.6); font-size: 13px; margin-top: 4px; }
  .hero { background: linear-gradient(135deg, #059669, #1D234F); padding: 28px 32px; text-align: center; }
  .hero .icon { font-size: 48px; }
  .hero h1 { color: #fff; font-size: 22px; font-weight: 700; margin-top: 12px; }
  .amount-badge { display: inline-block; background: rgba(255,255,255,.15); color: #fff; font-size: 28px; font-weight: 800; padding: 10px 24px; border-radius: 50px; margin-top: 12px; }
  .body { padding: 32px; }
  .detail-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
  .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { color: #6b7280; font-weight: 500; }
  .detail-value { color: #111827; font-weight: 600; text-align: right; }
  .highlight { color: #059669; }
  .btn { display: block; width: fit-content; margin: 24px auto 0; background: #1C9AD6; color: #fff; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; }
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
      <div class="icon">💰</div>
      <h1>Payment Received!</h1>
      <div class="amount-badge">TZS {{ number_format($payment->technician_payout, 0) }}</div>
      <p style="color:rgba(255,255,255,.8);font-size:13px;margin-top:8px;">Credited to your wallet</p>
    </div>
    <div class="body">
      <p style="font-size:15px;color:#111827;margin-bottom:16px;">
        Hi <strong>{{ $payment->booking->technician->user->name }}</strong>,
      </p>
      <p style="font-size:14px;line-height:1.7;color:#4b5563;">
        Great news! A customer has paid for their booking. Your earnings have been added to your wallet and are ready for withdrawal.
      </p>
      <div class="detail-box">
        <div class="detail-row">
          <span class="detail-label">Booking Number</span>
          <span class="detail-value" style="color:#1C9AD6;font-family:monospace;">{{ $payment->booking->booking_number }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Service</span>
          <span class="detail-value">{{ $payment->booking->category->name }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Customer Paid</span>
          <span class="detail-value">TZS {{ number_format($payment->amount, 0) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Platform Fee ({{ $payment->commission_rate }}%)</span>
          <span class="detail-value">- TZS {{ number_format($payment->platform_fee, 0) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Your Earnings</span>
          <span class="detail-value highlight">TZS {{ number_format($payment->technician_payout, 0) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Payment Method</span>
          <span class="detail-value" style="text-transform:uppercase;">{{ $payment->payment_method }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Paid At</span>
          <span class="detail-value">{{ $payment->paid_at?->format('D, d M Y H:i') }}</span>
        </div>
      </div>
      <a href="{{ env('FRONTEND_URL') }}/dashboard/technician/wallet" class="btn">View Wallet</a>
    </div>
    <div class="footer">
      © {{ date('Y') }} FundiConnect Tanzania · All rights reserved<br>
      <a href="{{ env('FRONTEND_URL') }}">fundiconnect.co.tz</a>
    </div>
  </div>
</div>
</body>
</html>
