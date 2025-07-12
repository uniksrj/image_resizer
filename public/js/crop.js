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
        xhr: () => {
            $("#progressContainer").css("display", "block")
            var xhr = new XMLHttpRequest()
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    var percent = (event.loaded / event.total) * 100
                    $("#uploadProgressBar").css("width", percent + "%")
                    $("#progressText").text(Math.round(percent) + "% uploaded")
                }
            }
            return xhr
        },
        success: (response) => {
            if (response.success) {
                console.log(response)
                window.location.href = response.path
            } else {
                showError("Upload failed. Please try again.")
            }
        },
        error: (xhr, status, error) => {
            console.log(error)
            showError(xhr.responseJSON?.message || "An error occurred during the upload. Please try again.")
        },
    });
}

function showError(message) {
    $("#errorMessage").text(message).show()
    setTimeout(() => {
        $("#errorMessage").hide().text("")
        $("#progressContainer").css("display", "none")
    }, 3000)
}

function showLoader() {
    document.getElementById('loader-container').style.display = 'flex';
}

function hideLoader() {
    document.getElementById('loader-container').style.display = 'none';
}

function handleFileSelect(file) {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
        showError("Please select a valid image file.")
        return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showError("File size must be less than 10MB.")
        return
    }

    // Show image preview
    var reader = new FileReader()
    reader.onload = (e) => {
        var preview = $("#preview")
        preview.html(
            '<img src="' +
            e.target.result +
            '" alt="Image preview" style="max-width: 100%; max-height: 300px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-top: 20px;">',
        )
    }
    reader.readAsDataURL(file)

    // Upload the image
    uploadImage(file)
}

function drag(event) {
    event.preventDefault()
}

function drop(event) {
    event.preventDefault()
    var file = event.dataTransfer.files[0]
    handleFileSelect(file)
}
$(document).ready(function () {

    // Handle desktop file input change
    $("#uploadFile").on("change", (event) => {
        var file = event.target.files[0]
        handleFileSelect(file)
    })

    // Handle mobile file input change
    $("#uploadFileMobile").on("change", (event) => {
        var file = event.target.files[0]
        handleFileSelect(file)
    })

    // Handle drag and drop on drag box
    $(".dragBox").on("dragover", function (e) {
        e.preventDefault()
        $(this).addClass("drag-over")
    })

    $(".dragBox").on("dragleave", function (e) {
        e.preventDefault()
        $(this).removeClass("drag-over")
    })

    $(".dragBox").on("drop", function (e) {
        e.preventDefault()
        $(this).removeClass("drag-over")
        var file = e.originalEvent.dataTransfer.files[0]
        handleFileSelect(file)
    })

    // Handle click on drag box to open file dialog
    $(".dragBox").on("click", () => {
        $("#uploadFile").click()
    })

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
            aspectRatio: Number.NaN,
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
        showLoader();
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
                error: (err) => {
                    hideLoader()
                    console.error("Upload failed:", err)
                    const errorMsg = err.responseJSON?.message || "Upload failed. Please try again."
                    $("#errorMessage").text(errorMsg).fadeIn(300)

                    setTimeout(() => {
                        $("#errorMessage").fadeOut(300)
                    }, 3000)
                },
                complete: () => {
                    $("#updateCrop").prop("disabled", false).text("Crop & Save")
                },
            })
        })
    });



    $('#crop-x').on('change', function () {
        if (!cropper) return
        const x = parseFloat(this.value);
        const cropData = cropper.getData();
        cropper.setData({ ...cropData, x });  // Update cropper x position
    });

    $('#crop-y').on('change', function () {
        if (!cropper) return
        const y = parseFloat(this.value);
        const cropData = cropper.getData();
        cropper.setData({ ...cropData, y });  // Update cropper y position
    });

    $('#crop-width').on('change', function () {
        if (!cropper) return
        const width = parseFloat(this.value);
        const cropData = cropper.getData();
        cropper.setData({ ...cropData, width });  // Update cropper width
    });

    $('#crop-height').on('change', function () {
        if (!cropper) return
        const height = parseFloat(this.value);
        const cropData = cropper.getData();
        cropper.setData({ ...cropData, height });  // Update cropper height
    });

    $('#crop-rotate').on('change', function () {
        if (!cropper) return
        const rotate = parseFloat(this.value);
        cropper.rotateTo(rotate);  // Apply rotation to cropper
    });

    $('#crop-scale-x').on('change', function () {
        if (!cropper) return
        const scaleValue = parseFloat(this.value);
        cropper.scaleX(scaleValue);  // Apply scaling on X axis
    });

    $('#crop-scale-y').on('change', function () {
        if (!cropper) return
        const scaleValue = parseFloat(this.value);
        cropper.scaleY(scaleValue);  // Apply scaling on Y axis
    });

    // Handle aspect ratio button clicks
    $('.aspect-ratio-btn').on('click', function () {
        if (!cropper) return
        const aspectRatio = $(this).data('aspect-ratio');  // Get the aspect ratio from the data attribute

        if (aspectRatio === undefined || $(this).attr("id") === "free-crop") {
            cropper.setAspectRatio(Number.NaN)
        } else {
            cropper.setAspectRatio(aspectRatio)
        }
        $(".aspect-ratio-btn").removeClass("active")
        $(this).addClass("active")
    });

    // Handle free crop button click
    $('#free-crop').on('click', function () {
        if (!cropper) return
        cropper.setAspectRatio(NaN);  // Set to free crop mode (no aspect ratio constraint)
    });

    window.addEventListener("resize", () => {
        if (cropper) {
            cropper.resize()
        }
    })
    // Handle orientation change on mobile
    window.addEventListener("orientationchange", () => {
        setTimeout(() => {
            if (cropper) {
                cropper.resize()
            }
        }, 500)
    })


});