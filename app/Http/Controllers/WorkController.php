<?php

namespace App\Http\Controllers;

use App\Models\Work;
use App\Models\Comment;
use Illuminate\Http\Request;

class WorkController extends Controller
{
public function index($classId)
{
    $works = Work::where('class_id', $classId)->get();

    // Loop through each work to get its comments
    foreach ($works as $work) {
        // Get comments related to the current work
        $comments = Comment::where('work_id', $work->id)->get();

        // Attach comments directly to the work object
        $work->comments = $comments; // Add comments to the work
    }

    // Return the response as JSON
    return response()->json(['works' => $works], 200);
}

public function store(Request $request)
{
    $request->validate([
        'classId' => 'required|exists:classrooms,id',
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'file' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:2048', // Validate the file
    ]);

    $work = new Work();
    $work->class_id = $request->classId;
    $work->title = $request->title;
    $work->description = $request->description;
    $work->user_id = auth()->id(); // Assuming the user is authenticated
    $work->teacher_id = null; // You can set this based on your logic

    if ($request->hasFile('file')) {
        $filePath = $request->file('file')->store('uploads/works'); // Store the file in 'uploads/works'
        $work->file_path = $filePath; // Save the file path in the database
    }

    $work->save(); // Save the work

    return response()->json(['message' => 'Work created successfully!', 'work' => $work], 201);
}
    public function update(Request $request, $id)
    {
        $work = Work::findOrFail($id);
        $work->update([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return response()->json(['work' => $work]);
    }

    public function updateStatus(Request $request, $classId, $workId)
{
    // Validate the incoming status field
    $validatedData = $request->validate([
        'status' => 'required|string|in:approved,pending',
    ]);

    // Find the work by class ID and work ID
    $work = Work::where('class_id', $classId)->where('id', $workId)->firstOrFail();

    // Update the status field
    $work->status = $validatedData['status'];
    $work->save();

    return response()->json(['message' => 'Status updated successfully', 'work' => $work], 200);
}


public function addFile(Request $request, $classId, $workId)
{
    try {
        $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:2048', // Validate the file
        ]);

        $work = Work::findOrFail($workId); // Ensure the work exists

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('uploads/works'); // Store the file
            $work->file_path = $filePath; // Save the file path in the database
            $work->save(); // Update the work record
        }

        return response()->json(['message' => 'File uploaded successfully!', 'work' => $work], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'File upload failed: ' . $e->getMessage()], 500); // Return error message
    }
}


    public function destroy($id)
    {
        $work = Work::findOrFail($id);
        $work->delete();

        return response()->json(['message' => 'Work deleted successfully']);
    }
}
