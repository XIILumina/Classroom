<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Log; // Ensure you import the Log model
use Auth;
use Illuminate\Http\Request;

class StorageController extends Controller
{
    public function getPhoto()
    {
        $user = Auth::user();
        return response()->json([
            'photo' => json_decode($user->profile_picture),
        ]);
    }

    public function updatePhoto(Request $request)
    {
        $request->validate([
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:16256',
        ]);

        $user = User::find(Auth::user()->id);
        
        $file = $request->file('avatar');
        
        $path = [];
        if (gettype($file) == 'array') {
            foreach ($file as $pidor) {
                $path[] = $pidor->store('avatars', 'public');
            }
        } else {
            $path[] = $file->store('avatars', 'public');
        }

        $user->profile_picture = json_encode($path);
        
        $user->save();

        // Log the profile photo update
        $this->storeLog($user->id, 'Updated profile photo', 'User updated their profile photo.');

        return redirect()->back()->with('success', 'Profile photo updated successfully.');
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
