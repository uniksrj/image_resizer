var $image = $('#uploadedImage');

function initializeCropper(imageElement) {
    if (window.cropper) {
        window.cropper.destroy();
    }
    window.cropper = new Cropper(imageElement, {
        viewMode: 1,             // Only dragging allowed
        dragMode: 'move',        // Enable dragging only
        responsive: true,        // Maintain aspect ratio when resizing container
        // aspectRatio: 16 / 9,     // Maintain a specific aspect ratio
        movable: false,
        zoomable: false,
        autoCrop: false,       // Disable zoom
        // scalable: false,         // Disable scaling
        rotatable: false,        // Disable rotation
        cropBoxMovable: false,   // Disable moving crop box
        cropBoxResizable: false, // Disable resizing crop box
        guides: false,           // Hide grid lines
        background: false,       // Disable background grid
        ready: function () {
        },
    });
}
function uploadImage(files) {
    $image = '';
    if (!files || files.length === 0) {
        alert('No file selected.');
        return;
    }

    const file = files[0];
    console.log(file);
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        return;
    }


    $('#progressLoadingImg').removeClass('hidden');


    const formData = new FormData();
    formData.append('image', file);
    formData.append('method', 'flipImage');

    $.ajax({
        url: '/save-temp',
        type: 'POST',
        data: formData,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        contentType: false,
        processData: false,
        xhr: function () {
            const xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener('progress', function (event) {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    $('#progressBar').css('width', `${percentComplete}%`);
                    $('#progressText').text(`${percentComplete}% Uploaded`);
                }
            });
            return xhr;
        },
        success: function (response) {
            // Replace the image inside #dynamic_img
            $('#dynamic_img').html(`<img id="uploadedImage" src="${response.path}" alt="Uploaded Image" style="transform:none;" class=" w-full h-auto object-contain" />`);
            $('#progressLoadingImg').addClass('hidden'); // Hide loader

            $image = $('#uploadedImage');
            console.log($image);
            initializeCropper($image[0]);


        },
        error: function () {
            alert('Error uploading file. Please try again.');
            $('#progressLoadingImg').addClass('hidden'); // Hide loader
        },
    });
}

function bindRotateEvents() {
    $('#horizontally_btn').off('click').on('click', function () {
        if (window.cropper) {
            cropper.scaleX(cropper.getData().scaleX * -1);

        } else {
            alert('Please upload new Image');
            console.warn('Cropper is not initialized.');

        }
    });

    $('#vertically_btn').off('click').on('click', function () {
        if (window.cropper) {
            cropper.scaleY(cropper.getData().scaleY * -1);

        } else {
            alert('Please upload new Image');
            console.warn('Cropper is not initialized.');
        }
    });

    $('#resetButton').on('click', function () {
        if (window.cropper) {
            window.cropper.reset();
        }
    });
}

function processImage() {
    $('#loader-container').css('display', 'flex'); //
    if (!cropper) {
        console.error("Cropper instance is not initialized. Ensure the Cropper is properly initialized before interacting with it.");
        return;
    }

    console.log($image[0].src);

    console.log(cropper.getCroppedCanvas());

    const extension = $image[0].src.split('.').pop();
    cropper.getCroppedCanvas().toBlob(function (blob) {
        const formData = new FormData();
        formData.append('flipImage', blob, `flip-image.${extension}`);
        formData.append('_token', $('meta[name="csrf-token"]').attr('content'));

        $.ajax({
            url: '/save-flip-image',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.status === 'success') {
                    const form = document.createElement('form');
                    form.method = 'POST';
                    form.action = '/download-page';
                    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                    const csrfInput = document.createElement('input');
                    csrfInput.type = 'hidden';
                    csrfInput.name = '_token';
                    csrfInput.value = csrfToken;
                    form.appendChild(csrfInput);
                    const filenameInput = document.createElement('input');
                    filenameInput.type = 'hidden';
                    filenameInput.name = 'filename';
                    filenameInput.value = data.filename;
                    form.appendChild(filenameInput);
                    document.body.appendChild(form);
                    form.submit();
                }
            },
            error: function (err) {
                console.error(err);
            }
        })
    })
}

$(document).ready(function () {

     const sidebar = document.getElementById('sidebar');
    const sidebarContent = document.getElementById('sidebarContent');
    const sliderBtn = document.getElementById('sidebarSlider');
    const sliderIcon = document.getElementById('sliderIcon');
    let isCollapsed = true; // Start collapsed on mobile

    sliderBtn.addEventListener('click', () => {
        isCollapsed = !isCollapsed;
        
        if (isCollapsed) {
            sidebar.style.height = '60px';
            sliderIcon.classList.remove('rotate-180');
            sliderIcon.classList.add('rotate-0');
            sidebarContent.classList.add('opacity-0');
            sidebarContent.classList.remove('opacity-100');
        } else {
            sidebar.style.height = '80vh'; // Use vh instead of 100% to prevent jumping
            sliderIcon.classList.remove('rotate-0');
            sliderIcon.classList.add('rotate-180');
            sidebarContent.classList.remove('opacity-0');
            sidebarContent.classList.add('opacity-100');
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) { // md breakpoint
            sidebar.style.height = '100vh';
            sliderIcon.classList.remove('rotate-180');
            sliderIcon.classList.add('rotate-0');
            sidebarContent.classList.remove('opacity-0');
            sidebarContent.classList.add('opacity-100');
            isCollapsed = false;
        } else if (isCollapsed) {
            sidebar.style.height = '60px';
            sidebarContent.classList.add('opacity-0');
        }
    });

    bindRotateEvents()
    $('#dropZone').on('dragover', function (e) {
        e.preventDefault();
        $(this).css({
            'background-color': 'rgb(134 239 172)',
        });
    });

    $('#dropZone').on('dragleave', function () {
        $(this).css({
            'background-color': 'rgb(134 239 172)',
        });
    });

    $('#dropZone').on('drop', function (e) {
        e.preventDefault();
        $(this).css({
            'background-color': 'rgb(134 239 172)',
        });

        const file = e.originalEvent.dataTransfer.files[0];
        if (file) {
            uploadImage([file]);
        } else {
            alert('No valid file dropped. Please try again.');
        }
    });
    let isUploading = false;
    window.handleFileChange = function (event) {
        const file = event.target.files[0];
        if (!file || isUploading) {
            return;
        }
        isUploading = true;


        if (['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            uploadImage([file]);
        } else {
            alert('Invalid file type. Please upload an image (JPEG, PNG, or GIF).');
        }

        event.target.value = '';
        isUploading = false;

    };

    $(document).on('click', '#process_data', function () {
        processImage();
    });
})