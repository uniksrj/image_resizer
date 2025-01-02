<?php

namespace App\Http\Controllers;

use Illuminate\Container\Attributes\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage as FacadesStorage;
use Illuminate\Support\Facades\URL;
use Intervention\Image\ImageManager;

class CropImageController extends Controller
{
    public function view()
    {
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
        $croppedImagePath = 'cropped_images/cropped_' . time() . '.' . $imgExtension;

        // Store the file using Intervention Image
        $img = ImageManager::imagick()->read($image->getPathname());
        if (!file_exists(public_path('storage/uploads/cropped_images/'))) {
            mkdir(public_path('storage/uploads/cropped_images/'), 0777, true);
        }
        $img->save(public_path('storage/uploads/' . $croppedImagePath));

        return response()->json([
            'status' => 'success',
            'filename' => $croppedImagePath,
            'redirectUrl' => route('download_page', ['filename' => $croppedImagePath]),
        ]);
    }

    //Rotation Page

    public function rotationview()
    {
        return view('rotationPage');
    }

    public function save_image(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|file|mimes:jpeg,png,jpg|max:10240',
        ]);
        if ($request->input('method') == 'flipImage') {
            $directory = 'uploads/flip_image';
        } elseif ($request->input('method') == 'converterImage') {
            $directory = 'uploads/convert_image';
        } else {
            $directory = 'uploads/rotate_image';
        }

        $storagePath = storage_path('app/' . $directory);

        if (!file_exists($storagePath)) {
            mkdir($storagePath, 0777, true);
        }

        $path = $request->file('image')->store($directory, 'public');

        $filename = basename($path);

        return response()->json(['success' => true, 'path' => asset('storage/' . $directory . '/' . $filename)]);
    }

    public function saveRotateImage(Request $request)
    {
        $validated = $request->validate([
            'rotateImage' => 'required|file|mimes:jpeg,png,jpg',
        ]);

        $image = $request->file('rotateImage');
        $imgExtension = $image->getClientOriginalExtension();

        $croppedImagePath = 'rotate_images/rotate_' . time() . '.' . $imgExtension;

        $img = ImageManager::imagick()->read($image->getPathname());
        if (!file_exists(public_path('storage/uploads/rotate_images/'))) {
            mkdir(public_path('storage/uploads/rotate_images/'), 0777, true);
        }
        $img->save(public_path('storage/uploads/' . $croppedImagePath));

        return response()->json([
            'status' => 'success',
            'filename' => $croppedImagePath,
            'redirectUrl' => route('download_page', ['filename' => $croppedImagePath]),
        ]);
    }

    public function flipView()
    {
        return view('flipImage');
    }

    public function saveFlipImage(Request $request)
    {
        $request->validate([
            'flipImage' => 'required|file|mimes:jpeg,png,jpg',
        ]);

        $image = $request->file('flipImage');
        $imgExtension = $image->getClientOriginalExtension();

        $flipImagePath = 'flip_images/flip_' . time() . '.' . $imgExtension;

        $img = ImageManager::imagick()->read($image->getPathname());
        if (!file_exists(public_path('storage/uploads/flip_images/'))) {
            mkdir(public_path('storage/uploads/flip_images/'), 0777, true);
        }
        $img->save(public_path('storage/uploads/' . $flipImagePath));

        return response()->json([
            'status' => 'success',
            'filename' => $flipImagePath,
            'redirectUrl' => route('download_page', ['filename' => $flipImagePath]),
        ]);
    }

    public function converter()
    {
        return view(('imageConverter'));
    }

    public function saveConvertImage(Request $request)
    {
        $image = $request->input('image');
        $formate = $request->input('formate');
        $quality = $request->input('quality');
        if ($image) {
            try {
                $fullPath = public_path($image);
                $img = ImageManager::imagick()->read($fullPath);
                $img->encodeByExtension($formate, ['progressive'=> true, 'quality'=> $quality]);
                if (!file_exists(public_path('storage/uploads/convert_images/'))) {
                    mkdir(public_path('storage/uploads/convert_images/'), 0777, true);
                }
                $convertImagePath = 'convert_images/convert_' . time() . '.' . $formate;
                $img->save(public_path('storage/uploads/' . $convertImagePath));
            } catch (\Throwable $th) {
                return response()->json([
                    'status' => 'error',
                    'message' => $th->getMessage(),
                ]);
            }
        }
        return response()->json([
            'status' => 'success',
            'filename' => $convertImagePath,
            'redirectUrl' => route('download_page', ['filename' => $convertImagePath]),
        ]);
    }
}
