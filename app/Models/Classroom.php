<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'users_id'
    ];
    // app/Models/Classroom.php
public function works()
{
    return $this->hasMany(Work::class);
}
}
