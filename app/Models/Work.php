<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Work extends Model
{
    protected $fillable = [
        'name',
        'teacher_id', // Make sure this is correct
        'work_id',
        'title',
        'description',
        'status',
    ];
    // app/Models/Work.php
    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }
}
