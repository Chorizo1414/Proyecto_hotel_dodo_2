document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const usuario_id = payload.id; // Obtener el ID del usuario desde el token

    let reservationSummary = {
        usuario_id: usuario_id,  // Añadir el usuario_id a los datos de la reserva
        habitacion: null,
        paquete: null,
        fecha_entrada: null,
        fecha_salida: null,
        servicios_extras: [],
        total: 0
    };

    const urlParams = new URLSearchParams(window.location.search);
    const selectedRoom = urlParams.get('room');
    const selectedPackage = urlParams.get('package');

    // Mostrar la habitación o paquete seleccionado
    if (selectedRoom) {
        reservationSummary.habitacion = selectedRoom;
        document.getElementById('selectedRoomDisplay').textContent = `Has seleccionado la habitación: ${selectedRoom}`;
    } else if (selectedPackage) {
        reservationSummary.paquete = selectedPackage;
        document.getElementById('selectedRoomDisplay').textContent = `Has seleccionado el paquete: ${selectedPackage}`;
    }

    const nextBtns = document.querySelectorAll('.next-btn');
    nextBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            // Validar y almacenar fechas de entrada y salida
            if (currentStep === 1) {
                const checkinDate = document.getElementById('checkinDate').value;
                const checkoutDate = document.getElementById('checkoutDate').value;
                if (!checkinDate || !checkoutDate) {
                    alert('Por favor, selecciona las fechas de entrada y salida.');
                    return;
                }
                reservationSummary.fecha_entrada = checkinDate;
                reservationSummary.fecha_salida = checkoutDate;
            }

            // Capturar los servicios extras seleccionados
            if (currentStep === 2) {
                reservationSummary.servicios_extras = Array.from(document.querySelectorAll('input[name="extras"]:checked')).map(input => input.value);
            }

            goToStep(currentStep + 1);
        });
    });

    // Función para manejar el botón de Pagar
    const pagarBtn = document.getElementById('pagarButton');
    pagarBtn.addEventListener('click', () => {
        // Enviar los datos de la reserva a la API para que se guarde en la base de datos
        fetch('/api/reservas/crear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(reservationSummary)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Reserva guardada correctamente');
                window.location.href = '/misreservas.html'; // Redirigir a la página de "Mis Reservas"
            } else {
                alert('Error al guardar la reserva');
            }
        })
        .catch(error => {
            console.error('Error al guardar la reserva:', error);
        });
    });

    // Lógica para cerrar sesión
    document.getElementById('logoutButton').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
});
