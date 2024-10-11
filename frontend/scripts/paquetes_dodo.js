document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const loginButton = document.getElementById('loginButton'); // Botón de iniciar sesión
    const logoutButton = document.getElementById('logoutButton'); // Botón de cerrar sesión

    if (token) {
        // Si el token existe, extraer el nombre del usuario
        const payload = JSON.parse(atob(token.split('.')[1]));
        const username = payload.nombre_usuario;
        welcomeMessage.textContent = `¡Bienvenido, ${username}!`;
        loginButton.style.display = 'none'; // Ocultar el botón de iniciar sesión
        logoutButton.style.display = 'inline-block'; // Mostrar el botón de cerrar sesión
    } else {
        // Si no hay token, ocultar la etiqueta de "Bienvenido"
        welcomeMessage.style.display = 'none';
        loginButton.style.display = 'inline-block'; // Mostrar el botón de iniciar sesión
        logoutButton.style.display = 'none'; // Ocultar el botón de cerrar sesión
    }

    const reservePackageButtons = document.querySelectorAll('.reserve-package-btn');
    reservePackageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const packageType = button.getAttribute('data-package');
            // Redirigir a la página de reservas con el paquete seleccionado
            window.location.href = `reservas.html?package=${packageType}`;
        });
    });

    // Manejo de cerrar sesión
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html'; // Redirigir al inicio después de cerrar sesión
    });

    // Manejo del menú desplegable de usuario
    document.getElementById("arrow").addEventListener("click", function() {
        const userMenu = document.querySelector(".user-menu");
        userMenu.classList.toggle("show");
    });
});
