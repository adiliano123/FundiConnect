<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Payment Alert</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f3f4f6; font-family: 'Segoe UI', Arial, sans-serif; color: #374151; }
  .wrapper { max-width: 600px; margin: 40px auto; }
  .card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
  .header { background: #1D234F; padding: 32px; text-align: center; }
  .header .logo { color: #FFD530; font-size: 26px; font-weight: 800; }
  .header .tagline { color: rgba(255,255,255,.6); font-size: 13px; margin-top: 4px; }
  .hero { background: linear-gradient(135deg, #7c3aed, #1D234F); padding: 24px 32px; text-align: center; }
  .hero h1 { color: #fff; font-size: 20px; font-weight: 700; }
  .hero p { color: rgba(255,255,255,.8); font-size: 13px; margin-top: 6px; }
  .body { padding: 32px; }
  .stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin: 20px 0; }
  .stat { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px; text-align: center; }
  .stat .value { font-size: 18px; font-weight: 800; color: #1D234F; }
  .stat .label { font-size: 11px; color: #6b7280; margin-top: 2px; }
  .detail-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
  .detail-row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { color: #6b7280; }
  .detail-value { color: #111827; font-weight: 600; }
  .btn { display: block; width: fit-content; margin: 20px auto 0; background: #7c3aed; color: #fff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; }
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
      <h1>💰 New Payment Received</h1>
      <p>{{ $payment->paid_at?->format('D, d M Y \a\t H:i') }}</p>
    </div>
    <div class="body">
      <div class="stats">
        <div class="stat">
          <div class="value">TZS {{ number_format($payment->amount, 0) }}</div>
          <div class="label">Total Amount</div>
        </div>
        <div class="stat">
          <div class="value" style="color:#059669;">TZS {{ number_format($payment->platform_fee, 0) }}</div>
          <div class="label">Platform Fee</div>
        </div>
        <div class="stat">
          <div class="value" style="color:#1C9AD6;">TZS {{ number_format($payment->technician_payout, 0) }}</div>
          <div class="label">Technician Payout</div>
        </div>
      </div>
      <div class="detail-box">
        <div class="detail-row">
          <span class="detail-label">Reference</span>
          <span class="detail-value" style="font-family:monospace;color:#1C9AD6;">{{ $payment->reference }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Booking #</span>
          <span class="detail-value" style="font-family:monospace;">{{ $payment->booking->booking_number }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Service</span>
          <span class="detail-value">{{ $payment->booking->category->name }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Customer</span>
          <span class="detail-value">{{ $payment->customer->name }} ({{ $payment->customer->email }})</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Technician</span>
          <span class="detail-value">{{ $payment->booking->technician->user->name }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Method</span>
          <span class="detail-value" style="text-transform:uppercase;">{{ $payment->payment_method }}</span>
        </div>
        @if($payment->transaction_id)
        <div class="detail-row">
          <span class="detail-label">Transaction ID</span>
          <span class="detail-value" style="font-family:monospace;">{{ $payment->transaction_id }}</span>
        </div>
        @endif
      </div>
      <a href="{{ env('FRONTEND_URL') }}/admin/revenue" class="btn">View in Dashboard</a>
    </div>
    <div class="footer">
      © {{ date('Y') }} FundiConnect Tanzania · All rights reserved<br>
      <a href="{{ env('FRONTEND_URL') }}">fundiconnect.co.tz</a>
    </div>
  </div>
</div>
</body>
</html>
