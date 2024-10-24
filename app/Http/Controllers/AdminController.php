<?php

namespace App\Http\Controllers;
use Inertia\Inertia;

use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        $users = User::all(); // Fetch all users
        return Inertia::render('AdminPanel', [
            'auth' => auth()->user(), // Current authenticated user
            'users' => $users // Pass users to the component
        ]);
    }
    public function destroy($id) {
        User::find($id)->delete(); // Delete user
        return response()->json(['message' => 'User deleted']);
    }

}
