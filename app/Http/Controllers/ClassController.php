<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassController extends Controller
{
    // Display the dashboard with classes
    public function index()
    {
        $classes = Classroom::all(); // Fetch all classes
        return Inertia::render('Dashboard', [
            'classes' => $classes,
        ]);
    }

    // Create a new class (only for admins and teachers)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'teacher') {
            abort(403, 'Unauthorized action.');
        }

        Classroom::create([
            'name' => $request->name,
        ]);

        return redirect()->back()->with('success', 'Class created successfully');
    }
    public function show($id)
{
    $class = Classroom::findOrFail($id);
    $quests = $class->quests; // Assuming there's a relationship for quests

    return Inertia::render('ClassPage', [
        'classDetails' => $class,
        'quests' => $quests,
    ]);
}

}
