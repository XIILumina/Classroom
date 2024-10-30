<?php

namespace App\Http\Controllers;

use App\Models\Work;
use Illuminate\Http\Request;

class WorkController extends Controller
{
    public function index($classId)
{
    $works = Work::where('class_id', $classId)->get();
    
    // Ensure the response is JSON
    return response()->json(['works' => $works], 200);
}

public function store(Request $request, $classId)
{
    $validatedData = $request->validate([
        'class_id' => 'required|integer', // Update validation to match the fetch request
        'title' => 'required|string|max:255',
        'description' => 'required|string',
    ]);

    // Assuming you have a Work model and it's set up properly
    $work = Work::create([
        'class_id' => $validatedData['class_id'], // Use the validated class_id
        'title' => $validatedData['title'],
        'description' => $validatedData['description'],
    ]);

    return response()->json(['success' => true, 'work' => $work]);
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

    public function destroy($id)
    {
        $work = Work::findOrFail($id);
        $work->delete();

        return response()->json(['message' => 'Work deleted successfully']);
    }
}
