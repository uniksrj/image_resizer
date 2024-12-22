var $image = $('#uploadedImage');

function initializeCropper(imageElement) {
    if (window.cropper) {
        window.cropper.destroy();
    }
    window.cropper = new Cropper(imageElement, {
        aspectRatio: 1,
        viewMode: 1,
        cropBoxResizable: true,
        autoCropArea: 1,
        ready: function () {
            cropper.setCropBoxData({
                width: cropper.getImageData().width,
                height: cropper.getImageData().height
            });
        }
    });
}

function bindRotateEvents() {
    $('#rotateLeft').off('click').on('click', function () {
        if (window.cropper) {
            window.cropper.rotate(-90);
        } else {
            alert('Cropper is not initialized.');
        }
    });

    $('#rotateRight').off('click').on('click', function () {
        if (window.cropper) {
            window.cropper.rotate(90);
        } else {
            alert('Cropper is not initialized.');
        }
    });

    $('#resetButton').on('click', function () {
        if (window.cropper) {
            window.cropper.reset();
        }
        $('#colorSlider').val(0);
        $('#degree').text('0°');
        cropper.rotateTo(0);
    });

    $('#colorSlider').on('input', function () {
        var angle = $(this).val();
        // Ensure the slider ranges from -360 to 360
        if (angle < -360) {
            angle += 360;
        } else if (angle > 360) {
            angle -= 360;
        }

        // Straighten image to the specified angle
        $('#degree').html(`${angle} &deg;`);
        cropper.rotateTo(angle);
       // Calculate the percentage position of the slider
       let percent = (angle / 360) * 100;

       // Update slider color gradient based on the position
       this.style.setProperty('--slider-color-left', `hsl(${180 - percent}, 100%, 50%)`);
       this.style.setProperty('--slider-color-right', `hsl(${180 + percent}, 100%, 50%)`);
    });
}

function uploadImage(files) {
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
            $('#dynamic_img').html(`<img id="uploadedImage" src="${response.path}" alt="Uploaded Image" class="max-w-full max-h  max-h-[680px] object-contain" />`);
            $('#progressLoadingImg').addClass('hidden'); // Hide loader

            const $image = $('#uploadedImage');
            console.log($image);
            initializeCropper($image[0]);
        },
        error: function () {
            alert('Error uploading file. Please try again.');
            $('#progressLoadingImg').addClass('hidden'); // Hide loader
        },
    });
}


$(document).ready(function () {
    bindRotateEvents()
    // bindStraightenSlider()
    let cropper = null;
    // Drag and Drop Handlers   
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


    console.log($image);

    if ($image.length > 0 && $image[0] instanceof HTMLImageElement) {
        // Initialize Cropper
        initializeCropper($image[0])
    } else {
        console.error('Image element not found.');
    }

    // $('#rotateLeft').on('click', function () {
    //     cropper.rotate(-90);
    // });
    // // Rotate Right Button
    // $('#rotateRight').on('click', function () {
    //     cropper.rotate(90);
    // });

    // // Straighten Slider
    // $('#colorSlider').on('input', function () {  
    //     var value = $(this).val();      
    //     $(this).style.setProperty('--slider-value', value + '%');        
    //     cropper.setCropBoxData({
    //         width: cropper.getImageData().width + value,
    //         height: cropper.getImageData().height + value
    //     });
    // });
});


