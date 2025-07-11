@extends('layout.mainView')

@section('content')
    <section class="hero-section">
        <div class="container text-center">
            <h1 class="hero-title">Reliable Image Cropping – Fast, Secure, and Precise</h1>
            <p class="hero-subtitle">
                Crop your images effortlessly with our tool designed for speed, privacy, and accuracy. Keep your images
                private and achieve perfect results every time.
            </p>

            <div class="uploadOuter hidden lg:inline-block">
                <label for="uploadFile" class="btn btn-secondary">Upload Image</label>
                <strong class="mx-2">OR</strong>
                <span class="dragBox">
                    Drag and Drop image here
                    <input type="file" ondragover="drag()" ondrop="drop()" id="uploadFile" accept="image/*" />
                </span>
            </div>

            <!-- Upload Feature - Mobile -->
            <div class="uploadOuter lg:hidden mt-4">
                <div class="upload-mobile">
                    <label for="uploadFileMobile" class="btn btn-secondary">Upload Image</label>
                    <input type="file" id="uploadFileMobile" accept="image/*" style="display: none;" />
                </div>
            </div>

            <!-- Progress Container -->
            <div id="progressContainer" style="display: none;">
                <div style="width: 100%; background-color: #f3f3f3; border-radius: 5px; overflow: hidden; position: relative; height: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);">
                    <div id="uploadProgressBar" style="width: 0%; background-color: #28a745; height: 100%; transition: width 0.3s;"></div>
                </div>
                <span id="progressText" style="display: block; margin-top: 10px;">Uploading...</span>
            </div>

            <!-- Error Message -->
            <div id="errorMessage"></div>
        </div>
    </section>
@endsection
@section('feature')
    <section class="crop-image-section py-5">
        <div class="container">
            <h2 class="text-center crop-title mb-4">Why Use Our Image Cropper?</h2>
            <div class="row g-4">
                <div class="col-md-4 text-center">
                    <i class="fas fa-magic crop-icon feature-icon"></i>
                    <h4 class="crop-feature-title">Quick and Easy to Use</h4>
                    <p class="feature-description">Crop image easily by drawing a crop rectangle on them. No need to upload. We crop photos right on
                        your browser.</p>
                </div>
                <div class="col-md-4 text-center">
                    <i class="fas fa-compress crop-icon feature-icon"></i>
                    <h4 class="crop-feature-title">Crop Image to Any Size</h4>
                    <p class="feature-description">Crop your image to an exact pixel size so that you can share them without leaving out parts or
                        distorting them.</p>
                </div>
                <div class="col-md-4 text-center">
                    <i class="fas fa-vector-square crop-icon feature-icon"></i>
                    <h4 class="crop-feature-title">Crop to Any Aspect Ratio</h4>
                    <p class="feature-description">Choose from many different crop aspect ratios to get the best composition for your photo.</p>
                </div>
                <div class="col-md-4 text-center">
                    <i class="fas fa-shield-alt crop-icon feature-icon"></i>
                    <h4 class="crop-feature-title">Privacy Protected</h4>
                    <p class="feature-description">We crop image files right on the browser. Since your images are never uploaded to our servers, no one
                        has access to them.</p>
                </div>
                <div class="col-md-4 text-center">
                    <i class="fas fa-cloud crop-icon feature-icon"></i>
                    <h4 class="crop-feature-title">Online Tool</h4>
                    <p class="feature-description">This image cropper is hosted on the cloud. There is no software to install. It works on Windows, Mac,
                        Linux, or any device with a web browser.</p>
                </div>
                <div class="col-md-4 text-center">
                    <i class="fas fa-gift crop-icon feature-icon"></i>
                    <h4 class="crop-feature-title">100% Free</h4>
                    <p class="feature-description">This photo cropper is completely free to use. There are no registrations, file size limits, or
                        annoying watermarks to worry about.</p>
                </div>
            </div>
        </div>
        <script type="module" src="{{ asset('js/crop.js') }}"></script>    
    </section>
    
@endsection
@section('title')
    Crop Image
@endsection
