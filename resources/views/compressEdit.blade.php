@extends('layout.mainView')

@section('content')
    <link rel="stylesheet" href="{{ asset('css/compress.css') }}">
    
    <div class="container">       
        <h3 class=" heading-title text-center">Compare and Compress Your Image</h3> 
        <div class="row">
            <!-- Tool Panel -->
            <div class="col-md-3 mt-5">
                <div class="tool-panel">
                    <h5>Compression Tools</h5>
                    <label for="compressionRate">Compression Quality</label>
                    <input type="range" id="compressionRate" min="0.1" max="1" step="0.01" value="1.0"
                        class="form-range">
                    <p>Quality: <span id="qualityValue">100%</span></p>
                    <button id="compressButton" class="btn btn-primary w-100 mt-3">Compress Image</button>
                </div>
            </div>
            <!-- Image Comparison Section -->
            <div class="col-md-9">
                <div class="row">
                    <!-- Sub-Headings for Comparison -->
                    <div class="col-md-6 text-center">
                        <h4 class="sub-heading">Compressed Image</h4>
                        <p>Size: <span id="compressed_size"></span> KB</p>
                    </div>
                    <div class="col-md-6 text-center">
                        <h4 class="sub-heading">Original Image</h4>
                        <p>Size: <span id="original_size">{{$size}}</span> KB</p>
                    </div>
                </div>
                <!-- Image Comparison Viewer -->
                <div class="image-comparison-container">
                    <!-- Wrapper for images -->
                    <div class="image-wrapper">
                        <!-- Original Image -->
                        <img id="originalImage" src="{{ $imageUrl }}" alt="Original Image" class="comparison-image">
                        <!-- Compressed Image -->
                        <img id="compressedImage" style="display: none;" src="" alt="Compressed Image" class="comparison-image"
                            style="clip-path: inset(0 50% 0 0);">
                    </div>
                    <!-- Slider bar -->
                    <div class="slider-bar" id="sliderBar">
                        <div class="slider-handle"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="loaderOverlay">
        <div id="loaderSpinner"></div>
    </div>
    <script type="module" src="{{ asset('js/compress.js') }}"></script>
@endsection


@section('title')
    Compress Image
@endsection