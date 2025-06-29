var cropper;
const fileInput = document.getElementById('image');
function uploadImage(file) {
    var formData = new FormData();
    formData.append('image', file);

    $.ajax({
        url: '/upload-crop-image',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        xhr: function () {
            var xhr = new XMLHttpRequest();
            xhr.upload.onprogress = function (event) {
                if (event.lengthComputable) {
                    var percent = (event.loaded / event.total) * 100;

                    // Update progress bar
                    $('#uploadProgressBar').css('width', percent + '%');
                    $('#progressText').text(Math.round(percent) + '% uploaded');
                }
            };
            return xhr;
        },
        success: function (response) {
            // If upload is successful, redirect to the resize image page
            if (response.success) {
                console.log(response);
                window.location.href = response.path;
            } else {
                alert('Upload failed. Please try again.');
            }
        },
        error: function (xhr, status, erro) {
            console.log(erro);
            $('#errorMessage').show();
            $('#progressContainer').hide();
            $('#errorMessage').text(xhr.responseJSON?.message || 'An error occurred during the upload. Please try again.');
            setTimeout(() => {
                $('#errorMessage').hide();
                $('#errorMessage').text('');
                $('#progressContainer').css('display', 'none');
            }, 2000);
        }
    });
}

function showLoader() {
    document.getElementById('loader-container').style.display = 'flex';
}

function hideLoader() {
    document.getElementById('loader-container').style.display = 'none';
}

