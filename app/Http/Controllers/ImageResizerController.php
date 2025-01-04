<?php

namespace App\Http\Controllers;

use App\Models\reviewTable;
use Illuminate\Http\Request;
use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class ImageResizerController extends Controller
{

    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $path = $request->file('image')->store('uploads', 'local');

        $filename = basename($path);

        $signedUrl = URL::temporarySignedRoute(
            'resize.image',
            now()->addMinutes(30),
            ['filename' => $filename]
        );
        return response()->json(['success' => true, 'path' => $signedUrl]);
    }

    public function resizePage($filename)
    {
        $filePath = 'uploads/' . $filename;
        if (!Storage::disk('local')->exists($filePath)) {
            return redirect()->back()->withErrors(['error' => 'The requested image does not exist.']);
        }
        $imageUrl = route('secure.image', ['filename' => $filename]);

        return view('imageview', ['filename' => $filename, 'imageUrl' => $imageUrl]);
    }

    public function resize(Request $request)
    {
        $request->validate([
            'filename' => 'required',
            'width' => 'required|numeric',
            'height' => 'required|numeric',
            'unit' => 'required|in:px,in,cm',
            'format' => 'required|in:jpeg,png,gif',
        ]);

        $filePath = storage_path('app/private/uploads/' .  $request->filename);
        if (!file_exists($filePath)) {
            return redirect()->back()->withErrors(['error' => 'The requested image does not exist.']);
        }

        $unit = $request->unit;
        $width = $this->convertToPx($request->width, $unit);
        $height = $this->convertToPx($request->width, $unit);

        $image = ImageManager::imagick()->read($filePath)
            ->resize($width, $height, function ($constraint) {
                $constraint->aspectRatio(); // Maintain aspect ratio
                $constraint->upsize(); // Prevent upsizing
            });
        $targetSize = $request->target_size * 1024; // Convert KB to bytes
        $format = $request->format;

        $quality = $request->quality_image; // Start with a high quality
        do {
            $tempFile = tempnam(sys_get_temp_dir(), 'resize');
            $image->encodeByExtension($format, $quality)->save($tempFile);
            $actualSize = filesize($tempFile);

            if ($actualSize > $targetSize) {
                $quality -= 5; // Reduce quality to decrease size
            }
        } while ($actualSize > $targetSize && $quality > 10);


        $newFilename = pathinfo($request->filename, PATHINFO_FILENAME) . "_resized." . $format;
        if (!file_exists(public_path('storage/uploads/resized'))) {
            mkdir(public_path('storage/uploads/resized'), 0777, true);
        }
        $newFilePath = public_path('storage/uploads/resized/' . $newFilename);
        $image->save($newFilePath);

        return view('downloadPage', ['filename' => 'resized/' . $newFilename]);
    }

    private function convertToPx($value, $unit)
    {
        // Convert units to pixels based on selected unit
        switch ($unit) {
            case 'in':
                return $value * 96; // 1 inch = 96px (standard DPI for screens)
            case 'cm':
                return ($value / 2.54) * 96; // 1 cm = 37.795px
            default:
                return $value; // Default is already in pixels
        }
    }

    public function download($filename)
    {
        $filePath = public_path('storage/uploads/resized/' . $filename);

        if (!file_exists($filePath)) {
            return redirect()->back()->withErrors(['error' => 'Image not found']);
        }

        return response()->download($filePath);
    }

    public function save_review(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'rating' => 'required',
            'review' => 'required',
        ]);

        if (!empty($request->latitude)) {
            $location = "$request->latitude-$request->longitude";
        } else {
            $location = "No location";
        }

        $reviewData = new reviewTable;
        $reviewData->username = $request->username;
        $reviewData->rating = $request->rating;
        $reviewData->review = $request->review;
        $reviewData->geolocation = $location;
        $reviewData->save();
        if (!empty($reviewData->id)) {
            echo 1;
        }
    }
    public function get_reviews()
    {
        $reviews = reviewTable::query()
            ->orderBy('id', 'desc')
            ->get();
        return response()->json($reviews);
    }
}
