// Simple XOR encryption (for demo purposes - secure enough for local storage)
const ENCRYPTION_KEY = 'MediCare2024!SecureKey#ReminderApp';
function encrypt(text) {
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
        encrypted += String.fromCharCode(text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length));
    }
    return btoa(encrypted);
}

function decrypt(encryptedText) {
    try {
        const decoded = atob(encryptedText);
        let decrypted = '';
        for (let i = 0; i < decoded.length; i++) {
            decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length));
        }
        return decrypted;
    } catch {
        return null;
    }
}

// DOM Elements
const loginForm = document.getElementById('loginFormElement');
const registerForm = document.getElementById('registerFormElement');
const successModal = document.getElementById('successModal');
const successMessage = document.getElementById('successMessage');

// Form switching
function showLogin() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
}

function showRegister() {
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
}

// Password visibility toggle
function togglePassword(inputId, eyeId) {
    const input = document.getElementById(inputId);
    const eye = document.getElementById(eyeId);
    const icon = eye.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Event listeners for eye icons
document.getElementById('loginEye').addEventListener('click', () => togglePassword('loginPassword', 'loginEye'));
document.getElementById('regEye').addEventListener('click', () => togglePassword('regPassword', 'regEye'));
document.getElementById('regConfirmEye').addEventListener('click', () => togglePassword('regConfirmPassword', 'regConfirmEye'));

// Validation functions
function validateName(name) {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name) && name.trim().length >= 2;
}

function validatePassword(password) {
    return password.length >= 6;
}

function validateAge(age) {
    const ageNum = parseInt(age);
    return ageNum >= 1 && ageNum <= 120;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = '';
    errorElement.style.display = 'none';
}

// Clear all errors
function clearAllErrors(formPrefix) {
    ['Name', 'Password', 'Age', 'Condition', 'ConfirmPassword'].forEach(field => {
        clearError(`${formPrefix}${field}Error`);
    });
}

// Login Handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllErrors('login');
    
    const name = document.getElementById('loginName').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validation
    if (!validateName(name)) {
        showError('loginNameError', 'Please enter a valid name (2+ characters, letters only)');
        return;
    }
    
    if (!validatePassword(password)) {
        showError('loginPasswordError', 'Password must be at least 6 characters');
        return;
    }
    
    // Check stored users
    const users = JSON.parse(localStorage.getItem('medicUsers') || '[]');
    const encryptedPassword = encrypt(password);
    
    const user = users.find(u => u.name.toLowerCase() === name.toLowerCase() && u.password === encryptedPassword);
    
    if (user) {
        // Login successful
        localStorage.setItem('currentUser', JSON.stringify({
            name: user.name,
            age: user.age,
            condition: user.condition
        }));
        successMessage.textContent = `Welcome back, ${user.name}!`;
        successModal.classList.add('active');
    } else {
        showError('loginNameError', 'No account found with this name/password');
        showError('loginPasswordError', '');
    }
});

// Register Handler
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllErrors('reg');
    
    const name = document.getElementById('regName').value.trim();
    const age = document.getElementById('regAge').value;
    const condition = document.getElementById('regCondition').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    // Validation
    if (!validateName(name)) {
        showError('regNameError', 'Please enter a valid name (2+ characters, letters only)');
        return;
    }
    
    if (!validateAge(age)) {
        showError('regAgeError', 'Please enter a valid age (1-120)');
        return;
    }
    
    if (!validatePassword(password)) {
        showError('regPasswordError', 'Password must be at least 6 characters');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('regConfirmPasswordError', 'Passwords do not match');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('medicUsers') || '[]');
    if (users.find(u => u.name.toLowerCase() === name.toLowerCase())) {
        showError('regNameError', 'User with this name already exists');
        return;
    }
    
    // Register new user
    const newUser = {
        name,
        age: parseInt(age),
        condition: condition || 'No specific conditions noted',
        password: encrypt(password),
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('medicUsers', JSON.stringify(users));
    
    // Set as current user
    localStorage.setItem('currentUser', JSON.stringify({
        name,
        age: parseInt(age),
        condition: condition || 'No specific conditions noted'
    }));
    
    successMessage.textContent = `Welcome ${name}! Your account has been created successfully.`;
    successModal.classList.add('active');
});

// Dashboard redirect
function goToDashboard() {
    // In a real app, this would navigate to dashboard.html
    // For demo, we'll create a simple dashboard in the same page
    document.body.innerHTML = `
        <div style="font-family: 'Poppins', sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
            <div style="background: rgba(255,255,255,0.1); padding: 3rem; border-radius: 25px; backdrop-filter: blur(20px);">
                <h1 style="font-size: 3rem; margin-bottom: 1rem;">🎉 Welcome to Dashboard!</h1>
                <div style="background: rgba(255,255,255,0.2); padding: 2rem; border-radius: 20px; margin: 2rem 0;">
                    <h2 style="margin-bottom: 1rem;">User Profile</h2>
                    <p><strong>Name:</strong> ${JSON.parse(localStorage.getItem('currentUser') || '{}').name || 'User'}</p>
                    <p><strong>Age:</strong> ${JSON.parse(localStorage.getItem('currentUser') || '{}').age || 'N/A'}</p>
                    <p><strong>Condition:</strong> ${JSON.parse(localStorage.getItem('currentUser') || '{}').condition || 'N/A'}</p>
                </div>
                <button onclick="location.reload()" style="background: rgba(255,255,255,0.2); color: white; border: 2px solid white; padding: 1rem 2rem; border-radius: 50px; font-size: 1.1rem; cursor: pointer; font-weight: 600; transition: all 0.3s;">Add Medicine Reminder</button>
                <p style="margin-top: 2rem; opacity: 0.9;">Your Medicine Reminder Dashboard is ready! 🚀</p>
            </div>
        </div>
    `;
}

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('active');
    }
});

// Auto-focus first input
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginName').focus();
});
