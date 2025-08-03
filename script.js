// Registration Form Handler
class RegistrationForm {
    constructor() {
        this.form = document.getElementById('registrationForm');
        this.fields = {
            fullName: document.getElementById('fullName'),
            email: document.getElementById('email'),
            phone: document.getElementById('phone'),
            dob: document.getElementById('dob'),
            password: document.getElementById('password'),
            confirmPassword: document.getElementById('confirmPassword'),
            gender: document.getElementsByName('gender'),
            country: document.getElementById('country'),
            terms: document.getElementById('terms')
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupHamburgerMenu();
        this.setDateConstraints();
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        Object.keys(this.fields).forEach(fieldName => {
            if (fieldName === 'gender') {
                this.fields[fieldName].forEach(radio => {
                    radio.addEventListener('change', () => this.validateField(fieldName));
                });
            } else {
                this.fields[fieldName].addEventListener('blur', () => this.validateField(fieldName));
                this.fields[fieldName].addEventListener('input', () => {
                    if (fieldName === 'password') {
                        this.updatePasswordStrength();
                    }
                    this.clearFieldError(fieldName);
                });
            }
        });

        // Confirm password real-time validation
        this.fields.confirmPassword.addEventListener('input', () => {
            this.validateConfirmPassword();
        });
    }

    setupHamburgerMenu() {
        const hamburger = document.getElementById('hamburgerMenu');
        const sideNav = document.getElementById('sideNav');
        const overlay = document.getElementById('overlay');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            sideNav.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', () => {
            hamburger.classList.remove('active');
            sideNav.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    setDateConstraints() {
        const today = new Date();
        const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
        const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
        
        this.fields.dob.max = maxDate.toISOString().split('T')[0];
        this.fields.dob.min = minDate.toISOString().split('T')[0];
    }

    validateField(fieldName) {
        const field = this.fields[fieldName];
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'fullName':
                if (!field.value.trim()) {
                    errorMessage = 'Full name is required';
                    isValid = false;
                } else if (field.value.trim().length < 2) {
                    errorMessage = 'Full name must be at least 2 characters';
                    isValid = false;
                } else if (!/^[a-zA-Z\s]+$/.test(field.value.trim())) {
                    errorMessage = 'Full name can only contain letters and spaces';
                    isValid = false;
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!field.value.trim()) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!emailRegex.test(field.value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;

            case 'phone':
                const phoneRegex = /^[0-9]{10}$/;
                if (!field.value.trim()) {
                    errorMessage = 'Phone number is required';
                    isValid = false;
                } else if (!phoneRegex.test(field.value.replace(/\D/g, ''))) {
                    errorMessage = 'Please enter a valid 10-digit phone number';
                    isValid = false;
                }
                break;

            case 'dob':
                if (!field.value) {
                    errorMessage = 'Date of birth is required';
                    isValid = false;
                } else {
                    const selectedDate = new Date(field.value);
                    const today = new Date();
                    const age = today.getFullYear() - selectedDate.getFullYear();
                    
                    if (age < 13) {
                        errorMessage = 'You must be at least 13 years old';
                        isValid = false;
                    } else if (age > 100) {
                        errorMessage = 'Please enter a valid date of birth';
                        isValid = false;
                    }
                }
                break;

            case 'password':
                const passwordStrength = this.getPasswordStrength(field.value);
                if (!field.value) {
                    errorMessage = 'Password is required';
                    isValid = false;
                } else if (field.value.length < 8) {
                    errorMessage = 'Password must be at least 8 characters long';
                    isValid = false;
                } else if (passwordStrength < 2) {
                    errorMessage = 'Password is too weak. Include uppercase, lowercase, numbers, and special characters';
                    isValid = false;
                }
                break;

            case 'confirmPassword':
                if (!field.value) {
                    errorMessage = 'Please confirm your password';
                    isValid = false;
                } else if (field.value !== this.fields.password.value) {
                    errorMessage = 'Passwords do not match';
                    isValid = false;
                }
                break;

            case 'gender':
                const selectedGender = Array.from(field).find(radio => radio.checked);
                if (!selectedGender) {
                    errorMessage = 'Please select your gender';
                    isValid = false;
                }
                break;

            case 'country':
                if (!field.value) {
                    errorMessage = 'Please select your country';
                    isValid = false;
                }
                break;

            case 'terms':
                if (!field.checked) {
                    errorMessage = 'You must agree to the terms and conditions';
                    isValid = false;
                }
                break;
        }

        this.displayFieldError(fieldName, errorMessage);
        this.updateFieldStatus(fieldName, isValid);
        
        return isValid;
    }

    validateConfirmPassword() {
        const confirmPassword = this.fields.confirmPassword.value;
        const password = this.fields.password.value;
        
        if (confirmPassword && confirmPassword !== password) {
            this.displayFieldError('confirmPassword', 'Passwords do not match');
            this.updateFieldStatus('confirmPassword', false);
        } else if (confirmPassword === password && password) {
            this.displayFieldError('confirmPassword', '');
            this.updateFieldStatus('confirmPassword', true);
        }
    }

    getPasswordStrength(password) {
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        
        // Character variety checks
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        
        return strength;
    }

    updatePasswordStrength() {
        const password = this.fields.password.value;
        const strengthBar = document.getElementById('strengthBar');
        const strengthText = document.getElementById('strengthText');
        
        const strength = this.getPasswordStrength(password);
        
        // Remove all strength classes
        strengthBar.className = 'strength-bar';
        
        if (!password) {
            strengthText.textContent = 'Password Strength';
            return;
        }
        
        switch (strength) {
            case 0:
            case 1:
                strengthBar.classList.add('weak');
                strengthText.textContent = 'Weak Password';
                break;
            case 2:
                strengthBar.classList.add('fair');
                strengthText.textContent = 'Fair Password';
                break;
            case 3:
                strengthBar.classList.add('good');
                strengthText.textContent = 'Good Password';
                break;
            case 4:
            case 5:
                strengthBar.classList.add('strong');
                strengthText.textContent = 'Strong Password';
                break;
        }
    }

    displayFieldError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearFieldError(fieldName) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        if (errorElement && !errorElement.textContent) {
            return;
        }
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    updateFieldStatus(fieldName, isValid) {
        let field = this.fields[fieldName];
        
        if (fieldName === 'gender') {
            // For radio buttons, we don't add visual validation classes
            return;
        }
        
        if (isValid) {
            field.classList.remove('invalid');
            field.classList.add('valid');
        } else {
            field.classList.remove('valid');
            field.classList.add('invalid');
        }
    }

    validateForm() {
        let isFormValid = true;
        
        // Validate all fields
        Object.keys(this.fields).forEach(fieldName => {
            const fieldValid = this.validateField(fieldName);
            if (!fieldValid) {
                isFormValid = false;
            }
        });
        
        return isFormValid;
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Validate entire form
        const isValid = this.validateForm();
        
        if (isValid) {
            this.submitForm();
        } else {
            // Focus on first invalid field
            const firstInvalidField = this.form.querySelector('.invalid');
            if (firstInvalidField) {
                firstInvalidField.focus();
            }
        }
    }

    submitForm() {
        // Collect form data
        const formData = {
            fullName: this.fields.fullName.value.trim(),
            email: this.fields.email.value.trim(),
            phone: this.fields.phone.value.trim(),
            dob: this.fields.dob.value,
            password: this.fields.password.value,
            gender: Array.from(this.fields.gender).find(radio => radio.checked)?.value,
            country: this.fields.country.value,
            terms: this.fields.terms.checked
        };
        
        // Simulate form submission
        console.log('Registration Data:', formData);
        
        // Show success message
        this.showSuccessMessage();
    }

    showSuccessMessage() {
        this.form.style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        
        // Reset form after showing success (optional)
        setTimeout(() => {
            this.resetForm();
        }, 3000);
    }

    resetForm() {
        this.form.reset();
        this.form.style.display = 'block';
        document.getElementById('successMessage').style.display = 'none';
        
        // Clear all validation classes and error messages
        Object.keys(this.fields).forEach(fieldName => {
            if (fieldName !== 'gender') {
                this.fields[fieldName].classList.remove('valid', 'invalid');
            }
            this.clearFieldError(fieldName);
        });
        
        // Reset password strength meter
        const strengthBar = document.getElementById('strengthBar');
        const strengthText = document.getElementById('strengthText');
        strengthBar.className = 'strength-bar';
        strengthText.textContent = 'Password Strength';
    }
}

// Sample registration details for testing
const sampleData = {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
    dob: "1990-01-01",
    password: "SecurePass123!",
    gender: "male",
    country: "us"
};

// Initialize the registration form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = new RegistrationForm();
    
    // Add sample data button for testing (remove in production)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const fillSampleBtn = document.createElement('button');
        fillSampleBtn.textContent = 'Fill Sample Data';
        fillSampleBtn.type = 'button';
        fillSampleBtn.style.marginBottom = '20px';
        fillSampleBtn.addEventListener('click', () => {
            document.getElementById('fullName').value = sampleData.fullName;
            document.getElementById('email').value = sampleData.email;
            document.getElementById('phone').value = sampleData.phone;
            document.getElementById('dob').value = sampleData.dob;
            document.getElementById('password').value = sampleData.password;
            document.getElementById('confirmPassword').value = sampleData.password;
            document.getElementById(sampleData.gender).checked = true;
            document.getElementById('country').value = sampleData.country;
            document.getElementById('terms').checked = true;
            
            // Trigger password strength update
            registrationForm.updatePasswordStrength();
        });
        
        document.querySelector('.registration-form').insertBefore(fillSampleBtn, document.querySelector('form'));
    }
});