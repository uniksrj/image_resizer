<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\PDF;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ExifController extends Controller
{
    public function exifViewPage()
    {
        return view('exif_controller.exiffview');
    }

    public function save_image(Request $request)
    {
        $request->validate([
            'image' => 'required|file|mimes:jpeg,png,jpg|max:10240',
        ]);
        $directory = 'uploads/exif_image';
        $storagePath = storage_path('app/public/' . $directory);

        if (!file_exists($storagePath)) {
            mkdir($storagePath, 0777, true);
        }

        // Generate a unique filename
        $timestamp = now()->format('YmdHis');
        $originalName = pathinfo($request->file('image')->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $request->file('image')->guessExtension();
        $filename = $originalName . '_' . $timestamp . '.' . $extension;
        $cleanText = str_replace(' ', '', $filename);

        $request->file('image')->storeAs($directory, $cleanText, 'public');

        return response()->json(['success' => true, 'path' => asset('storage/' . $directory . '/' . $cleanText)]);
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

    private function to_get_shell_command($filename, $path)
    {
        // Run ExifTool to extract ALL metadata
        $exiftoolOutput = shell_exec("exiftool -json " . escapeshellarg($path));
        $metadata = json_decode($exiftoolOutput, true)[0] ?? [];

        $latitude = $metadata['GPSLatitude'] ?? null;
        $longitude = $metadata['GPSLongitude'] ?? null;
        $googleMapsUrl = ($latitude && $longitude) ? "https://www.google.com/maps?q={$latitude},{$longitude}" : null;

        if (!$metadata) {
            return response()->json(['status' => 0, 'error' => 'No EXIF metadata found']);
        }

        $metadataArray[0]['FileName'] = $filename;
        unset($metadataArray['SourceFile']);
        unset($metadataArray['Directory']);
        return [
            'metadata' => $metadata,
            'image' => $filename,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'googleMapsUrl' => $googleMapsUrl
        ];
    }

    private function getImagePath($filename)
    {
        $directory = 'uploads/exif_image/';
        return Storage::disk('public')->path($directory . $filename);
    }

    // Get Metadata
    public function getMetadata(Request $request)
    {
        $filename = $request->input('filename');
        $path = $this->getImagePath($filename);

        if (!file_exists($path)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $metaData = $this->to_get_shell_command($filename, $path);
        if (!$metaData) {
            return response()->json(['error' => 'No EXIF metadata found']);
        }
        return response()->json($metaData);
    }

    // Download Metadata as JSON
    public function downloadMetadata($filename)
    {
        $path = $this->getImagePath($filename);
        if (!file_exists($path)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $metaData = $this->to_get_shell_command($filename, $path);
        $pdf = app(PDF::class)->loadView('exif_controller.metapdf', $metaData);
        $pdf->setPaper('A4', 'portrait');
        $pdf->setOptions(['defaultFont' => 'sans-serif']);
        $pdf->setWarnings(false);
        $pdf->setOption('isHtml5ParserEnabled', true);
        $pdf->setOption('isRemoteEnabled', true);
        $pdf->setOption('isFontSubsettingEnabled', true);
        $pdf->setOption('isJavascriptEnabled', true);
        $pdf->setOption('isFontSubsettingEnabled', true);
        $pdf->setOption('isRemoteEnabled', true);
        $pdf->setOption('isHtml5ParserEnabled', true);
        $pdf->setOption('isPhpEnabled', true);
        $pdf->setOption('isJavascriptEnabled', true);
        $pdf->setOption('isFontSubsettingEnabled', true);
        $timestamp = now()->format('YmdHis');
        $filename = $filename . '_' . $timestamp;
        return $pdf->download($filename . '.pdf');
    }



    // Remove Metadata (Creates a New Image Without EXIF)
    public function removeMetadata($filename)
    {
        $path = $this->getImagePath($filename);

        if (!file_exists($path)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        shell_exec("exiftool -all= -overwrite_original -q " . escapeshellarg($path));     

        return response()->download($path, $filename, [
            'Content-Type' => 'image/jpeg',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"'
        ])->deleteFileAfterSend(true);
    // return response()->json(['message' => 'Metadata removed successfully']);
    
    }



    // View GPS Location
    public function viewLocation($filename)
    {
        $path = $this->getImagePath($filename);

        if (!file_exists($path)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $exifData = @exif_read_data($path);
        if (!$exifData || !isset($exifData['GPSLatitude']) || !isset($exifData['GPSLongitude'])) {
            return response()->json(['error' => 'No GPS metadata found']);
        }

        $lat = $this->convertGpsToDecimal($exifData['GPSLatitude'], $exifData['GPSLatitudeRef']);
        $lng = $this->convertGpsToDecimal($exifData['GPSLongitude'], $exifData['GPSLongitudeRef']);

        return json_encode(array("url"=>"https://www.google.com/maps/search/?api=1&query=$lat,$lng"));
    }

    // Convert GPS Format to Decimal
    private function convertGpsToDecimal($gps, $hemisphere)
    {
        $degrees = count($gps) > 0 ? $this->gpsPartToDecimal($gps[0]) : 0;
        $minutes = count($gps) > 1 ? $this->gpsPartToDecimal($gps[1]) : 0;
        $seconds = count($gps) > 2 ? $this->gpsPartToDecimal($gps[2]) : 0;

        $decimal = $degrees + ($minutes / 60) + ($seconds / 3600);
        return ($hemisphere == 'S' || $hemisphere == 'W') ? -$decimal : $decimal;
    }

    private function gpsPartToDecimal($part)
    {
        $parts = explode('/', $part);
        return count($parts) == 2 ? floatval($parts[0]) / floatval($parts[1]) : floatval($part);
    }
}
