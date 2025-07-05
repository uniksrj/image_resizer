
var $image = $("#uploadedImage")
let baseRotation = 0
let currentScale = 1
var storeAngle = 0
const isFirstMovement = true
let isUploading = false

function initializeCropper(imageElement) {
  if (window.cropper) {
    window.cropper.destroy()
  }
  window.cropper = new Cropper(imageElement, {
    viewMode: 1,
    background: false,
    autoCrop: false,
    cropBoxMovable: false,
    dragMode: "none",
    responsive: true,
    zoomable: true,
    zoomOnTouch: false,
    checkOrientation: false,
    ready: () => {
      fitImageToContainer()
    },
  })
}

function fitImageToContainer() {
  if (!window.cropper) return

  const cropper = window.cropper

  setTimeout(() => {
    const containerData = cropper.getContainerData()
    const imageData = cropper.getImageData()

    const scaleX = containerData.width / imageData.naturalWidth
    const scaleY = containerData.height / imageData.naturalHeight
    const scale = Math.max(scaleX, scaleY) * 0.9

    const adjustedWidth = imageData.naturalWidth * scale
    const adjustedHeight = imageData.naturalHeight * scale

    const offsetX = (containerData.width - adjustedWidth) / 2
    const offsetY = (containerData.height - adjustedHeight) / 2

    cropper.setCanvasData({
      left: offsetX,
      top: offsetY,
      width: adjustedWidth,
      height: adjustedHeight,
    })

    cropper.clear()
    currentScale = scale
  }, 100)
}

function scaleImageToFillAfterRotation(cropper, rotationAngle = 0) {
  const container = cropper.getContainerData()
  const imageData = cropper.getImageData()

  const angleInRadians = (rotationAngle * Math.PI) / 180
  const cos = Math.abs(Math.cos(angleInRadians))
  const sin = Math.abs(Math.sin(angleInRadians))

  const rotatedWidth = imageData.naturalWidth * cos + imageData.naturalHeight * sin
  const rotatedHeight = imageData.naturalWidth * sin + imageData.naturalHeight * cos

  const scaleX = container.width / rotatedWidth
  const scaleY = container.height / rotatedHeight

  const fillScale = Math.max(scaleX, scaleY) * 1.1

  const adjustedWidth = imageData.naturalWidth * fillScale
  const adjustedHeight = imageData.naturalHeight * fillScale

  const offsetX = (container.width - adjustedWidth) / 2
  const offsetY = (container.height - adjustedHeight) / 2

  cropper.setCanvasData({
    left: offsetX,
    top: offsetY,
    width: adjustedWidth,
    height: adjustedHeight,
  })

  currentScale = fillScale
  return fillScale
}

// Mobile toolbox functionality
const mobileToolbox = document.getElementById("mobileToolbox")
const mobileBackdrop = document.getElementById("mobileBackdrop")
const mobileToolsBtn = document.getElementById("mobileToolsBtn")

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

// Mobile toolbox events
if (mobileToolsBtn) {
  mobileToolsBtn.addEventListener("click", toggleMobileToolbox)
}

