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
    ];

    // Relationship with works
    public function works()
    {
        return $this->hasMany(Work::class);
    }
}
