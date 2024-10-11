document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');

    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const username = payload.nombre_usuario;
        welcomeMessage.textContent = `¡Bienvenido, ${username}!`;
        loginButton.style.display = 'none';
        logoutButton.style.display = 'inline-block';
    } else {
        welcomeMessage.style.display = 'none';
        loginButton.style.display = 'inline-block';
        logoutButton.style.display = 'none';
    }

    // Función para obtener las habitaciones desde el servidor
async function fetchRooms() {
    try {
        const response = await fetch('http://localhost:3000/api/habitaciones');
        const rooms = await response.json();

        const roomsContainer = document.getElementById('roomsContainer');
        roomsContainer.innerHTML = ''; // Limpiar contenido previo

        rooms.forEach(room => {
            const roomElement = document.createElement('div');
            roomElement.classList.add('room');

            const imageSrc = room.imagen ? `data:image/jpeg;base64,${room.imagen}` : 'ruta/a/imagen/default.jpg';

            // Asegúrate de que estás utilizando el campo 'id'
            roomElement.innerHTML = `
                <img src="${imageSrc}" alt="${room.nombre}" class="room-img">
                <div class="room-info">
                    <h3>${room.nombre}</h3>
                    <p>${room.descripcion}</p>
                    <p><strong>Precio: $${room.precio} por noche</strong></p>
                    <button onclick="window.updateRoom(${room.id})">Actualizar</button>
                    <button onclick="window.deleteRoom(${room.id})">Eliminar</button>
                </div>
            `;
            roomsContainer.appendChild(roomElement);
        });
    } catch (error) {
        console.error('Error al obtener habitaciones:', error);
    }
}

    // Llamar a la función para obtener las habitaciones
    fetchRooms();

    // Función para actualizar una habitación
    window.updateRoom = async function(id) {
        const nombre = prompt("Nuevo nombre:");
        const descripcion = prompt("Nueva descripción:");
        const precio = prompt("Nuevo precio:");
    
        const fileInput = document.getElementById('roomImage'); // Asume que hay un input para cargar imágenes
        const imagen = fileInput.files.length > 0 ? await getBase64(fileInput.files[0]) : null;
    
        const roomData = { nombre, descripcion, precio, imagen };
    
        try {
            const response = await fetch(`http://localhost:3000/api/habitaciones/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(roomData)
            });
    
            if (response.ok) {
                alert('Habitación actualizada exitosamente');
                fetchRooms(); // Volver a cargar las habitaciones
            } else {
                const errorData = await response.text();  // Capturar el texto del error (si no es JSON)
                throw new Error(errorData);
            }
        } catch (error) {
            console.error('Error al actualizar habitación:', error);
            alert(`Error al actualizar habitación: ${error.message}`);
        }
    };
    

    window.deleteRoom = async function(id) {
        const confirmation = confirm("¿Estás seguro de que deseas eliminar esta habitación?");
        if (!confirmation) return;
    
        try {
            const response = await fetch(`http://localhost:3000/api/habitaciones/${id}`, {
                method: 'DELETE'
            });
    
            if (response.ok) {
                alert('Habitación eliminada exitosamente');
                fetchRooms(); // Volver a cargar las habitaciones
            } else {
                // Verifica si la respuesta es JSON antes de intentar convertirla
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    alert(`Error al eliminar habitación: ${errorData.error}`);
                } else {
                    // Si no es JSON, muestra un mensaje genérico
                    const errorText = await response.text();
                    console.error('Error inesperado:', errorText);
                    alert('Error al eliminar habitación, la respuesta no es JSON');
                }
            }
        } catch (error) {
            console.error('Error al eliminar habitación:', error);
        }
    };
    
    

    // Manejo del formulario de agregar habitación
    const addRoomForm = document.getElementById('addRoomForm');
    addRoomForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(addRoomForm);
        const roomData = {
            nombre: formData.get('nombre'),
            descripcion: formData.get('descripcion'),
            precio: formData.get('precio'),
            imagen: await getBase64(formData.get('imagen')) // Convertir la imagen a base64
        };

        try {
            const response = await fetch('http://localhost:3000/api/habitaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(roomData)
            });

            if (response.ok) {
                alert('Habitación agregada exitosamente');
                fetchRooms(); // Recargar las habitaciones para mostrar la nueva
                addRoomForm.reset(); // Limpiar el formulario
            } else {
                const errorData = await response.json();
                alert(`Error al agregar habitación: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error al agregar habitación:', error);
            alert('Error al agregar habitación. Inténtalo de nuevo.');
        }
    });

    // Función para convertir archivo de imagen a base64
    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]); // Tomar solo la parte base64
            reader.onerror = (error) => reject(error);
        });
    }
});
