document.addEventListener('DOMContentLoaded', () => {
    const authButton = document.getElementById('authButton');
    const registerButton = document.getElementById('registerButton');
    const userGreeting = document.getElementById('userGreeting');
    const rol = localStorage.getItem('rol');  // Obtener el rol del usuario desde localStorage

    // Variable para almacenar el tiempo límite de inactividad (30 segundos = 30000 ms)
    const INACTIVITY_LIMIT = 30000; // 30 segundos

    // Variable para almacenar el temporizador de inactividad
    let inactivityTimer;

    // Iniciar el temporizador de inactividad
    function startInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            alert('Sesión cerrada por inactividad.');
            logoutUser(); // Cerrar sesión por inactividad
        }, INACTIVITY_LIMIT);
    }

    // Reiniciar el temporizador de inactividad cada vez que el usuario interactúe
    function resetInactivityTimer() {
        startInactivityTimer();
    }

    // Comprobar si el usuario está logueado verificando el token en localStorage
    function isLoggedIn() {
        const token = localStorage.getItem('token');
        console.log("Token encontrado: ", token);
        return token !== null;
    }

    // Obtener el nombre de usuario desde localStorage
    function getUsername() {
        const username = localStorage.getItem('username') || 'Usuario';
        console.log("Nombre de usuario encontrado: ", username);
        return username;
    }

    // Función para mostrar u ocultar botones de admin
    function manageAdminButtons() {
        console.log("Verificando rol para ocultar o mostrar botones de admin.");
        const botonesAdmin = document.querySelectorAll('.admin-only');
        if (rol === 'admin') {
            botonesAdmin.forEach(boton => {
                boton.style.display = 'inline-block';
            });
        } else {
            botonesAdmin.forEach(boton => {
                boton.style.display = 'none';
            });
        }
    }

    // Actualizar el estado de autenticación
    function updateAuthUI() {
        console.log("Rol encontrado: ", rol);
        if (isLoggedIn()) {
            authButton.textContent = 'Cerrar Sesión';
            userGreeting.textContent = `Hola, ${getUsername()}!`;
            registerButton.style.display = 'none';
            manageAdminButtons();
        } else {
            authButton.textContent = 'Iniciar Sesión';
            userGreeting.textContent = '';
            registerButton.style.display = 'inline';
            manageAdminButtons();
        }
    }

    // Función para cerrar sesión
    function logoutUser() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('rol');
        alert('Cerraste sesión');
        window.location.href = 'login.html';
    }

    // Manejar el clic en el botón de autenticación
    authButton.addEventListener('click', () => {
        if (isLoggedIn()) {
            logoutUser();
        } else {
            window.location.href = 'login.html';
        }
    });

    // Inicializar el estado de la UI
    updateAuthUI();

    // Iniciar el temporizador de inactividad al cargar la página
    startInactivityTimer();

    // Reiniciar el temporizador cuando el usuario interactúe con la página
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keypress', resetInactivityTimer);
    document.addEventListener('click', resetInactivityTimer);
});