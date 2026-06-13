<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Complaint Received</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f3f4f6; font-family: 'Segoe UI', Arial, sans-serif; color: #374151; }
  .wrapper { max-width: 600px; margin: 40px auto; }
  .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
  .header { background: #1D234F; padding: 32px; text-align: center; }
  .header .logo { color: #FFD530; font-size: 26px; font-weight: 800; }
  .header .tagline { color: rgba(255,255,255,.6); font-size: 13px; margin-top: 4px; }
  .hero { background: linear-gradient(135deg, #d97706, #b45309); padding: 28px 32px; text-align: center; }
  .hero .icon { font-size: 48px; }
  .hero h1 { color: #fff; font-size: 22px; font-weight: 700; margin-top: 12px; }
  .hero p { color: rgba(255,255,255,.8); font-size: 14px; margin-top: 6px; }
  .body { padding: 32px; }
  .detail-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
  .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { color: #6b7280; font-weight: 500; }
  .detail-value { color: #111827; font-weight: 600; text-align: right; max-width: 300px; }
  .description-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 14px; line-height: 1.6; color: #92400e; }
  .info-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 14px; line-height: 1.6; color: #1e40af; }
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
    <div class="hero">
      <div class="icon">🚨</div>
      @if($recipient === 'admin')
        <h1>New Complaint Filed</h1>
        <p>A user has submitted a complaint that requires attention</p>
      @else
        <h1>Complaint Received</h1>
        <p>We've received your complaint and will look into it</p>
      @endif
    </div>
    <div class="body">
      @if($recipient === 'admin')
        <p style="font-size:15px;color:#111827;">Hi <strong>Admin</strong>,</p>
        <p style="font-size:14px;line-height:1.7;color:#4b5563;margin-top:12px;">
          <strong>{{ $complaint->complainant->name }}</strong> has filed a complaint. Please review and take appropriate action.
        </p>
      @else
        <p style="font-size:15px;color:#111827;">Hi <strong>{{ $complaint->complainant->name }}</strong>,</p>
        <p style="font-size:14px;line-height:1.7;color:#4b5563;margin-top:12px;">
          We've received your complaint and our support team will review it shortly. We typically respond within <strong>24–48 hours</strong>.
        </p>
      @endif

      <div class="detail-box">
        <div class="detail-row">
          <span class="detail-label">Complaint ID</span>
          <span class="detail-value" style="color:#1C9AD6;">#{{ $complaint->id }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Subject</span>
          <span class="detail-value">{{ $complaint->subject }}</span>
        </div>
        @if($complaint->booking)
        <div class="detail-row">
          <span class="detail-label">Related Booking</span>
          <span class="detail-value">{{ $complaint->booking->booking_number }}</span>
        </div>
        @endif
        <div class="detail-row">
          <span class="detail-label">Filed By</span>
          <span class="detail-value">{{ $complaint->complainant->name }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Against</span>
          <span class="detail-value">{{ $complaint->respondent->name }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Submitted</span>
          <span class="detail-value">{{ $complaint->created_at->format('D, d M Y \a\t H:i') }}</span>
        </div>
      </div>

      <p style="font-size:13px;font-weight:600;color:#374151;margin-bottom:8px;">Description:</p>
      <div class="description-box">{{ $complaint->description }}</div>

      @if($recipient !== 'admin')
        <div class="info-box">
          ℹ️ You'll receive another email once your complaint has been reviewed and resolved. Thank you for helping us maintain quality on FundiConnect.
        </div>
      @endif

      <a href="{{ env('FRONTEND_URL') }}/{{ $recipient === 'admin' ? 'admin/complaints' : 'dashboard/customer/complaints' }}" class="btn">
        {{ $recipient === 'admin' ? 'Review in Admin Dashboard' : 'View My Complaints' }}
      </a>
    </div>
    <div class="footer">
      © {{ date('Y') }} FundiConnect Tanzania · All rights reserved<br>
      <a href="{{ env('FRONTEND_URL') }}">fundiconnect.co.tz</a>
    </div>
  </div>
</div>
</body>
</html>
