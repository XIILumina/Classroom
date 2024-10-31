<?php

namespace App\Http\Controllers;

use App\Models\Log;  // Assuming you have a Log model
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogsController extends Controller
{
    // Show logs to the admin
    public function showLogs(Request $request)
    {
        // Check if the user is an admin
        if ($request->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        // Fetch logs from the database (you can filter or paginate if needed)
        $logs = Log::orderBy('created_at', 'desc')->get(); // Fetch logs in descending order

        // Return logs to the Logs.jsx component
        return Inertia::render('Logs', [
            'auth' => $request->user(),  // Authenticated user data
            'logs' => $logs,  // The logs data
        ]);
    }

    // Optionally, you could add a method to store logs
    public function storeLog($userId, $action)
    {
        // Create a new log entry
        Log::create([
            'user_id' => $userId,
            'action' => $action,
            'created_at' => now(),
        ]);
    }
}
