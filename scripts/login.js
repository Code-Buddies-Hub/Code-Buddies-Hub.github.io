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
    
    loginFormElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Here you would typically send the login data to your server
        // For now, we'll just simulate a successful login
        
        console.log('Login attempt:', { email });
        
        // Simulate successful login
        alert('Login successful! Redirecting to dashboard...');
        
        // Redirect to index or dashboard page
        // window.location.href = 'index.html';
    });
    
    signupFormElement.addEventListener('submit', function(e) {
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
        
        // Here you would typically send the signup data to your server
        // For now, we'll just simulate a successful signup
        
        console.log('Signup attempt:', { name, email });
        
        // Simulate successful signup
        alert('Account created successfully! You can now log in.');
        
        // Switch to login tab
        loginTab.click();
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
});

// Google Sign-In functions
function handleGoogleSignIn(response) {
    // Get the ID token from the response
    const idToken = response.credential;
    
    // Parse the JWT token to get user information
    const payload = parseJwt(idToken);
    
    console.log('Google Sign-In successful:', payload);
    
    // Store user information in localStorage or sessionStorage
    localStorage.setItem('user', JSON.stringify({
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        sub: payload.sub, // Google's unique identifier for the user
        token: idToken
    }));
    
    // Show success message
    alert(`Welcome, ${payload.name}! You've successfully signed in with Google.`);
    
    // Redirect to index or dashboard page
    window.location.href = 'index.html';
}

// Function to parse JWT token
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
}
