/**
 * Authentication utilities for Code Buddies Hub
 * This file handles user authentication state across the website
 */

// Replace with your WAMP server's IP address
const API_BASE_URL = 'http://YOUR_WAMP_SERVER_IP/code-buddies-api/api';

// Check if user is logged in
function isLoggedIn() {
    return getAuthToken() !== null;
}

// Get the authentication token
function getAuthToken() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

// Get the current user
function getCurrentUser() {
    const userJson = localStorage.getItem('user') || sessionStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
}

// Logout the user
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('tokenExpiry');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Update UI based on authentication state
function updateAuthUI() {
    const user = getCurrentUser();
    
    // Find auth-related elements
    const loginButtons = document.querySelectorAll('.login-button, .login-link');
    const logoutButtons = document.querySelectorAll('.logout-button');
    const userProfileElements = document.querySelectorAll('.user-profile');
    const authRequiredElements = document.querySelectorAll('.auth-required');
    const guestOnlyElements = document.querySelectorAll('.guest-only');
    
    if (user) {
        // User is logged in
        loginButtons.forEach(el => el.style.display = 'none');
        logoutButtons.forEach(el => {
            el.style.display = 'inline-block';
            el.addEventListener('click', logout);
        });
        
        // Update user profile elements
        userProfileElements.forEach(el => {
            el.style.display = 'block';
            // If the element has a data-field attribute, fill it with user data
            const field = el.getAttribute('data-field');
            if (field && user[field]) {
                el.textContent = user[field];
            }
            
            // If it's a profile picture
            if (el.classList.contains('profile-picture') && user.profile_picture) {
                el.src = user.profile_picture;
            }
        });
        
        // Show elements that require authentication
        authRequiredElements.forEach(el => el.style.display = 'block');
        
        // Hide elements for guests only
        guestOnlyElements.forEach(el => el.style.display = 'none');
    } else {
        // User is not logged in
        loginButtons.forEach(el => el.style.display = 'inline-block');
        logoutButtons.forEach(el => el.style.display = 'none');
        userProfileElements.forEach(el => el.style.display = 'none');
        
        // Hide elements that require authentication
        authRequiredElements.forEach(el => el.style.display = 'none');
        
        // Show elements for guests only
        guestOnlyElements.forEach(el => el.style.display = 'block');
    }
}

// Verify token with the backend
async function verifyToken() {
    const token = getAuthToken();
    
    if (!token) {
        return false;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/verify_token.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });
        
        const data = await response.json();
        
        if (response.ok && data.user) {
            // Update user data with latest from server
            const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;
            storage.setItem('user', JSON.stringify(data.user));
            return true;
        } else {
            // Token is invalid, log the user out
            logout();
            return false;
        }
    } catch (error) {
        console.error('Token verification error:', error);
        return false;
    }
}

// Protect pages that require authentication
function protectAuthenticatedPage() {
    if (!isLoggedIn()) {
        // Redirect to login page
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
        return false;
    }
    
    // Verify token in the background
    verifyToken().then(valid => {
        if (!valid) {
            // Token is invalid, user will be redirected by verifyToken function
            return false;
        }
    });
    
    return true;
}

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update UI based on current auth state
    updateAuthUI();
    
    // If user is logged in, verify token in the background
    if (isLoggedIn()) {
        verifyToken();
    }
});
