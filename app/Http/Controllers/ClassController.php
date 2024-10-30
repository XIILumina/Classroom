<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassController extends Controller
{
    // Display the dashboard with all classes
    public function index()
    {
        $classes = Classroom::all(); // Fetch all classes
        return Inertia::render('Dashboard', [
            'classes' => $classes,
        ]);
    }

    // Show a specific class with quests
    public function show($id)
    {
        $class = Classroom::findOrFail($id);
        $quests = $class->quests; // Assuming the class has related quests

        return Inertia::render('ClassPage', [
            'classId' => $id,
            'classDetails' => $class,
            'quests' => $quests,
        ]);
    }
    public function store(Request $request)
{
    // Validate the request data
    $validated = $request->validate([
        'name' => 'required|string|max:255',
    ]);

    // Create a new class and automatically set the teacher_id
    $newClass = Classroom::create([
        'name' => $request->name,
        'teacher_id' => auth()->id(), // Automatically assign the logged-in teacher
    ]);

    // Debugging: See what data is coming in
    // dd($request->all()); // Uncomment this for testing to see request data

    // Save the class and redirect
    if ($newClass) {
        return redirect()->back()->with('success', 'Class created successfully');
    } else {
        return redirect()->back()->with('error', 'Failed to create class');
    }
}
    
    // Create a new class (only for admins and teachers)
    // public function store(Request $request)
    // {
    //     // Validate the input
    //     $request->validate([
    //         'name' => 'required|string|max:255',
    //         'teacher_id' => 'required|exists:users,id',
    //         'work_id' => 'required|string|max:255',
    //         'user_id' => 'required|string|max:255',
    //     ]);

    //     // Check if user is an admin or teacher
    //     if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'teacher') {
    //         abort(403, 'Unauthorized action.');
    //     }

    //     // Create the class with the unique invitation code automatically generated
    //     $classroom = Classroom::create([
    //         'name' => $request->name,
    //         'teacher_id' => $request->teacher_id,
    //         'work_id' => $request->work_id,
    //         'user_id' => $request->user_id,
    //     ]);
    //     dd($request->all()); // Debugging: See what data is coming in

    // $validated = $request->validate([
    //     'name' => 'required|string|max:255',
    //     // other validations...
    // ]);
    //     return redirect()->back()->with('success', 'Classroom created successfully with code: ' . $classroom->invitation_code);
    // }

    // Edit a class (only for admins and teachers)
    public function edit($id)
    {
        $classroom = Classroom::findOrFail($id);
        return Inertia::render('EditClass', ['classroom' => $classroom]);
    }

    // Update a class (only for admins and teachers)
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

        return redirect()->route('dashboard')->with('success', 'Classroom updated successfully.');
    }

    // Delete a class (only for admins and teachers)
    public function destroy($id)
    {
        $classroom = Classroom::findOrFail($id);

        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'teacher') {
            abort(403, 'Unauthorized action.');
        }

        $classroom->delete();

        return redirect()->back()->with('success', 'Classroom deleted successfully.');
    }
}