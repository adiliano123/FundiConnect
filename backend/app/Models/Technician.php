<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Technician extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'category_id', 'bio', 'description', 'experience_years',
        'id_number', 'license_number', 'hourly_rate', 'rating', 'total_reviews',
        'total_jobs', 'service_area', 'is_available', 'verification_status',
        'rejection_reason', 'working_hours',
    ];

    protected $casts = [
        'is_available'  => 'boolean',
        'working_hours' => 'array',
        'rating'        => 'float',
        'hourly_rate'   => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Category::class, 'technician_skills');
    }

    public function portfolioImages()
    {
        return $this->hasMany(PortfolioImage::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    public function walletTransactions()
    {
        return $this->hasMany(WalletTransaction::class);
    }

    public function withdrawalRequests()
    {
        return $this->hasMany(WithdrawalRequest::class);
    }

    public function isVerified(): bool
    {
        return $this->verification_status === 'verified';
    }

    public function updateRating(): void
    {
        $avg = $this->reviews()->where('is_published', true)->avg('rating') ?? 0;
        $count = $this->reviews()->where('is_published', true)->count();
        $this->update(['rating' => round($avg, 2), 'total_reviews' => $count]);
    }
}
