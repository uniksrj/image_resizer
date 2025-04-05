var $image = $('#uploadedImage');
let baseRotation = 0;
let currentScale = 1;
var storeAngle = 0;
let currentZoomLevel = 1;
let isFirstMovement = true;
function initializeCropper(imageElement) {
    if (window.cropper) {
        window.cropper.destroy();
    }
    window.cropper = new Cropper(imageElement, {
        viewMode: 2,
        background: false,
        autoCrop: false,    
        cropBoxMovable: false,
        dragMode: 'none',
        responsive: false,
        zoomable: false,
        zoomOnTouch: false,
        checkOrientation: false,
        ready: function () {
            fitImageToContainer();
        },
    });
}

function fitImageToContainer() {
    if (!window.cropper) return;

    const cropper = window.cropper;

    setTimeout(() => {
        const containerData = cropper.getContainerData();
        const imageData = cropper.getImageData();

        const rotation = imageData.rotate % 180 !== 0;
        const width = rotation ? imageData.naturalHeight : imageData.naturalWidth;
        const height = rotation ? imageData.naturalWidth : imageData.naturalHeight;

        const scaleX = containerData.width / width;
        const scaleY = containerData.height / height;
        const scale = Math.min(scaleX, scaleY);

        const adjustedWidth = width * scale;
        const adjustedHeight = height * scale;

        const offsetX = (containerData.width - adjustedWidth) / 2;
        const offsetY = (containerData.height - adjustedHeight) / 2;
        cropper.setCanvasData({
            left: offsetX,
            top: offsetY,
            width: adjustedWidth,
            height: adjustedHeight,
        });

        cropper.clear();
    }, 100);

}

function scaleImageToFillAfterRotation(cropper) {
    const container = cropper.getContainerData();
    const imageData = cropper.getImageData();

    // Compute bounding box of rotated image
    const angleInRadians = (imageData.rotate || 0) * Math.PI / 180;
    const cos = Math.abs(Math.cos(angleInRadians));
    const sin = Math.abs(Math.sin(angleInRadians));

    const rotatedWidth = imageData.naturalWidth * cos + imageData.naturalHeight * sin;
    const rotatedHeight = imageData.naturalWidth * sin + imageData.naturalHeight * cos;

    const scaleX = container.width / rotatedWidth;
    const scaleY = container.height / rotatedHeight;
    console.log("scaleX: ", scaleX);
    console.log("scaleY: ", scaleY);

    const finalScale = Math.max(scaleX, scaleY);

    // Calculate new canvas size
    const adjustedWidth = imageData.naturalWidth * finalScale;
    const adjustedHeight = imageData.naturalHeight * finalScale;

    // Center the image within the container
    const offsetX = (container.width - adjustedWidth) / 2;
    const offsetY = (container.height - adjustedHeight) / 2;

    cropper.setCanvasData({
        left: offsetX,
        top: offsetY,
        width: adjustedWidth,
        height: adjustedHeight,
    });

    // cropper.scale(finalScale); 
    currentScale = finalScale;
}

function bindRotateEvents() {
    $('#rotateLeft').off('click').on('click', function () {
        if (window.cropper) {
            baseRotation = (baseRotation - 90 + 360) % 360;
            storeAngle = baseRotation;
            cropper.rotateTo(baseRotation);
            fitImageToContainer();
            $('#colorSlider').val(0);
            $('#degree').html(`0 &deg;`);
        }
    });

    $('#rotateRight').off('click').on('click', function () {
        if (window.cropper) {
            baseRotation = (baseRotation + 90) % 360;
            storeAngle = baseRotation;
            cropper.rotateTo(baseRotation);
            fitImageToContainer();
            $('#colorSlider').val(0);
            $('#degree').html(`0 &deg;`);
        }
    });

    $('#resetButton').on('click', function () {
        if (window.cropper) {
            window.cropper.reset();
        }
        baseRotation = 0;
        currentScale = 1;
        storeAngle = 0;
        $('#colorSlider').val(0);
        $('#degree').text('0°');
    });

    $('#colorSlider').on('input', function () {
        const rawAngle = parseFloat($(this).val()) || 0;
        const relativeAngle = Math.max(-45, Math.min(45, rawAngle));
        const totalRotation = baseRotation + relativeAngle;
        storeAngle = totalRotation;

        $('#degree').html(`${relativeAngle} &deg;`);

        const cropper = window.cropper;
        if (!cropper) return;

        cropper.rotateTo(totalRotation);
        const absAngle = Math.abs(relativeAngle);
        // cropper.scale(1 / currentScale);
        if (absAngle > 5 || !isFirstMovement) {
            const zoomFactor = 1 + (absAngle / 44) * 0.5; // Adjust 0.5 for stronger/weaker zoom
            cropper.zoomTo(zoomFactor);
            currentZoomLevel = zoomFactor;
            isFirstMovement = false;
        }

        // scaleImageToFillAfterRotation(cropper)

        // Slider color feedback
        if (relativeAngle < 0) {
            this.style.setProperty('--slider-color-left', `hsl(200, 100%, 70%)`);
            this.style.setProperty('--slider-color-right', `hsl(0, 0%, 75%)`);
        } else {
            this.style.setProperty('--slider-color-left', `hsl(0, 0%, 75%)`);
            this.style.setProperty('--slider-color-right', `hsl(200, 100%, 70%)`);
        }
        
    });

    $('#colorSlider').on('change', function() {
        if (parseFloat($(this).val()) === 0) {
            isFirstMovement = true;
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
            $('#progressLoadingImg').addClass('hidden');
        },
    });
}

function trimCanvas(c) {
    const ctx = c.getContext('2d');
    const w = c.width;
    const h = c.height;
    const imageData = ctx.getImageData(0, 0, w, h).data;

    let minX = w, minY = h, maxX = 0, maxY = 0;

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const index = (y * w + x) * 4;
            const alpha = imageData[index + 3];
            if (alpha > 0) {
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
            }
        }
    }

    const trimmedW = maxX - minX + 1;
    const trimmedH = maxY - minY + 1;

    const trimmed = document.createElement('canvas');
    trimmed.width = trimmedW;
    trimmed.height = trimmedH;
    const trimmedCtx = trimmed.getContext('2d');
    trimmedCtx.drawImage(c, minX, minY, trimmedW, trimmedH, 0, 0, trimmedW, trimmedH);

    return trimmed;
}

function processImage() {
    const cropper = window.cropper;
    $('#loader-container').css('display', 'flex');
    if (!cropper) {
        console.error("Cropper instance is not initialized. Ensure the Cropper is properly initialized before interacting with it.");
        return;
    }

    try {
        cropper.rotateTo(storeAngle);

        // let canvas = cropper.getCroppedCanvas();
        const canvas = cropper.getCroppedCanvas({
            fillColor: 'transparent'
        });

        // === REMOVE white space (transparent areas) ===
        const trimmedCanvas = trimCanvas(canvas);
        console.log($image.attr('src'));
        let new_Img = $image.attr('src');

        const relativePath = new_Img.replace(location.origin, '');
        const extension = relativePath.split('.').pop().toLowerCase();
        trimmedCanvas.toBlob(function (blob) {
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
    $('#colorSlider').val(0);
    $('#degree').html('0&deg;');
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

    // if ($image.length > 0 && $image[0] instanceof HTMLImageElement) {
    //     // Initialize Cropper
    //     initializeCropper($image[0])
    // } else {
    //     console.error('Image element not found.');
    // }
});


