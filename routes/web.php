<?php

use App\Http\Controllers\CompressImage;
use App\Http\Controllers\CropImageController;
use App\Http\Controllers\ImageResizerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('imageresizer');
})->name('home');

//Resize route
Route::post('/resize-image', [ImageResizerController::class, 'resize'])->name('resize-image');
Route::post('/upload-image', [ImageResizerController::class, 'upload'])->name('upload.image');
Route::get('/resize-image/{filename}', [ImageResizerController::class, 'resizePage'])->name('resize.image');
Route::get('/secure-image/{filename}', function ($filename) {
    $filePath = storage_path('app/private/uploads/' . $filename);
    if (!file_exists($filePath)) {
        return redirect()->back()->withErrors(['error' => 'The requested image does not exist.']);
    }
    return response()->file($filePath); 
})->name('secure.image');

Route::get('/download/{filename}', [ImageResizerController::class, 'download'])->name('image.download');


//crop Image route
Route::get('/crop-image', [CropImageController::class, "view"])->name('crop_image');
Route::post('/upload-crop-image', [CropImageController::class, "upload"])->name('upload.crop_image');
Route::get('/crop-image/{filename}', [CropImageController::class, 'cropPage'])->name('crop.image');
Route::get('/secure-crop-image/{filename}', function ($filename) {
    $filePath = storage_path('app/private/uploads/cropImage/' . $filename);
    if (!file_exists($filePath)) {
        return redirect()->back()->withErrors(['error' => 'The requested image does not exist.']);
    }
    return response()->file($filePath); 
})->name('secure.Cropimage');

Route::post('/save-cropped-image', [CropImageController::class, 'saveCroppedImage'])->name('save.cropped.image');

Route::get('/download-page/{filename}', [CropImageController::class, "Downloadview"])->name('download_page');
Route::post('/download-page', function (Request $request) {
    $filename = $request->input('filename'); // Get filename from POST request

    if ($filename && file_exists(public_path('storage/uploads/' . $filename))) {
        return view('downloadPage', ['filename' => $filename]);
    }

    return redirect()->route('home'); 
})->name('download_page');

// Compress Image
Route::get('/compress-image', [CompressImage::class, "view"])->name('compress_image');
Route::post('/compress-image-edit', [CompressImage::class, 'compressimage']);
Route::get('/comp-image/{filename}', [CompressImage::class, 'compPage'])->name('comp.image');
Route::get('/secure-comp-image/{filename}', function ($filename) {
    // Define the file path in the `tmp` folder
    $filePath = storage_path('app/public/tmp/' . $filename);
    if (!file_exists($filePath)) {
        abort(404, 'The requested image does not exist.');
    }

    return response()->file($filePath);
})->name('secure.Compimage');
Route::post('/save-compressed-image', [CompressImage::class, 'saveCompressImage']);


//Delete file//

Route::post('/delete-image', [CompressImage::class, "deletefile"]);