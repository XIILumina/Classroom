<?php 
namespace App\Http\Controllers;

use App\Models\Log;  
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogsController extends Controller
{
    // Show logs to the admin
    public function showLogs(Request $request)
{
    if ($request->user()->role !== 'admin') {
        abort(403, 'Unauthorized action.');
    }

    $logs = Log::with('user')
        ->orderBy('created_at', 'desc')
        ->get();

    return Inertia::render('Logs', [
        'auth' => $request->user(),
        'logs' => $logs,
    ]);

}


    // Method to log an action
    public function storeLog($userId, $action, $details = null)
    {
        // Create a new log entry
        Log::create([
            'user_id' => $userId,
            'action' => $action,
            'details' => $details, // Optional details
            'created_at' => now(),
        ]);
    }
}
    