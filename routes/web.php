<?php
use App\Http\Controllers\ClassController;
use App\Http\Controllers\ProfileController;
<<<<<<< HEAD
use App\Http\Controllers\StorageController;
=======
use App\Http\Controllers\CourseController;
>>>>>>> 9d0b646858d90dc53453305f9f3cbf5afbd20773
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});



Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::post('/api/image', [StorageController::class, 'updatePhoto'])->name('profile.photo.update');
    Route::get('/api/image/get', [StorageController::class,'getPhoto'])->name('profile.photo.get');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/courses/store', [CourseController::class, 'store'])->name('courses.store'); // For teachers
    Route::post('/courses/join', [CourseController::class, 'join'])->name('courses.join'); // For students


});

Route::get('/classes', function () {
    return Inertia::render('classes');
});
Route::get('/storage/{any}', function ($any) {
    return file(public_path('storage/'.$any));
})->where('any', '.*');





require __DIR__.'/auth.php';

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/classes', function () {
    return Inertia::render('classes');
});

Route::get('/dashboard', [ClassController::class, 'index'])->middleware(['auth'])->name('dashboard');
Route::post('/class/create', [ClassController::class, 'store'])->middleware(['auth']);
Route::get('/class/{id}', [ClassController::class, 'show'])->middleware(['auth']);

require __DIR__.'/auth.php';
use App\Http\Controllers\UserController;



// // Admin Routes
// Route::middleware(['auth', 'role:admin'])->group(function () {
//     Route::get('/admin', [UserController::class, 'index'])->name('admin.dashboard');
//     Route::get('/admin/user/{id}/edit', [UserController::class, 'editUser'])->name('admin.edit.user');
//     Route::post('/admin/user/{id}', [UserController::class, 'updateUser'])->name('admin.update.user');
// });

// // Teacher Routes
// Route::middleware(['auth', 'role:teacher'])->group(function () {
//     Route::get('/teacher', [UserController::class, 'index'])->name('teacher.dashboard');
//     Route::post('/class/create', [UserController::class, 'createClass'])->name('teacher.create.class');
//     Route::post('/class/{classId}/invite', [UserController::class, 'inviteUserToClass'])->name('teacher.invite.user');
// });

// // User Routes
// Route::middleware(['auth'])->group(function () {
//     Route::get('/dashboard', [UserController::class, 'index'])->name('user.dashboard');
//     Route::post('/assignment/{assignmentId}/submit', [UserController::class, 'submitAssignment'])->name('user.submit.assignment');
//     Route::post('/assignment/{assignmentId}/comment', [UserController::class, 'commentOnAssignment'])->name('user.comment.assignment');
// });