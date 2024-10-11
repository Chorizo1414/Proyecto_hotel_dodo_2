document.addEventListener('DOMContentLoaded', () => {
    // Manejar el formulario de inicio de sesión
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:3000/auth/signin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nombre_usuario: username, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = 'users.html'; // Redirigir a la página de usuarios
                } else {
                    document.getElementById('generalError').textContent = data.message || 'Error al iniciar sesión';
                }
            } catch (error) {
                console.error(error);
                document.getElementById('generalError').textContent = 'Error al conectar con el servidor';
            }
        });
    }

    // Manejar el botón de registro de usuarios
    const registerButton = document.getElementById('registerButton');
    if (registerButton) {
        registerButton.addEventListener('click', () => {
            window.location.href = 'register.html'; // Redirigir a la página de registro
        });
    }

    // Manejar el formulario de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre_usuario = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;

            try {
                const response = await fetch('http://localhost:3000/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nombre_usuario, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    alert(data.message || 'Usuario registrado exitosamente');
                    window.location.href = 'index.html'; // Redirigir a la página de inicio de sesión
                } else {
                    document.getElementById('registerGeneralError').textContent = data.message || 'El usuario ya existe';
                }
            } catch (error) {
                console.error(error);
                document.getElementById('registerGeneralError').textContent = 'Error al conectar con el servidor';
            }
        });
    }
});
