<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Models\Log; // Ensure you import the Log model
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassController extends Controller
{
    // Display the dashboard with all classes
    public function index()
    {
        $classes = Classroom::all(); // Fetch all classes
        // Log the action of viewing classes
        $this->storeLog(auth()->id(), 'Viewed classes', 'User accessed the classes dashboard.');

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

    // Create a new class (only for admins and teachers)
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

        // Log the class creation
        $this->storeLog(auth()->id(), 'Created class', 'Class created: ' . $newClass->name);

        // Save the class and redirect
        if ($newClass) {
            return redirect()->back()->with('success', 'Class created successfully');
        } else {
            return redirect()->back()->with('error', 'Failed to create class');
        }
    }

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

        // Log the class update
        $this->storeLog(auth()->id(), 'Updated class', 'Class updated: ' . $classroom->name);

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

        // Log the class deletion
        $this->storeLog(auth()->id(), 'Deleted class', 'Class deleted: ' . $classroom->name);

        return redirect()->back()->with('success', 'Classroom deleted successfully.');
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
