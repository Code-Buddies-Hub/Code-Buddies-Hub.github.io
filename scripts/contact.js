/**
 * Code Buddies Hub - Contact Form JavaScript
 * Handles contact form submission and authentication integration
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the contact page
    initContactPage();
    
    // Add event listener for logout button
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            logout();
            window.location.reload(); // Reload the page after logout
        });
    }
    
    // Contact form submission handler
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show success message
        const successMessage = document.getElementById('successMessage');
        successMessage.style.display = 'block';
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth' });
        
        // Reset form
        this.reset();
        
        // Pre-fill form again if user is logged in
        if (isLoggedIn()) {
            prefillFormWithUserData();
        }
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    });
});

/**
 * Initialize the contact page based on authentication state
 */
function initContactPage() {
    // Check if user is logged in
    if (isLoggedIn()) {
        // User is logged in, update UI and pre-fill form
        updateUIForAuthenticatedUser();
        prefillFormWithUserData();
    } else {
        // User is not logged in, show guest content
        updateUIForGuest();
    }
    
    // Initialize copyright year
    updateCopyrightYear();
}

/**
 * Update UI elements for authenticated users
 */
function updateUIForAuthenticatedUser() {
    // Show authenticated content
    document.querySelectorAll('.auth-required').forEach(element => {
        element.style.display = 'block';
    });
    
    // Hide guest-only content
    document.querySelectorAll('.guest-only').forEach(element => {
        element.style.display = 'none';
    });
    
    // Get current user data
    const user = getCurrentUser();
    
    // Update user profile elements
    document.querySelectorAll('.user-profile[data-field="name"]').forEach(element => {
        element.textContent = user.name || 'User';
    });
    
    // Update profile picture if available
    const profilePicElements = document.querySelectorAll('.user-profile.profile-picture');
    if (user.profilePicture) {
        profilePicElements.forEach(element => {
            element.src = user.profilePicture;
            element.style.display = 'inline-block';
        });
    } else {
        // Hide profile picture if not available
        profilePicElements.forEach(element => {
            element.style.display = 'none';
        });
    }
}

/**
 * Update UI elements for guest users
 */
function updateUIForGuest() {
    // Hide authenticated content
    document.querySelectorAll('.auth-required').forEach(element => {
        element.style.display = 'none';
    });
    
    // Show guest-only content
    document.querySelectorAll('.guest-only').forEach(element => {
        element.style.display = 'block';
    });
}

/**
 * Pre-fill the contact form with user data if available
 */
function prefillFormWithUserData() {
    if (!isLoggedIn()) return;
    
    const user = getCurrentUser();
    
    // Pre-fill name field
    const nameField = document.getElementById('name');
    if (nameField && user.name) {
        nameField.value = user.name;
    }
    
    // Pre-fill email fields
    const emailField = document.getElementById('email');
    const accountEmailField = document.getElementById('accountEmail');
    
    if (emailField && user.email) {
        emailField.value = user.email;
    }
    
    if (accountEmailField && user.email) {
        accountEmailField.value = user.email;
    }
}

/**
 * Update the copyright year in the footer
 */
function updateCopyrightYear() {
    const copyrightContainer = document.getElementById('copyright-container');
    if (copyrightContainer) {
        const year = copyrightContainer.getAttribute('data-year') || new Date().getFullYear();
        copyrightContainer.textContent = ` ${year} Code Buddies Hub. All rights reserved.`;
    }
}