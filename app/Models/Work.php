<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Work extends Model
{
    use HasFactory;
    // app/Models/Work.php
    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }
}
