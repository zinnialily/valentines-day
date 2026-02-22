const CORRECT_PASSWORD = 'your-password-here';
const TIMELINE_PAGE = 'timeline.html';
const ERROR_MESSAGE_DURATION = 3000;

const passwordForm = document.getElementById('passwordForm');
const passwordInput = document.getElementById('passwordInput');
const errorMessage = document.getElementById('errorMessage');

passwordForm.addEventListener('submit', handlePasswordSubmit);
passwordInput.addEventListener('input', clearError);

function handlePasswordSubmit(event) {
    event.preventDefault();

    const enteredPassword = passwordInput.value.trim();

    if (!enteredPassword) {
        showError('Please enter a password');
        return;
    }

    if (enteredPassword === CORRECT_PASSWORD) {
        redirectToTimeline();
    } else {
        showError('Incorrect password. Please try again.');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');

    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, ERROR_MESSAGE_DURATION);
}

function clearError() {
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
}

function redirectToTimeline() {
    window.location.href = TIMELINE_PAGE;
}