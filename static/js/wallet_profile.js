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

    // Modal Elements
    const addMoneyModal = document.getElementById('add-money-modal');
    const withdrawModal = document.getElementById('withdraw-money-modal');
    const editProfileModal = document.getElementById('edit-profile-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    // Buttons to open modals
    const addMoneyBtn = document.querySelector('.add-money-btn');
    const withdrawMoneyBtn = document.querySelector('.withdraw-money-btn');
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const changePhotoBtn = document.querySelector('.change-photo-btn');
    
    // Modal close buttons
    const cancelAddMoney = document.getElementById('cancel-add-money');
    const confirmAddMoney = document.getElementById('confirm-add-money');
    const cancelWithdraw = document.getElementById('cancel-withdraw');
    const confirmWithdraw = document.getElementById('confirm-withdraw');
    const cancelEditProfile = document.getElementById('cancel-edit-profile');
    const saveProfile = document.getElementById('save-profile');
    
    // User data
    const userData = {
        name: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        phone: "+91 9876543210",
        profilePic: "https://randomuser.me/api/portraits/men/42.jpg",
        walletBalance: 1850,
        transactions: [
            {
                type: "credit",
                amount: 500,
                title: "Added to Wallet",
                date: "Today, 10:45 AM"
            },
            {
                type: "debit",
                amount: 180,
                title: "Ride Payment",
                date: "Yesterday, 5:30 PM"
            },
            {
                type: "credit",
                amount: 200,
                title: "Referral Bonus",
                date: "15 Mar 2023"
            },
            {
                type: "debit",
                amount: 150,
                title: "Ride Payment",
                date: "12 Mar 2023"
            }
        ]
    };
    
    // Initialize page with user data
    function initializePage() {
        document.getElementById('user-name').textContent = userData.name;
        document.getElementById('user-email').textContent = userData.email;
        document.getElementById('user-phone').textContent = userData.phone;
        document.getElementById('profile-pic').src = userData.profilePic;
        document.querySelector('.balance-amount').textContent = `₹${userData.walletBalance.toLocaleString()}`;
        
        // Pre-fill edit profile form
        document.getElementById('edit-name').value = userData.name;
        document.getElementById('edit-email').value = userData.email;
        document.getElementById('edit-phone').value = userData.phone;
    }
    
    // Open modal functions
    function openModal(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Close modal functions
    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Event listeners for opening modals
    addMoneyBtn.addEventListener('click', () => openModal(addMoneyModal));
    withdrawMoneyBtn.addEventListener('click', () => openModal(withdrawModal));
    editProfileBtn.addEventListener('click', () => openModal(editProfileModal));
    
    // Event listeners for closing modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Cancel buttons
    cancelAddMoney.addEventListener('click', () => closeModal(addMoneyModal));
    cancelWithdraw.addEventListener('click', () => closeModal(withdrawModal));
    cancelEditProfile.addEventListener('click', () => closeModal(editProfileModal));
    
    // Change profile picture
    changePhotoBtn.addEventListener('click', function() {
        // In a real app, this would open a file picker
        alert("In a real app, this would allow you to upload a new profile picture");
    });
    
    // Add money to wallet
    confirmAddMoney.addEventListener('click', function() {
        const amount = parseFloat(document.getElementById('amount').value);
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        
        if (isNaN(amount) || amount < 100) {
            alert("Please enter a valid amount (minimum ₹100)");
            return;
        }
        
        // In a real app, this would process the payment
        console.log(`Adding ₹${amount} via ${paymentMethod}`);
        
        // Update wallet balance
        userData.walletBalance += amount;
        
        // Add transaction
        userData.transactions.unshift({
            type: "credit",
            amount: amount,
            title: "Added to Wallet",
            date: "Just now"
        });
        
        // Update UI
        document.querySelector('.balance-amount').textContent = `₹${userData.walletBalance.toLocaleString()}`;
        alert(`Successfully added ₹${amount} to your wallet`);
        
        // Close modal
        closeModal(addMoneyModal);
    });
    
    // Withdraw money
    confirmWithdraw.addEventListener('click', function() {
        const amount = parseFloat(document.getElementById('withdraw-amount').value);
        const bankAccount = document.getElementById('bank-account').value;
        const accountHolder = document.getElementById('account-holder').value;
        const ifscCode = document.getElementById('ifsc-code').value;
        
        if (isNaN(amount) || amount < 100) {
            alert("Please enter a valid amount (minimum ₹100)");
            return;
        }
        
        if (amount > userData.walletBalance) {
            alert("Insufficient balance in your wallet");
            return;
        }
        
        if (!bankAccount || !accountHolder || !ifscCode) {
            alert("Please fill all bank details");
            return;
        }
        
        // In a real app, this would process the withdrawal
        console.log(`Withdrawing ₹${amount} to bank account ${bankAccount}`);
        
        // Update wallet balance
        userData.walletBalance -= amount;
        
        // Add transaction
        userData.transactions.unshift({
            type: "debit",
            amount: amount,
            title: "Withdrawal to Bank",
            date: "Just now"
        });
        
        // Update UI
        document.querySelector('.balance-amount').textContent = `₹${userData.walletBalance.toLocaleString()}`;
        alert(`Withdrawal request of ₹${amount} has been submitted. It will be processed within 2-3 business days.`);
        
        // Close modal
        closeModal(withdrawModal);
    });
    
    // Save profile changes
    saveProfile.addEventListener('click', function() {
        const newName = document.getElementById('edit-name').value.trim();
        const newEmail = document.getElementById('edit-email').value.trim();
        const newPhone = document.getElementById('edit-phone').value.trim();
        const newPassword = document.getElementById('edit-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (!newName || !newEmail || !newPhone) {
            alert("Please fill all required fields");
            return;
        }
        
        if (newPassword && newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        
        // Update user data
        userData.name = newName;
        userData.email = newEmail;
        userData.phone = newPhone;
        
        // Update UI
        document.getElementById('user-name').textContent = newName;
        document.getElementById('user-email').textContent = newEmail;
        document.getElementById('user-phone').textContent = newPhone;
        
        if (newPassword) {
            console.log("Password changed (in a real app, this would be securely updated)");
        }
        
        alert("Profile updated successfully");
        closeModal(editProfileModal);
    });
    
   
    // Initialize the page
    initializePage();
    
});


