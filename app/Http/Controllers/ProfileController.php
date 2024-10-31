<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Log; // Ensure you import the Log model
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        // Log the action of viewing the profile edit form
        $this->storeLog(auth()->id(), 'Viewed profile edit', 'User accessed the profile edit form.');

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        // Log the profile update
        $this->storeLog(auth()->id(), 'Updated profile', 'User updated their profile information.');

        return Redirect::route('profile.edit')->with('success', 'Profile updated successfully.');
    }

    /**
     * Update the user's profile photo.
     */
    public function updateProfilePhoto(Request $request): RedirectResponse
    {
        // Validate the file
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Get the file
        $file = $request->file('avatar');

        // Create a unique filename
        $filename = time() . '.' . $file->getClientOriginalExtension();

        // Save the file in the public/avatars folder
        $file->move(public_path('avatars'), $filename);

        // Update the user's profile
        $user = auth()->user();
        $user->update([
            'avatar' => $filename,
        ]);

        // Log the profile photo update
        $this->storeLog(auth()->id(), 'Updated profile photo', 'User updated their profile photo.');

        return back()->with('success', 'Profile photo updated successfully.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Log the account deletion
        $this->storeLog(auth()->id(), 'Deleted account', 'User deleted their account.');

        return Redirect::to('/');
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
