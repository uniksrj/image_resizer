<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>@yield('title')</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon(1).ico') }}">
    <!-- SEO Meta Tags -->
    <meta name="description"
        content="Enhance, edit, and create stunning visuals with Image Tools. Explore intuitive online tools for editing photos, creating designs, and optimizing images for web and print.">
    <meta name="keywords"
        content="image editor, online image tool, photo editing, image optimization, free image tools, resize images, edit photos, copress image, image converter">
    <meta name="author" content="unik srj">

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=Roboto+Slab:wght@100..900&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/navStyle.css') }}">
    <link rel="stylesheet" href="{{ asset('css/footer.css') }}">
    <link rel="stylesheet" href="{{ asset('css/resize.css') }}">
    @vite(['resources/js/app.js', 'resources/css/app.css'])
</head>

<style>
    body {
        font-family: "Roboto Slab", serif;
        -webkit-font-smoothing: auto;
        -moz-osx-font-smoothing: auto;
        letter-spacing: 0.09em;
        /* font-optical-sizing: auto; */
        font-weight: 400;
        font-style: normal;
    }
</style>

<body>
    @if ($errors->any())
        <div class="alert alert-danger " style="padding: 0px !important; margin: 0px !important; text-align: center;">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif
    <nav class="navbar">
        <div class="logo">
            <a href="{{ route('home') }}"><img style="width: 190px; height : 60px;"
                    src="{{ asset('storage/cut_logo.png') }}" alt="Logo"></a>
        </div>
        <div class="menu-toggle block md:hidden cursor-pointer" id="mobile-menu">
            <span class="bar block w-6 h-1 bg-gray-800 mb-1"></span>
            <span class="bar block w-6 h-1 bg-gray-800 mb-1"></span>
            <span class="bar block w-6 h-1 bg-gray-800"></span>
        </div>

        <!-- Navigation Menu -->
        <ul class="nav-list w-full hidden flex-col absolute md:hidden top-full left-0 text-white p-2 place-items-end space-y-2 bg-[rgb(25,135,84)]">
            <li><a href="{{ route('home') }}" class="block">Image Resizer</a></li>
            <li><a href="{{ route('crop_image') }}" class="block">Crop Image</a></li>
            <li><a href="{{ route('compress_image') }}" class="block">Image Compressor</a></li>
            <li><a href="{{ route('tool-view/1') }}" class="block">Rotate Image</a></li>
            <li><a href="{{ route('flipPage') }}" class="block">Flip Image</a></li>
            <li><a href="{{ route('converter-page') }}" class="block">Image Converter</a></li>
        </ul>
        
        <!-- Desktop View -->
        <ul class="nav-list hidden md:flex md:flex-row space-x-4">
            <li><a href="{{ route('home') }}">Image Resizer</a></li>
            <li><a href="{{ route('crop_image') }}">Crop Image</a></li>
            <li><a href="{{ route('compress_image') }}">Image Compressor</a></li>
            <li class="dropdown relative">
                <button class="dropbtn" onclick="showDropdown(event)">
                    More <i class="fa fa-caret-down"></i>
                </button>
                <div class="dropdown-content w-[100px] hidden absolute top-14 left-[-160px] bg-green-500 text-white">
                    <a href="{{ route('tool-view/1') }}" class="block px-4 py-2">Rotate Image</a>
                    <a href="{{ route('flipPage') }}" class="block px-4 py-2">Flip Image</a>
                    <a href="{{ route('converter-page') }}" class="block px-4 py-2">Image Converter</a>
                </div>
            </li>
        </ul>       
    </nav>


    @yield('content')

    @yield('feature')

    @if (!request()->has('expires'))
        @if (Request::route()->getName() === 'home')
            <section class="reviews-section py-5">
                <div class="container">
                    <h2 class="text-center reviews-title mb-4">What Our Users Say</h2>
                    <!-- Rating and Review Form -->
                    <div class="review-form p-4">
                        <h4 class="mb-3">Leave a Review</h4>
                        <form id="reviewForm">
                            <div class="mb-3">
                                <label for="username" class="form-label">Your Name</label>
                                <input type="text" class="form-control" name="username" id="username"
                                    placeholder="Enter your name" required>
                            </div>
                            <div class="mb-3">
                                <label for="rating" class="form-label">Rating</label>
                                <select class="form-select" name="rating" id="rating" required>
                                    <option value="" disabled selected>Select your rating</option>
                                    <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
                                    <option value="4">⭐⭐⭐⭐ - Very Good</option>
                                    <option value="3">⭐⭐⭐ - Good</option>
                                    <option value="2">⭐⭐ - Fair</option>
                                    <option value="1">⭐ - Poor</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="review" class="form-label">Your Review</label>
                                <textarea class="form-control" name="review" id="review" rows="4" placeholder="Write your review"
                                    required></textarea>
                            </div>
                            <button type="submit" id="submit_form" class="btn btn-primary">Submit Review</button>
                        </form>
                    </div>

                    <!-- Display User Reviews -->
                    <div id="reviewsDisplay" class="mt-5">
                        <h4 class="text-center reviews-title">User Reviews</h4>
                        {{-- <div  id="reviewContainer"  class="review-box">
                        <p>No reviews yet. Be the first to leave a review!</p>
                    </div> --}}
                        <div id="testimonialSlider" class="testimonial-slider">
                        </div>
                    </div>
                </div>
            </section>
        @endif
    @endif



    <footer class="footer bg-success text-white py-2">
        <div class="container">
            <div class="text-center">
                <p class="mb-0">© 2024 Image Tools. Trustworthy resizing for everyone!</p>
            </div>
        </div>
    </footer>

    <script type="module" src="{{ asset('js/nav.js') }}"></script>
    <script>
        function showDropdown(event) {
                const dropdownContent = document.querySelector('.dropdown-content');
                dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
            }
            window.onclick = function(e) {
                const dropdownContent = document.querySelector('.dropdown-content');
                if (!e.target.matches('.dropbtn')) {
                    dropdownContent.style.display = 'none';
                }
            };
        document.getElementById('mobile-menu').addEventListener('click', function () {
        document.querySelector('.nav-list').classList.toggle('hidden');
    });
    </script>
</body>

</html>
