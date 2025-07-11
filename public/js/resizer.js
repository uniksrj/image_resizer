
function uploadImage(file) {
    $("#errorMessage").text("").hide()
    $("#progressContainer").css("display", "none")
    var formData = new FormData()
    formData.append("image", file)

    $.ajax({
        url: "/upload-image",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
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
    })
}

// Function to show error messages
function showError(message) {
    $("#errorMessage").text(message).show()
    setTimeout(() => {
        $("#errorMessage").hide().text("")
        $("#progressContainer").css("display", "none")
    }, 3000)
}

// Function to handle file selection and preview
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

// Drag and drop functions
function drag(event) {
    event.preventDefault()
}

function drop(event) {
    event.preventDefault()
    var file = event.dataTransfer.files[0]
    handleFileSelect(file)
}

$(document).ready(() => {
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

    // Handle mobile upload button click
    $('label[for="uploadFileMobile"]').on("click", () => {
        $("#uploadFileMobile").click()
    })
})
