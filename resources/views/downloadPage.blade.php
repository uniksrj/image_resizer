@extends('layout.mainView')
@section('content')

    <body>
        @php
            $myfile = explode('/', $filename);
            if ($myfile[0] == 'resized') {
                $heading = 'Your resized image is ready to download!';
            } elseif ($myfile[0] == 'cropped_images') {
                $heading = 'Your Croped image is ready to download!';
            }elseif ($myfile[0] == 'compressed_image') {
                $heading = 'Your Compressed image is ready to download!';
            }
        @endphp
        <div style="text-align: center; padding: 50px;">
            <h1 class="d-head">{{ $heading }}</h1>
            <div class="container">
                <img class="d-image" src="{{ asset('storage/uploads/' . $filename) }}" alt="Resized Image"
                    style="max-width: 20%; height: auto; margin-bottom: 20px;">
            </div>
            <br>
            <a href="{{ asset('storage/uploads/' . $filename) }}" download="{{ $myfile[1] }}">
                <button class="b-button"
                    style="padding: 10px 20px; font-size: 16px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Download Image
                </button>
            </a>
        </div>
    @endsection
    @section('title')
        Download Image
    @endsection
