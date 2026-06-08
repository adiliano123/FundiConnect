<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PortfolioImage extends Model
{
    use HasFactory;

    protected $fillable = ['technician_id', 'image_path', 'caption', 'is_featured'];

    protected $casts = ['is_featured' => 'boolean'];

    protected $appends = ['image_url'];

    public function technician()
    {
        return $this->belongsTo(Technician::class);
    }

    public function getImageUrlAttribute(): string
    {
        return str_starts_with($this->image_path, 'http')
            ? $this->image_path
            : asset('storage/' . $this->image_path);
    }
}
