// menu_dodo.js

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    const welcomeMessageDiv = document.getElementById('welcomeMessage');
    const logoutButton = document.getElementById('logoutButton');
    const userMenuArrow = document.getElementById('arrow');

    if (token) {
        // Decodificar el token para extraer el nombre de usuario
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el payload del token
        const username = payload.nombre_usuario;

        // Mostrar el mensaje de bienvenida y el botón de Cerrar Sesión
        welcomeMessageDiv.textContent = `¡Bienvenido, ${username}!`;
        logoutButton.style.display = 'block';  // Mostrar el botón de cerrar sesión
        userMenuArrow.style.display = 'inline'; // Mostrar flechita de menú de usuario
    } else {
        // Si no hay token, mostrar el botón de Iniciar Sesión
        welcomeMessageDiv.textContent = 'Iniciar Sesión';
        welcomeMessageDiv.style.cursor = 'pointer';  // Añadir cursor de pointer
        logoutButton.style.display = 'none';  // Ocultar el botón de cerrar sesión
        userMenuArrow.style.display = 'none'; // Ocultar flechita de menú de usuario

        // Redirigir a la página de inicio de sesión cuando se haga clic en "Iniciar Sesión"
        welcomeMessageDiv.addEventListener('click', () => {
            window.location.href = 'index.html';  // Página de inicio de sesión
        });
    }

    // Funcionalidad del botón de cerrar sesión
    logoutButton.addEventListener('click', () => {
        // Eliminar el token del localStorage
        localStorage.removeItem('token');

        // Redirigir al inicio de sesión
        window.location.href = 'index.html';
    });

    // Toggle del menú desplegable cuando se hace clic en la flechita (si el usuario está autenticado)
    if (token) {
        document.getElementById("arrow").addEventListener("click", function () {
            const userMenu = document.querySelector(".user-menu");
            userMenu.classList.toggle("show");
        });
    }
});
