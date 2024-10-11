document.getElementById('loginForm').addEventListener('submit', function(event) {
    let valid = true;

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const generalError = document.getElementById('generalError');

    usernameError.textContent = '';
    passwordError.textContent = '';
    generalError.textContent = '';

    if (username.length < 5) {
        usernameError.textContent = 'El nombre de usuario debe tener al menos 5 caracteres.';
        valid = false;
    }

    if (password.length < 8) {
        passwordError.textContent = 'La contraseña debe tener al menos 8 caracteres.';
        valid = false;
    }

    if (!valid) {
        event.preventDefault();
        generalError.textContent = 'Por favor, corrija los errores antes de enviar.';
    }
});

document.getElementById('registerButton').addEventListener('click', function() {
    window.location.href = '/register';
});
