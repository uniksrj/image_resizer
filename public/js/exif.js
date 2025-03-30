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


        },
        error: function () {
            alert('Error uploading file. Please try again.');
            $('#progressLoadingImg').addClass('hidden'); // Hide loader
        },
    });
}

function generateTable(obj) {
    let container = $("#dynamic_img"); // Get the div where we will append the table

    // Clear previous content
    container.html('');

    // Create a scrollable container
    let scrollableDiv = $('<div></div>').css({
        "max-height": "780px",
        "overflow-y": "auto",
        "border": "1px solid #ddd",
        "padding": "10px"
    });

    // Create a table element
    let table = $('<table></table>').addClass('table table-bordered').css({
        "width": "100%", // Ensure full width
        "border-collapse": "collapse"
    });

    // Check if metadata exists
    if (obj.metadata && Object.keys(obj.metadata).length > 0) {
        // Add table header
        let thead = $('<thead><tr><th>Key</th><th>Value</th></tr></thead>').css({
            "position": "sticky",
            "top": "0",
            "background": "#f8f9fa",
            "z-index": "10"
        });
        table.append(thead);

        // Add table body
        let tbody = $('<tbody></tbody>');

        $.each(obj.metadata, function (key, value) {
            if(key != 'SourceFile' && key != 'Directory' && key != 'ExifToolVersion'){
                let row = $('<tr></tr>');
                row.append($('<td></td>').text(key).css("border", "1px solid #ddd"));
                row.append($('<td></td>').text(value).css("border", "1px solid #ddd"));
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
    });

    $(document).on('click', '#locateButton', function () {
        let imageurl = $image[0].src;
        const urlObj = new URL(imageurl);
        const filename = urlObj.pathname.split('/').pop();
        $.ajax({
            url: `/view-location/${filename}`,
            type: "GET",
            success: function(response) {
                if(response.error){
                    alert(response.error);
                    return;
                }
                let obj = JSON.parse(response);                
                window.open(obj.url, "_blank"); 
            }
        });
    });

});