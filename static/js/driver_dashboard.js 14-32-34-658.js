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
    
    // Toggle Sidebar on Mobile
    const sidebarToggle = document.createElement('button');
    sidebarToggle.className = 'btn btn-primary sidebar-toggle';
    sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
    sidebarToggle.style.position = 'fixed';
    sidebarToggle.style.bottom = '20px';
    sidebarToggle.style.right = '20px';
    sidebarToggle.style.zIndex = '997';
    sidebarToggle.style.display = 'none';
    sidebarToggle.style.width = '50px';
    sidebarToggle.style.height = '50px';
    sidebarToggle.style.borderRadius = '50%';
    sidebarToggle.style.padding = '0';
    document.body.appendChild(sidebarToggle);
    
    const dashboardSidebar = document.querySelector('.dashboard-sidebar');
    
    sidebarToggle.addEventListener('click', function() {
        dashboardSidebar.classList.toggle('active');
    });
    
    // Show/hide sidebar toggle based on screen size
    function checkScreenSize() {
        if (window.innerWidth <= 992) {
            sidebarToggle.style.display = 'flex';
            sidebarToggle.style.alignItems = 'center';
            sidebarToggle.style.justifyContent = 'center';
        } else {
            sidebarToggle.style.display = 'none';
            dashboardSidebar.classList.remove('active');
        }
    }
    
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
    
    // User Dropdown Menu
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.querySelector('.dropdown-menu');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    });
    
    // Prevent dropdown from closing when clicking inside
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
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
    
    // Animation for cards
    const animateCards = function() {
        const cards = document.querySelectorAll('.stat-card, .ride-card');
        
        cards.forEach((card, index) => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (cardPosition < screenPosition) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animated elements
    document.querySelectorAll('.stat-card, .ride-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
    });
    
    window.addEventListener('scroll', animateCards);
    animateCards(); // Run once on page load
});