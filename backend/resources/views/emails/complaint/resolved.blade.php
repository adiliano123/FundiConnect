<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Complaint Resolved</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f3f4f6; font-family: 'Segoe UI', Arial, sans-serif; color: #374151; }
  .wrapper { max-width: 600px; margin: 40px auto; }
  .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
  .header { background: #1D234F; padding: 32px; text-align: center; }
  .header .logo { color: #FFD530; font-size: 26px; font-weight: 800; }
  .header .tagline { color: rgba(255,255,255,.6); font-size: 13px; margin-top: 4px; }
  .hero { padding: 28px 32px; text-align: center; }
  .hero-resolved { background: linear-gradient(135deg, #059669, #047857); }
  .hero-dismissed { background: linear-gradient(135deg, #6b7280, #4b5563); }
  .hero .icon { font-size: 48px; }
  .hero h1 { color: #fff; font-size: 22px; font-weight: 700; margin-top: 12px; }
  .hero p { color: rgba(255,255,255,.8); font-size: 14px; margin-top: 6px; }
  .body { padding: 32px; }
  .detail-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
  .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { color: #6b7280; font-weight: 500; }
  .detail-value { color: #111827; font-weight: 600; text-align: right; }
  .resolution-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 14px; line-height: 1.6; color: #166534; }
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
    <div class="hero hero-{{ $complaint->status }}">
      <div class="icon">{{ $complaint->status === 'resolved' ? '✅' : '📁' }}</div>
      <h1>{{ $complaint->status === 'resolved' ? 'Complaint Resolved' : 'Complaint Closed' }}</h1>
      <p>{{ $complaint->status === 'resolved' ? 'Your issue has been addressed' : 'Your complaint has been reviewed' }}</p>
    </div>
    <div class="body">
      <p style="font-size:15px;color:#111827;">Hi <strong>{{ $complaint->complainant->name }}</strong>,</p>
      <p style="font-size:14px;line-height:1.7;color:#4b5563;margin-top:12px;">
        Our support team has reviewed your complaint and has marked it as
        <strong>{{ $complaint->status === 'resolved' ? 'resolved' : 'dismissed' }}</strong>.
      </p>

      <div class="detail-box">
        <div class="detail-row">
          <span class="detail-label">Complaint ID</span>
          <span class="detail-value" style="color:#1C9AD6;">#{{ $complaint->id }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Subject</span>
          <span class="detail-value">{{ $complaint->subject }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Outcome</span>
          <span class="detail-value" style="color: {{ $complaint->status === 'resolved' ? '#059669' : '#6b7280' }};">
            {{ ucfirst($complaint->status) }}
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Resolved At</span>
          <span class="detail-value">{{ $complaint->resolved_at?->format('D, d M Y \a\t H:i') ?? 'N/A' }}</span>
        </div>
      </div>

      @if($complaint->resolution_notes)
        <p style="font-size:13px;font-weight:600;color:#374151;margin-bottom:8px;">Resolution Notes:</p>
        <div class="resolution-box">{{ $complaint->resolution_notes }}</div>
      @endif

      <p style="font-size:13px;color:#9ca3af;text-align:center;margin-top:16px;">
        If you're not satisfied with this outcome, please contact us at
        <a href="mailto:support@fundiconnect.co.tz" style="color:#1C9AD6;">support@fundiconnect.co.tz</a>
      </p>

      <a href="{{ env('FRONTEND_URL') }}/dashboard/customer" class="btn">Back to Dashboard</a>
    </div>
    <div class="footer">
      © {{ date('Y') }} FundiConnect Tanzania · All rights reserved<br>
      <a href="{{ env('FRONTEND_URL') }}">fundiconnect.co.tz</a>
    </div>
  </div>
</div>
</body>
</html>
