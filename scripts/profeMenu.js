document.addEventListener('DOMContentLoaded', () => {
    const notificationsContainer = document.querySelector('#notificationsContainer');
    const textarea = document.querySelector('#notificationMessage');
    const clearButton = document.querySelector('#clearMessage');
    const sendButton = document.querySelector('#sendMessage');
    const alertContainer = document.querySelector('#alertContainer');
    const alertMessage = document.querySelector('#alertMessage');
    const alertCloseBtn = document.querySelector('#alertCloseBtn');
    const confirmContainer = document.querySelector('#confirmContainer');
    const confirmMessage = document.querySelector('#confirmMessage');
    const confirmYesBtn = document.querySelector('#confirmYesBtn');
    const confirmNoBtn = document.querySelector('#confirmNoBtn');
    
    let selectedCard = null;
    let editing = false;
    let editId = null;
    let confirmCallback = null;

    // Función para mostrar un mensaje de alerta
    function showAlert(message, callback = null) {
        alertMessage.textContent = message;
        alertContainer.classList.remove('hidden');
        confirmCallback = callback; // Guardar callback para confirmación
    }

    // Función para mostrar un mensaje de confirmación
    function showConfirm(message, callback) {
        confirmMessage.textContent = message;
        confirmContainer.classList.remove('hidden');
        confirmCallback = callback; // Guardar callback para confirmación
    }

    // Función para ocultar todos los contenedores de alerta
    function hideAlerts() {
        alertContainer.classList.add('hidden');
        confirmContainer.classList.add('hidden');
    }

    // Evento para el botón de cerrar en la alerta
    alertCloseBtn.addEventListener('click', hideAlerts);

    // Evento para el botón "Sí" en la confirmación
    confirmYesBtn.addEventListener('click', () => {
        if (confirmCallback) confirmCallback(true);
        hideAlerts();
    });

    // Evento para el botón "No" en la confirmación
    confirmNoBtn.addEventListener('click', () => {
        if (confirmCallback) confirmCallback(false);
        hideAlerts();
    });

    // Cargar notificaciones al inicio
    fetch('../jsons/notifications.json')
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(notification => notification.name === "Matias Ferrando");

            notificationsContainer.innerHTML = filteredData.map(notification => `
                <div class="notification-card" data-id="${notification.id}">
                    <div class="notification-part1">
                        <img src="${notification.img}" alt="Perfil" class="notification-image">
                        <div class="notification-info">
                            <p class="notification-name">${notification.name}</p>
                            <p class="notification-role">${notification.role}</p>
                        </div>
                    </div>
                    <div class="notification-part2">
                        <p class="notification-message">${notification.message}</p>
                    </div>
                    <div class="notification-part3">
                        <div class="notification-confirmation">
                            <button class="mark-as-read ${notification.read ? 'hidden' : ''}">Marcar como leído</button>
                            <p class="read-status ${notification.read ? '' : 'hidden'}">Leído</p>
                        </div>
                        <div class="notification-expanded">
                            <button class="toggle-read-status ${notification.hasMore ? '' : 'hidden'}">Leer más</button>
                            <button class="toggle-view hidden">Ver menos</button>
                        </div>
                    </div>
                    <div class="notification-part4">
                        <button class="notification-action-btn"><img src="../img/utilidades/engranaje.png" alt="Conf." class="btnCOnfiguracionDeMensaje"></button>
                    </div>
                </div>
            `).join('');
            addEventListenersToCards();
        })
        .catch(error => showAlert('Error al cargar las notificaciones: ' + error.message));

    // Función para agregar eventos a las tarjetas de notificación
    function addEventListenersToCards() {
        document.querySelectorAll('.notification-card').forEach(card => {
            const markAsRead = card.querySelector('.mark-as-read');
            const readStatus = card.querySelector('.read-status');
            const toggleReadStatus = card.querySelector('.toggle-read-status');
            const toggleView = card.querySelector('.toggle-view');
            const notiMessage = card.querySelector('.notification-message');
            const configButton = card.querySelector('.notification-action-btn');
            const maxHeight = '5.76em';

            markAsRead?.addEventListener('click', () => {
                markAsRead.classList.add('hidden');
                readStatus.classList.remove('hidden');
            });

            toggleReadStatus?.addEventListener('click', () => {
                toggleReadStatus.classList.add('hidden');
                toggleView.classList.remove('hidden');
                Object.assign(notiMessage.style, {
                    maxHeight: 'none',
                    webkitLineClamp: 'unset'
                });
            });

            toggleView?.addEventListener('click', () => {
                toggleReadStatus.classList.remove('hidden');
                toggleView.classList.add('hidden');
                Object.assign(notiMessage.style, {
                    maxHeight,
                    webkitLineClamp: '4'
                });
            });

            configButton?.addEventListener('click', () => {
                if (selectedCard) {
                    selectedCard.querySelector('.notification-message').style.color = ''; // Reset previous card color
                }
                selectedCard = card; // Set the selected card
                const messageText = notiMessage.innerHTML.replace(/<br>/g, '\n'); // Replace <br> with newlines
                textarea.value = messageText;
                notiMessage.style.color = 'gray'; // Change text color to gray
                editing = true; // Activate edit mode
                editId = card.getAttribute('data-id'); // Save the notification ID for editing
            });
        });
    }

    // Evento para el botón de eliminar
    clearButton.addEventListener('click', () => {
        if (editing && selectedCard) {
            showConfirm('¿Estás seguro de que deseas eliminar esta notificación?', confirmed => {
                if (confirmed) {
                    const notificationId = selectedCard.getAttribute('data-id');

                    fetch('../jsons/notifications.json')
                        .then(response => response.json())
                        .then(data => {
                            const updatedData = data.filter(notification => notification.id !== notificationId);

                            return fetch('../jsons/notifications.json', {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(updatedData)
                            });
                        })
                        .then(response => response.json())
                        .then(() => {
                            selectedCard.remove();
                            textarea.value = '';
                            selectedCard = null;
                            editing = false;
                        })
                        .catch(error => showAlert('Error al eliminar la notificación: ' + error.message));
                }
            });
        } else {
            textarea.value = '';
            if (selectedCard) {
                selectedCard.querySelector('.notification-message').style.color = '';
                selectedCard = null;
                editing = false;
            }
        }
    });

    // Evento para el botón de enviar
    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim().replace(/\n/g, '<br>');
        if (message) {
            if (editing && selectedCard) {
                const notiMessage = selectedCard.querySelector('.notification-message');
                notiMessage.innerHTML = message;
                notiMessage.style.color = '';

                fetch('../jsons/notifications.json')
                    .then(response => response.json())
                    .then(data => {
                        const updatedData = data.map(notification =>
                            notification.id === editId
                                ? { ...notification, message: message }
                                : notification
                        );
                        return fetch('../jsons/notifications.json', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updatedData)
                        });
                    })
                    .then(() => {
                        selectedCard = null;
                        editing = false;
                        textarea.value = '';
                    })
                    .catch(error => showAlert('Error al actualizar la notificación: ' + error.message, null));
            } else {
                const newNotification = {
                    id: Date.now().toString(),
                    img: "../img/perfiles/FerrandoMatias.jpg",
                    name: "Matias Ferrando",
                    role: "Profesor",
                    message: message,
                    hasMore: message.split('<br>').length > 4,
                    read: false
                };

                fetch('../jsons/notifications.json')
                    .then(response => response.json())
                    .then(data => {
                        data.push(newNotification);
                        return fetch('../jsons/notifications.json', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        });
                    })
                    .then(() => {
                        notificationsContainer.innerHTML += `
                            <div class="notification-card" data-id="${newNotification.id}">
                                <div class="notification-part1">
                                    <img src="${newNotification.img}" alt="Perfil" class="notification-image">
                                    <div class="notification-info">
                                        <p class="notification-name">${newNotification.name}</p>
                                        <p class="notification-role">${newNotification.role}</p>
                                    </div>
                                </div>
                                <div class="notification-part2">
                                    <p class="notification-message">${message}</p>
                                </div>
                                <div class="notification-part3">
                                    <div class="notification-confirmation">
                                        <button class="mark-as-read">Marcar como leído</button>
                                        <p class="read-status hidden">Leído</p>
                                    </div>
                                    <div class="notification-expanded">
                                        <button class="toggle-read-status ${newNotification.hasMore ? '' : 'hidden'}">Leer más</button>
                                        <button class="toggle-view hidden">Ver menos</button>
                                    </div>
                                </div>
                                <div class="notification-part4">
                                    <button class="notification-action-btn"><img src="../img/util/engranaje.png" alt="Conf." class="btnCOnfiguracionDeMensaje"></button>
                                </div>
                            </div>
                        `;
                        addEventListenersToCards();
                        textarea.value = '';
                    })
                    .catch(error => showAlert('Error al guardar la notificación: ' + error.message, null));
            }
        } else {
            showAlert('Por favor, ingresa un mensaje.', null);
        }
    });
});
