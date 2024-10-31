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
        'auth' => [
            'user' => auth()->user(),
            'role' => auth()->user()->role, // Explicitly pass the role
        ],
        'users' => $users, // Pass users to the component
    ]);
}

public function destroy($id)
{
    User::find($id)->delete(); // Delete user
    return response()->json(['message' => 'User deleted']);
}

public function edit($id)
{
    $user = User::findOrFail($id);
    return Inertia::render('EditUser', [
        'auth' => [
            'user' => auth()->user(),
            'role' => auth()->user()->role, // Explicitly pass the role
        ],
        'user' => $user
    ]);
}

public function update(Request $request, $id)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255|unique:users,email,' . $id,
    ]);

    $user = User::findOrFail($id);
    $user->update($request->only(['name', 'email']));

    return redirect()->route('adminPanel')->with('success', 'User updated successfully!');
}
}
