@extends('layout.mainView')

@section('content')
    <link rel="stylesheet" href="{{ asset('css/compress.css') }}">

    <div class="container">
        <h3 class="text-center py-4 text-xl md:text-4xl font-serif font-extrabold text-green-800 tracking-tight">Compare and Compress Your Image</h3>
        
        <div class="main-wrapper">
            <div class="content-container">
                <!-- Image Comparison Section -->
                <div class="comparison-section">
                    <!-- Sub-Headings for Comparison -->
                    <div class="comparison-headers">
                        <div class="header-item">
                            <h4 class="sub-heading">Compressed Image</h4>
                            <p class="size-info">Size: <span id="compressed_size">--</span> KB</p>
                        </div>
                        <div class="header-item">
                            <h4 class="sub-heading">Original Image</h4>
                            <p class="size-info">Size: <span id="original_size">{{ $size }}</span> KB</p>
                        </div>
                    </div>
                    
                    <!-- Image Comparison Viewer -->
                    <div class="image-comparison-container">
                        <!-- Wrapper for images -->
                        <div class="image-wrapper">
                            <!-- Original Image -->
                            <img id="originalImage" src="{{ $imageUrl }}" alt="Original Image" class="comparison-image">
                            <!-- Compressed Image -->
                            <img id="compressedImage" style="display: none;" src="/placeholder.svg" alt="Compressed Image"
                                class="comparison-image compressed-overlay">
                        </div>
                        <!-- Slider bar -->
                        <div class="slider-bar" id="sliderBar">
                            <div class="slider-handle"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Tool Panel -->
                <div class="tools-section">
                    <div class="tool-panel">
                        <h5 class="tool-title">Compression Tools</h5>
                        
                        <div class="tool-group">
                            <label for="compressionRate" class="tool-label">Compression Quality</label>
                            <input type="range" id="compressionRate" min="0.1" max="1" step="0.01"
                                value="1.0" class="compression-slider">
                            <div class="quality-display">
                                <span class="quality-text">Quality: </span>
                                <span id="qualityValue" class="quality-value">100%</span>
                            </div>
                        </div>
                        
                        <button id="compressButton" class="compress-btn">
                            <span class="btn-text">Compress Image</span>
                            <span class="btn-loader" style="display: none;">Processing...</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="note-section">
            <p class="note-text">
                <strong class="note-label">Note:</strong> 
                <span class="note-warning">Compressed image will be displayed after processing. Please wait until the compressed image appears and its size is shown.</span> 
            </p>
        </div>
    </div>

    <!-- Loader -->
    <div id="loader-container">
        <div id="loader"></div>
    </div>
    
    <script type="module" src="{{ asset('js/compress.js') }}"></script>
@endsection

@section('title')
    Compress Image
@endsection
