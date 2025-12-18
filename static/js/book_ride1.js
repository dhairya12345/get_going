document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
    
    // Update display on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinks.style.display = 'flex';
        } else {
            navLinks.style.display = 'none';
        }
    });
    
    // Set current date and time
    const today = new Date();
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    
    // Format date as YYYY-MM-DD
    const formattedDate = today.toISOString().split('T')[0];
    dateInput.value = formattedDate;
    dateInput.min = formattedDate;
    
    // Format time as HH:MM (current time + 30 minutes)
    const currentHour = today.getHours();
    const currentMinutes = today.getMinutes();
    const futureTime = new Date(today.setMinutes(currentMinutes + 30));
    const formattedTime = `${String(futureTime.getHours()).padStart(2, '0')}:${String(futureTime.getMinutes()).padStart(2, '0')}`;
    timeInput.value = formattedTime;
    
    // Price Range Slider
    const priceRange = document.getElementById('price-range');
    const currentPrice = document.getElementById('current-price');
    
    priceRange.addEventListener('input', function() {
        currentPrice.textContent = `₹${this.value}`;
    });
    
    // Location Suggestions
    const sourceInput = document.getElementById('source');
    const destinationInput = document.getElementById('destination');
    const sourceSuggestions = sourceInput.nextElementSibling;
    const destinationSuggestions = destinationInput.nextElementSibling;
    
    const popularLocations = [
        "MG Road, Bangalore",
        "Electronic City, Bangalore",
        "Whitefield, Bangalore",
        "Koramangala, Bangalore",
        "Indiranagar, Bangalore",
        "Marathahalli, Bangalore",
        "HSR Layout, Bangalore",
        "Jayanagar, Bangalore",
        "BTM Layout, Bangalore",
        "Hebbal, Bangalore"
    ];
    
    function showSuggestions(input, suggestionsContainer) {
        const inputValue = input.value.toLowerCase();
        if (inputValue.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        const filteredLocations = popularLocations.filter(location => 
            location.toLowerCase().includes(inputValue)
        );
        
        if (filteredLocations.length > 0) {
            suggestionsContainer.innerHTML = filteredLocations.map(location => 
                `<div>${location}</div>`
            ).join('');
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    }
    
    sourceInput.addEventListener('input', () => showSuggestions(sourceInput, sourceSuggestions));
    destinationInput.addEventListener('input', () => showSuggestions(destinationInput, destinationSuggestions));
    
    // Close suggestions when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (e.target !== sourceInput) {
            sourceSuggestions.style.display = 'none';
        }
        if (e.target !== destinationInput) {
            destinationSuggestions.style.display = 'none';
        }
    });
    
    // Select suggestion
    sourceSuggestions.addEventListener('click', function(e) {
        if (e.target.tagName === 'DIV') {
            sourceInput.value = e.target.textContent;
            sourceSuggestions.style.display = 'none';
        }
    });
    
    destinationSuggestions.addEventListener('click', function(e) {
        if (e.target.tagName === 'DIV') {
            destinationInput.value = e.target.textContent;
            destinationSuggestions.style.display = 'none';
        }
    });
    
    // Search Form Submission
    const searchForm = document.querySelector('.search-form');
    const searchBtn = document.querySelector('.search-btn');
    const btnText = document.querySelector('.btn-text');
    const loadingSpinner = document.querySelector('.search-btn .loading-spinner');
    const ridesList = document.getElementById('rides-list');
    const loadingResults = document.getElementById('loading-results');
    const noResults = document.getElementById('no-results');
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        btnText.style.display = 'none';
        loadingSpinner.style.display = 'block';
        searchBtn.disabled = true;
        
        // Hide previous results
        ridesList.innerHTML = '';
        noResults.style.display = 'none';
        loadingResults.style.display = 'flex';
        
        // Simulate API call delay
        setTimeout(() => {
            // Hide loading state
            btnText.style.display = 'block';
            loadingSpinner.style.display = 'none';
            searchBtn.disabled = false;
            
            // Get form values
            const source = sourceInput.value;
            const destination = destinationInput.value;
            const date = dateInput.value;
            const time = timeInput.value;
            const seats = document.getElementById('seats').value;
            const maxPrice = priceRange.value;
            
            requestData(source,destination,date,time);

            // Filter vehicle types
            const vehicleTypes = [];
            document.querySelectorAll('input[name="vehicle-type"]:checked').forEach(checkbox => {
                vehicleTypes.push(checkbox.value);
            });
            
            // Filter amenities
            const amenities = [];
            document.querySelectorAll('input[name="amenity"]:checked').forEach(checkbox => {
                amenities.push(checkbox.value);
            });
            
            console.log('Search Parameters:', {
                source,
                destination,
                date,
                time,
                seats,
                maxPrice,
                vehicleTypes,
                amenities
            });
            requestData(source,destination,date,time);
            // Display results (in a real app, this would come from an API)
           
        }, 1500);
    });
    
   
    function requestData(from,to,date1,time1)
    {
        fetch('/customer/login/user_home1/book_ride',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken' : getCSRFToken()
            },
            body: JSON.stringify({
                source: from,
                destination: to,
                date: date1,
                time: time1,
              })
        })
        .then(response => response.json())
        .then(data => {
             
             sampleRides = data;
             console.log("data is",sampleRides);
              displayRideResults(from, to, date1, time1);
        })
        .catch(error=>{
            console.error("error is",error)
        })
        
    }

    // Display ride results
    function displayRideResults(source, destination, date, time) {
        loadingResults.style.display = 'none';
        
        // Filter rides based on source and destination (simplified for demo)
        const filteredRides = sampleRides.filter(ride => 
            ride.source.includes(source.split(',')[0]) && 
            ride.destination.includes(destination.split(',')[0])
        );
        
        if (filteredRides.length === 0) {
            noResults.style.display = 'flex';
            return;
        }
        
        ridesList.innerHTML = filteredRides.map(ride => `
            <div class="ride-card" data-id="${ride.id}">
                <div class="ride-header">
                    <div class="driver-info">
                        <img src="${ride.driver.avatar}" alt="Driver" class="driver-avatar">
                        <div class="driver-name-rating">
                            <h4>${ride.driver.name}</h4>
                            <div class="rating">
                                ${generateStarRating(ride.driver.rating)}
                                <span>${ride.driver.rating} (${ride.driver.reviews})</span>
                            </div>
                        </div>
                    </div>
                    <div class="ride-price">₹${ride.price}</div>
                </div>
                <div class="ride-details">
                    <div class="route">
                        <div class="location">
                            <span class="dot start"></span>
                            <span>${ride.source}</span>
                        </div>
                        <div class="location">
                            <span class="dot end"></span>
                            <span>${ride.destination}</span>
                        </div>
                    </div>
                    <div class="timing">
                        <i class="fas fa-clock"></i> ${ride.departure}
                    </div>
                    <div class="car-info">
                        <i class="fas fa-car"></i> ${ride.car.model} ${ride.car.ac ? '(AC)' : ''} • ${ride.car.seatsAvailable} seat${ride.car.seatsAvailable > 1 ? 's' : ''} available
                    </div>
                    ${ride.amenities.length > 0 ? `
                        <div class="amenities-list">
                            ${ride.amenities.map(amenity => `
                                <span class="amenity-badge">
                                    ${amenity === 'ac' ? '<i class="fas fa-snowflake"></i> AC' : ''}
                                    ${amenity === 'wifi' ? '<i class="fas fa-wifi"></i> WiFi' : ''}
                                    ${amenity === 'charging' ? '<i class="fas fa-bolt"></i> Charging' : ''}
                                </span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="ride-actions">
                    <button class="btn-outline view-details-btn"><i class="fas fa-info-circle"></i> Details</button>
                    <button class="btn-primary request-ride-btn"><i class="fas fa-chair"></i> Book Seat</button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to the new buttons
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const rideId = parseInt(this.closest('.ride-card').dataset.id);
                showRideDetails(rideId);
            });
        });
        
        document.querySelectorAll('.request-ride-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const rideId = parseInt(this.closest('.ride-card').dataset.id);
                requestRide(rideId);
            });
        });
    }
    
    // Generate star rating HTML
    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }
    
    // Ride Details Modal
    const modal = document.getElementById('ride-details-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const closeModalBtnFooter = document.getElementById('close-modal-btn');
    const modalContent = document.querySelector('.modal-content');
    const modalRideDetails = document.getElementById('modal-ride-details');
    
    function showRideDetails(rideId) {
        const ride = sampleRides.find(r => r.id === rideId);
        if (!ride) return;
        
        modalRideDetails.innerHTML = `
            <div class="ride-detail">
                <div class="driver-info">
                    <img src="${ride.driver.avatar}" alt="Driver" class="driver-avatar">
                    <div class="driver-name-rating">
                        <h3>${ride.driver.name}</h3>
                        <div class="rating">
                            ${generateStarRating(ride.driver.rating)}
                            <span>${ride.driver.rating} (${ride.driver.reviews} reviews)</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="ride-detail">
                <h3>Ride Information</h3>
                <div class="detail-row">
                    <div class="detail-label">From:</div>
                    <div class="detail-value">${ride.source}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">To:</div>
                    <div class="detail-value">${ride.destination}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Departure:</div>
                    <div class="detail-value">${ride.departure}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Price:</div>
                    <div class="detail-value">₹${ride.price}</div>
                </div>
            </div>
            
            <div class="ride-detail">
                <h3>Vehicle Details</h3>
                <div class="detail-row">
                    <div class="detail-label">Model:</div>
                    <div class="detail-value">${ride.car.model}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Type:</div>
                    <div class="detail-value">${ride.car.type.charAt(0).toUpperCase() + ride.car.type.slice(1)}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">AC:</div>
                    <div class="detail-value">${ride.car.ac ? 'Yes' : 'No'}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Seats Available:</div>
                    <div class="detail-value">${ride.car.seatsAvailable}</div>
                </div>
            </div>
            
            ${ride.amenities.length > 0 ? `
                <div class="ride-detail">
                    <h3>Amenities</h3>
                    <div class="amenities-list">
                        ${ride.amenities.map(amenity => `
                            <span class="amenity-badge">
                                ${amenity === 'ac' ? '<i class="fas fa-snowflake"></i> AC' : ''}
                                ${amenity === 'wifi' ? '<i class="fas fa-wifi"></i> WiFi' : ''}
                                ${amenity === 'charging' ? '<i class="fas fa-bolt"></i> Charging' : ''}
                            </span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    closeModalBtn.addEventListener('click', closeModal);
    closeModalBtnFooter.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Request Ride Button in Modal
    const requestRideBtn = document.getElementById('request-ride-btn');
    
    requestRideBtn.addEventListener('click', function() {
        alert('Ride request functionality will be implemented in the backend');
        closeModal();
    });
    
    // Request Ride directly from card
    function requestRide(rideId) {
        const ride = sampleRides.find(r => r.id === rideId);
        if (!ride) return;
        
        alert(`Requesting ride with ${ride.driver.name} from ${ride.source} to ${ride.destination} for ₹${ride.price}`);
    }
    
    // Adjust Search Button
    const adjustSearchBtn = document.getElementById('adjust-search');
    
    adjustSearchBtn.addEventListener('click', function() {
        document.querySelector('.search-section').scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    // Reset Filters Button
    const resetFiltersBtn = document.querySelector('.reset-filters');
    
    resetFiltersBtn.addEventListener('click', function() {
        // Reset price range
        priceRange.value = 500;
        currentPrice.textContent = '₹500';
        
        // Reset vehicle types
        document.querySelectorAll('input[name="vehicle-type"]').forEach(checkbox => {
            checkbox.checked = true;
        });
        
        // Reset amenities
        document.querySelectorAll('input[name="amenity"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset sort option
        document.getElementById('sort-by').value = 'price-low';
    });
    
    // Sort Rides
    const sortBy = document.getElementById('sort-by');
    
    sortBy.addEventListener('change', function() {
        const rides = Array.from(document.querySelectorAll('.ride-card'));
        if (rides.length === 0) return;
        
        rides.sort((a, b) => {
            const aPrice = parseInt(a.querySelector('.ride-price').textContent.replace('₹', ''));
            const bPrice = parseInt(b.querySelector('.ride-price').textContent.replace('₹', ''));
            
            switch (this.value) {
                case 'price-low':
                    return aPrice - bPrice;
                case 'price-high':
                    return bPrice - aPrice;
                case 'rating':
                    const aRating = parseFloat(a.querySelector('.rating span').textContent.split(' ')[0]);
                    const bRating = parseFloat(b.querySelector('.rating span').textContent.split(' ')[0]);
                    return bRating - aRating;
                default:
                    return 0;
            }
        });
        
        const ridesList = document.getElementById('rides-list');
        rides.forEach(ride => ridesList.appendChild(ride));
    });
});
function getCSRFToken() {
    return document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken'))
        ?.split('=')[1];
}