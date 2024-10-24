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
}