if (mobileBackdrop) {
  mobileBackdrop.addEventListener("click", closeMobileToolbox)
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

// Responsive handling
function handleResize() {
  if (window.innerWidth >= 768) {
    closeMobileToolbox()
  }
}

window.addEventListener("resize", handleResize)

function bindRotateEvents() {
  // Desktop rotation buttons
  $("#rotateLeft")
    .off("click")
    .on("click", function () {
      if (window.cropper) {
        baseRotation = (baseRotation - 90 + 360) % 360
        storeAngle = baseRotation
        window.cropper.rotateTo(baseRotation)

        setTimeout(() => {
          scaleImageToFillAfterRotation(window.cropper, baseRotation)
        }, 100)

        $("#colorSlider, #colorSliderMobile").val(0)
        $("#degree, #degreeMobile").html(`0 &deg;`)

        $(this).addClass("active")
        setTimeout(() => $(this).removeClass("active"), 200)
      }
    })

  $("#rotateRight")
    .off("click")
    .on("click", function () {
      if (window.cropper) {
        baseRotation = (baseRotation + 90) % 360
        storeAngle = baseRotation
        window.cropper.rotateTo(baseRotation)

        setTimeout(() => {
          scaleImageToFillAfterRotation(window.cropper, baseRotation)
        }, 100)

        $("#colorSlider, #colorSliderMobile").val(0)
        $("#degree, #degreeMobile").html(`0 &deg;`)

        $(this).addClass("active")
        setTimeout(() => $(this).removeClass("active"), 200)
      }
    })

  // Mobile rotation buttons
  $("#rotateLeft_mobile")
    .off("click")
    .on("click", () => {
      $("#rotateLeft").click()
    })

  $("#rotateRight_mobile")
    .off("click")
    .on("click", () => {
      $("#rotateRight").click()
    })

  // Reset buttons
  $("#resetButton, #resetButtonMobile").on("click", () => {
    if (window.cropper) {
      baseRotation = 0
      storeAngle = 0
      window.cropper.rotateTo(0)

      setTimeout(() => {
        fitImageToContainer()
      }, 100)
    }

    currentScale = 1
    $("#colorSlider, #colorSliderMobile").val(0)
    $("#degree, #degreeMobile").text("0°")

    // Reset slider colors
    const sliders = ["colorSlider", "colorSliderMobile"]
    sliders.forEach((sliderId) => {
      const slider = document.getElementById(sliderId)
      if (slider) {
        slider.style.setProperty("--slider-color-left", "hsl(0, 0%, 75%)")
        slider.style.setProperty("--slider-color-right", "hsl(0, 0%, 75%)")
      }
    })
  })

  // Slider events for both desktop and mobile
  $("#colorSlider, #colorSliderMobile").on("input", function () {
    const rawAngle = Number.parseFloat($(this).val()) || 0
    const relativeAngle = Math.max(-45, Math.min(45, rawAngle))
    const totalRotation = baseRotation + relativeAngle
    storeAngle = totalRotation

    // Update both degree displays
    $("#degree, #degreeMobile").html(`${relativeAngle} &deg;`)

    // Sync both sliders
    if (this.id === "colorSlider") {
      $("#colorSliderMobile").val(relativeAngle)
    } else {
      $("#colorSlider").val(relativeAngle)
    }

    const cropper = window.cropper
    if (!cropper) return

    cropper.rotateTo(totalRotation)

    setTimeout(() => {
      scaleImageToFillAfterRotation(cropper, totalRotation)
    }, 20)

    // Enhanced slider color feedback for both sliders
    const updateSliderColors = (slider) => {
      if (relativeAngle < 0) {
        slider.style.setProperty("--slider-color-left", `hsl(200, 100%, 70%)`)
        slider.style.setProperty("--slider-color-right", `hsl(0, 0%, 75%)`)
      } else if (relativeAngle > 0) {
        slider.style.setProperty("--slider-color-left", `hsl(0, 0%, 75%)`)
        slider.style.setProperty("--slider-color-right", `hsl(200, 100%, 70%)`)
      } else {
        slider.style.setProperty("--slider-color-left", `hsl(0, 0%, 75%)`)
        slider.style.setProperty("--slider-color-right", `hsl(0, 0%, 75%)`)
      }
    }

    updateSliderColors(this)
    // Update the other slider too
    const otherSliderId = this.id === "colorSlider" ? "colorSliderMobile" : "colorSlider"
    const otherSlider = document.getElementById(otherSliderId)
    if (otherSlider) {
      updateSliderColors(otherSlider)
    }
  })
}

function uploadImage(files) {
  $image = ""
  if (!files || files.length === 0) {
    alert("No file selected.")
    return
  }

  const file = files[0]
  if (!file.type.startsWith("image/")) {
    alert("Please upload an image file.")
    return
  }

  // Show progress bars for both desktop and mobile
  $("#progressLoadingImg, #progressLoadingImgMobile").removeClass("hidden")

  const formData = new FormData()
  formData.append("image", file)

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
          $("#progressBar, #progressBarMobile").css("width", `${percentComplete}%`)
          $("#progressText, #progressTextMobile").text(`${percentComplete}% Uploaded`)
        }
      })
      return xhr
    },
    success: (response) => {
      $("#dynamic_img").html(`
                <div class="w-full h-full flex items-center justify-center bg-white rounded-2xl shadow-inner border-2 border-gray-200/50 min-h-[400px]">
                    <img id="uploadedImage" src="${response.path}" alt="Uploaded Image" class="object-contain max-w-full max-h-full rounded-lg" />
                </div>
            `)
      $("#progressLoadingImg, #progressLoadingImgMobile").addClass("hidden")

      $image = $("#uploadedImage")
      initializeCropper($image[0])
    },
    error: () => {
      alert("Error uploading file. Please try again.")
      $("#progressLoadingImg, #progressLoadingImgMobile").addClass("hidden")
    },
  })
}

function processImage() {
  const cropper = window.cropper
  $("#loader-container").css("display", "flex")

  // Close mobile toolbox
  closeMobileToolbox()

  if (!cropper) {
    console.error("Cropper instance is not initialized.")
    $("#loader-container").hide()
    return
  }

  try {
    const imageData = cropper.getImageData()
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    const angleInRadians = (storeAngle * Math.PI) / 180
    const cos = Math.abs(Math.cos(angleInRadians))
    const sin = Math.abs(Math.sin(angleInRadians))

    const rotatedWidth = imageData.naturalWidth * cos + imageData.naturalHeight * sin
    const rotatedHeight = imageData.naturalWidth * sin + imageData.naturalHeight * cos

    canvas.width = rotatedWidth
    canvas.height = rotatedHeight

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(angleInRadians)

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      ctx.drawImage(
        img,
        -imageData.naturalWidth / 2,
        -imageData.naturalHeight / 2,
        imageData.naturalWidth,
        imageData.naturalHeight,
      )

      const extension = $image.attr("src").split(".").pop().toLowerCase()
      canvas.toBlob(
        (blob) => {
          const formData = new FormData()
          formData.append("rotateImage", blob, `rotate-image.${extension}`)
          formData.append("_token", $('meta[name="csrf-token"]').attr("content"))

          $.ajax({
            url: "/save-rotate-image",
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
        },
        `image/${extension}`,
        0.95,
      )
    }

    img.src = $image.attr("src")
  } catch (error) {
    console.error("Error applying transformations:", error)
    $("#loader-container").hide()
  }
}

// Make handleFileChange available globally
window.handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file || isUploading) {
    return
  }
  isUploading = true

  if (["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
    uploadImage([file])
  } else {
    alert("Invalid file type. Please upload an image (JPEG, PNG, or GIF).")
  }

  event.target.value = ""
  isUploading = false
}

// Global drag and drop handlers
window.dragOver = (event) => {
  event.preventDefault()
}

window.dragLeave = (event) => {
  event.preventDefault()
}

window.handleDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    uploadImage([file])
  }
}

$(document).ready(() => {
  $("#colorSlider, #colorSliderMobile").val(0)
  $("#degree, #degreeMobile").html("0&deg;")

  $(document).on("click", "#process_data, #process_data_mobile", () => {
    processImage()
  })

  bindRotateEvents()

  // Enhanced drag and drop handlers
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
})
