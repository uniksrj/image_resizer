@extends('layout.mainView')

@section('content')
    <link rel="stylesheet" href="{{ asset('css/crop.css') }}">
    <div class="container">
        <h1 class="text-3xl font-bold text-green-700 md:font-size[32px] mb-6">Crop Your Image</h1>
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
                    <input type="number" id="crop-x" value="0">
                </div>
                <div class="tool-item">
                    <label for="crop-y">Y:</label>
                    <input type="number" id="crop-y" value="0">
                </div>
                <div class="tool-item">
                    <label for="crop-width">Width:</label>
                    <input type="number" id="crop-width" value="100">
                </div>
                <div class="tool-item">
                    <label for="crop-height">Height:</label>
                    <input type="number" id="crop-height" value="100">
                </div>
                <div class="tool-item">
                    <label for="crop-rotate">Rotate:</label>
                    <input type="number" id="crop-rotate" value="0">
                </div>
                <div class="tool-item">
                    <label for="crop-scale-x">ScaleX:</label>
                    <input type="number" id="crop-scale-x" value="1">
                </div>
                <div class="tool-item">
                    <label for="crop-scale-y">ScaleY:</label>
                    <input type="number" id="crop-scale-y" value="1">
                </div>
                <div class="tool-item">
                    <button id="aspect-ratio-1-1" class="aspect-ratio-btn" data-aspect-ratio="1">1:1</button>
                    <button id="aspect-ratio-16-9" class="aspect-ratio-btn" data-aspect-ratio="16/9">16:9</button>
                    <button id="aspect-ratio-4-3" class="aspect-ratio-btn" data-aspect-ratio="4/3">4:3</button>
                    <button id="free-crop" class="aspect-ratio-btn">Free Crop</button>
                </div>
                <button id="updateCrop">Update Crop</button>
            </div>
        </div>
    </div>
    <div id="loader-container">
        <div id="loader"></div>
    </div>
    <div id="errorMessage"
     style="color: #ffffff; 
            display: none; 
            position: fixed; 
            top: 78px; 
            left: 82%; 
            transform: translateX(-50%); 
            width: 80%; 
            max-width: 500px; 
            background-color: #d00619;
            font-family: 'Segoe UI', Tahoma, sans-serif; 
            font-weight: 800; 
            text-align: center; 
            padding: 12px; 
            border-radius: 5px; 
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            text-shadow: 0 2px 3px rgba(0, 0, 0, 0.5);
            z-index: 1000;">
</div>
    <script type="module" src="{{ asset('js/crop.js') }}"></script>
@endsection
