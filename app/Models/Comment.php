<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = ['work_id', 'text']; // Atļautie laukumi masveida piepildīšanai

    // Attiecības: katram komentāram ir darbs
    public function work()
    {
        return $this->belongsTo(Work::class); // Saistība ar Work modeli
    }
}
    
