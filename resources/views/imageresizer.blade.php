@extends('layout.mainView')

@section('content')
    <section class="hero-section">
        <div class="container text-center">
            <h1 class="hero-title">Trustworthy Image Resizing Made Simple</h1>
            <p class="hero-subtitle">
                Resize your images effortlessly with a tool designed for speed, privacy, and precision.
            </p>

            <!-- Upload Feature -->
            <div class="uploadOuter hidden mt-4 lg:inline-block">
                <label for="uploadFile" class="btn btn-secondary">Upload Image</label>
                <strong class="mx-2">OR</strong>
                <span class="dragBox">
                    Drag and Drop image here
                    <input type="file" ondragover="drag()" ondrop="drop()" id="uploadFile" />
                </span>
            </div>
            {{-- //Mobile view --}}
            <div class="uploadOuter lg:hidden mt-4">
                <label for="uploadFile" class="btn btn-secondary">Upload Image</label>
            </div>
        </div>
        <div id="progressContainer" style="display: none; text-align: center; margin-top: 30px;">
            <div
                style="width: 100%; background-color: #f3f3f3; border-radius: 5px; overflow: hidden; position: relative; height: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);">
                <div id="uploadProgressBar"
                    style="width: 0%; background-color: #28a745; height: 100%; transition: width 0.3s;"></div>
            </div>
            <span id="progressText"
                style="display: block; margin-top: 10px; font-size: 14px; font-weight: bold;">Uploading...</span>
        </div>
        <div id="errorMessage" style="color: red; font-weight: bold; text-align: center; margin-top: 10px;"></div>
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
                    <p>Your images will be resized with the utmost precision, preserving clarity and details.</p>
                </div>
                <div class="col-md-4 text-center">
                    <i class="fas fa-bolt feature-icon"></i>
                    <h4 class="feature-title">Blazing Speed</h4>
                    <p>Process images in the blink of an eye with our ultra-fast cloud-based infrastructure.</p>
                </div>
                <div class="col-md-4 text-center">
                    <i class="fas fa-smile feature-icon"></i>
                    <h4 class="feature-title">User-Friendly Interface</h4>
                    <p>Resize images effortlessly in just three steps—upload, set dimensions, and download.</p>
                </div>
                <div class="col-md-4 text-center">
                    <i class="fas fa-desktop feature-icon"></i>
                    <h4 class="feature-title">Cross-Platform Compatibility</h4>
                    <p>Accessible from any device—whether you’re on Windows, Mac, Linux, or mobile.</p>
                </div>
                <div class="col-md-4 text-center">
                    <i class="fas fa-lock feature-icon"></i>
                    <h4 class="feature-title">Enhanced Privacy</h4>
                    <p>Your data is safe with us! Files are encrypted during upload and permanently deleted after
                        processing.</p>
                </div>
                <div class="col-md-4 text-center">
                    <i class="fas fa-gift feature-icon"></i>
                    <h4 class="feature-title">Completely Free</h4>
                    <p>No hidden fees, subscriptions, or watermarks—just free, high-quality resizing for everyone.</p>
                </div>
                <div class="col-md-4 text-center">
                    <i class="fas fa-layer-group feature-icon"></i>
                    <h4 class="feature-title">Batch Processing</h4>
                    <p>Save time by resizing multiple images at once with our powerful bulk resizer.</p>
                </div>
            </div>
        </div>
    </section>
    <script type="module" src="{{ asset('js/resizer.js') }}"></script>
@endsection


{{-- <div class="container mt-5">
    <h1 class="text-center">Image Resizer</h1>
    <form id="resizeForm" enctype="multipart/form-data" method="POST">
        @csrf
        <div class="mb-3">
            <label for="image" class="form-label">Upload Image</label>
            <input type="file" class="form-control" id="image" name="image" required>
        </div>
        <div class="mb-3">
            <label for="width" class="form-label">Width (px)</label>
            <input type="number" class="form-control" id="width" name="width" required>
        </div>
        <div class="mb-3">
            <label for="height" class="form-label">Height (px)</label>
            <input type="number" class="form-control" id="height" name="height" required>
        </div>
        <button type="submit" class="btn btn-primary">Resize Image</button>
    </form>
    <div id="result" class="mt-5"></div>
</div> --}}

@section('title')
    Image Resizer
@endsection
