<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Storage as FacadesStorage;
use Intervention\Image\ImageManager;

class CompressImage extends Controller
{
    public function view(){
        return view('compressImage');
    }
    public function compressimage(Request $request){
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif',
        ]);
        $path = $request->file('image')->store('tmp', 'public');

        $filename = basename($path);

        $signedUrl = URL::temporarySignedRoute(
            'comp.image',
            now()->addMinutes(1),
            ['filename' => $filename]
        );
        return response()->json(['success' => true, 'path' => $signedUrl]);
    }

    public function compPage($filename){
        $filePath = 'tmp/' . $filename;
        if (!FacadesStorage::disk('public')->exists($filePath)) {
            return redirect()->back()->withErrors(['error' => 'The requested image does not exist.']);
        }
        $imageUrl = route('secure.Compimage', ['filename' => $filename]);
        $path = storage_path('app/public/tmp/'.  $filename);
        $size =   number_format(filesize($path) / 1024, 2);
        return view('compressEdit', ['filename' => $filename, 'size' => $size, 'imageUrl' => $imageUrl]);
        // echo 'you are here';
    }

    public function saveCompressImage(Request $request){
        $request->validate([
            'compressedImage' => 'required|file|mimes:jpeg,png,jpg',
        ]);
    
        // Handle the uploaded file
        if ($request->hasFile('compressedImage')) {
            $file = $request->file('compressedImage');
    
            // Generate a unique filename
            $compressedfilename = 'compressed_image/compressed_' . time() .'.'. $file->getClientOriginalExtension();
    
            // Save the file to the `public/compressed` directory
            // $filePath = $file->storeAs('tmp', $filename);
            $directoryPath = public_path('storage/uploads/compressed_image/');
            if (!file_exists($directoryPath)) {
                mkdir($directoryPath, 0777, true);
            }
            $file->move($directoryPath, $compressedfilename);
    
            return response()->json([
                'status'=>  'success',
                'success' => true,
                'filePath' =>  $directoryPath . $compressedfilename, 
                'filename' => $compressedfilename,
                'url' =>  asset('storage/uploads/compressed_image/' . $compressedfilename), 
            ]);
        }
    
        return response()->json(['success' => false, 'message' => 'File upload failed.'], 500);
    }

    public function deletefile(Request $request){       
        $request->validate([
            'filename' => 'required|string',
        ]);
    
        $filename = $request->input('filename');
    
        $filePath = "uploads/".$filename;
    
        if (Storage::exists($filePath)) {
            Storage::delete($filePath);
            return response()->json(['status' => 1, 'success' => 'File deleted successfully.']);
        } else {
            return response()->json(['error' => 'File not found.'], 404);
        }
    }
}
