<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id', 'complainant_id', 'respondent_id', 'subject', 'description',
        'status', 'resolution_notes', 'resolved_by', 'resolved_at',
    ];

    protected $casts = ['resolved_at' => 'datetime'];

    public function booking()      { return $this->belongsTo(Booking::class); }
    public function complainant()  { return $this->belongsTo(User::class, 'complainant_id'); }
    public function respondent()   { return $this->belongsTo(User::class, 'respondent_id'); }
    public function resolvedBy()   { return $this->belongsTo(User::class, 'resolved_by'); }
}
