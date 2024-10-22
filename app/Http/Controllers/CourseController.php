<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

use App\Models\Course; // Iekļaujiet Course modeli


class CourseController extends Controller
{


    public function store(Request $request)
    {
        $request->validate([
            'courseName' => 'required|string|max:255', // Validācija
        ]);

        // Izveidojiet jaunu kursu
        $course = new Course();
        $course->name = $request->courseName; // Saglabājiet kursa nosaukumu
        $course->teacher_id = auth()->id(); // Pievienojiet skolotāja ID (ja nepieciešams)
        $course->save();

        return response()->json(['message' => 'Course created successfully!', 'course' => $course], 201);
    }
}

