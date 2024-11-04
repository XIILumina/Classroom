<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassroomUser extends Model
{
    use HasFactory;

    // Specify the table name if it does not follow Laravel's convention
    protected $table = 'classroom_user';

    // If you have timestamps in your pivot table, you may need this
    public $timestamps = true;

    // Define any additional fields you want to be mass-assignable
    protected $fillable = ['classroom_id', 'user_id'];
}
