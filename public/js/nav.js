const reviewContainer = document.getElementById('reviewContainer');
var reviewData;
if (document.getElementById('reviewForm') && document.getElementById('reviewsDisplay')) {
    const reviewForm = document.getElementById('reviewForm');
    const reviewsDisplay = document.getElementById('reviewsDisplay');
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const username = document.getElementById('username').value;
        const rating = document.getElementById('rating').value;
        const reviewText = document.getElementById('review').value;

        // Create new review box
        const newReview = document.createElement('div');
        newReview.classList.add('review-box');
        newReview.innerHTML = `
            <strong>${username}</strong> 
            <span>(${rating} ⭐)</span>
            <p>${reviewText}</p>
        `;

        // Append to reviewsDisplay
        reviewsDisplay.querySelector('.review-box').remove(); // Remove default message if present
        reviewsDisplay.appendChild(newReview);

        // Clear form
        reviewForm.reset();
    });
}


function drag() {
    document.getElementById('uploadFile').parentNode.className = 'draging dragBox';
}
function drop() {
    document.getElementById('uploadFile').parentNode.className = 'dragBox';
}

const mobileMenu = document.getElementById('mobile-menu');
const navList = document.querySelector('.nav-list');

mobileMenu.addEventListener('click', () => {
    navList.classList.toggle('show');
});

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '★' : '☆';
    }
    return `<span class="text-3xl">${stars}</span>`;
}

function submitFormData(formData) {
    $.ajax({
        url: '/save-review',
        type: 'POST',
        data: formData,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        processData: false,
        contentType: false,
        success: function (response) {
            console.log(response);
            getReviewData();
        },
        error: function (response) {
            alert('An error occurred');
        }
    });
}

function getReviewData() {
    $('#testimonialSlider').empty(); 
    $.ajax({
        url: '/get-all-data',
        type: 'GET',
        success: function (response) {
            console.log(response);
            if (response.length > 0) {
                response.forEach((review) => {

                    let city = '';
                    let country = '';
                    if (review.geolocatn) {
                        let [latitude, longitude] = review.geolocation.split('-').map(coord => parseFloat(coord));

                        $.ajax({
                            url: `https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi?lat=${latitude}&lng=${longitude}`,
                            type: 'GET',
                            headers: {
                                'x-rapidapi-key': 'fe8613b354msh758691d1e3f4edcp1842a0jsna52e063e64e7',
                                'x-rapidapi-host': 'address-from-to-latitude-longitude.p.rapidapi.com'
                            },
                            async: false,
                            crossDomain: true,
                            success: function (apiResponse) {

                                apiResponse.Results.forEach(place => {

                                    if (place.region != '') {
                                        city = place.region;
                                    } else {
                                        city = 'unknown';
                                    }
                                    if (place.country != '') {
                                        country = place.country;
                                    } else {
                                        country = 'unknown';
                                    }
                                });
                            },
                            error: function (e) {
                                console.error('Error fetching city and country', e);
                            }
                        });
                    }

                    const reviewHTML = `
                        <div class="review-item">
                        <p class="">${generateStars(review.rating)}</p>
                        <p class="line-clamp-3">${review.review}</p>
                        <p class="text-sm py-3 subpixel-antialiased"><strong>${review.username}</strong></p>
                        <p >${city}/${country}</p>
                        </div>
                    `;
                    $('#testimonialSlider').append(reviewHTML);

                });
                if ($('#testimonialSlider').hasClass('slick-initialized')) {
                    $('#testimonialSlider').slick('refresh');
                } else {
                    $('#testimonialSlider').slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        autoplay: true,
                        autoplaySpeed: 5000,
                        dots: false,
                        arrows: true,
                        prevArrow: '<button type="button" class="slick-prev">←</button>',
                        nextArrow: '<button type="button" class="slick-next">→</button>',
                        responsive: [
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToShow: 1
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    slidesToShow: 1
                                }
                            }
                        ]
                    });
                }

            } else {
                $('#testimonialSlider').html('<p>No reviews available yet.</p>');
            }
        },
        error: function () {
            alert('Error loading reviews');
        }
    });
}

$(document).ready(function () {

    getReviewData();

    $(document).on('click', '#submit_form', function (e) {
        e.preventDefault();

        if ($('#username').val() == '') {
            $('#username').css("border", "1px solid red").focus();
            return false;
        }

        if ($('#rating').val() == '' || $('#rating').val() == 'disabled') {
            $('#rating').css("border", "1px solid red").focus();
            return false;
        }

        if ($('#review').val() == '') {
            $('#review').css("border", "1px solid red").focus();
            return false;
        }

        let formData = new FormData($('#reviewForm')[0]);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    formData.append('latitude', latitude);
                    formData.append('longitude', longitude);

                    submitFormData(formData);
                },
                function (error) {
                    console.warn('Geolocation error or declined. Submitting without location.');
                    submitFormData(formData);
                }
            );
        } else {
            console.warn('Geolocation not supported. Submitting without location.');
            submitFormData(formData);
        }
    })
})

