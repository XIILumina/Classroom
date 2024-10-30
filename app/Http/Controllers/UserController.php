<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Classroom;
use App\Models\Assignment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            $users = User::all();
            $logs = []; // Placeholder for logs. Replace with log retrieval logic
            return Inertia::render('AdminDashboard', ['users' => $users, 'logs' => $logs]);
        } elseif ($user->role === 'teacher') {
            $classes = Classroom::where('teacher_id', $user->id)->get();
            return Inertia::render('TeacherDashboard', ['classes' => $classes]);
        } else {
            $assignments = Assignment::where('user_id', $user->id)->get();
            return Inertia::render('UserDashboard', ['assignments' => $assignments]);
        }
    }

    // Admin: Edit user details (name, password, role)
    public function editUser($id)
    {
        $user = User::findOrFail($id);
        return Inertia::render('EditUser', ['user' => $user]);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $request->validate([
            'name' => 'required|string|max:255',
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'required|in:admin,teacher,user',
        ]);

        $user->name = $request->name;
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        $user->role = $request->role;
        $user->save();

        return redirect()->route('admin.dashboard')->with('success', 'User updated successfully');
    }

    // Teacher: Create class
    public function createClass(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Classroom::create([
            'name' => $request->name,
            'teacher_id' => $request->user()->id,
        ]);

        return redirect()->route('teacher.dashboard')->with('success', 'Class created successfully');
    }

    // Teacher: Invite users to class (via QR code or notification)
    public function inviteUserToClass(Request $request, $classId)
    {
        // Logic for sending invitation (via code, QR, notification) can be added here
        return response()->json(['success' => 'User invited successfully']);
    }

    // User: Submit assignment
    public function submitAssignment(Request $request, $assignmentId)
    {
        $request->validate([
            'file' => 'required|file',
        ]);

        $assignment = Assignment::findOrFail($assignmentId);
        $path = $request->file('file')->store('assignments');
        $assignment->file_path = $path;
        $assignment->save();

        return redirect()->back()->with('success', 'Assignment submitted successfully');
    }

    // User: Comment on assignment
    public function commentOnAssignment(Request $request, $assignmentId)
    {
        $request->validate([
            'comment' => 'required|string|max:255',
        ]);

        $assignment = Assignment::findOrFail($assignmentId);
        $assignment->comments()->create([
            'user_id' => $request->user()->id,
            'comment' => $request->comment,
        ]);

        return redirect()->back()->with('success', 'Comment added successfully');
    }
}

