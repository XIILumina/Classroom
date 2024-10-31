<?php 
namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;
use App\Models\Log; // Ensure you import the Log model
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        $users = User::all(); // Fetch all users
        // Log the action of viewing users
        $this->storeLog(auth()->user()->id, 'Viewed users', 'User accessed the user management panel.');

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
        $user = User::findOrFail($id); // Ensure the user exists
        $user->delete(); // Delete user

        // Log the deletion
        $this->storeLog(auth()->user()->id, 'Deleted user', 'User ID: ' . $id);

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

        // Log the update action
        $this->storeLog(auth()->user()->id, 'Updated user', 'User ID: ' . $id);

        return redirect()->route('adminPanel')->with('success', 'User updated successfully!');
    }

    // Add the storeLog method here
    private function storeLog($userId, $action, $details = null)
    {
        Log::create([
            'user_id' => $userId,
            'action' => $action,
            'details' => $details,
            'created_at' => now(),
        ]);
    }
}
