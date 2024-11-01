<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Models\Log;
use App\Models\Work;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassController extends Controller
{
    // Display the dashboard with all classes
    public function index()
    {
        $classes = Classroom::all();
        $this->storeLog(auth()->id(), 'Viewed classes', 'User accessed the classes dashboard.');

        return Inertia::render('Dashboard', [
            'classes' => $classes,
        ]);
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
            'name' => 'required|string|max:255',
        ]);

        $newClass = Classroom::create([
            'name' => $request->name,
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
