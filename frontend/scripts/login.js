// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerButton = document.getElementById('registerButton');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            // Realiza una solicitud POST al endpoint de inicio de sesión
            const response = await fetch('http://localhost:3000/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre_usuario: username,
                    password: password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                // Guarda el token en el localStorage
                localStorage.setItem('token', result.token);
                alert('Inicio de sesión exitoso');
                // Redirige a la página de usuarios u otra página deseada
                window.location.href = 'menu_dodo.html'; // Cambia la URL según tu necesidad
            } else {
                // Maneja los errores de autenticación
                document.getElementById('generalError').textContent = result.message || 'Usuario o password incorrecta';
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            document.getElementById('generalError').textContent = 'Usuario o password incorrecta';
        }
    });

    registerButton.addEventListener('click', () => {
        window.location.href = 'register.html'; // Cambia la URL de registro según tu configuración
    });
});