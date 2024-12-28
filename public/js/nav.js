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


$(document).ready(function () {
    

    $(document).on('click','#submit_form', function(e){
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
        console.log(formData);

        $.ajax({
            url: '/save-review', // Replace with your form submission URL
            type: 'POST',
            data: formData,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            processData: false,
            contentType: false,
            success: function(response) {
                // Handle success
                alert('Form submitted successfully');
            },
            error: function(response) {
                // Handle error
                alert('An error occurred');
            }
        });
        
        // alert('you are here');
    })
})

