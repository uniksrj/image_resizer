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
    $("#progressLoadingImgMobile").removeClass("hidden")


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
                    $("#progressBarMobile").css("width", `${percentComplete}%`)
                    $('#progressText').text(`${percentComplete}% Uploaded`);
                    $("#progressTextMobile").text(`${percentComplete}% Uploaded`)
                }
            });
            return xhr;
        },
        success: function (response) {
            // Replace the image inside #dynamic_img
            $("#dynamic_img").html(`
                <div class="w-full h-full flex items-center justify-center bg-white rounded-2xl shadow-inner border-2 border-gray-200/50 min-h-[400px]">
                    <img id="uploadedImage" src="${response.path}" alt="Uploaded Image" style="transform:none;" class="object-contain max-w-full max-h-full transition-all duration-300 ease-in-out rounded-lg" />
                </div>
            `)
            $('#progressLoadingImg').addClass('hidden'); // Hide loader
            $("#progressLoadingImgMobile").addClass("hidden")

            // Show file info
            $("#fileInfo").text(`Selected: ${file.name}`).removeClass("hidden")

            $image = $("#uploadedImage")
            console.log($image)
            initializeCropper($image[0])
        },
        error: function () {
            alert('Error uploading file. Please try again.');
            $('#progressLoadingImg').addClass('hidden'); // Hide loader
            $("#progressLoadingImgMobile").addClass("hidden")
        },
    });
}


function processImage() {
    $('#loader-container').css('display', 'flex');
    closeMobileToolbox()
    let formate = $('#format').val() != '' ? $('#format').val() : ($('#format_mobile').val() != '' ? $('#format_mobile').val() : 'jpeg');
    let quality = $('#quality').val() != '' ? $('#quality').val() : ($('#quality_mobile').val() != '' ? $('#quality_mobile').val() : 80);
    const Image = $image[0].src;
    const imageUrl = new URL(Image);
    const relativePath = imageUrl.pathname;
    if (relativePath.includes('cut_logo.png')) {
        alert('Please upload a new image before processing.');
        $('#loader-container').hide();
        return;
    }
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
            $("#loader-container").hide()
        }
    })
}

// Mobile toolbox functionality
const mobileToolbox = document.getElementById("mobileToolbox")
const mobileBackdrop = document.getElementById("mobileBackdrop")
const mobileToolsBtn = document.getElementById("mobileToolsBtn")
if (mobileToolsBtn) {
    // Mobile toolbox toggle
    mobileToolsBtn.addEventListener("click", () => {
        toggleMobileToolbox()
    })
}
if (mobileBackdrop) {
    mobileBackdrop.addEventListener("click", () => {
        closeMobileToolbox()
    })
}

// Touch gestures for mobile toolbox
let startY = 0
let currentY = 0
let isDragging = false

if (mobileToolbox) {
    mobileToolbox.addEventListener("touchstart", (e) => {
        startY = e.touches[0].clientY
        isDragging = true
    })


    mobileToolbox.addEventListener("touchmove", (e) => {
        if (!isDragging) return

        currentY = e.touches[0].clientY
        const deltaY = currentY - startY

        if (deltaY > 0) {
            mobileToolbox.style.transform = `translateY(${deltaY}px)`
        }
    })

    mobileToolbox.addEventListener("touchend", (e) => {
        if (!isDragging) return

        const deltaY = currentY - startY

        if (deltaY > 100) {
            closeMobileToolbox()
        } else {
            mobileToolbox.style.transform = "translateY(0)"
        }

        isDragging = false
    })
}

function toggleMobileToolbox() {
    if (!mobileToolbox || !mobileBackdrop) return
    mobileToolbox.classList.toggle("show")
    mobileBackdrop.classList.toggle("show")

    if (mobileToolbox.classList.contains("show")) {
        mobileToolbox.style.transform = "translateY(0)"
        document.body.style.overflow = "hidden"
    } else {
        mobileToolbox.style.transform = "translateY(100%)"
        document.body.style.overflow = ""
    }
}

function closeMobileToolbox() {
    if (!mobileToolbox || !mobileBackdrop) return
    mobileToolbox.classList.remove("show")
    mobileBackdrop.classList.remove("show")
    mobileToolbox.style.transform = "translateY(100%)"
    document.body.style.overflow = ""
}

// Responsive handling
function handleResize() {
    if (window.innerWidth >= 768) {
        closeMobileToolbox()
    }
}
// GLOBAL FUNCTIONS - These need to be accessible from HTML
window.handleFileChange = (event) => {
    const file = event.target.files[0]
    if (!file) {
        return
    }

    if (["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
        uploadImage([file])
    } else {
        alert("Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP).")
    }

    event.target.value = ""
}

window.handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
        uploadImage([file])
    }
}

