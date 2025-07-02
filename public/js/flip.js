var $image = $("#uploadedImage")
var cropper = null
var Cropper = window.Cropper

function initializeCropper(imageElement) {
    if (window.cropper) {
        window.cropper.destroy()
    }
    window.cropper = new Cropper(imageElement, {
        viewMode: 1,
        dragMode: "move",
        responsive: true,
        movable: false,
        zoomable: false,
        autoCrop: false,
        rotatable: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        guides: false,
        background: false,
        ready: () => {
            console.log("Cropper initialized successfully")
        },
    })
    cropper = window.cropper
}

function uploadImage(files) {
    $image = ""
    if (!files || files.length === 0) {
        alert("No file selected.")
        return
    }

    const file = files[0]
    console.log(file)
    if (!file.type.startsWith("image/")) {
        alert("Please upload an image file.")
        return
    }

    // Show progress bars for both desktop and mobile
    $("#progressLoadingImg").removeClass("hidden")
    $("#progressLoadingImgMobile").removeClass("hidden")

    const formData = new FormData()
    formData.append("image", file)
    formData.append("method", "flipImage")

    $.ajax({
        url: "/save-temp",
        type: "POST",
        data: formData,
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        contentType: false,
        processData: false,
        xhr: () => {
            const xhr = new window.XMLHttpRequest()
            xhr.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100)
                    $("#progressBar").css("width", `${percentComplete}%`)
                    $("#progressBarMobile").css("width", `${percentComplete}%`)
                    $("#progressText").text(`${percentComplete}% Uploaded`)
                    $("#progressTextMobile").text(`${percentComplete}% Uploaded`)
                }
            })
            return xhr
        },
        success: (response) => {
            // Replace the image inside #dynamic_img
            $("#dynamic_img").html(`
                <div class="w-full h-full flex items-center justify-center bg-white rounded-2xl shadow-inner border-2 border-gray-200/50 min-h-[400px]">
                    <img id="uploadedImage" src="${response.path}" alt="Uploaded Image" style="transform:none;" class="object-contain max-w-full max-h-full transition-all duration-300 ease-in-out rounded-lg" />
                </div>
            `)

            // Hide progress bars
            $("#progressLoadingImg").addClass("hidden")
            $("#progressLoadingImgMobile").addClass("hidden")

            // Show file info
            $("#fileInfo").text(`Selected: ${file.name}`).removeClass("hidden")

            $image = $("#uploadedImage")
            console.log($image)
            initializeCropper($image[0])
        },
        error: () => {
            alert("Error uploading file. Please try again.")
            $("#progressLoadingImg").addClass("hidden")
            $("#progressLoadingImgMobile").addClass("hidden")
        },
    })
}

function bindRotateEvents() {
    // Desktop buttons
    $("#horizontally_btn")
        .off("click")
        .on("click", function () {
            if (cropper) {
                cropper.scaleX(cropper.getData().scaleX * -1)
                $(this).toggleClass("flip-active")
            } else {
                alert("Please upload new Image")
                console.warn("Cropper is not initialized.")
            }
        })

    $("#vertically_btn")
        .off("click")
        .on("click", function () {
            if (cropper) {
                cropper.scaleY(cropper.getData().scaleY * -1)
                $(this).toggleClass("flip-active")
            } else {
                alert("Please upload new Image")
                console.warn("Cropper is not initialized.")
            }
        })

    // Mobile buttons
    $("#horizontally_btn_mobile")
        .off("click")
        .on("click", function () {
            if (cropper) {
                cropper.scaleX(cropper.getData().scaleX * -1)
                $(this).toggleClass("flip-active")
                $("#horizontally_btn").toggleClass("flip-active")
            } else {
                alert("Please upload new Image")
                console.warn("Cropper is not initialized.")
            }
        })

    $("#vertically_btn_mobile")
        .off("click")
        .on("click", function () {
            if (cropper) {
                cropper.scaleY(cropper.getData().scaleY * -1)
                $(this).toggleClass("flip-active")
                $("#vertically_btn").toggleClass("flip-active")
            } else {
                alert("Please upload new Image")
                console.warn("Cropper is not initialized.")
            }
        })

    // Reset buttons
    $("#resetButton, #resetButtonMobile").on("click", () => {
        if (cropper) {
            cropper.reset()
            $(".flip-active").removeClass("flip-active")
        }
    })
}

function processImage() {
    $("#loader-container").css("display", "flex")

    // Close mobile toolbox
    closeMobileToolbox()

    if (!cropper) {
        console.error(
            "Cropper instance is not initialized. Ensure the Cropper is properly initialized before interacting with it.",
        )
        $("#loader-container").hide()
        return
    }

    console.log($image[0].src)
    console.log(cropper.getCroppedCanvas())

    const extension = $image[0].src.split(".").pop()
    cropper.getCroppedCanvas().toBlob((blob) => {
        const formData = new FormData()
        formData.append("flipImage", blob, `flip-image.${extension}`)
        formData.append("_token", $('meta[name="csrf-token"]').attr("content"))

        $.ajax({
            url: "/save-flip-image",
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: (data) => {
                if (data.status === "success") {
                    const form = document.createElement("form")
                    form.method = "POST"
                    form.action = "/download-page"
                    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content")
                    const csrfInput = document.createElement("input")
                    csrfInput.type = "hidden"
                    csrfInput.name = "_token"
                    csrfInput.value = csrfToken
                    form.appendChild(csrfInput)
                    const filenameInput = document.createElement("input")
                    filenameInput.type = "hidden"
                    filenameInput.name = "filename"
                    filenameInput.value = data.filename
                    form.appendChild(filenameInput)
                    document.body.appendChild(form)
                    form.submit()
                }
            },
            error: (err) => {
                console.error(err)
                $("#loader-container").hide()
            },
        })
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

window.dragOver = (event) => {
    event.preventDefault()
}

window.dragLeave = (event) => {
    event.preventDefault()
}


window.addEventListener("resize", handleResize)

$(document).ready(() => {
    bindRotateEvents()

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

    // Process image event handlers
    $(document).on("click", "#process_data, #process_data_mobile", () => {
        processImage()
    })
})
