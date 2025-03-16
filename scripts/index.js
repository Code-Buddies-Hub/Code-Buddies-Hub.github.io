fetch("http://192.168.86.42:5000/api/data")
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error("Error:", error));


 /**
 * Code Buddies Hub - Homepage JavaScript
 * Handles authentication state and UI updates for the homepage
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the homepage
    initHomepage();
    
    // Add event listener for logout button
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            logout();
            window.location.reload(); // Reload the page after logout
        });
    }
});

/**
 * Initialize the homepage based on authentication state
 */
function initHomepage() {
    // Check if user is logged in
    if (isLoggedIn()) {
        // User is logged in, update UI
        updateUIForAuthenticatedUser();
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
 * Update the copyright year in the footer
 */
function updateCopyrightYear() {
    const copyrightContainer = document.getElementById('copyright-container');
    if (copyrightContainer) {
        const year = copyrightContainer.getAttribute('data-year') || new Date().getFullYear();
        copyrightContainer.textContent = ` ${year} Code Buddies Hub. All rights reserved.`;
    }
}