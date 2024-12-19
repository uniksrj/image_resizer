@extends('layout.mainView')

@section('content')
    <link rel="stylesheet" href="{{ asset('css/crop.css') }}">

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
    <div id="loader-container">
        <div id="loader"></div>
    </div>

    <script type="module" src="{{ asset('js/crop.js') }}"></script>
@endsection
