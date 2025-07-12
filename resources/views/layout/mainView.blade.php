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
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=Roboto+Slab:wght@100..900&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/navStyle.css') }}">
    <link rel="stylesheet" href="{{ asset('css/footer.css') }}">
    <link rel="stylesheet" href="{{ asset('css/resize.css') }}">
    @vite(['resources/js/app.js', 'resources/css/app.css'])
</head>

<style>
    html,
    body {
        height: 100%;
        margin: 0;
    }

    body {
        font-family: "Roboto Slab", serif;
        -webkit-font-smoothing: auto;
        -moz-osx-font-smoothing: auto;
        letter-spacing: 0.09em;
        font-weight: 400;
        font-style: normal;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }
    .content {
      flex: 1; 
    }
</style>

<body>
    <div class="content">
        @if ($errors->any())
            <div class="alert alert-danger "
                style="padding: 0px !important; margin: 0px !important; text-align: center;">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif
        
        <!-- Enhanced Header -->
        <header class="modern-header">
            <nav class="navbar">
                <div class="nav-container">
                    <!-- Logo Section -->
                    <div class="logo-section">
                        <a href="{{ route('home') }}" class="logo-link">
                            <img class="logo-img" src="{{ asset('storage/cut_logo.png') }}" alt="Image Tools Logo">
                            <div class="logo-text">
                                <span class="brand-name">Image Tools</span>
                                <span class="brand-tagline">Professional Editing</span>
                            </div>
                        </a>
                    </div>

                    <!-- Desktop Navigation -->
                    <div class="desktop-nav">
                        <ul class="nav-list">
                            <li class="nav-item">
                                <a href="{{ route('home') }}" class="nav-link">
                                    <i class="fas fa-expand-arrows-alt nav-icon"></i>
                                    <span>Resize</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{ route('crop_image') }}" class="nav-link">
                                    <i class="fas fa-crop nav-icon"></i>
                                    <span>Crop</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="{{ route('compress_image') }}" class="nav-link">
                                    <i class="fas fa-compress nav-icon"></i>
                                    <span>Compress</span>
                                </a>
                            </li>
                            <li class="nav-item dropdown">
                                <button class="nav-link dropdown-btn" onclick="showDropdown(event)">
                                    <i class="fas fa-tools nav-icon"></i>
                                    <span>More Tools</span>
                                    <i class="fas fa-chevron-down dropdown-arrow"></i>
                                </button>
                                <div class="dropdown-menu">
                                    <a href="{{ route('tool-view/1') }}" class="dropdown-item">
                                        <i class="fas fa-redo"></i>
                                        <span>Rotate Image</span>
                                    </a>
                                    <a href="{{ route('flipPage') }}" class="dropdown-item">
                                        <i class="fas fa-exchange-alt"></i>
                                        <span>Flip Image</span>
                                    </a>
                                    <a href="{{ route('converter-page') }}" class="dropdown-item">
                                        <i class="fas fa-file-export"></i>
                                        <span>Convert Format</span>
                                    </a>
                                    <a href="{{ route('exif-page') }}" class="dropdown-item">
                                        <i class="fas fa-info-circle"></i>
                                        <span>Image Details</span>
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <!-- Mobile Menu Button -->
                    <button class="mobile-menu-btn" id="mobile-menu">
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                    </button>
                </div>

                <!-- Mobile Navigation -->
                <div class="mobile-nav" id="mobile-nav">
                    <div class="mobile-nav-header">
                        <h3>Navigation</h3>
                        <button class="mobile-close-btn" id="mobile-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <ul class="mobile-nav-list">
                        <li class="mobile-nav-item">
                            <a href="{{ route('home') }}" class="mobile-nav-link">
                                <i class="fas fa-expand-arrows-alt"></i>
                                <span>Image Resizer</span>
                            </a>
                        </li>
                        <li class="mobile-nav-item">
                            <a href="{{ route('crop_image') }}" class="mobile-nav-link">
                                <i class="fas fa-crop"></i>
                                <span>Crop Image</span>
                            </a>
                        </li>
                        <li class="mobile-nav-item">
                            <a href="{{ route('compress_image') }}" class="mobile-nav-link">
                                <i class="fas fa-compress"></i>
                                <span>Image Compressor</span>
                            </a>
                        </li>
                        <li class="mobile-nav-item">
                            <a href="{{ route('tool-view/1') }}" class="mobile-nav-link">
                                <i class="fas fa-redo"></i>
                                <span>Rotate Image</span>
                            </a>
                        </li>
                        <li class="mobile-nav-item">
                            <a href="{{ route('flipPage') }}" class="mobile-nav-link">
                                <i class="fas fa-exchange-alt"></i>
                                <span>Flip Image</span>
                            </a>
                        </li>
                        <li class="mobile-nav-item">
                            <a href="{{ route('converter-page') }}" class="mobile-nav-link">
                                <i class="fas fa-file-export"></i>
                                <span>Image Converter</span>
                            </a>
                        </li>
                        <li class="mobile-nav-item">
                            <a href="{{ route('exif-page') }}" class="mobile-nav-link">
                                <i class="fas fa-info-circle"></i>
                                <span>Get Meta Details</span>
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- Mobile Overlay -->
                <div class="mobile-overlay" id="mobile-overlay"></div>
            </nav>
        </header>

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
                                <button type="submit" id="submit_form" class="btn btn-primary">Submit
                                    Review</button>
                            </form>
                        </div>

                        <!-- Display User Reviews -->
                        <div id="reviewsDisplay" class="mt-5">
                            <h4 class="text-center reviews-title">User Reviews</h4>
                            <div id="testimonialSlider" class="testimonial-slider">
                            </div>
                        </div>
                    </div>
                </section>
            @endif
        @endif

    </div>

    <!-- Enhanced Footer -->
    <footer class="modern-footer">
        <div class="footer-container">
            <!-- Main Footer Content -->
            <div class="footer-main">
                <div class="footer-grid">
                    <!-- Company Info -->
                    <div class="footer-section">
                        <div class="footer-logo">
                            <img src="{{ asset('storage/cut_logo.png') }}" alt="Image Tools" class="footer-logo-img">
                            <h3 class="footer-brand">Image Tools</h3>
                        </div>
                        <p class="footer-description">
                            Your all-in-one solution for professional image editing. Resize, crop, compress, and transform your images with ease.
                        </p>
                        <div class="social-links">
                            <a href="#" class="social-link" aria-label="Facebook">
                                <i class="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" class="social-link" aria-label="Twitter">
                                <i class="fab fa-twitter"></i>
                            </a>
                            <a href="#" class="social-link" aria-label="Instagram">
                                <i class="fab fa-instagram"></i>
                            </a>
                            <a href="#" class="social-link" aria-label="LinkedIn">
                                <i class="fab fa-linkedin-in"></i>
                            </a>
                        </div>
                    </div>

                    <!-- Quick Tools -->
                    <div class="footer-section">
                        <h4 class="footer-title">Quick Tools</h4>
                        <ul class="footer-links">
                            <li><a href="{{ route('home') }}" class="footer-link">
                                <i class="fas fa-expand-arrows-alt"></i>
                                Image Resizer
                            </a></li>
                            <li><a href="{{ route('crop_image') }}" class="footer-link">
                                <i class="fas fa-crop"></i>
                                Crop Image
                            </a></li>
                            <li><a href="{{ route('compress_image') }}" class="footer-link">
                                <i class="fas fa-compress"></i>
                                Image Compressor
                            </a></li>
                            <li><a href="{{ route('flipPage') }}" class="footer-link">
                                <i class="fas fa-exchange-alt"></i>
                                Flip Image
                            </a></li>
                        </ul>
                    </div>

                    <!-- More Tools -->
                    <div class="footer-section">
                        <h4 class="footer-title">More Tools</h4>
                        <ul class="footer-links">
                            <li><a href="{{ route('tool-view/1') }}" class="footer-link">
                                <i class="fas fa-redo"></i>
                                Rotate Image
                            </a></li>
                            <li><a href="{{ route('converter-page') }}" class="footer-link">
                                <i class="fas fa-file-export"></i>
                                Image Converter
                            </a></li>
                            <li><a href="{{ route('exif-page') }}" class="footer-link">
                                <i class="fas fa-info-circle"></i>
                                Image Details
                            </a></li>
                        </ul>
                    </div>

                    <!-- Features -->
                    <div class="footer-section">
                        <h4 class="footer-title">Features</h4>
                        <ul class="footer-features">
                            <li class="footer-feature">
                                <i class="fas fa-check-circle"></i>
                                <span>Free to Use</span>
                            </li>
                            <li class="footer-feature">
                                <i class="fas fa-shield-alt"></i>
                                <span>Secure Processing</span>
                            </li>
                            <li class="footer-feature">
                                <i class="fas fa-mobile-alt"></i>
                                <span>Mobile Friendly</span>
                            </li>
                            <li class="footer-feature">
                                <i class="fas fa-bolt"></i>
                                <span>Fast & Reliable</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Footer Bottom -->
            <div class="footer-bottom">
                <div class="footer-bottom-content">
                    <div class="copyright">
                        <p>&copy; <?php echo date('Y'); ?> Image Tools. All rights reserved.</p>
                    </div>
                    <div class="footer-bottom-links hidden md:flex">
                        <a href="#" class="footer-bottom-link">Privacy Policy</a>
                        <a href="#" class="footer-bottom-link">Terms of Service</a>
                        <a href="#" class="footer-bottom-link">Contact Us</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    <script type="module" src="{{ asset('js/nav.js') }}"></script>
    
    <script>
        // Enhanced dropdown functionality
        function showDropdown(event) {
            event.stopPropagation();
            const dropdownMenu = event.target.closest('.dropdown').querySelector('.dropdown-menu');
            const allDropdowns = document.querySelectorAll('.dropdown-menu');
            
            // Close all other dropdowns
            allDropdowns.forEach(menu => {
                if (menu !== dropdownMenu) {
                    menu.classList.remove('show');
                }
            });
            
            // Toggle current dropdown
            dropdownMenu.classList.toggle('show');
        }

        // Close dropdown when clicking outside
        window.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
            }
        });

        // Mobile menu functionality - UNIFIED APPROACH
        document.addEventListener('DOMContentLoaded', function() {
            const mobileMenuBtn = document.getElementById('mobile-menu');
            const mobileNav = document.getElementById('mobile-nav');
            const mobileOverlay = document.getElementById('mobile-overlay');
            const mobileCloseBtn = document.getElementById('mobile-close');

            function openMobileMenu() {
                mobileNav.classList.add('active');
                mobileOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                document.body.classList.add('mobile-nav-open');
            }

            function closeMobileMenu() {
                mobileNav.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
                document.body.classList.remove('mobile-nav-open');
            }

            // Event listeners
            if (mobileMenuBtn) {
                mobileMenuBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    openMobileMenu();
                });
            }

            if (mobileCloseBtn) {
                mobileCloseBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    closeMobileMenu();
                });
            }

            if (mobileOverlay) {
                mobileOverlay.addEventListener('click', function(e) {
                    e.preventDefault();
                    closeMobileMenu();
                });
            }

            // Close mobile menu when clicking on a link
            document.querySelectorAll('.mobile-nav-link').forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });

            // Handle escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeMobileMenu();
                    document.querySelectorAll('.dropdown-menu').forEach(menu => {
                        menu.classList.remove('show');
                    });
                }
            });
        });
    </script>
</body>

</html>
