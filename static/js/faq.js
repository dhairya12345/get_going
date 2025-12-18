document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Animate hamburger icon
        if (this.classList.contains('active')) {
            this.querySelectorAll('span')[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            this.querySelectorAll('span')[1].style.opacity = '0';
            this.querySelectorAll('span')[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            this.querySelectorAll('span')[0].style.transform = 'rotate(0) translate(0, 0)';
            this.querySelectorAll('span')[1].style.opacity = '1';
            this.querySelectorAll('span')[2].style.transform = 'rotate(0) translate(0, 0)';
        }
    });
    
    // FAQ Category Tabs
    const categoryBtns = document.querySelectorAll('.category-btn');
    const faqCategories = document.querySelectorAll('.faq-category');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and categories
            categoryBtns.forEach(btn => btn.classList.remove('active'));
            faqCategories.forEach(category => category.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding category
            const categoryId = this.getAttribute('data-category');
            document.getElementById(`${categoryId}-faq`).classList.add('active');
        });
    });
    
    // FAQ Accordion
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', function() {
            // Close all other items
            if (!item.classList.contains('active')) {
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
            }
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // FAQ Search Functionality
    const searchBox = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-btn');
    
    function searchFAQs() {
        const searchTerm = searchBox.value.toLowerCase();
        
        if (searchTerm.trim() === '') {
            // Reset to default view if search is empty
            accordionItems.forEach(item => {
                item.style.display = 'block';
            });
            return;
        }
        
        accordionItems.forEach(item => {
            const question = item.querySelector('h3').textContent.toLowerCase();
            const answer = item.querySelector('p').textContent.toLowerCase();
            
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = 'block';
                
                // Expand matching items
                if (!item.classList.contains('active')) {
                    item.classList.add('active');
                }
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    searchBtn.addEventListener('click', searchFAQs);
    searchBox.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchFAQs();
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '15px 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Animation for FAQ items
    const animateFAQItems = function() {
        const items = document.querySelectorAll('.accordion-item');
        
        items.forEach((item, index) => {
            const itemPosition = item.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (itemPosition < screenPosition) {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animated elements
    document.querySelectorAll('.accordion-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.5s ease';
    });
    
    window.addEventListener('scroll', animateFAQItems);
    animateFAQItems(); // Run once on page load
});