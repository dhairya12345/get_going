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

    // Sample Ride History Data
    const rideHistory = [
        {
            id: 1,
            date: "15 Mar 2023",
            price: 150,
            driver: {
                name: "John D.",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                rating: 4.5
            },
            source: "MG Road, Bangalore",
            destination: "Electronic City, Bangalore",
            departure: "8:30 AM",
            duration: "45 mins",
            distance: "22 km",
            vehicle: "Hyundai i20 (AC)",
            userRating: 4,
            userReview: "Great ride! Driver was punctual and car was clean."
        },
        {
            id: 2,
            date: "10 Mar 2023",
            price: 200,
            driver: {
                name: "Priya S.",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                rating: 4.0
            },
            source: "Koramangala, Bangalore",
            destination: "Whitefield, Bangalore",
            departure: "5:45 PM",
            duration: "1 hr 15 mins",
            distance: "28 km",
            vehicle: "Maruti Swift",
            userRating: 3,
            userReview: "Decent ride but there was some traffic."
        },
        {
            id: 3,
            date: "5 Mar 2023",
            price: 180,
            driver: {
                name: "Rahul M.",
                avatar: "https://randomuser.me/api/portraits/men/67.jpg",
                rating: 5.0
            },
            source: "Indiranagar, Bangalore",
            destination: "Marathahalli, Bangalore",
            departure: "9:15 AM",
            duration: "55 mins",
            distance: "24 km",
            vehicle: "Honda City (AC)",
            userRating: 5,
            userReview: "Excellent experience! Would definitely ride with Rahul again."
        },
        {
            id: 4,
            date: "28 Feb 2023",
            price: 220,
            driver: {
                name: "Ananya K.",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg",
                rating: 4.7
            },
            source: "HSR Layout, Bangalore",
            destination: "Hebbal, Bangalore",
            departure: "4:00 PM",
            duration: "1 hr 30 mins",
            distance: "32 km",
            vehicle: "Toyota Fortuner (AC)",
            userRating: null,
            userReview: null
        },
        {
            id: 5,
            date: "22 Feb 2023",
            price: 170,
            driver: {
                name: "Vikram P.",
                avatar: "https://randomuser.me/api/portraits/men/75.jpg",
                rating: 4.2
            },
            source: "Jayanagar, Bangalore",
            destination: "BTM Layout, Bangalore",
            departure: "11:30 AM",
            duration: "35 mins",
            distance: "15 km",
            vehicle: "Tata Nexon (AC)",
            userRating: null,
            userReview: null
        }
    ];

    // DOM Elements
    const ridesList = document.getElementById('rides-list');
    const loadingState = document.getElementById('loading-state');
    const noResults = document.getElementById('no-results');
    const timePeriodFilter = document.getElementById('time-period');
    const sortByFilter = document.getElementById('sort-by');
    const resetFiltersBtn = document.getElementById('reset-filters');

    // Ride Details Modal Elements
    const rideDetailsModal = document.getElementById('ride-details-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const closeModalBtnFooter = document.getElementById('close-modal-btn');
    const modalRideDetails = document.getElementById('modal-ride-details');

    // Rating Modal Elements
    const ratingModal = document.getElementById('rating-modal');
    const ratingStars = document.getElementById('rating-stars');
    const ratingText = document.querySelector('.rating-text');
    const reviewText = document.getElementById('review-text');
    const cancelRatingBtn = document.getElementById('cancel-rating-btn');
    const submitRatingBtn = document.getElementById('submit-rating-btn');
    let currentRating = 0;
    let currentRideId = null;

    // Load Ride History
    function loadRideHistory() {
        // Show loading state
        loadingState.style.display = 'flex';
        ridesList.innerHTML = '';
        noResults.style.display = 'none';

        // Simulate API call delay
        setTimeout(() => {
            // Hide loading state
            loadingState.style.display = 'none';

            // Filter rides based on time period (simplified for demo)
            let filteredRides = [...rideHistory];
            const timePeriod = timePeriodFilter.value;

            if (timePeriod === 'month') {
                filteredRides = filteredRides.slice(0, 3);
            } else if (timePeriod === 'week') {
                filteredRides = filteredRides.slice(0, 1);
            } else if (timePeriod === 'today') {
                filteredRides = [];
            }

            // Sort rides
            const sortBy = sortByFilter.value;
            filteredRides.sort((a, b) => {
                const dateA = new Date(a.date.split(' ').reverse().join('-'));
                const dateB = new Date(b.date.split(' ').reverse().join('-'));

                switch (sortBy) {
                    case 'recent':
                        return dateB - dateA;
                    case 'oldest':
                        return dateA - dateB;
                    case 'price-high':
                        return b.price - a.price;
                    case 'price-low':
                        return a.price - b.price;
                    case 'rating':
                        return (b.userRating || 0) - (a.userRating || 0);
                    default:
                        return 0;
                }
            });

            // Display results or no results message
            if (filteredRides.length === 0) {
                noResults.style.display = 'flex';
            } else {
                displayRideHistory(filteredRides);
            }
        }, 1000);
    }

    // Display Ride History
    function displayRideHistory(rides) {
        ridesList.innerHTML = rides.map(ride => `
            <div class="ride-item" data-id="${ride.id}">
                <div class="ride-header">
                    <span class="ride-date">${ride.date}</span>
                    <span class="ride-price">₹${ride.price}</span>
                </div>
                <div class="ride-body">
                    <div class="ride-driver">
                        <img src="${ride.driver.avatar}" alt="Driver" class="driver-avatar">
                        <div class="driver-info">
                            <h4>${ride.driver.name}</h4>
                            <div class="driver-rating">
                                ${generateStarRating(ride.driver.rating)}
                                <span>${ride.driver.rating}</span>
                            </div>
                        </div>
                    </div>
                    <div class="ride-details">
                        <div class="detail-group ride-route">
                            <span class="detail-label">Route</span>
                            <span class="detail-value">
                                <span class="dot start"></span> ${ride.source}<br>
                                <span class="dot end"></span> ${ride.destination}
                            </span>
                        </div>
                        <div class="detail-group">
                            <span class="detail-label">Departure</span>
                            <span class="detail-value">${ride.departure}</span>
                        </div>
                        <div class="detail-group">
                            <span class="detail-label">Duration</span>
                            <span class="detail-value">${ride.duration}</span>
                        </div>
                        <div class="detail-group">
                            <span class="detail-label">Distance</span>
                            <span class="detail-value">${ride.distance}</span>
                        </div>
                        <div class="detail-group">
                            <span class="detail-label">Vehicle</span>
                            <span class="detail-value">${ride.vehicle}</span>
                        </div>
                        <div class="detail-group">
                            <span class="detail-label">Your Rating</span>
                            <span class="detail-value">
                                ${ride.userRating ? `
                                    ${generateStarRating(ride.userRating)}
                                    ${ride.userRating}/5
                                ` : 'Not rated yet'}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="ride-actions">
                    ${ride.userRating ? '' : `
                        <button class="rate-btn" data-id="${ride.id}">
                            <i class="fas fa-star"></i> Rate Ride
                        </button>
                    `}
                    <button class="view-details-btn" data-id="${ride.id}">
                        <i class="fas fa-info-circle"></i> View Details
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners to the new buttons
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const rideId = parseInt(this.dataset.id);
                showRideDetails(rideId);
            });
        });

        document.querySelectorAll('.rate-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const rideId = parseInt(this.dataset.id);
                showRatingModal(rideId);
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

    // Show Ride Details Modal
    function showRideDetails(rideId) {
        const ride = rideHistory.find(r => r.id === rideId);
        if (!ride) return;
        
        modalRideDetails.innerHTML = `
            <div class="ride-detail">
                <h3>Ride Summary</h3>
                <div class="detail-row">
                    <div class="detail-label">Date:</div>
                    <div class="detail-value">${ride.date}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Price:</div>
                    <div class="detail-value">₹${ride.price}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Departure:</div>
                    <div class="detail-value">${ride.departure}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Duration:</div>
                    <div class="detail-value">${ride.duration}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Distance:</div>
                    <div class="detail-value">${ride.distance}</div>
                </div>
            </div>
            
            <div class="ride-detail">
                <h3>Route Details</h3>
                <div class="detail-row">
                    <div class="detail-label">From:</div>
                    <div class="detail-value">${ride.source}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">To:</div>
                    <div class="detail-value">${ride.destination}</div>
                </div>
            </div>
            
            <div class="ride-detail">
                <h3>Driver & Vehicle</h3>
                <div class="detail-row">
                    <div class="detail-label">Driver:</div>
                    <div class="detail-value">${ride.driver.name}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Driver Rating:</div>
                    <div class="detail-value">
                        ${generateStarRating(ride.driver.rating)}
                        ${ride.driver.rating}/5
                    </div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Vehicle:</div>
                    <div class="detail-value">${ride.vehicle}</div>
                </div>
            </div>
            
            ${ride.userRating ? `
                <div class="ride-detail">
                    <h3>Your Feedback</h3>
                    <div class="detail-row">
                        <div class="detail-label">Rating:</div>
                        <div class="detail-value">
                            ${generateStarRating(ride.userRating)}
                            ${ride.userRating}/5
                        </div>
                    </div>
                    ${ride.userReview ? `
                        <div class="detail-row">
                            <div class="detail-label">Review:</div>
                            <div class="detail-value">${ride.userReview}</div>
                        </div>
                    ` : ''}
                </div>
            ` : ''}
        `;
        
        rideDetailsModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Show Rating Modal
    function showRatingModal(rideId) {
        currentRideId = rideId;
        currentRating = 0;
        reviewText.value = '';
        
        // Reset stars
        const stars = ratingStars.querySelectorAll('i');
        stars.forEach(star => {
            star.classList.remove('fas', 'active');
            star.classList.add('far');
        });
        
        ratingText.textContent = 'Tap to rate';
        ratingModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Close Modal
    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === rideDetailsModal) {
            closeModal(rideDetailsModal);
        }
        if (e.target === ratingModal) {
            closeModal(ratingModal);
        }
    });

    // Close buttons
    closeModalBtn.addEventListener('click', () => closeModal(rideDetailsModal));
    closeModalBtnFooter.addEventListener('click', () => closeModal(rideDetailsModal));
    cancelRatingBtn.addEventListener('click', () => closeModal(ratingModal));

    // Star Rating Interaction
    ratingStars.addEventListener('mouseover', function(e) {
        if (e.target.tagName === 'I') {
            const rating = parseInt(e.target.dataset.rating);
            const stars = ratingStars.querySelectorAll('i');
            
            stars.forEach((star, index) => {
                if (index < rating) {
                    star.classList.add('fas', 'hover');
                    star.classList.remove('far');
                } else {
                    star.classList.remove('fas', 'hover');
                    star.classList.add('far');
                }
            });
        }
    });

    ratingStars.addEventListener('mouseout', function() {
        const stars = ratingStars.querySelectorAll('i');
        
        stars.forEach((star, index) => {
            if (index < currentRating) {
                star.classList.add('fas', 'active');
                star.classList.remove('far', 'hover');
            } else {
                star.classList.remove('fas', 'hover', 'active');
                star.classList.add('far');
            }
        });
    });

    ratingStars.addEventListener('click', function(e) {
        if (e.target.tagName === 'I') {
            currentRating = parseInt(e.target.dataset.rating);
            const stars = ratingStars.querySelectorAll('i');
            
            stars.forEach((star, index) => {
                if (index < currentRating) {
                    star.classList.add('fas', 'active');
                    star.classList.remove('far');
                } else {
                    star.classList.remove('fas', 'active');
                    star.classList.add('far');
                }
            });
            
            ratingText.textContent = `You rated ${currentRating} star${currentRating > 1 ? 's' : ''}`;
        }
    });

    // Submit Rating
    submitRatingBtn.addEventListener('click', function() {
        if (currentRating === 0) {
            alert('Please select a rating');
            return;
        }
        
        const review = reviewText.value.trim();
        
        // In a real app, you would send this to your backend
        console.log(`Rating submitted for ride ${currentRideId}: ${currentRating} stars`);
        console.log(`Review: ${review}`);
        
        // Update the UI (in a real app, this would happen after successful API call)
        const rideIndex = rideHistory.findIndex(r => r.id === currentRideId);
        if (rideIndex !== -1) {
            rideHistory[rideIndex].userRating = currentRating;
            rideHistory[rideIndex].userReview = review || null;
        }
        
        // Close modal and reload history
        closeModal(ratingModal);
        loadRideHistory();
    });

    // Filter Event Listeners
    timePeriodFilter.addEventListener('change', loadRideHistory);
    sortByFilter.addEventListener('change', loadRideHistory);
    resetFiltersBtn.addEventListener('click', function() {
        timePeriodFilter.value = 'all';
        sortByFilter.value = 'recent';
        loadRideHistory();
    });

    // Initial load
    loadRideHistory();
});