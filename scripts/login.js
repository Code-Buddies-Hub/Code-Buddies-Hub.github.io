document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    loginTab.addEventListener('click', function() {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    });

    signupTab.addEventListener('click', function() {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    });

    // Password strength validation
    const passwordInput = document.getElementById('signupPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordStrength = document.getElementById('passwordStrength');
    
    // Password requirement elements
    const lengthReq = document.getElementById('length');
    const uppercaseReq = document.getElementById('uppercase');
    const lowercaseReq = document.getElementById('lowercase');
    const numberReq = document.getElementById('number');
    const specialReq = document.getElementById('special');

    passwordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        
        // Check requirements
        const hasLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        // Update requirement indicators
        updateRequirement(lengthReq, hasLength);
        updateRequirement(uppercaseReq, hasUppercase);
        updateRequirement(lowercaseReq, hasLowercase);
        updateRequirement(numberReq, hasNumber);
        updateRequirement(specialReq, hasSpecial);
        
        // Calculate strength
        let strength = 0;
        if (hasLength) strength += 20;
        if (hasUppercase) strength += 20;
        if (hasLowercase) strength += 20;
        if (hasNumber) strength += 20;
        if (hasSpecial) strength += 20;
        
        // Update strength indicator
        passwordStrength.style.width = strength + '%';
        
        if (strength <= 40) {
            passwordStrength.style.backgroundColor = '#e74c3c'; // Weak - Red
        } else if (strength <= 80) {
            passwordStrength.style.backgroundColor = '#f39c12'; // Medium - Orange
        } else {
            passwordStrength.style.backgroundColor = '#2ecc71'; // Strong - Green
        }
    });
    
    function updateRequirement(element, isValid) {
        if (isValid) {
            element.classList.add('valid');
        } else {
            element.classList.remove('valid');
        }
    }
    
    // Form submission handling
    const loginFormElement = document.getElementById('loginForm');
    const signupFormElement = document.getElementById('signupForm');
    
    // Replace with your WAMP server's IP address
    const API_BASE_URL = 'http://192.168.86.42/code-buddies-api/api';
    
    loginFormElement.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Disable form while processing
        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Logging in...';
        
        try {
            const response = await fetch(`${API_BASE_URL}/login.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Store auth token and user data
                const storage = rememberMe ? localStorage : sessionStorage;
                storage.setItem('authToken', data.token);
                storage.setItem('user', JSON.stringify(data.user));
                storage.setItem('tokenExpiry', data.expires_at);
                
                alert('Login successful! Redirecting to dashboard...');
                window.location.href = 'index.html';
            } else {
                alert(`Login failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login. Please try again.');
        } finally {
            // Re-enable form
            submitButton.disabled = false;
            submitButton.textContent = 'Log In';
        }
    });
    
    signupFormElement.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Validate password strength
        const hasLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        if (!(hasLength && hasUppercase && hasLowercase && hasNumber && hasSpecial)) {
            alert('Please ensure your password meets all the requirements.');
            return;
        }
        
        // Validate terms agreement
        if (!agreeTerms) {
            alert('You must agree to the Terms of Service and Privacy Policy.');
            return;
        }
        
        // Disable form while processing
        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Creating account...';
        
        try {
            const response = await fetch(`${API_BASE_URL}/register.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert('Account created successfully! You can now log in.');
                
                // Clear form fields
                this.reset();
                
                // Switch to login tab
                document.getElementById('loginTab').click();
            } else {
                alert(`Registration failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration. Please try again.');
        } finally {
            // Re-enable form
            submitButton.disabled = false;
            submitButton.textContent = 'Create Account';
        }
    });
    
    // Social login buttons
    const githubBtn = document.querySelector('.social-btn.github');
    const googleBtn = document.querySelector('.social-btn.google');
    
    if (githubBtn) {
        githubBtn.addEventListener('click', function() {
            // Implement GitHub OAuth login
            alert('GitHub login will be implemented soon!');
        });
    }
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            // Trigger Google Sign-In
            google.accounts.id.prompt();
        });
    }
    
    // Update copyright year
    const copyrightContainer = document.getElementById('copyright-container');
    if (copyrightContainer) {
        const currentYear = new Date().getFullYear();
        copyrightContainer.setAttribute('data-year', currentYear);
    }
    
    // Check if user is already logged in
    function checkLoggedInStatus() {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        if (token) {
            // Verify token with the backend
            fetch(`${API_BASE_URL}/verify_token.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            })
            .then(response => response.json())
            .then(data => {
                if (data.user) {
                    // User is already logged in, redirect to index
                    window.location.href = 'index.html';
                }
            })
            .catch(error => {
                console.error('Token verification error:', error);
                // Clear invalid tokens
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                sessionStorage.removeItem('authToken');
                sessionStorage.removeItem('user');
            });
        }
    }
    
    // Check if user is already logged in when page loads
    checkLoggedInStatus();
});

// Google Sign-In functions
function handleGoogleSignIn(response) {
    // Get the ID token from the response
    const idToken = response.credential;
    
    // API base URL - replace with your WAMP server's IP
    const API_BASE_URL = 'http://YOUR_WAMP_SERVER_IP/code-buddies-api/api';
    
    // Send token to your backend
    fetch(`${API_BASE_URL}/google_auth.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: idToken })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            // Store auth token and user data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('tokenExpiry', data.expires_at);
            
            alert(`Welcome, ${data.user.name}! You've successfully signed in with Google.`);
            window.location.href = 'index.html';
        } else {
            alert(`Google Sign-In failed: ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Google auth error:', error);
        alert('An error occurred during Google authentication. Please try again.');
    });
}

// Function to parse JWT token (kept for reference)
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
}
