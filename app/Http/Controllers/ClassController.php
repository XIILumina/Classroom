<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Models\User;
use App\Models\Log;
use App\Models\Work;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ClassroomUser; // Import the ClassroomUser model


class ClassController extends Controller
{
    // Display the dashboard with all classes
// public function index(Request $request)
// {
//     $classes = Classroom::with('creator')->get();
    
//     // Debugging: Check if classrooms have creators
//     foreach ($classes as $class) {
//         if (!$class->creator) {
//             \Log::info("Classroom ID {$class->id} has no creator.");
//         }
//     }

//     return Inertia::render('Dashboard', [
//         'teacher_id' => $request->user()->name,
//         'classes' => $classes,
//         'users' => User::all(),
        
//     ]); 
    
// }

public function addUsers(Request $request)
{
    // Validate request
    $request->validate([
        'classroom_id' => 'required|exists:classrooms,id',
        'user_ids' => 'required|array',
        'user_ids.*' => 'exists:users,id',
    ]);

    // Check permissions
    if (!auth()->user()->can('add-users')) {
        return response()->json(['error' => 'Unauthorized action.'], 403);
    }

    // Add users to the classroom
    foreach ($request->user_ids as $userId) {
        DB::table('classroom_user')->insert([
            'classroom_id' => $request->classroom_id,
            'user_id' => $userId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    return response()->json(['message' => 'Users added successfully.']);
}



public function index(Request $request)
{
    $user = $request->user();
    
    $classrooms = $user->allClassrooms();

    // Debugging

    return Inertia::render('Dashboard', [
        'classrooms' => $classrooms,
        'auth' => [
            'user' => $user,
        ],
    ]);
}





public function addUsersToClass(Request $request)
{
    // Validate incoming request
    $validated = $request->validate([
        'classroom_id' => 'required|exists:classrooms,id',
        'user_ids' => 'required|array',
        'user_ids.*' => 'exists:users,id',
    ]);

    // Find the classroom
    $classroom = Classroom::findOrFail($validated['classroom_id']);

    // Log the IDs for debugging
    \Log::info('Attaching users to classroom:', [
        'classroom_id' => $validated['classroom_id'],
        'user_ids' => $validated['user_ids'],
    ]);

    // Attach users to the classroom
    $classroom->users()->attach($validated['user_ids']);

    return response()->json(['message' => 'Users added successfully.'], 200);
}


public function addClass(Request $request)
{
    // Validācija
    $request->validate([
        'name' => 'required|string|max:255',
        'teacher_id' => 'required|exists:users,id',
        'created_by' => 'required|exists:users,id',
    ]);

    // Klases izveide
    $class = new Classroom();
    $class->name = $request->name;
    $class->teacher_id = $request->teacher_id;
    $class->created_by = $request->created_by;
    $class->save();

    // Atgriež atbildi vai novirza uz citu lapu
    return redirect()->back()->with('success', 'Class created successfully!');
}


    // Show a specific class with quests
    public function show($id)
    {
        $class = Classroom::findOrFail($id);
        $quests = $class->quests;

        return Inertia::render('ClassPage', [
            'classId' => $id,
            'classDetails' => $class,
            'quests' => $quests,
        ]);
    }

    // Create a new class
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255|unique:classrooms,name', // Added uniqueness validation
    ]);

    $newClass = Classroom::create([
        'name' => $validated['name'],
        'teacher_id' => auth()->id(),
    ]);

    $this->storeLog(auth()->id(), 'Created class', 'Class created: ' . $newClass->name);

    return redirect()->back()->with('success', 'Class created successfully');
}

    // Edit a class
    public function edit($id)
    {
        $classroom = Classroom::findOrFail($id);
        return Inertia::render('EditClass', ['classroom' => $classroom]);
    }

    // Update a class
    public function update(Request $request, $id)
    {
        $classroom = Classroom::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'teacher') {
            abort(403, 'Unauthorized action.');
        }

        $classroom->update([
            'name' => $request->name,
        ]);

        $this->storeLog(auth()->id(), 'Updated class', 'Class updated: ' . $classroom->name);

        return redirect()->route('dashboard')->with('success', 'Classroom updated successfully.');
    }

    // Delete a class
    public function destroy($id)
    {
        $classroom = Classroom::findOrFail($id);

        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'teacher') {
            abort(403, 'Unauthorized action.');
        }

        $classroom->delete();

        $this->storeLog(auth()->id(), 'Deleted class', 'Class deleted: ' . $classroom->name);

        return redirect()->back()->with('success', 'Classroom deleted successfully.');
    }

    // Method to edit a comment on a work
    public function updateComment(Request $request, $classId, $workId, $commentId)
    {
        $request->validate([
            'text' => 'required|string|max:1000',
        ]);

        $comment = Comment::where('id', $commentId)->where('work_id', $workId)->first();

        if (!$comment) {
            return response()->json(['error' => 'Comment not found'], 404);
        }

        $comment->text = $request->text;
        $comment->save();

        return response()->json(['message' => 'Comment updated successfully']);
    }

    // Method to delete a comment on a work
    public function deleteComment($classId, $workId, $commentId)
    {
        $comment = Comment::where('id', $commentId)->where('work_id', $workId)->first();

        if (!$comment) {
            return response()->json(['error' => 'Comment not found'], 404);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }

    // Log an action for tracking
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
