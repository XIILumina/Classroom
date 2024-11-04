<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'profile_picture',
        'password',
        'class',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
    
// public function classrooms()
// {
//     return $this->hasMany(Classroom::class, 'teacher_id');
// }

// public function classrooms()
// {
//     return $this->belongsToMany(Classroom::class, 'classroom_user');
// }


    // public function classrooms()
    // {
    //     return $this->belongsToMany(Classroom::class);
    // }
    public function classrooms()
    {
        return $this->belongsToMany(Classroom::class, 'classroom_user');
    }

    public function createdClassrooms()
    {
        return $this->hasMany(Classroom::class, 'teacher_id');
    }

    // Klases, kurās skolotājs ir pievienots
    public function joinedClassrooms()
    {
        return $this->belongsToMany(Classroom::class, 'classroom_user');
    }

    // Apvienota metode, lai iegūtu abas klases
    public function allClassrooms()
    {
        // Iegūstam izveidotās klases un pievienotās klases
        $createdClassrooms = $this->createdClassrooms()->get();
        $joinedClassrooms = $this->joinedClassrooms()->get();

        // Apvienojam rezultātus
        return $createdClassrooms->merge($joinedClassrooms);
    }

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
}
