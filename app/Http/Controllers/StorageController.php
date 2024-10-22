<?php

namespace App\Http\Controllers;

use App\Models\User;
use Auth;
use Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StorageController extends Controller
{

    public function getPhoto(){
        $user = Auth::user();
        return response()->json([
            'photo' => json_decode($user->profile_picture) ,
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
        if(gettype($file) == 'array') {
            foreach($file as $pidor) {
                $path[] = $pidor->store('avatars', 'public');
            }
        }else{
            $path[] = $file->store('avatars', 'public');
        }


        $user->profile_picture = json_encode($path);
        
        $user->save();

        return redirect()->back()->with('success', 'Profile photo updated successfully.');
    }

}
