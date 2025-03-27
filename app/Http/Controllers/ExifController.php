<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ExifController extends Controller
{
    public function exifViewPage()
    {
        return view('exif_controller.exiffview');
    }

    public function getExifData(Request $request)
    {
        try {
            // Simulating an error for testing
            throw new \Exception("EXIF data extraction failed!");

            return response()->json(['message' => 'Success', 'data' => []]);
        } catch (\Exception $e) {
            Log::error($e->getMessage(), ['exception' => $e]); 
            return response()->json([
                'error' => 'Server Error',
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    }
}
