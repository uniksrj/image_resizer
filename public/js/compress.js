var orig_size
const $ = window.jQuery // Declare the $ variable
const Compressor = window.Compressor // Declare the Compressor variable

function uploadImage(file) {
  var formData = new FormData()
  formData.append("image", file)

  $.ajax({
    url: "/compress-image-edit",
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

function showError(message) {
  $("#errorMessage").text(message).show()
  setTimeout(() => {
    $("#errorMessage").hide().text("")
    $("#progressContainer").css("display", "none")
  }, 3000)
}

function showLoader() {
  document.getElementById("loader-container").style.display = "flex"
}

function hideLoader() {
  document.getElementById("loader-container").style.display = "none"
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

$(document).ready(() => {
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

  $("#original_size").text(orig_size)
  const selectedFile = null

  // Handle image drag and drop event
  $("#uploadFile").on("change", (event) => {
    $("#progressContainer").hide()
    $("#errorMessage").hide()
    $("#errorMessage").text("")
    var file = event.target.files[0]

    if (!file) return
    var reader = new FileReader()
    reader.onload = (e) => {
      var preview = $("#preview")
      preview.html(
        '<img src="' + e.target.result + '" alt="Image preview" style="max-width: 100%; max-height: 300px;">',
      )
    }
    reader.readAsDataURL(file)

    $("#progressContainer").show()
    uploadImage(file)
  })

  const originalImagePath = $("#originalImage").attr("src")
  let compressedBlob = null

  // Compression slider handler
  $("#compressionRate").on("input", function () {
    const quality = Number.parseFloat($(this).val())
    $("#qualityValue").text(Math.round(quality * 100) + "%")
    showLoader()

    fetch(originalImagePath)
      .then((response) => response.blob())
      .then((blob) => {
        new Compressor(blob, {
          quality: quality,
          success(result) {
            console.log("Original Size:", blob.size)
            console.log(result)
            $("#compressed_size").text((result.size / 1024).toFixed(2))
            compressedBlob = result
            const reader = new FileReader()
            reader.onload = (e) => {
              $("#compressedImage").attr("src", e.target.result)
              $("#compressedImage").show()
            }
            reader.readAsDataURL(result)
            hideLoader()
          },
          error(err) {
            console.error("Compression error:", err)
            hideLoader()
          },
        })
      })
      .catch((error) => {
        console.error("Fetch error:", error)
        hideLoader()
      })
  })

  // Enhanced slider functionality with better mobile support
  const slider = $("#sliderBar")
  const container = $(".image-comparison-container")
  const compressedImage = $("#compressedImage")

  let isDragging = false
  let startX = 0

  // Helper function to get X coordinate from event (mouse or touch)
  function getEventX(e) {
    if (e.type.includes("touch")) {
      return e.originalEvent.touches[0]?.clientX || e.originalEvent.changedTouches[0]?.clientX
    }
    return e.clientX || e.pageX
  }

  // Helper function to move slider
  function moveSlider(clientX) {
    if (!isDragging) return

    const containerOffset = container.offset()
    const containerWidth = container.width()
    let sliderPosition = clientX - containerOffset.left

    // Clamp slider position within the container
    sliderPosition = Math.max(0, Math.min(sliderPosition, containerWidth))

    // Move the slider and adjust the compressed image's clip-path
    slider.css("left", `${sliderPosition}px`)
    compressedImage.css("clip-path", `inset(0 ${containerWidth - sliderPosition}px 0 0)`)
  }

  // Mouse events
  slider.on("mousedown", (e) => {
    isDragging = true
    startX = getEventX(e)
    e.preventDefault()
    e.stopPropagation()
  })

  // Touch events for mobile - Enhanced
  slider.on("touchstart", (e) => {
    isDragging = true
    startX = getEventX(e)
    e.preventDefault()
    e.stopPropagation()
  })

  // Global mouse/touch move events
  $(document).on("mousemove touchmove", (e) => {
    if (isDragging) {
      e.preventDefault()
      const clientX = getEventX(e)
      moveSlider(clientX)
    }
  })

  // Global mouse/touch end events
  $(document).on("mouseup touchend", (e) => {
    if (isDragging) {
      isDragging = false
      e.preventDefault()
    }
  })

  // Handle container clicks/taps to move slider
  container.on("click tap", (e) => {
    if (!$(e.target).closest(".slider-bar, .slider-handle").length) {
      const clientX = getEventX(e)
      const containerOffset = container.offset()
      const containerWidth = container.width()
      let sliderPosition = clientX - containerOffset.left

      // Clamp slider position within the container
      sliderPosition = Math.max(0, Math.min(sliderPosition, containerWidth))

      // Animate slider movement
      slider.animate({ left: `${sliderPosition}px` }, 200, () => {
        compressedImage.css("clip-path", `inset(0 ${containerWidth - sliderPosition}px 0 0)`)
      })
    }
  })

  // Prevent default touch behaviors on the container
  container.on("touchstart touchmove touchend", (e) => {
    if ($(e.target).closest(".slider-bar, .slider-handle").length) {
      e.preventDefault()
    }
  })

  // Compress button handler
  $("#compressButton").on("click", function () {
    if (!compressedBlob) {
      alert("No compressed image available!")
      return
    }

    // Show loading state
    const $btn = $(this)
    $btn.prop("disabled", true)
    $btn.find(".btn-text").hide()
    $btn.find(".btn-loader").show()

    console.log(compressedBlob)

    const link = new URL(originalImagePath)
    const pathname = link.pathname
    const extension = pathname.split(".").pop().toLowerCase()
    const formData = new FormData()
    formData.append("compressedImage", compressedBlob, `compressed.${extension}`)
    formData.append("_token", $('meta[name="csrf-token"]').attr("content"))

    $.ajax({
      url: "/save-compressed-image",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      beforeSend: () => {
        showLoader()
      },
      success: (response) => {
        console.log(response)
        if (response.status === "success") {
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
          filenameInput.value = response.filename
          form.appendChild(filenameInput)

          document.body.appendChild(form)
          form.submit()
        }
      },
      error: (xhr, status, error) => {
        console.error("Error saving compressed image:", error)
        alert("Failed to save the compressed image.")
      },
      complete: () => {
        hideLoader()
        // Reset button state
        $btn.prop("disabled", false)
        $btn.find(".btn-text").show()
        $btn.find(".btn-loader").hide()
      },
    })
  })

  // Handle window resize
  $(window).on("resize orientationchange", () => {
    setTimeout(() => {
      // Reset slider position on resize
      if (compressedImage.is(":visible")) {
        const containerWidth = container.width()
        const currentLeft = Number.parseInt(slider.css("left")) || containerWidth / 2
        const clampedLeft = Math.max(0, Math.min(currentLeft, containerWidth))
        slider.css("left", `${clampedLeft}px`)
        compressedImage.css("clip-path", `inset(0 ${containerWidth - clampedLeft}px 0 0)`)
      }
    }, 300)
  })

  // Initialize slider position
  setTimeout(() => {
    const containerWidth = container.width()
    slider.css("left", `${containerWidth / 2}px`)
  }, 100)
})
