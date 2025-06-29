var orig_size;
function uploadImage(file) {
    var formData = new FormData();
    formData.append('image', file);

    $.ajax({
        url: '/compress-image-edit',
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
    
    $('#original_size').text(orig_size);
    let selectedFile = null;
    // Handle image drag and drop event
    $('#uploadFile').on('change', function (event) {
        $('#progressContainer').hide();
        $('#errorMessage').hide();
        $('#errorMessage').text("");
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


    const originalImagePath = $('#originalImage').attr('src');
    let compressedBlob = null;

    $('#compressionRate').on('input', function () {
        const quality = parseFloat($(this).val());
        $('#qualityValue').text(Math.round(quality * 100) + '%');
        showLoader();
        fetch(originalImagePath)
            .then(response => response.blob())
            .then(blob => {
                new Compressor(blob, {
                    quality: quality,
                    success(result) {
                        console.log('Original Size:', blob.size);
                        console.log(result);
                        $('#compressed_size').text((result.size / 1024).toFixed(2));
                        compressedBlob = result;
                        const reader = new FileReader();
                        reader.onload = function (e) {
                            $('#compressedImage').attr('src', e.target.result);
                            $('#compressedImage').show();
                        };
                        reader.readAsDataURL(result);
                        hideLoader();
                    },
                    error(err) {
                        console.error('Compression error:', err);
                    }
                });
            });
    });

    // Slider functionality
    const slider = $('#sliderBar');
    const container = $('.image-comparison-container');
    const compressedImage = $('#compressedImage');
    const imageComparison = $('.image-comparison');

    let isDragging = false;

    slider.on('mousedown', function (e) {
        isDragging = true;
        e.preventDefault();
    });

    $(document).on('mouseup', function () {
        isDragging = false;
    });

    $(document).on('mousemove', function (e) {
        moveSlider(e)
    })

    function moveSlider(e) {
        if (!isDragging) return;

        // Calculate slider position relative to the container
        const containerOffset = container.offset().left;
        const containerWidth = container.width();
        let sliderPosition = e.pageX - containerOffset;

        // Clamp slider position within the container
        sliderPosition = Math.max(0, Math.min(sliderPosition, containerWidth));

        // Move the slider and adjust the compressed image's clip-path
        slider.css('left', `${sliderPosition}px`);
        compressedImage.css('clip-path', `inset(0 ${containerWidth - sliderPosition}px 0 0)`);
    }

    $('#compressButton').on('click', function () {
        if (!compressedBlob) {
            alert('No compressed image available!');
            return;
        }
        console.log(compressedBlob);

        const link = new URL(originalImagePath);
        const pathname = link.pathname;
        const extension = pathname.split('.').pop().toLowerCase();
        const formData = new FormData();
        formData.append('compressedImage', compressedBlob, `compressed.${extension}`);
        formData.append('_token', $('meta[name="csrf-token"]').attr('content'));

        $.ajax({
            url: '/save-compressed-image',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function () {
                showLoader();
            },
            success: function (response) {
                console.log(response);
                if (response.status === 'success') {
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
                    filenameInput.value = response.filename;
                    form.appendChild(filenameInput);

                    document.body.appendChild(form);
                    form.submit();
                }
            },
            error: function (xhr, status, error) {
                console.error('Error saving compressed image:', error);
                alert('Failed to save the compressed image.');
            }
        });
    });

});