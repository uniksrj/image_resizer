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


