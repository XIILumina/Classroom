<?php 
namespace App\Http\Controllers;

use App\Models\Work;
use App\Models\Comment;
use App\Models\Log; // Import the Log model
use Illuminate\Http\Request;

class WorkController extends Controller
{
    public function index($classId)
    {
        $works = Work::where('class_id', $classId)->get();

        foreach ($works as $work) {
            $comments = Comment::where('work_id', $work->id)->get();
            $work->comments = $comments;
        }

        return response()->json(['works' => $works], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'classId' => 'required|exists:classrooms,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'file' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:2048',
        ]);

        $work = new Work();
        $work->class_id = $request->classId;
        $work->title = $request->title;
        $work->description = $request->description;
        $work->user_id = auth()->id();
        $work->teacher_id = null;

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('uploads/works');
            $work->file_path = $filePath;
        }

        $work->save();
        
        // Log the creation of a work
        $this->storeLog(auth()->user()->id, 'Created work', 'Work ID: ' . $work->id);

        return response()->json(['message' => 'Work created successfully!', 'work' => $work], 201);
    }

    public function update(Request $request, $id)
    {
        $work = Work::findOrFail($id);
        $work->update([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        // Log the update of the work
        $this->storeLog(auth()->user()->id, 'Updated work', 'Work ID: ' . $work->id);

        return response()->json(['work' => $work]);
    }

    public function updateStatus(Request $request, $classId, $workId)
    {
        $validatedData = $request->validate([
            'status' => 'required|string|in:approved,pending',
        ]);

        $work = Work::where('class_id', $classId)->where('id', $workId)->firstOrFail();
        $work->status = $validatedData['status'];
        $work->save();

        // Log the status update
        $this->storeLog(auth()->user()->id, 'Updated work status', 'Work ID: ' . $work->id);

        return response()->json(['message' => 'Status updated successfully', 'work' => $work], 200);
    }

    public function addFile(Request $request, $classId, $workId)
    {
        try {
            $request->validate([
                'file' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:2048',
            ]);

            $work = Work::findOrFail($workId);

            if ($request->hasFile('file')) {
                $filePath = $request->file('file')->store('uploads/works');
                $work->file_path = $filePath;
                $work->save();
            }

            // Log the file upload
            $this->storeLog(auth()->user()->id, 'Uploaded file for work', 'Work ID: ' . $work->id);

            return response()->json(['message' => 'File uploaded successfully!', 'work' => $work], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'File upload failed: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $work = Work::findOrFail($id);
        $work->delete();

        // Log the deletion of the work
        $this->storeLog(auth()->user()->id, 'Deleted work', 'Work ID: ' . $work->id);

        return response()->json(['message' => 'Work deleted successfully']);
    }

    // Log method
    protected function storeLog($userId, $action, $details)
    {
        Log::create([
            'user_id' => $userId,
            'action' => $action,
            'details' => $details,
            'created_at' => now(),
        ]);
    }
}
