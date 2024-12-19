
// document.getElementById('resizeForm').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const response = await fetch('/resize-image', {
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json'
//         },
//         body: formData,
//     });
//     const result = await response.json();
//     console.log(response);
//     // return false;
//     if (response.ok) {
//         document.getElementById('result').innerHTML = `
//             <p>Image resized successfully!</p>
//             <img src="${result.url}" alt="Resized Image" class="img-fluid">
//         `;
//     } else {
//         const errorText = await response.text();
//         console.error('Error response:', errorText);
//         // document.getElementById('result').innerHTML = `<p>Error: ${result.message}</p>`;
//     }
// });

// Function to upload image with AJAX and show progress
function uploadImage(file) {
    var formData = new FormData();
    formData.append('image', file);

    $.ajax({
        url: '/upload-image',
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
            $('#errorMessage').text(xhr.responseJSON?.message || 'An error occurred during the upload. Please try again.');
        }
    });
}

$(document).ready(function () {
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
        reader.readAsDataURL(file); // Load image as data URL

        // Show the progress bar while uploading
        $('#progressContainer').show();
        uploadImage(file);
    });


});