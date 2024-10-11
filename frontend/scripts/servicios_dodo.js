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

    // Función para obtener los servicios desde el servidor
    async function fetchServices() {
        try {
            const response = await fetch('http://localhost:3000/api/servicios');
            const services = await response.json();

            console.log(services); // Agregar este log para verificar los datos

            const servicesContainer = document.getElementById('servicesContainer');
            servicesContainer.innerHTML = ''; // Limpiar contenido previo

            // Iterar sobre los servicios y agregarlos al DOM
            services.forEach(service => {
                console.log(`Servicio: ${service.nombre}, Precio: ${service.precio}`); // Verificar si el precio está presente

                const serviceElement = document.createElement('div');
                serviceElement.classList.add('service-card');

                // Verifica si la imagen existe, de lo contrario usa una imagen por defecto
                const imageSrc = service.imagen ? `data:image/jpeg;base64,${service.imagen}` : 'ruta/a/imagen/default.jpg';

                // Verifica si el precio está definido, si no, mostrar "No disponible"
                const precio = service.precio !== undefined && service.precio !== null ? `$${service.precio}` : 'No disponible';

                serviceElement.innerHTML = `
                    <img src="${imageSrc}" alt="${service.nombre}" class="service-img">
                    <div class="service-info">
                        <h3>${service.nombre}</h3>
                        <p>${service.descripcion}</p>
                        <p class="price">Precio: ${precio}</p> <!-- Mostrar el precio o "No disponible" -->
                    </div>
                `;
                servicesContainer.appendChild(serviceElement);
            });
        } catch (error) {
            console.error('Error al obtener los servicios:', error);
        }
    }

    // Llamar a la función para obtener los servicios
    fetchServices();

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
