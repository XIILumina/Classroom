<?php

namespace App\Http\Controllers;

use App\Models\Work;
use Illuminate\Http\Request;

class WorkController extends Controller
{
    public function index($classId)
    {
        $works = Work::where('class_id', $classId)->get();
        return response()->json(['works' => $works]);
    }

    public function store(Request $request)
    {
        $work = Work::create([
            'title' => $request->title,
            'description' => $request->description,
            'class_id' => $request->classId,
        ]);

        return response()->json(['work' => $work], 201);
    }

    public function update(Request $request, $id)
    {
        // Validate request data
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Find the work by ID
        $work = Work::findOrFail($id);
        
        // Update the work details
        $work->update([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        return response()->json(['work' => $work]);
    }

    public function destroy($id)
    {
        // Find the work by ID and delete it
        $work = Work::findOrFail($id);
        $work->delete();

        return response()->json(['message' => 'Work deleted successfully.'], 200);
    }
}
