@extends('layout.mainView')
@section('content')
    <style>
        /* Fullscreen overlay to freeze the page */
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            /* Semi-transparent background */
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            /* Ensure it's above all other elements */
        }

        /* Hidden class */
        .hidden {
            display: none;
        }

        /* Alert box styling */
        .alert-box {
            background-color: #4caf50;
            color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            text-align: center;
            max-width: 300px;
            width: 100%;
        }

        /* Button styling */
        .alert-box button {
            margin-top: 15px;
            padding: 10px 20px;
            background-color: white;
            color: #4caf50;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }

        .alert-box button:hover {
            background-color: #f1f1f1;
        }
    </style>
    @php
    // echo $filename;
    // return;
        $myfile = explode('/', $filename);
        if ($myfile[0] == 'resized') {
            $heading = 'Your resized image is ready to download!';
        } elseif ($myfile[0] == 'cropped_images') {
            $heading = 'Your Croped image is ready to download!';
        } elseif ($myfile[0] == 'compressed_image') {
            $heading = 'Your Compressed image is ready to download!';
        }elseif ($myfile[0] == 'rotate_images') {
            $heading = 'Your Rotate image is ready to download!';
        }elseif ($myfile[0] == 'flip_images') {
            $heading = 'Your Flip image is ready to download!';
        }
    @endphp
    <div style="text-align: center; padding: 50px;">
        <h1 class="d-head">{{ $heading }}</h1>
        <div class="container flex justify-center items-center">
            <img class="d-image" src="{{ asset('storage/uploads/' . $filename) }}" alt="Resized Image"
                style="max-width: 20%; height: auto; margin-bottom: 20px;">
        </div>
        <br>
        <a href="{{ asset('storage/uploads/' . $filename) }}" download="{{ $myfile[1] }}">
            <button class="b-button" id="download_image" filename="{{ $filename }}"
                style="padding: 10px 20px; font-size: 16px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Download Image
            </button>
        </a>
    </div>
    <div id="freezeOverlay" class="overlay hidden">
        <div class="alert-box">
            <span>Image downloaded successfully!</span>
            <button id="closeAlert">OK</button>
        </div>
    </div>
    <script type="module" src="{{ asset('js/download.js') }}"></script>
@endsection
@section('title')
    Download Image
@endsection
