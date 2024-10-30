<?php

use App\Http\Controllers\WorkController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StorageController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|----------------------------------------------------------------------
| Web Routes
|----------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Public routes
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name("welcome");

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [ClassController::class, 'index'])->name('dashboard');

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Class routes
    Route::resource('class', ClassController::class)->except(['index', 'show']);
    Route::get('/class/{id}/show', [ClassController::class, 'show'])->name('class.show');
    Route::post('/class/create', [ClassController::class, 'store'])->name('class.store');

    // Course routes
    Route::post('/courses/store', [CourseController::class, 'store'])->name('courses.store');
    Route::post('/courses/join', [CourseController::class, 'join'])->name('courses.join');

    // Storage routes
    Route::post('/api/image', [StorageController::class, 'updatePhoto'])->name('profile.photo.update');
    Route::get('/api/image/get', [StorageController::class, 'getPhoto'])->name('profile.photo.get');

    // Admin routes
    Route::get('/admin/user/edit/{id}', [AdminController::class, 'edit'])->name('admin.user.edit');
    Route::put('/admin/user/update/{id}', [AdminController::class, 'update'])->name('admin.user.update');

    // Class work routes
    Route::get('/class/{classId}/works', [WorkController::class, 'index'])->name('class.works.index');
    Route::post('/class/{classId}/works/store', [WorkController::class, 'store'])->name('class.works.store');
    Route::put('/class/{classId}/works/{id}', [WorkController::class, 'update'])->name('class.works.update');
    Route::delete('/class/{classId}/works/{id}', [WorkController::class, 'destroy'])->name('class.works.destroy');
});
// In web.php
Route::get('/classroom/{id}', function ($id) {
    return Inertia::render('Classrooms/ClassPage', [
        'classId' => $id,
        'auth' => auth()->user()
    ]);
})->name('classroom.show');

// Additional public routes
Route::get('/classes', function () {
    return Inertia::render('classes');
})->name('classes');

Route::get('/classroom/{id}', function ($id) {
    return Inertia::render('Classrooms/ClassPage', [
        'params' => ['id' => $id]
    ]);
})->name('classroom.show');


Route::get('/works', function () {
    return Inertia::render('works');
})->name('works');

Route::get('/logs', function () {
    return Inertia::render('logs');
})->name('logs');

Route::get('/adminPanel', function () {
    return Inertia::render('adminPanel');
})->name('adminPanel');

// Storage retrieval
Route::get('/storage/{any}', function ($any) {
    return file(public_path('storage/' . $any));
})->where('any', '.*');

// Authentication routes
require __DIR__.'/auth.php';
