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
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            faqItem.classList.toggle('active');
            
            // Close other open FAQs
            faqQuestions.forEach(q => {
                if (q !== question && q.parentElement.classList.contains('active')) {
                    q.parentElement.classList.remove('active');
                }
            });
        });
    });
    
    // Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Filter Buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Here you would typically filter the rides based on the selected filter
            // For demo purposes, we'll just log the filter
            console.log(`Filter: ${this.textContent}`);
        });
    });
    
    // Ride Booking Form Submission
    const bookingForm = document.querySelector('.booking-form');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const source = document.getElementById('source').value;
            const destination = document.getElementById('destination').value;
            const date = document.getElementById('date').value;
            
            if (!source || !destination) {
                alert('Please enter both pickup and drop locations');
                return;
            }
            
            // Here you would typically make an API call to search for rides
            console.log(`Searching rides from ${source} to ${destination} on ${date}`);
            
            // For demo, we'll just scroll to the available rides section
            document.querySelector('.available-rides').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    // Book Seat Button Click
    const bookSeatBtns = document.querySelectorAll('.ride-actions .btn-primary');
    
    bookSeatBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Here you would typically show a booking modal or process the booking
            alert('Booking functionality will be implemented in the backend');
        });
    });
    
    // Wallet Quick Add Buttons
    const amountBtns = document.querySelectorAll('.amount-btn');
    
    amountBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const amount = this.textContent;
            
            // Here you would typically add the amount to the wallet
            alert(`Adding ${amount} to wallet - will be processed in the backend`);
        });
    });
    
    // Current Date for Date Input
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    document.getElementById('date').min = today;
    
    // Animation on Scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.step, .ride-card, .faq-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animated elements
    const animatedElements = document.querySelectorAll('.step, .ride-card, .faq-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
});