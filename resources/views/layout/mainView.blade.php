<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title')</title>

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
        <div class="menu-toggle" id="mobile-menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </div>
        <ul class="nav-list">
            <li><a href="{{ route('home') }}">Image Resizer</a></li>
            <li><a href="{{ route('crop_image') }}">Crop Image</a></li>
            <li><a href="{{ route('compress_image') }}">Image Compressor</a></li>
            <li class="dropdown">
                <button class="dropbtn" onclick="showDropdown(event)">More
                    <i class="fa fa-caret-down"></i>
                </button>
                <div class="dropdown-content">
                    <a href="{{ route('tool-view/1') }}">Rotate Image</a>
                    <a href="#">Flip Image</a>
                    <a href="#">Meme Generator</a>
                </div>
            </li>
        </ul>
    </nav>


    @yield('content')

    @yield('feature')

    @if (!request()->has('expires'))
        <section class="reviews-section py-5">
            <div class="container">
                <h2 class="text-center reviews-title mb-4">What Our Users Say</h2>
                <!-- Rating and Review Form -->
                <div class="review-form p-4">
                    <h4 class="mb-3">Leave a Review</h4>
                    <form id="reviewForm">
                        <div class="mb-3">
                            <label for="username" class="form-label">Your Name</label>
                            <input type="text" class="form-control" id="username" placeholder="Enter your name"
                                required>
                        </div>
                        <div class="mb-3">
                            <label for="rating" class="form-label">Rating</label>
                            <select class="form-select" id="rating" required>
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
                            <textarea class="form-control" id="review" rows="4" placeholder="Write your review" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Submit Review</button>
                    </form>
                </div>

                <!-- Display User Reviews -->
                <div id="reviewsDisplay" class="mt-5">
                    <h4 class="text-center mb-4">User Reviews</h4>
                    <div class="review-box">
                        <p>No reviews yet. Be the first to leave a review!</p>
                    </div>
                </div>
            </div>
        </section>
    @endif



    <footer class="footer bg-success text-white py-4">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h5>About Us</h5>
                    <p>
                        Our mission is to provide fast, reliable, and secure image resizing tools to users worldwide.
                    </p>
                </div>
                <div class="col-md-6 text-md-end">
                    <h5>Follow Us</h5>
                    <a href="#" class="text-white me-3"><i class="fab fa-facebook"></i></a>
                    <a href="#" class="text-white me-3"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="text-white"><i class="fab fa-linkedin"></i></a>
                </div>
            </div>
            <hr class="bg-white">
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
    </script>
</body>

</html>
