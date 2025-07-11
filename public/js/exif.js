var $image = $('#uploadedImage');
const mobileToolbox = document.getElementById("mobileToolbox")
const mobileBackdrop = document.getElementById("mobileBackdrop")
const mobileToolsBtn = document.getElementById("mobileToolsBtn")
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
        rotatable: false,        // Disable rotation
        cropBoxMovable: false,   // Disable moving crop box
        cropBoxResizable: false, // Disable resizing crop box
        guides: false,           // Hide grid lines
        background: false,       // Disable background grid
    });
}

function uploadImage(files) {
    $image = '';
    if (!files || files.length === 0) {
        alert('No file selected.');
        return;
    }

    const file = files[0];
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        return;
    }

    $('#progressLoadingImg').removeClass('hidden');
    const formData = new FormData();
    formData.append('image', file);
    $.ajax({
        url: '/save-exif',
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
            if (mobileBackdrop) {
                closeMobileToolbox()
            }

        },
        error: function () {
            alert('Error uploading file. Please try again.');
            $('#progressLoadingImg').addClass('hidden'); // Hide loader
        },
    });
}

function generateTable(obj) {
    let container = $("#dynamic_img");

    // Clear previous content
    container.html('');
    let scrollableDiv = $('<div></div>').css({
        "max-height": "780px",
        "overflow-y": "auto",
        "background-color": "#ffffff",
        "border-radius": "12px",
        "box-shadow": "0 4px 12px rgba(0,0,0,0.1)",
        "padding": "15px",
        "margin": "10px 0"
    });
    let table = $('<table></table>').addClass('table-modern').css({
        "width": "100%",
        "border-collapse": "separate",
        "border-spacing": "0 8px",
        "font-size": "15px"
    });

    const style = `
        <style>
            .table-modern thead th {
                position: sticky;
                top: 0;
                background: #1f2937;
                color: #ffffff;
                padding: 12px;
                text-align: left;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
            }
            .table-modern tbody td {
                background: #f9fafb;
                padding: 12px;
                border-radius: 6px;
                color: #333;
            }
            .table-modern tbody tr {
                transition: background 0.2s ease;
            }
            .table-modern tbody tr:hover td {
                background: #e5e7eb;
            }
            @media (max-width: 600px) {
                .table-modern thead, .table-modern tbody, .table-modern th, .table-modern td, .table-modern tr {
                    display: block;
                }
                .table-modern thead {
                    display: none;
                }
                .table-modern tbody td {
                    position: relative;
                    padding-left: 50%;
                    margin-bottom: 10px;
                }
                .table-modern tbody td::before {
                    content: attr(data-label);
                    position: absolute;
                    left: 16px;
                    font-weight: bold;
                    color: #555;
                }
            }
        </style>
    `;
    $('head').append(style); // Append styles once

    if (obj.metadata && Object.keys(obj.metadata).length > 0) {
        // Table Header
        let thead = $('<thead><tr><th>Key</th><th>Value</th></tr></thead>');
        table.append(thead);

        // Table Body
        let tbody = $('<tbody></tbody>');

        $.each(obj.metadata, function (key, value) {
            if (key !== 'SourceFile' && key !== 'Directory' && key !== 'ExifToolVersion') {
                let row = $('<tr></tr>');
                row.append($('<td></td>').attr('data-label', 'Key').text(key));
                row.append($('<td></td>').attr('data-label', 'Value').text(value));
                tbody.append(row);
            }
        });

        table.append(tbody);
    } else {
        table.append('<tr><td colspan="2" style="color: red; text-align: center;">No metadata found for this image.</td></tr>');
    }

    scrollableDiv.append(table);
    container.append(scrollableDiv);
}




// Mobile toolbox functionality

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

let isUploading = false;
window.handleFileChange = function (event) {
    const file = event.target.files[0];
    if (!file || isUploading) {
        return;
    }
    isUploading = true;


    if (["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
        uploadImage([file]);
    } else {
        alert('Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP).');
    }

    event.target.value = '';
    isUploading = false;
};

window.handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
        uploadImage([file])
    }
}


window.addEventListener("resize", handleResize)

$(document).ready(function () {
    // Enhanced drag and drop functionality
    $("#dropZone").on("dragover", function (e) {
        e.preventDefault()
        $(this).addClass("drag-over")
    })

    $("#dropZone").on("dragleave", function () {
        $(this).removeClass("drag-over")
    })

    $("#dropZone").on("drop", function (e) {
        e.preventDefault()
        $(this).removeClass("drag-over")

        const file = e.originalEvent.dataTransfer.files[0]
        if (file) {
            uploadImage([file])
        } else {
            alert("No valid file dropped. Please try again.")
        }
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

    $(document).on('click', '#downloadMetaButton', function () {
        let imageurl = $image[0].src;
        const urlObj = new URL(imageurl);
        const filename = urlObj.pathname.split('/').pop();
        window.location.href = `/download-meta/${filename}`;
    });

    $(document).on('click', '#viewMetaButton', function () {
        let imageurl = $image[0].src;
        const urlObj = new URL(imageurl);
        const filename = urlObj.pathname.split('/').pop();
        const myData = new FormData();
        myData.append('filename', filename);
        $.ajax({
            url: '/get-meta',
            type: 'POST',
            data: myData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (response) {
                console.log(response);
                generateTable(response);
                if (mobileBackdrop) {
                    closeMobileToolbox()
                }

            },
            error: function (error) {
                alert('Error While fetching details. Please try again.');
                console.error("Error:", error);

            },
        });
    });

    $(document).on('click', '#removeMetaButton', function () {
        let imageurl = $image[0].src;
        const urlObj = new URL(imageurl);
        const filename = urlObj.pathname.split('/').pop();
        window.location.href = `/remove-meta/${filename}`;
        if (mobileBackdrop) {
            closeMobileToolbox()
        }
    });

    $(document).on('click', '#locateButton', function () {
        let imageurl = $image[0].src;
        const urlObj = new URL(imageurl);
        const filename = urlObj.pathname.split('/').pop();
        $.ajax({
            url: `/view-location/${filename}`,
            type: "GET",
            success: function (response) {
                if (response.error) {
                    alert(response.error);
                    return;
                }
                if (mobileBackdrop) {
                    closeMobileToolbox()
                }
                let obj = JSON.parse(response);
                window.open(obj.url, "_blank");

            }
        });
    });

});