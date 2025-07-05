const reviewContainer = document.getElementById("reviewContainer")
var reviewData;
if (document.getElementById("reviewForm") && document.getElementById("reviewsDisplay")) {
  const reviewForm = document.getElementById("reviewForm")
  const reviewsDisplay = document.getElementById("reviewsDisplay")

  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form values
    const username = document.getElementById("username").value
    const rating = document.getElementById("rating").value
    const reviewText = document.getElementById("review").value

    // Create new review box
    const newReview = document.createElement("div")
    newReview.classList.add("review-box")
    newReview.innerHTML = `
            <strong>${username}</strong> 
            <span>(${rating} ⭐)</span>
            <p>${reviewText}</p>
        `

    // Append to reviewsDisplay
    const existingReview = reviewsDisplay.querySelector(".review-box")
    if (existingReview) {
      existingReview.remove() // Remove default message if present
    }
    reviewsDisplay.appendChild(newReview)

    // Clear form
    reviewForm.reset()
  })
}

function drag() {
  document.getElementById("uploadFile").parentNode.className = "draging dragBox"
}

function drop() {
  document.getElementById("uploadFile").parentNode.className = "dragBox"
}

function generateStars(rating) {
  let stars = ""
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? "★" : "☆"
  }
  return `<span class="text-3xl">${stars}</span>`
}

function submitFormData(formData) {
  $.ajax({
    url: "/save-review",
    type: "POST",
    data: formData,
    headers: {
      "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
    },
    processData: false,
    contentType: false,
    success: (response) => {
      console.log(response)
      $("#username").val("")
      $("#rating").val("")
      $("#review").val("")
      getReviewData()
    },
    error: (response) => {
      alert("An error occurred")
    },
  })
}

function getReviewData() {
  $("#testimonialSlider").empty()
  $.ajax({
    url: "/get-all-data",
    type: "GET",
    success: (response) => {
      if (response.length > 0) {
        response.forEach((review) => {
          let city = ""
          let country = ""
          if(country != ""){
          if (!review.geolocation) {
            const [latitude, longitude] = review.geolocation.split("-").map((coord) => Number.parseFloat(coord))

            $.ajax({
              url: `https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi?lat=${latitude}&lng=${longitude}`,
              type: "GET",
              headers: {
                "x-rapidapi-key": "fe8613b354msh758691d1e3f4edcp1842a0jsna52e063e64e7",
                "x-rapidapi-host": "address-from-to-latitude-longitude.p.rapidapi.com",
              },
              async: false,
              crossDomain: true,
              success: (apiResponse) => {
                apiResponse.Results.forEach((place) => {
                  if (place.region != "") {
                    city = place.region
                  } else {
                    city = "unknown"
                  }
                  if (place.country != "") {
                    country = place.country
                  } else {
                    country = "unknown"
                  }
                })
              },
              error: (e) => {
                console.error("Error fetching city and country", e)
              },
            })
          }
        }
          const reviewHTML = `
                        <div class="review-item">
                        <p class="">${generateStars(review.rating)}</p>
                        <p class="line-clamp-3">${review.review}</p>
                        <p class="text-sm py-3 subpixel-antialiased"><strong>${review.username}</strong></p>                                            
                        <p>${city}/${country}</p>
                        </div>
                    `
          $("#testimonialSlider").append(reviewHTML)
        })

        if ($("#testimonialSlider").hasClass("slick-initialized")) {
          $("#testimonialSlider").slick("refresh")
        } else {
          $("#testimonialSlider").slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            dots: false,
            arrows: true,
            prevArrow: '<button type="button" class="slick-prev"></button>',
            nextArrow: '<button type="button" class="slick-next"></button>',
            responsive: [
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 1,
                },
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 1,
                },
              },
            ],
          })
        }
      } else {
        $("#testimonialSlider").html("<p>No reviews available yet.</p>")
      }
    },
    error: () => {
      alert("Error loading reviews")
    },
  })
}

$(document).ready(() => {
  getReviewData()

  $(document).on("click", "#submit_form", (e) => {
    e.preventDefault()

    if ($("#username").val() == "") {
      $("#username").css("border", "1px solid red").focus()
      return false
    }

    if ($("#rating").val() == "" || $("#rating").val() == "disabled") {
      $("#rating").css("border", "1px solid red").focus()
      return false
    }

    if ($("#review").val() == "") {
      $("#review").css("border", "1px solid red").focus()
      return false
    }

    const formData = new FormData($("#reviewForm")[0])

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude
          formData.append("latitude", latitude)
          formData.append("longitude", longitude)
          submitFormData(formData)
        },
        (error) => {
          console.warn("Geolocation error or declined. Submitting without location.")
          submitFormData(formData)
        },
      )
    } else {
      console.warn("Geolocation not supported. Submitting without location.")
      submitFormData(formData)
    }
  })
})
