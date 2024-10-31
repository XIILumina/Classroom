<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Work;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    // Pievienot jaunu komentāru
    public function store(Request $request, $classId, $workId)
    {
        $request->validate([
            'text' => 'required|string|max:255',
        ]);
    
        $work = Work::findOrFail($workId);
        $comment = new Comment();
        $comment->work_id = $work->id;
        $comment->text = $request->input('text');
        $comment->save();
    
        return response()->json($comment, 201);
    }
}
