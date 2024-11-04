<?php 
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'teacher_id', // Make sure this is correct
        'work_id',
        'created_by',
    ];
     
    // public function teacher()
    // {
    //     return $this->belongsTo(User::class, 'teacher_id');
    // }

        public function users()
    {
        return $this->belongsToMany(User::class, 'classroom_user');
    }


    // public function users()
    // {
    //     return $this->belongsToMany(User::class);
    // }
    // public function users()
    // {
    //     return $this->belongsToMany(User::class, 'classroom_user');
    // }
// In Classroom.php
// public function creator()
// {
//     return $this->belongsTo(User::class, 'teacher_id'); // Ensure 'user_id' matches your foreign key
// }
    // public function users()
    // {
    //     return $this->belongsToMany(User::class, 'classroom_user');
    // }

    // Relationship with works
    public function works()
    {
        return $this->hasMany(Work::class);
    }
}
