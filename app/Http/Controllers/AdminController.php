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
            'users' => $users, // Pass users to the component
            'user_id' => $id, // Pass users to the component
        ]);
    }

    public function destroy($id)
    {
        User::find($id)->delete(); // Delete user
        return response()->json(['message' => 'User deleted']);
    }

    // New method to show the edit form
    public function edit($id)
    {
        $user = User::findOrFail($id); // Fetch user by ID
        return Inertia::render('EditUser', [
            'auth' => auth()->user(),
            'user' => $user // Pass user to the component
        ]);
    }

    // New method to update user details
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $id, // Unique validation except for the current user
            // Add more validation rules as needed
        ]);

        $user = User::findOrFail($id); // Fetch user by ID
        $user->update($request->only(['name', 'email'])); // Update user details

        return redirect()->route('adminPanel')->with('success', 'User updated successfully!');
    }
}
