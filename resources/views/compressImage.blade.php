@extends('layout.mainView')

@section('content')
<section class="hero-section">
    <div class="container text-center">
        <h1 class="hero-title">Reliable Image Compressor – Fast, Secure, and Precise</h1>
        <p class="hero-subtitle">
            Optimize Your Images – Fast, Secure, and High-Quality Results
        </p>

        <!-- Upload Feature -->
        <div class="uploadOuter mt-4">
            <label for="uploadFile" class="btn btn-secondary">Upload Image</label>
            <strong class="mx-2">OR</strong>
            <span class="dragBox">
                Drag and Drop image here
                <input type="file" ondragover="drag()" ondrop="drop()" id="uploadFile" />
            </span>
        </div>
    </div>
    <div id="progressContainer" style="display: none; text-align: center; margin-top: 30px;">
        <div style="width: 100%; background-color: #f3f3f3; border-radius: 5px; overflow: hidden; position: relative; height: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);">
            <div id="uploadProgressBar"
                style="width: 0%; background-color: #28a745; height: 100%; transition: width 0.3s;"></div>
        </div>
        <span id="progressText" style="display: block; margin-top: 10px; font-size: 14px; font-weight: bold;">Uploading...</span>
    </div>
    <div id="errorMessage" style="color: red; font-weight: bold; text-align: center; margin-top: 10px;"></div>
</section>
@endsection

@section('feature')
<section class="features-section py-5">
    <div class="container">
        <h2 class="text-center features-title mb-4">Why Use Our Image Compressor?</h2>
        <div class="row g-4">
            <div class="col-md-4 text-center">
                <i class="fas fa-tachometer-alt feature-icon"></i>
                <h4 class="feature-title">Fast and Efficient</h4>
                <p>Compress images instantly without compromising quality. Get results in just a few seconds directly in your browser.</p>
            </div>
            <div class="col-md-4 text-center">
                <i class="fas fa-image feature-icon"></i>
                <h4 class="feature-title">High-Quality Compression</h4>
                <p>Our tool uses smart algorithms to reduce file sizes while maintaining the sharpness and clarity of your images.</p>
            </div>
            <div class="col-md-4 text-center">
                <i class="fas fa-cogs feature-icon"></i>
                <h4 class="feature-title">Custom Compression Settings</h4>
                <p>Adjust compression levels to suit your needs. Choose the perfect balance between image quality and file size.</p>
            </div>
            <div class="col-md-4 text-center">
                <i class="fas fa-lock feature-icon"></i>
                <h4 class="feature-title">Secure and Private</h4>
                <p>All compression happens locally in your browser. Your images are never uploaded, ensuring complete privacy.</p>
            </div>
            <div class="col-md-4 text-center">
                <i class="fas fa-cloud feature-icon"></i>
                <h4 class="feature-title">Works Anywhere</h4>
                <p>Our online image compressor works on all platforms—Windows, Mac, Linux, or any device with a modern web browser.</p>
            </div>
            <div class="col-md-4 text-center">
                <i class="fas fa-hand-holding-usd feature-icon"></i>
                <h4 class="feature-title">Absolutely Free</h4>
                <p>Use this tool as much as you like. No registration, file size limits, or hidden charges—100% free and easy to use.</p>
            </div>
        </div>
    </div>
</section>
<script type="module" src="{{ asset('js/compress.js') }}"></script>  
@endsection

@section('title')
Compress Image
@endsection