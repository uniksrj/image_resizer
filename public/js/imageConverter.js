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
    formData.append('method', 'converterImage');

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

function processImage() {
    $('#loader-container').css('display', 'flex');
    let formate = $('#format').val();
    let quality = $('#quality').val();
    const Image = $image[0].src;
    const imageUrl = new URL(Image);
    const relativePath = imageUrl.pathname;
    $.ajax({
        url: '/save-convert-image',
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        data: JSON.stringify({ image: relativePath, formate: formate, quality: quality }),
        contentType: 'application/json',
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
}

$(document).ready(function () {
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
        let formate = $('#format').val();
        if (!formate) {
            let $errorMessage = $('#dropdownButton').next('.error_message');
            if ($errorMessage.length === 0) {
                $('#dropdownButton').after('<span class="error_message text-red-500 text-sm">Please select a format</span>').focus();
            }
            return false; 
        } else {
            $('#dropdownButton').next('.error_message').remove();
        }
        processImage();
    });

    const $dropdownButton = $('#dropdownButton');
    const $dropdownList = $('#dropdownList');
    const $selectedValue = $('#selectedValue');
    const $hiddenInput = $('#format');


    $dropdownButton.on('click', function () {
        $dropdownList.toggleClass('hidden');
    });

    $('.dropdown-item').on('click', function () {
        const $item = $(this);
        const value = $item.data('value');

        $hiddenInput.val(value);

        $('.dropdown-item').find('.checkmark').remove();
        if (!$item.find('.checkmark').length) {
            $item.append('<span class="checkmark text-green-500 ml-auto">&#10003;</span>');
        }

        $selectedValue.text(value.toUpperCase());
        $dropdownList.addClass('hidden');
    });

    $(document).on('click', '#resetButton', function () {
        $selectedValue.text('Select Format');
        $('.dropdown-item').find('.checkmark').remove();
        $hiddenInput.val("");
        $('#quality').val(80);
    })

})