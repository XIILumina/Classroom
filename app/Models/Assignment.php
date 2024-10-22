<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'users_id'
    ];

// app/Models/Assignment.php
public function work()
{
    return $this->belongsTo(Work::class);
}
}
