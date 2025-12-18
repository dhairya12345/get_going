/**
 * GET GOING SYSTEM - Book a Ride JS
 * Simple JavaScript functionality for form handling and basic UI interactions
 */

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const bookingForm = document.getElementById('booking-form');
    const sourceInput = document.getElementById('source');
    const destinationInput = document.getElementById('destination');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const findRidesBtn = document.getElementById('find-rides-btn');
    const loader = document.getElementById('loader');
    const successMessage = document.getElementById('success-message');
    
    // Get error message elements
    const sourceError = document.getElementById('source-error');
    const destinationError = document.getElementById('destination-error');
    const dateError = document.getElementById('date-error');
    const timeError = document.getElementById('time-error');
    
    // Mobile menu toggle functionality
    const mobileMenu = document.getElementById('mobile-menu');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            navbarMenu.classList.toggle('active');
        });
    }
    
    // Set minimum date to today
    function setMinimumDate() {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        
        // Format month and day to have leading zeros if needed
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        
        const formattedDate = `${year}-${month}-${day}`;
        dateInput.setAttribute('min', formattedDate);
    }
    
    // Call the function to set minimum date
    setMinimumDate();
    
    // Simple form validation
    function validateForm() {
        let isValid = true;
        
        // Reset error messages
        sourceError.style.display = 'none';
        destinationError.style.display = 'none';
        dateError.style.display = 'none';
        timeError.style.display = 'none';
        
        // Validate source
        if (!sourceInput.value.trim()) {
            sourceError.textContent = 'Please enter pickup location';
            sourceError.style.display = 'block';
            isValid = false;
        }
        
        // Validate destination
        if (!destinationInput.value.trim()) {
            destinationError.textContent = 'Please enter drop-off location';
            destinationError.style.display = 'block';
            isValid = false;
        }
        
        // Validate date
        if (!dateInput.value) {
            dateError.textContent = 'Please select a date';
            dateError.style.display = 'block';
            isValid = false;
        } else {
            const selectedDate = new Date(dateInput.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                dateError.textContent = 'Date cannot be in the past';
                dateError.style.display = 'block';
                isValid = false;
            }
        }
        
        // Validate time
        if (!timeInput.value) {
            timeError.textContent = 'Please select a time';
            timeError.style.display = 'block';
            isValid = false;
        }
        
        return isValid;
    }
    
    // Form submission handler
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            if (validateForm()) {
                // Show loader
                bookingForm.style.display = 'none';
                loader.style.display = 'flex';
                const form = event.target;
                const formData = new FormData(form);
                fetch("/customer/login/user_home1/user",{
                    method: "POST",
                    headers : {
                        "X-CSRFToken" : getCSRFToken(),
                    },
                    body: formData,
                })
                .then((response)=>response.json())
                .then((data)=>{
                      // Hide loader
                    loader.style.display = 'none';
                    
                    if(data.rides && data.rides.length > 0){
                        // Show success message
                        successMessage.style.display = 'block';
                        renderRideCards(data.rides);
                    }
                    else{
                        alert("no rides found near your locations")
                    }
                        // Reset form after 3 seconds & show form again
                    setTimeout(() => {
                        bookingForm.reset();
                        successMessage.style.display = 'none';
                        bookingForm.style.display = 'block';
                    }, 3000);
                }).catch(error=>{
                    console.error('Error:',error);
                    loader.style.display="none";
                    bookingForm.style.display = "block";
                });
                
            }
        });
    }


    function getCSRFToken() {
    return document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken'))
        ?.split('=')[1];
}
    function renderRideCards(rides){
    const container = document.getElementById("rideCardsContainer");
    container.innerHTML = "";
    const mediaUrl = "/static/";
    rides.forEach((ride) => {
        const card = document.createElement("div");
        card.className = "ride-card";
        card.setAttribute("data-id", ride.id);
        card.innerHTML = `
            <div class="driver-info">
                <div class="driver-avatar">
                    <img src="${mediaUrl}${ride.u_id__profile_img}">
                </div>
                <div class="driver-details">
                    <h3>${ride.u_id__name}</h3>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <span>4</span>
                    </div>
                </div>
            </div>
            <div class="ride-details">
                <div class="detail-item">
                    <i class="fas fa-users"></i>
                    <span>${ride.vehical_id__seats_available} seats available</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-dollar-sign"></i>
                    <span>$${ride.price} estimate</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>Arriving in ${ride.time} mins</span>
                </div>
            </div>
        `;

        const button = document.createElement("button");
        button.className = "btn-request";
        button.textContent = "Request Ride";
        button.setAttribute("data-id",ride.id);
        button.addEventListener("click", function() {
            
            const data_id = this.getAttribute("data-id");
            alert("hello world"+data_id)
            fetch("/customer/login/user_home1/user",{
                method:"POST",
                headers: {
                    "Content-Type" : "application/json",
                    "X-CSRFToken" : getCSRFToken(),
                },
                body: JSON.stringify({
                    ride_id: data_id
                }),
            })
            .then(response => response.json())
            .then(data=>{
                console.log("Response from server:", data);
                alert(data.message);
                alert("Ride request sent! The driver will confirm shortly.");
            })
            .catch(error=>{
                console.error("Error:",error);
            });
        });

        card.appendChild(button);
        container.appendChild(card);
    });
}


});