$(document).ready(function () {

    function drag() {
        document.getElementById('uploadFile').parentNode.className = 'draging dragBox';
    }
    function drop() {
        document.getElementById('uploadFile').parentNode.className = 'dragBox';
    }
    // Handle image drag and drop event
    $('#uploadFile').on('change', function (event) {

        var file = event.target.files[0];

        if (!file) return; // If no file is selected, return

        // Show the image preview
        var reader = new FileReader();
        reader.onload = function (e) {
            var preview = $('#preview');
            preview.html('<img src="' + e.target.result + '" alt="Image preview" style="max-width: 100%; max-height: 300px;">');
        };
        reader.readAsDataURL(file);

        $('#progressContainer').show();
        uploadImage(file);
    });

    // new image crop 
    try {
        const image = document.getElementById('image');
        if (!image) {
            throw new Error("Image element not found in the DOM.");
        }

        cropper = new Cropper(image, {
            viewMode: 2,
            responsive: true,
            autoCropArea: 0.8,
            aspectRatio: NaN,
            autoCrop: true,
            movable: true,
            cropBoxMovable: true,
            cropBoxResizable: true,
            ready: function () {
                console.log('Cropper is ready');
                const cropData = cropper.getData();
                $('#crop-x').val(cropData.x);
                $('#crop-y').val(cropData.y);
                $('#crop-width').val(cropData.width);
                $('#crop-height').val(cropData.height);
            },
            cropmove: function (event) {
                const data = cropper.getData();
                $('#crop-x').val(Math.round(data.x));
                $('#crop-y').val(Math.round(data.y));
                $('#crop-width').val(Math.round(data.width));
                $('#crop-height').val(Math.round(data.height));
                $('#crop-rotate').val(Math.round(data.rotate));

                const imageData = cropper.getImageData();
                if (imageData && imageData.scaleX !== undefined && imageData.scaleY !== undefined) {
                    $('#crop-scale-x').val(imageData.scaleX.toFixed(2));
                    $('#crop-scale-y').val(imageData.scaleY.toFixed(2));
                } else {
                    console.warn('Image data is not available yet');
                }
            },
            cropend: function (event) {
                const data = cropper.getData();
                $('#crop-x').val(Math.round(data.x));
                $('#crop-y').val(Math.round(data.y));
                $('#crop-width').val(Math.round(data.width));
                $('#crop-height').val(Math.round(data.height));
                $('#crop-rotate').val(Math.round(data.rotate));

                const imageData = cropper.getImageData();
                if (imageData && imageData.scaleX !== undefined && imageData.scaleY !== undefined) {
                    $('#crop-scale-x').val(imageData.scaleX.toFixed(2));
                    $('#crop-scale-y').val(imageData.scaleY.toFixed(2));
                } else {
                    console.warn('Image data is not available yet');
                }
            },
        });
    } catch (error) {
        console.warn("Cropper initialization failed: The first argument must be an <img> or <canvas> element. Ensure that the target element is correctly selected and loaded in the DOM before initializing the Cropper.", error);
    }
    // Tool Handlers
    $('#updateCrop').on('click', function () {

        if (!cropper) {
            console.error("Cropper instance is not initialized. Ensure the Cropper is properly initialized before interacting with it.");
            return;
        }

        const x = parseFloat($('#crop-x').val());
        const y = parseFloat($('#crop-y').val());
        const width = parseFloat($('#crop-width').val());
        const height = parseFloat($('#crop-height').val());
        const rotate = parseFloat($('#crop-rotate').val());
        const scaleX = parseFloat($('#crop-scale-x').val());
        const scaleY = parseFloat($('#crop-scale-y').val());

        // Set Cropper Data
        cropper.setData({ x, y, width, height });
        cropper.rotateTo(rotate);
        cropper.scale(scaleX, scaleY);
        const link = new URL(fileInput.src);
        const pathname = link.pathname;
        const extension = pathname.split('.').pop().toLowerCase();
        cropper.getCroppedCanvas().toBlob(function (blob) {
            const formData = new FormData();
            formData.append('croppedImage', blob, `cropped-image.${extension}`);
            formData.append('_token', $('meta[name="csrf-token"]').attr('content'));

            $.ajax({
                url: '/save-cropped-image',
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                beforeSend: function () {
                    showLoader();
                },
                success: function (data) {
                    hideLoader();
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
                    hideLoader();
                    console.error("Upload failed:", err);

                    const errorMsg = err.responseJSON?.message || "Upload failed. Please try again.";
                    $('#errorMessage').text(errorMsg).fadeIn(300);
                    
                    setTimeout(() => {
                        $('#errorMessage').fadeOut(300);
                    }, 3000);

                }
            })
        })
    });



    $('#crop-x').on('change', function () {
        const x = parseFloat(this.value);
        const cropData = cropper.getData();
        cropper.setData({ ...cropData, x });  // Update cropper x position
    });

    $('#crop-y').on('change', function () {
        const y = parseFloat(this.value);
        const cropData = cropper.getData();
        cropper.setData({ ...cropData, y });  // Update cropper y position
    });

    $('#crop-width').on('change', function () {
        const width = parseFloat(this.value);
        const cropData = cropper.getData();
        cropper.setData({ ...cropData, width });  // Update cropper width
    });

    $('#crop-height').on('change', function () {
        const height = parseFloat(this.value);
        const cropData = cropper.getData();
        cropper.setData({ ...cropData, height });  // Update cropper height
    });

    $('#crop-rotate').on('change', function () {
        const rotate = parseFloat(this.value);
        cropper.rotateTo(rotate);  // Apply rotation to cropper
    });

    $('#crop-scale-x').on('change', function () {
        const scaleValue = parseFloat(this.value);
        cropper.scaleX(scaleValue);  // Apply scaling on X axis
    });

    $('#crop-scale-y').on('change', function () {
        const scaleValue = parseFloat(this.value);
        cropper.scaleY(scaleValue);  // Apply scaling on Y axis
    });

    // Handle aspect ratio button clicks
    $('.aspect-ratio-btn').on('click', function () {
        const aspectRatio = $(this).data('aspect-ratio');  // Get the aspect ratio from the data attribute

        if (aspectRatio === "free") {
            cropper.setAspectRatio(NaN);  // Set aspect ratio to 0 to make it free (no restriction)
        } else {
            cropper.setAspectRatio(aspectRatio);  // Apply fixed aspect ratio
        }
    });

    // Handle free crop button click
    $('#free-crop').on('click', function () {
        cropper.setAspectRatio(NaN);  // Set to free crop mode (no aspect ratio constraint)
    });

    window.addEventListener('resize', () => {
        cropper.resize(); // Ensures proper adjustment
    });


});