<?php

namespace App\Http\Controllers;

use Illuminate\Container\Attributes\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage as FacadesStorage;
use Illuminate\Support\Facades\URL;
use Intervention\Image\ImageManager;

class CropImageController extends Controller
{
    public function view(){
        return view('cropimage');
    }

    public function Downloadview($filename)
{
    return view('downloadPage', ['filename' => $filename]);
}

    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        $directory = 'uploads/cropImage';
        $storagePath = storage_path('app/' . $directory);
    
        if (!file_exists($storagePath)) {
            mkdir($storagePath, 0777, true);
        }

        $path = $request->file('image')->store($directory, 'local');

        $filename = basename($path);

        $signedUrl = URL::temporarySignedRoute(
            'crop.image',
            now()->addMinutes(30),
            ['filename' => $filename]
        );
        return response()->json(['success' => true, 'path' => $signedUrl]);
    }

    public function cropPage($filename)
    {
        $filePath = 'uploads/cropImage/' . $filename;
        if (!FacadesStorage::disk('local')->exists($filePath)) {
            return redirect()->back()->withErrors(['error' => 'The requested image does not exist.']);
        }
        $imageUrl = route('secure.Cropimage', ['filename' => $filename]);

        return view('cropPage', ['filename' => $filename, 'imageUrl' => $imageUrl]);
    }

    public function saveCroppedImage(Request $request)
    {
        $validated = $request->validate([
            'croppedImage' => 'required|file|mimes:jpeg,png,jpg|max:10240', // Validate image
        ]);
        // $manager = new ImageManager('imagick');
        // Get the uploaded file
        $image = $request->file('croppedImage');
        $imgExtension = $image->getClientOriginalExtension();
        
        // Define the storage path for the cropped image
        $croppedImagePath = 'cropped_images/cropped_' . time() .'.'.$imgExtension;

        // Store the file using Intervention Image
        $img = ImageManager::imagick()->read($image->getPathname());
        if (!file_exists(public_path('storage/uploads/cropped_images/'))) {
            mkdir(public_path('storage/uploads/cropped_images/'), 0777, true);
        }
        $img->save(public_path('storage/uploads/'.$croppedImagePath));

        return response()->json([
            'status' => 'success',
            'filename' => $croppedImagePath,
            'redirectUrl' => route('download_page', ['filename' => $croppedImagePath]),
        ]);
    } 

    //Rotation Page

    public function rotationview(){
        return view('rotationPage');
    }

    public function save_image(Request $request){
        $validated = $request->validate([
            'image' => 'required|file|mimes:jpeg,png,jpg|max:10240', 
        ]);

        $directory = 'uploads/rotate_image';
        $storagePath = storage_path('app/' . $directory);
    
        if (!file_exists($storagePath)) {
            mkdir($storagePath, 0777, true);
        }

        $path = $request->file('image')->store($directory, 'public');

        $filename = basename($path);

        return response()->json(['success' => true, 'path' => asset('storage/uploads/rotate_image/'.$filename)]);

    }
}
