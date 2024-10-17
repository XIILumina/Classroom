<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index() {
        $users = User::all(); // Get all users
        return response()->json($users);
    }   
    
    public function destroy($id) {
        User::find($id)->delete(); // Delete user
        return response()->json(['message' => 'User deleted']);
    }
    
}
