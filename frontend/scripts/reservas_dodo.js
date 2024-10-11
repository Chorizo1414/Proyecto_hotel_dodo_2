document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const username = payload.nombre_usuario;
        document.getElementById('welcomeMessage').textContent = `¡Bienvenido, ${username}!`;
    } else {
        window.location.href = 'index.html';
    }

    const urlParams = new URLSearchParams(window.location.search);
    const selectedRoom = urlParams.get('room');
    const selectedPackage = urlParams.get('package');

    const prices = {
        rooms: {
            estandar: 19.99,
            deluxe: 29.99,
            suite: 49.99
        },
        services: {
            piscina: 5,
            jacuzzi: 5,
            sauna: 10,
            spa: 40,
            gimnasio: 5,
            comida_habitacion: 3,
            sala_entretenimiento: 10
        }
    };

    const formSteps = document.querySelectorAll('.form-step');
    const progressBar = document.querySelectorAll('.progress');
    const steps = document.querySelectorAll('.step');
    let currentStep = 0;

    let reservationSummary = {
        room: null,
        package: null,
        checkinDate: null,
        checkoutDate: null,
        extras: [],
        total: 0,
        nights: 1
    };

    if (selectedRoom) {
        reservationSummary.room = selectedRoom;
        const roomDisplay = document.getElementById('selectedRoomDisplay');
        roomDisplay.textContent = `Has seleccionado la habitación: ${selectedRoom.charAt(0).toUpperCase() + selectedRoom.slice(1)}`;
    } else if (selectedPackage) {
        reservationSummary.package = selectedPackage;
        const packageDisplay = document.getElementById('selectedRoomDisplay');
        packageDisplay.textContent = `Has seleccionado el paquete: ${selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1)}`;
    }

    function calculateNights() {
        const checkinDate = new Date(reservationSummary.checkinDate);
        const checkoutDate = new Date(reservationSummary.checkoutDate);
        const timeDifference = checkoutDate - checkinDate;
        const nights = timeDifference / (1000 * 3600 * 24);
        reservationSummary.nights = nights;
    }

    function calculateTotal() {
        let roomPricePerNight = reservationSummary.room ? prices.rooms[reservationSummary.room] : 0;
        let roomPriceTotal = roomPricePerNight * reservationSummary.nights;

        let servicesPrice = reservationSummary.extras.reduce((total, service) => {
            return total + prices.services[service];
        }, 0);

        reservationSummary.total = roomPriceTotal + servicesPrice;

        return { roomPricePerNight, roomPriceTotal, servicesPrice };
    }

    function showSummary() {
        calculateNights();
        const { roomPricePerNight, roomPriceTotal, servicesPrice } = calculateTotal();

        const summaryContainer = document.getElementById('summaryContainer');
        let servicesList = '';
        if (reservationSummary.extras.length > 0) {
            reservationSummary.extras.forEach(service => {
                servicesList += `<p>${service.charAt(0).toUpperCase() + service.slice(1)}: $${prices.services[service]}</p>`;
            });
        } else {
            servicesList = '<p>Ninguno seleccionado</p>';
        }

        summaryContainer.innerHTML = `
            <h4>Detalles de la Reserva</h4>
            <p>Habitación: ${reservationSummary.room ? reservationSummary.room.charAt(0).toUpperCase() + reservationSummary.room.slice(1) : 'Ninguna seleccionada'}</p>
            <p>Precio por noche: $${roomPricePerNight.toFixed(2)}</p>
            <p>Número de noches: ${reservationSummary.nights}</p>
            <p>Total por noches: $${roomPriceTotal.toFixed(2)}</p>
            <h4>Servicios Extras:</h4>
            ${servicesList}
            <h4>Total a Pagar: $${reservationSummary.total.toFixed(2)}</h4>
        `;
    }

    function goToStep(stepIndex) {
        formSteps[currentStep].classList.remove('active');
        currentStep = stepIndex;
        formSteps[currentStep].classList.add('active');
        if (stepIndex > 0) {
            progressBar[stepIndex - 1].style.backgroundColor = '#333';
            steps[stepIndex].classList.add('completed');
        }
        if (stepIndex === 3) { // Mostrar resumen en el último paso
            showSummary();
        }
    }

    const nextBtns = document.querySelectorAll('.next-btn');
    nextBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (currentStep === 1) { // Validar fechas
                const checkinDate = document.getElementById('checkinDate').value;
                const checkoutDate = document.getElementById('checkoutDate').value;
                if (!checkinDate || !checkoutDate) {
                    alert('Por favor, selecciona las fechas de entrada y salida.');
                    return;
                }
                reservationSummary.checkinDate = checkinDate;
                reservationSummary.checkoutDate = checkoutDate;
            }
            if (currentStep === 2) { // Capturar servicios extras
                reservationSummary.extras = Array.from(document.querySelectorAll('input[name="extras"]:checked')).map(input => input.value);
            }
            goToStep(currentStep + 1);
        });
    });

    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            if (index <= currentStep) {
                goToStep(index);
            }
        });
    });

    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });

    document.getElementById("arrow").addEventListener("click", function() {
        const userMenu = document.querySelector(".user-menu");
        userMenu.classList.toggle("show");
    });
});
