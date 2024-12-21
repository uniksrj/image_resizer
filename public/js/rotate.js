function updateSliderColor() {
    const slider = document.getElementById('colorSlider');
    const value = slider.value;
    slider.style.setProperty('--slider-value', value + '%');
}

function drag() {
    document.getElementById('uploadFile').parentNode.className = 'draging dragBox';
}
function drop() {
    document.getElementById('uploadFile').parentNode.className = 'dragBox';
}

$(document).ready(function() {
        updateSliderColor();
})