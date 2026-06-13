<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Booking Update</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f3f4f6; font-family: 'Segoe UI', Arial, sans-serif; color: #374151; }
  .wrapper { max-width: 600px; margin: 40px auto; }
  .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
  .header { background: #1D234F; padding: 32px; text-align: center; }
  .header .logo { color: #FFD530; font-size: 26px; font-weight: 800; }
  .header .tagline { color: rgba(255,255,255,.6); font-size: 13px; margin-top: 4px; }
  .hero-accepted  { background: linear-gradient(135deg, #059669, #047857); }
  .hero-rejected  { background: linear-gradient(135deg, #dc2626, #b91c1c); }
  .hero-in_progress { background: linear-gradient(135deg, #2563eb, #1d4ed8); }
  .hero-completed { background: linear-gradient(135deg, #7c3aed, #6d28d9); }
  .hero-cancelled { background: linear-gradient(135deg, #d97706, #b45309); }
  .hero { padding: 28px 32px; text-align: center; }
  .hero .icon { font-size: 48px; }
  .hero h1 { color: #ffffff; font-size: 22px; font-weight: 700; margin-top: 12px; }
  .hero p { color: rgba(255,255,255,.8); font-size: 14px; margin-top: 6px; }
  .body { padding: 32px; }
  .detail-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
  .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
  .detail-row:last-child { border-bottom: none; }
  .detail-label { color: #6b7280; font-weight: 500; }
  .detail-value { color: #111827; font-weight: 600; text-align: right; }
  .alert-box { border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 14px; line-height: 1.6; }
  .alert-rejected { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
  .alert-completed { background: #f5f3ff; border: 1px solid #ddd6fe; color: #5b21b6; }
  .btn { display: block; width: fit-content; margin: 24px auto 0; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; color: #ffffff; }
  .btn-accepted   { background: #059669; }
  .btn-completed  { background: #7c3aed; }
  .btn-default    { background: #1C9AD6; }
  .star-box { background: #fefce8; border: 1px solid #fef08a; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
  .star-box h3 { color: #854d0e; font-size: 16px; margin-bottom: 8px; }
  .star-box p { color: #713f12; font-size: 13px; }
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

    {{-- Dynamic hero section --}}
    <div class="hero hero-{{ $status }}">
      @if($status === 'accepted')
        <div class="icon">✅</div>
        <h1>Booking Accepted!</h1>
        <p>Your technician is confirmed and ready</p>
      @elseif($status === 'rejected')
        <div class="icon">❌</div>
        <h1>Booking Rejected</h1>
        <p>The technician could not take this job</p>
      @elseif($status === 'in_progress')
        <div class="icon">🔧</div>
        <h1>Work In Progress</h1>
        <p>Your technician has started the job</p>
      @elseif($status === 'completed')
        <div class="icon">🎉</div>
        <h1>Job Completed!</h1>
        <p>Your service has been completed successfully</p>
      @elseif($status === 'cancelled')
        <div class="icon">🚫</div>
        <h1>Booking Cancelled</h1>
        <p>This booking has been cancelled</p>
      @endif
    </div>

    <div class="body">
      <p style="font-size:15px;color:#111827;margin-bottom:16px;">
        Hi <strong>{{ $recipient === 'technician' ? $booking->technician->user->name : $booking->customer->name }}</strong>,
      </p>

      @if($status === 'accepted')
        <p style="font-size:14px;line-height:1.7;color:#4b5563;">
          Great news! <strong>{{ $booking->technician->user->name }}</strong> has accepted your booking and will arrive at the scheduled time. Make sure the work area is accessible.
        </p>

      @elseif($status === 'rejected')
        <p style="font-size:14px;line-height:1.7;color:#4b5563;">
          Unfortunately, the technician was unable to accept your booking at this time.
        </p>
        @if($booking->rejection_reason)
          <div class="alert-box alert-rejected">
            <strong>Reason:</strong> {{ $booking->rejection_reason }}
          </div>
        @endif
        <p style="font-size:14px;color:#4b5563;margin-top:12px;">Please search for another available technician — we have many great professionals ready to help.</p>

      @elseif($status === 'in_progress')
        <p style="font-size:14px;line-height:1.7;color:#4b5563;">
          <strong>{{ $booking->technician->user->name }}</strong> has started working on your job. You'll be notified once the work is complete.
        </p>

      @elseif($status === 'completed')
        <p style="font-size:14px;line-height:1.7;color:#4b5563;">
          Your booking has been marked as complete. We hope you're satisfied with the service from <strong>{{ $booking->technician->user->name }}</strong>!
        </p>
        <div class="star-box">
          <h3>⭐ How was the service?</h3>
          <p>Your review helps other customers choose the right technician. It only takes 30 seconds!</p>
        </div>

      @elseif($status === 'cancelled')
        <p style="font-size:14px;line-height:1.7;color:#4b5563;">
          Booking <strong>#{{ $booking->booking_number }}</strong> has been cancelled. If this was unexpected, please contact our support team.
        </p>
      @endif

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
          <span class="detail-label">Scheduled</span>
          <span class="detail-value">{{ \Carbon\Carbon::parse($booking->scheduled_at)->format('D, d M Y \a\t H:i') }}</span>
        </div>
        @if($booking->final_cost)
        <div class="detail-row">
          <span class="detail-label">Final Cost</span>
          <span class="detail-value">TZS {{ number_format($booking->final_cost) }}</span>
        </div>
        @endif
      </div>

      @if($status === 'completed')
        <a href="{{ env('FRONTEND_URL') }}/dashboard/customer/bookings" class="btn btn-completed">Leave a Review</a>
      @elseif($status === 'rejected')
        <a href="{{ env('FRONTEND_URL') }}/technicians" class="btn btn-default">Find Another Technician</a>
      @else
        <a href="{{ env('FRONTEND_URL') }}/dashboard/customer/bookings" class="btn btn-default">View Booking</a>
      @endif

      <p style="font-size:13px;color:#9ca3af;text-align:center;margin-top:20px;">
        Need help? Contact us at <a href="mailto:support@fundiconnect.co.tz" style="color:#1C9AD6;">support@fundiconnect.co.tz</a>
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