// window.dragOver = (event) => {
//     event.preventDefault()
// }

// window.dragLeave = (event) => {
//     event.preventDefault()
// }


$(document).ready(function () {

    const $dropdownButton = $('#dropdownButton');
    const $dropdownList_mobile = $('#dropdownList_mobile');
    const $dropdownList = $('#dropdownList');
    const $selectedValue = $('#selectedValue');
    const $selectedValue_mobile = $('#selectedValue_mobile');
    const $hiddenInput = $('#format');
    const $format_mobile = $('#format_mobile');

    $('#quality_mobile').on('input', function () {
        this.value = Math.max(0, Math.min(100, this.value));
    });
    $('#quality').on('input', function () {
        this.value = Math.max(0, Math.min(100, this.value));
    });

    $('#dropZone').on('dragover', function (e) {
        e.preventDefault();
        $(this).addClass("drag-over")
        // $(this).css({
        //     'background-color': 'rgb(134 239 172)',
        // });
    });

    $('#dropZone').on('dragleave', function () {
        $(this).removeClass("drag-over")
        // $(this).css({
        //     'background-color': 'rgb(134 239 172)',
        // });
    });

    $('#dropZone').on('drop', function (e) {
        e.preventDefault();
        $(this).removeClass("drag-over")
        // $(this).css({
        //     'background-color': 'rgb(134 239 172)',
        // });

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

    $(document).on('click', '#process_data, #process_data_mobile', function () {
        const format = $('#format').val();
        const formatMobile = $('#format_mobile').val();

        if (!format || !formatMobile) {
            $('#dropdownButton_mobile').after('<span class="error_message text-red-500 text-sm">Please select a format</span>');
            $('#dropdownButton').after('<span class="error_message text-red-500 text-sm">Please select a format</span>');

            return false;
        }
        processImage();
    });

    // Show and hide the dropdown list on click for desktop
    $dropdownButton.on('click', function () {
        $dropdownList.toggleClass('hidden');
    });

    // Show and hide the dropdown list on click for mobile
    $(document).on('click', '#dropdownButton_mobile', function (e) {
        e.stopImmediatePropagation();
        let $dropdownButton = $('#dropdownButton').next('.error_message').length;
        let $dropdownButton_mobile = $('#dropdownButton_mobile').next('.error_message').length;
        if ($dropdownButton || $dropdownButton_mobile) {
            $('#dropdownButton_mobile').next('.error_message').remove();
            $('#dropdownButton').next('.error_message').remove();
        }
        // Toggle the dropdown list visibility
        const $dropdown = $('#dropdownList_mobile');
        $dropdown.toggleClass('hidden');
    });

    // Show and hide the dropdown list on click
    $('.dropdown-item').on('click', function () {
        const $item = $(this);
        const value = $item.data('value');

        $hiddenInput.val(value);
        $format_mobile.val(value);

        $('.dropdown-item').find('.checkmark').remove();
        if (!$item.find('.checkmark').length) {
            $item.append('<span class="checkmark text-green-500 ml-auto">&#10003;</span>');
        }

        $selectedValue.text(value.toUpperCase());
        $selectedValue_mobile.text(value.toUpperCase());
        $dropdownList.addClass('hidden');
        $dropdownList_mobile.addClass('hidden');
    });

    // Reset the dropdown and selected value
    $(document).on('click', '#resetButton, #resetButtonMobile', function () {
        $selectedValue.text('Select Format');
        $selectedValue_mobile.text('Select Format');
        $('.dropdown-item').find('.checkmark').remove();
        $hiddenInput.val("");
        $format_mobile.val("");
        $('#quality').val(80);
        $('#quality_mobile').val(80);
        $dropdownList.addClass('hidden');
        $dropdownList_mobile.addClass('hidden');
    })

    $("#mobileToolbox .bg-white\\/10").on("dragover", function (e) {
        e.preventDefault()
        $(this).addClass("drag-over")
    })

    $("#mobileToolbox .bg-white\\/10").on("dragleave", function () {
        $(this).removeClass("drag-over")
    })

    $("#mobileToolbox .bg-white\\/10").on("drop", function (e) {
        e.preventDefault()
        $(this).removeClass("drag-over")

        const file = e.originalEvent.dataTransfer.files[0]
        if (file) {
            uploadImage([file])
        } else {
            alert("No valid file dropped. Please try again.")
        }
    })

})