@extends('layout.mainView')

@section('content')
    <link rel="stylesheet" href="{{ asset('css/crop.css') }}">
    <div class="container">
         <h1 class="page-title text-center py-4 text-2xl md:text-4xl font-serif font-extrabold text-green-800 tracking-tight">
            Crop Your Image
        </h1>
        <div class="w-16 h-1 bg-green-600/30 mx-auto mb-2 rounded-full"></div>
        <div class="cropper-wrapper">
            <!-- Cropper Canvas Area -->
            <div class="cropper-area">
                <img id="image" src="{{ $imageUrl }}" alt="Image to crop">
            </div>

            <!-- Tools Section -->
            <div class="tools-area">
                <h3>Crop Tools</h3>
                
                <div class="tool-item">
                    <label for="crop-x">X:</label>
                    <input type="number" id="crop-x" value="0" step="1">
                </div>
                
                <div class="tool-item">
                    <label for="crop-y">Y:</label>
                    <input type="number" id="crop-y" value="0" step="1">
                </div>
                
                <div class="tool-item">
                    <label for="crop-width">Width:</label>
                    <input type="number" id="crop-width" value="100" step="1" min="1">
                </div>
                
                <div class="tool-item">
                    <label for="crop-height">Height:</label>
                    <input type="number" id="crop-height" value="100" step="1" min="1">
                </div>
                
                <div class="tool-item">
                    <label for="crop-rotate">Rotate:</label>
                    <input type="number" id="crop-rotate" value="0" step="1" min="-360" max="360">
                </div>
                
                <div class="tool-item">
                    <label for="crop-scale-x">ScaleX:</label>
                    <input type="number" id="crop-scale-x" value="1" step="0.1" min="0.1" max="3">
                </div>
                
                <div class="tool-item">
                    <label for="crop-scale-y">ScaleY:</label>
                    <input type="number" id="crop-scale-y" value="1" step="0.1" min="0.1" max="3">
                </div>
                
                <div class="aspect-ratio-container">
                    <button id="aspect-ratio-1-1" class="aspect-ratio-btn" data-aspect-ratio="1">1:1</button>
                    <button id="aspect-ratio-16-9" class="aspect-ratio-btn" data-aspect-ratio="16/9">16:9</button>
                    <button id="aspect-ratio-4-3" class="aspect-ratio-btn" data-aspect-ratio="4/3">4:3</button>
                    <button id="free-crop" class="aspect-ratio-btn">Free</button>
                </div>
                
                <button id="updateCrop">Crop & Save</button>
            </div>
        </div>
    </div>
    
    <div id="loader-container">
        <div id="loader"></div>
    </div>
    
    <div id="errorMessage"></div>
    
    <script type="module" src="{{ asset('js/crop.js') }}" defer></script>
@endsection

@section('title')
    Image Cropper
@endsection
