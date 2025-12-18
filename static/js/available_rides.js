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

    // Toggle Filters
    const toggleFiltersBtn = document.getElementById('toggle-filters');
    const filtersContainer = document.getElementById('filters-container');
    
    toggleFiltersBtn.addEventListener('click', function() {
        filtersContainer.classList.toggle('show');
    });

    // Price Range Slider
    const priceRange = document.getElementById('price-range');
    const currentPrice = document.getElementById('current-price');
    
    priceRange.addEventListener('input', function() {
        currentPrice.textContent = `₹${this.value}`;
    });

    // Sample Ride Data
    const sampleRides = [
        {
            id: 1,
            driver: {
                name: "John D.",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                rating: 4.5,
                reviews: 42
            },
            price: 150,
            source: "MG Road, Bangalore",
            destination: "Electronic City, Bangalore",
            departure: "Today, 8:30 AM",
            distance: "2.5 km",
            car: {
                model: "Hyundai i20",
                type: "hatchback",
                ac: true,
                seatsAvailable: 2
            },
            amenities: ["ac"]
        },
        {
            id: 2,
            driver: {
                name: "Priya S.",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                rating: 4.0,
                reviews: 28
            },
            price: 200,
            source: "Koramangala, Bangalore",
            destination: "Whitefield, Bangalore",
            departure: "Today, 5:45 PM",
            distance: "8.2 km",
            car: {
                model: "Maruti Swift",
                type: "hatchback",
                ac: false,
                seatsAvailable: 3
            },
            amenities: []
        },
        {
            id: 3,
            driver: {
                name: "Rahul M.",
                avatar: "https://randomuser.me/api/portraits/men/67.jpg",
                rating: 5.0,
                reviews: 63
            },
            price: 180,
            source: "Indiranagar, Bangalore",
            destination: "Marathahalli, Bangalore",
            departure: "Tomorrow, 9:15 AM",
            distance: "5.7 km",
            car: {
                model: "Honda City",
                type: "sedan",
                ac: true,
                seatsAvailable: 1
            },
            amenities: ["ac", "charging"]
        },
        {
            id: 4,
            driver: {
                name: "Ananya K.",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg",
                rating: 4.7,
                reviews: 35
            },
            price: 220,
            source: "HSR Layout, Bangalore",
            destination: "Hebbal, Bangalore",
            departure: "Today, 4:00 PM",
            distance: "12.3 km",
            car: {
                model: "Toyota Fortuner",
                type: "suv",
                ac: true,
                seatsAvailable: 4
            },
            amenities: ["ac", "wifi"]
        },
        {
            id: 5,
            driver: {
                name: "Vikram P.",
                avatar: "https://randomuser.me/api/portraits/men/75.jpg",
                rating: 4.2,
                reviews: 19
            },
            price: 170,
            source: "Jayanagar, Bangalore",
            destination: "BTM Layout, Bangalore",
            departure: "Today, 11:30 AM",
            distance: "3.1 km",
            car: {
                model: "Tata Nexon",
                type: "suv",
                ac: true,
                seatsAvailable: 3
            },
            amenities: ["ac"]
        },
        {
            id: 6,
            driver: {
                name: "Neha R.",
                avatar: "https://randomuser.me/api/portraits/women/33.jpg",
                rating: 4.9,
                reviews: 47
            },
            price: 190,
            source: "Marathahalli, Bangalore",
            destination: "MG Road, Bangalore",
            departure: "Tomorrow, 8:00 AM",
            distance: "7.8 km",
            car: {
                model: "Maruti Baleno",
                type: "hatchback",
                ac: true,
                seatsAvailable: 2
            },
            amenities: ["ac", "charging"]
        }
    ];

    // DOM Elements
    const ridesList = document.getElementById('rides-list');
    const loadingState = document.getElementById('loading-state');
    const noResults = document.getElementById('no-results');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetAllFiltersBtn = document.getElementById('reset-filters');
    const sortBy = document.getElementById('sort-by');

    // Load Rides
    function loadRides() {
        // Show loading state
        loadingState.style.display = 'flex';
        ridesList.innerHTML = '';
        noResults.style.display = 'none';

        // Simulate API call delay
        setTimeout(() => {
            // Hide loading state
            loadingState.style.display = 'none';

            // Filter rides based on selected filters (simplified for demo)
            const priceFilter = parseInt(priceRange.value);
            const distanceFilter = document.querySelector('input[name="distance"]:checked').value;
            const ratingFilter = document.querySelector('input[name="rating"]:checked').value;
            const vehicleTypeFilters = Array.from(document.querySelectorAll('input[name="vehicle-type"]:checked')).map(el => el.value);
            const timeFilter = document.querySelector('input[name="time"]:checked').value;

            // Filter rides
            const filteredRides = sampleRides.filter(ride => {
                // Price filter
                if (ride.price > priceFilter) return false;

                // Distance filter (simplified for demo)
                const rideDistance = parseFloat(ride.distance.split(' ')[0]);
                if (rideDistance > parseFloat(distanceFilter)) return false;

                // Rating filter
                if (ride.driver.rating < parseFloat(ratingFilter)) return false;

                // Vehicle type filter
                if (!vehicleTypeFilters.includes(ride.car.type)) return false;

                // Time filter (simplified for demo)
                if (timeFilter !== 'any') {
                    const hour = parseInt(ride.departure.split(', ')[1].split(':')[0]);
                    if (timeFilter === 'morning' && (hour < 6 || hour >= 12)) return false;
                    if (timeFilter === 'afternoon' && (hour < 12 || hour >= 18)) return false;
                    if (timeFilter === 'evening' && (hour < 18 || hour >= 24)) return false;
                }

                return true;
            });

            // Display results or no results message
            if (filteredRides.length === 0) {
                noResults.style.display = 'flex';
            } else {
                displayRides(filteredRides);
            }
        }, 1000);
    }

    // Display Rides
    function displayRides(rides) {
        ridesList.innerHTML = rides.map(ride => `
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
                    <div class="distance">
                        <i class="fas fa-map-marker-alt"></i> ${ride.distance} away
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
                    <button class="btn-primary book-now-btn"><i class="fas fa-chair"></i> Book Now</button>
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

        document.querySelectorAll('.book-now-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const rideId = parseInt(this.closest('.ride-card').dataset.id);
                bookRide(rideId);
            });
        });
    }

    // Generate Star Rating HTML
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
    const bookRideBtn = document.getElementById('book-ride-btn');

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
                    <div class="detail-label">Distance:</div>
                    <div class="detail-value">${ride.distance}</div>
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

    // Book Ride Button in Modal
    bookRideBtn.addEventListener('click', function() {
        const rideId = parseInt(modalRideDetails.querySelector('.driver-info').dataset.id);
        bookRide(rideId);
        closeModal();
    });

    // Book Ride Function
    function bookRide(rideId) {
        const ride = sampleRides.find(r => r.id === rideId);
        if (!ride) return;
        
        alert(`Booking ride with ${ride.driver.name} from ${ride.source} to ${ride.destination} for ₹${ride.price}`);
    }

    // Reset Filters Button
    resetFiltersBtn.addEventListener('click', function() {
        resetFilters();
        loadRides();
    });

    // Reset All Filters Button
    resetAllFiltersBtn.addEventListener('click', function() {
        resetFilters();
    });

    // Apply Filters Button
    applyFiltersBtn.addEventListener('click', function() {
        filtersContainer.classList.remove('show');
        loadRides();
    });

    // Sort Options
    sortBy.addEventListener('change', function() {
        const rides = Array.from(document.querySelectorAll('.ride-card'));
        if (rides.length === 0) return;
        
        rides.sort((a, b) => {
            const aPrice = parseInt(a.querySelector('.ride-price').textContent.replace('₹', ''));
            const bPrice = parseInt(b.querySelector('.ride-price').textContent.replace('₹', ''));
            const aDistance = parseFloat(a.querySelector('.distance').textContent.split(' ')[0]);
            const bDistance = parseFloat(b.querySelector('.distance').textContent.split(' ')[0]);
            const aRating = parseFloat(a.querySelector('.rating span').textContent.split(' ')[0]);
            const bRating = parseFloat(b.querySelector('.rating span').textContent.split(' ')[0]);
            
            switch (this.value) {
                case 'price-low':
                    return aPrice - bPrice;
                case 'price-high':
                    return bPrice - aPrice;
                case 'distance':
                    return aDistance - bDistance;
                case 'rating':
                    return bRating - aRating;
                case 'departure-early':
                    // Simplified sorting for demo
                    return a.querySelector('.timing').textContent.localeCompare(b.querySelector('.timing').textContent);
                default:
                    return 0;
            }
        });
        
        rides.forEach(ride => ridesList.appendChild(ride));
    });

    // Reset Filters Function
    function resetFilters() {
        // Price range
        priceRange.value = 500;
        currentPrice.textContent = '₹500';
        
        // Distance
        document.querySelector('input[name="distance"][value="1"]').checked = true;
        
        // Rating
        document.querySelector('input[name="rating"][value="4"]').checked = true;
        
        // Vehicle types
        document.querySelectorAll('input[name="vehicle-type"]').forEach(checkbox => {
            checkbox.checked = true;
        });
        
        // Time
        document.querySelector('input[name="time"][value="any"]').checked = true;
        
        // Sort by
        sortBy.value = 'price-low';
    }

    // Initial load
    loadRides();
});