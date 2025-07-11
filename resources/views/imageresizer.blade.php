@extends('layout.mainView')

@section('content')
    <section class="hero-section">
        <div class="hero-content">
            <h1 class="hero-title">Trustworthy Image Resizing Made Simple</h1>
            <p class="hero-subtitle">
                Resize your images effortlessly with a tool designed for speed, privacy, and precision.
            </p>

            <!-- Upload Feature - Desktop -->
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
    <section class="features-section py-5">
        <div class="container">
            <h2 class="text-center features-title mb-5">Why Choose Our Image Resizer?</h2>
            <div class="row g-4">
                <div class="col-md-4 text-center">
                    <i class="fas fa-gem feature-icon"></i>
                    <h4 class="feature-title">Flawless Quality</h4>
                    <p class="feature-description">Your images will be resized with the utmost precision, preserving clarity and details.</p>
                </div>
                <div class="col-md-4 text-center">
                    <i class="fas fa-bolt feature-icon"></i>
                    <h4 class="feature-title">Blazing Speed</h4>
                    <p class="feature-description">Process images in the blink of an eye with our ultra-fast cloud-based infrastructure.</p>
                </div>
                <div class="col-md-4 text-center">
                    <i class="fas fa-smile feature-icon"></i>
                    <h4 class="feature-title">User-Friendly Interface</h4>
                    <p class="feature-description">Resize images effortlessly in just three steps—upload, set dimensions, and download.</p>
                </div>
                <div class="col-md-4 text-center">
                    <i class="fas fa-desktop feature-icon"></i>
                    <h4 class="feature-title">Cross-Platform Compatibility</h4>
                    <p class="feature-description">Accessible from any device—whether you're on Windows, Mac, Linux, or mobile.</p>
                </div>
                <div class="col-md-4 text-center">
                    <i class="fas fa-lock feature-icon"></i>
                    <h4 class="feature-title">Enhanced Privacy</h4>
                    <p class="feature-description">Your data is safe with us! Files are encrypted during upload and permanently deleted after processing.</p>
                </div>
                <div class="col-md-4 text-center">
                    <i class="fas fa-gift feature-icon"></i>
                    <h4 class="feature-title">Completely Free</h4>
                    <p class="feature-description">No hidden fees, subscriptions, or watermarks—just free, high-quality resizing for everyone.</p>
                </div>
                <div class="col-md-4 text-center">
                    <i class="fas fa-layer-group feature-icon"></i>
                    <h4 class="feature-title">Batch Processing</h4>
                    <p class="feature-description">Save time by resizing multiple images at once with our powerful bulk resizer.</p>
                </div>
            </div>
        </div>
    </section>
    <script type="module" src="{{ asset('js/resizer.js') }}"></script>
@endsection

@section('title')
    Image Resizer
@endsection
