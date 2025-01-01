var $image = $('#uploadedImage');
function initializeCropper(imageElement) {
    if (window.cropper) {
        window.cropper.destroy();
    }
    window.cropper = new Cropper(imageElement, {
        viewMode: 2,
        background: false,
        autoCrop: false,
        // cropBoxResizable: false,
        cropBoxMovable: false,
        dragMode: 'none',
        responsive: false,
        // zoomable: false,
        zoomOnTouch: false,
        ready: function () {
            fitImageToContainer();
        },
    });
}
function fitImageToContainer() {
    if (window.cropper) {
        const containerData = cropper.getContainerData();
        const imageData = cropper.getImageData();

        // Calculate scaling to fit the container
        const scaleX = containerData.width / imageData.naturalWidth;
        const scaleY = containerData.height / imageData.naturalHeight;
        const scale = Math.min(scaleX, scaleY);

        // Prevent the canvas from exceeding the container
        cropper.setCanvasData({
            left: 0,
            top: 0,
            width: containerData.width,
            height: containerData.height * scale, // Scale height proportionally
        });
    }
}

/*
function adjustCanvasAfterRotation() {
    const imageData = cropper.getImageData();
    const canvasData = cropper.getCanvasData();
    const containerData = cropper.getContainerData();
    console.log(containerData);
    console.log(imageData);
    

      const scale = Math.min(
        containerData.width / imageData.naturalWidth,
        containerData.height / imageData.naturalHeight
    );

    cropper.setCanvasData({
        left: (containerData.width - imageData.naturalWidth * scale) / 2,
        top: (containerData.height - imageData.naturalHeight * scale) / 2,
        width: imageData.naturalWidth * scale,
        height: imageData.naturalHeight * scale,
    });

    const rotatedWidth = Math.abs(
        imageData.width * Math.cos(imageData.rotate * (Math.PI / 180)) +
        imageData.height * Math.sin(imageData.rotate * (Math.PI / 180))
    );
    const rotatedHeight = Math.abs(
        imageData.width * Math.sin(imageData.rotate * (Math.PI / 180)) +
        imageData.height * Math.cos(imageData.rotate * (Math.PI / 180))
    );

    cropper.setCanvasData({
        left: (containerData.width - rotatedWidth) / 2,
        top: (containerData.height - rotatedHeight) / 2,
        width: rotatedWidth,
        height: rotatedHeight,
    });
    
}*/

/*
// Function to fit image within the container without cropping
function fitImageToContainer() {
    if (window.cropper) {
        const containerData = cropper.getContainerData();
        const imageData = cropper.getImageData();

        // Calculate the scale needed to fit the image within container
        const scale = Math.min(
            containerData.width / imageData.naturalWidth,
            containerData.height / imageData.naturalHeight
        );

        cropper.setCanvasData({
            left: (containerData.width - imageData.naturalWidth * scale) / 2,
            top: (containerData.height - imageData.naturalHeight * scale) / 2,
            width: imageData.naturalWidth * scale,
            height: imageData.naturalHeight * scale,
        });

        // Ensure the image fits without cropping when rotated 180 degrees
        if (imageData.rotate % 180 === 0) {
            cropper.setCanvasData({
                left: (containerData.width - imageData.naturalWidth * scale) / 2,
                top: (containerData.height - imageData.naturalHeight * scale) / 2,
                width: containerData.width,
                height: containerData.height,
            });
        }
    }
} */

function bindRotateEvents() {
    $('#rotateLeft').off('click').on('click', function () {
        if (window.cropper) {
            window.cropper.rotate(-90);
            fitImageToContainer()
        } else {
            alert('Cropper is not initialized.');
        }
    });

    $('#rotateRight').off('click').on('click', function () {
        if (window.cropper) {
            window.cropper.rotate(90);
            fitImageToContainer()
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
        const angle = parseFloat($(this).val()) || 0;

        // Clamp angle to -360° to 360°
        const rotationAngle = Math.max(-360, Math.min(360, angle));
        $('#degree').html(`${rotationAngle} &deg;`);
    
        // Get container and image data
        const containerData = cropper.getContainerData();
        const imageData = cropper.getImageData();
    
        // Calculate the base scale
        const baseScale = Math.min(
            containerData.width / imageData.naturalWidth,
            containerData.height / imageData.naturalHeight
        );
    
        // Zoom factor based on rotation
        const zoomFactor = 1 + Math.abs(rotationAngle) / 90;
    
        // Final scale combines base scale and zoom factor
        const finalScale = baseScale * zoomFactor;
    
        // Set rotation and scale
        cropper.rotateTo(rotationAngle);
        cropper.scale(finalScale);
    
        let percent = ((rotationAngle + 45) / 90) * 100; // Normalize -45° to 45° to 0% to 100%
        if (rotationAngle < 0) {
            // Rotate left: Sky blue on the left, grey on the right
            this.style.setProperty('--slider-color-left', `hsl(200, 100%, 70%)`); // Sky blue
            this.style.setProperty('--slider-color-right', `hsl(0, 0%, 75%)`);    // Grey
        } else {
            // Rotate right: Grey on the left, sky blue on the right
            this.style.setProperty('--slider-color-left', `hsl(0, 0%, 75%)`);    // Grey
            this.style.setProperty('--slider-color-right', `hsl(200, 100%, 70%)`); // Sky blue
        }
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
            $('#dynamic_img').html(`<img id="uploadedImage" src="${response.path}" alt="Uploaded Image" class="max-w-full  max-h-[680px] object-contain" />`);
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
    if (!cropper) {
        console.error("Cropper instance is not initialized. Ensure the Cropper is properly initialized before interacting with it.");
        return;
    }

    const rotateRight = parseFloat($('#rotateRight').val()) || 0;
    const rotateLeft = parseFloat($('#rotateLeft').val()) || 0;
    const straighten = parseFloat($('#colorSlider').val()) || 0;

    const rotation = rotateRight - rotateLeft;

    try {
    cropper.rotateTo(rotation);

    // Straighten the image (simulating shear/skew effect)
    let canvas = cropper.getCroppedCanvas();
    if (straighten !== 0 && canvas) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;

        const ctx = tempCanvas.getContext('2d');
        ctx.setTransform(1, straighten / 100, straighten / 100, 1, 0, 0);
        ctx.drawImage(canvas, 0, 0);
        canvas = tempCanvas;
    }
    console.log($image.attr('src'));
    let new_Img = $image.attr('src');
    
    const relativePath = new_Img.replace(location.origin, '');
    const extension = relativePath.split('.').pop().toLowerCase();
    canvas.toBlob(function (blob) {
        const formData = new FormData();
        formData.append('rotateImage', blob, `rotate-image.${extension}`);
        formData.append('_token', $('meta[name="csrf-token"]').attr('content'));

        $.ajax({
            url: '/save-rotate-image',
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
    } catch (error) {
        console.error("Error applying transformations:", error);
    }
}

$(document).ready(function () {

    $(document).on('click', '#process_data', function () {
        processImage();
    });
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
});


