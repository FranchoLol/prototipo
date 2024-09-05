const notas = {
    '2024-08-28': [
        { categoria: 'Examen', contenido: 'Funciones logaritmicas - Matemática' }
    ],
    '2024-08-30': [
        { categoria: 'Act.', contenido: 'Entrega de bolsones' }
    ],
    '2024-09-02': [
        { categoria: 'TP', contenido: 'Vaca muerta - Geografía' }
    ],
    '2024-09-06': [
        { categoria: 'TP', contenido: 'Prototipos - Modelo y sistemas' }
    ],
    '2024-09-10': [
        { categoria: 'Examen', contenido: 'Complemento A1 y A2 - Sistemas digitales' }
    ],
    '2024-09-20': [
        { categoria: 'Act.', contenido: 'Torneo interno de voley' }
    ]
};

const asistencia = {
    //mayo
    '2024-03-07': 'T',
    '2024-03-12': 'P;A',
    //junio
    '2024-04-24': 'A;A',
    '2024-04-25': 'A',
    //julio
    '2024-05-06': 'P;T',
    '2024-05-15': 'P;T',
    '2024-05-17': 'A',
    '2024-05-30': 'A',
    //agosto
    '2024-06-04': 'A;P',
    '2024-06-06': 'A',
    //septiembre
    '2024-09-02': 'P;P', // // // //automatizar
    '2024-09-03': 'P;P',
    '2024-09-04': 'P;P',
    '2024-09-05': 'P'
};

const mesesExcluidos = [0, 1, 8, 9, 10, 11]; // Enero, Febrero, Septiembre, Octubre, Noviembre, Diciembre
const categorias = ['TP', 'Examen', 'Oral', 'Exposición', 'Act.'];
const feriados = ['2024-08-15', '2024-10-12', '2024-12-25'];
const diasParo = ['2024-05-01', '2024-06-20', '2024-09-10', '2024-09-11'];

let fechaActual = new Date();

function renderizarCalendario() {
    const calendario = document.getElementById('calendarioPart3');
    const indicadorMes = document.getElementById('mesIndicador');
    calendario.innerHTML = '';

    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();
    const primerDia = new Date(año, mes, 0);
    const ultimoDiaMes = new Date(año, mes + 1, 0).getDate();
    const ultimoDiaMesAnterior = new Date(año, mes, 0).getDate();

    indicadorMes.textContent = `${fechaActual.toLocaleString('es-ES', { month: 'long' })} ${año}`;

    for (let i = primerDia.getDay(); i > 0; i--) {
        calendario.innerHTML += `<div class="calendarioDias semana"><span class="numeroDia">${ultimoDiaMesAnterior - i + 1}</span></div>`;
    }

    for (let dia = 1; dia <= ultimoDiaMes; dia++) {
        const fecha = `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        const notasDia = notas[fecha] || [];
        let marcaAsistencia = asistencia[fecha] || '';

        const fechaObjeto = new Date(año, mes, dia);
        const esFinDeSemana = fechaObjeto.getDay() === 0 || fechaObjeto.getDay() === 6;
        const esFeriadoOParo = feriados.includes(fecha) || diasParo.includes(fecha);
        const esDiaConDobleAsistencia = fechaObjeto.getDay() === 1 || fechaObjeto.getDay() === 2 || fechaObjeto.getDay() === 3; // Lunes, Martes, Miércoles

        // Actualiza la asistencia para los días con doble asistencia
        if (!esFeriadoOParo && !esFinDeSemana && !mesesExcluidos.includes(mes) && esDiaConDobleAsistencia && !marcaAsistencia) {
            marcaAsistencia = 'P;P';
        } else if (!esFeriadoOParo && !esFinDeSemana && !mesesExcluidos.includes(mes) && !marcaAsistencia) {
            marcaAsistencia = 'P';
        }

        let asistenciaElemento = '';
        if (marcaAsistencia.includes(';')) {
            const [asistencia1, asistencia2] = marcaAsistencia.split(';');
            asistenciaElemento = `
                <span class="asistencia">
                    <span class="asistenciaTaller ${asistencia1}"><sup>${asistencia1}</sup></span>
                    <span class="barra">/</span>
                    <span class="asistenciaTeorico ${asistencia2}"><sub>${asistencia2}</sub></span>
                </span>
            `;
        } else if (marcaAsistencia) {
            asistenciaElemento = `<span class="asistencia ${marcaAsistencia}">${marcaAsistencia}</span>`;
        }

        const categoriasNotas = notasDia.length > 0 ? notasDia.map(n => n.categoria).join(', ') : '';

        const diaFeriadoDiaParo = esFeriadoOParo ? 'feriado' : '';

        calendario.innerHTML += `
            <div class="calendarioDias ${esFinDeSemana ? 'semana' : ''}" data-fecha="${fecha}">
                <span class="numeroDia ${diaFeriadoDiaParo}">${dia}</span>
                <span class="notaDia">${categoriasNotas}</span>
                ${asistenciaElemento}
            </div>
        `;
    }
}


function esFeriadoOParo(fecha) {
    return feriados.includes(fecha) || diasParo.includes(fecha);
}

function cambiarMes(offset) {
    fechaActual.setMonth(fechaActual.getMonth() + offset);
    renderizarCalendario();
}

document.getElementById('mesAnterior').addEventListener('click', () => {
    if (fechaActual.getFullYear() > 2024 || fechaActual.getMonth() > 0) {
        cambiarMes(-1);
    }
});

document.getElementById('mesSiguinte').addEventListener('click', () => {
    if (fechaActual.getFullYear() < 2024 || fechaActual.getMonth() < 11) {
        cambiarMes(1);
    }
});

document.getElementById('calendarioPart3').addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('calendarioDias')) {
        e.target.classList.add('expandirNotaDia');
        const fecha = e.target.getAttribute('data-fecha');
        const nota = notas[fecha];
        const notaElemento = e.target.querySelector('.notaDia');

        if (nota && nota.length > 0 && notaElemento) {
            const contenidoNota = nota.map(n => `${n.categoria}: ${n.contenido}`).join(', ');
            notaElemento.innerHTML = contenidoNota;
        }
    }
});

document.getElementById('calendarioPart3').addEventListener('mouseout', (e) => {
    if (e.target.classList.contains('calendarioDias')) {
        e.target.classList.remove('expandirNotaDia');
        const fecha = e.target.getAttribute('data-fecha');
        const nota = notas[fecha];
        const notaElemento = e.target.querySelector('.notaDia');

        if (notaElemento) {
            if (nota && nota.length > 0) {
                const categoriasNota = nota.map(n => n.categoria).join(', ');
                notaElemento.innerHTML = categoriasNota;
            } else {
                notaElemento.innerHTML = '';
            }
        }
    }
});

renderizarCalendario();

const modal = document.getElementById('noteModal');
const categoriaSelect = document.getElementById('categorySelect');
const contenidoNotaInput = document.getElementById('noteContent');
const cerrarModal = document.querySelector('.modal .close');
const guardarNotaBtn = document.getElementById('saveNoteBtn');

function abrirModal(fecha) {
    const listaNotas = document.getElementById('noteList');
    const notasSeleccionadas = notas[fecha] || [];
    listaNotas.innerHTML = '';

    notasSeleccionadas.forEach((nota, indice) => {
        const notaElemento = document.createElement('div');
        notaElemento.classList.add('note-item');
        notaElemento.innerHTML = `
            <strong>${nota.categoria}:</strong> ${nota.contenido}
            <button class="deleteNoteBtn" data-fecha="${fecha}" data-indice="${indice}">Eliminar</button>
        `;
        listaNotas.appendChild(notaElemento);
    });

    guardarNotaBtn.setAttribute('data-fecha', fecha);
    modal.classList.remove('oculto');
}

guardarNotaBtn.addEventListener('click', () => {
    const fecha = guardarNotaBtn.getAttribute('data-fecha');
    const categoria = categoriaSelect.value;
    const contenido = contenidoNotaInput.value;

    if (categoria && contenido) {
        if (!notas[fecha]) {
            notas[fecha] = [];
        }
        notas[fecha].push({ categoria, contenido });
        renderizarCalendario();
        cerrarModalFn();
    }
});

document.getElementById('noteList').addEventListener('click', (e) => {
    if (e.target.classList.contains('deleteNoteBtn')) {
        const fecha = e.target.getAttribute('data-fecha');
        const indice = e.target.getAttribute('data-indice');

        if (notas[fecha]) {
            notas[fecha].splice(indice, 1);
            if (notas[fecha].length === 0) {
                delete notas[fecha];
            }
            renderizarCalendario();
            abrirModal(fecha);
        }
    }
});

function cerrarModalFn() {
    modal.classList.add('oculto');
}

cerrarModal.addEventListener('click', cerrarModalFn);
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        cerrarModalFn();
    }
});

document.getElementById('calendarioPart3').addEventListener('click', (e) => {
    if (e.target.classList.contains('calendarioDias')) {
        const fecha = e.target.getAttribute('data-fecha');
        abrirModal(fecha);
    }
});



document.addEventListener('DOMContentLoaded', () => {
    const secciones = {
        notificaciones: document.querySelector('.seccionNotificaciones'),
        calendario: document.querySelector('.seccionCalendario')
    };

    // Función para actualizar la visibilidad de las secciones según el ancho de la pantalla
    const actualizarVisibilidad = () => {
        const anchoPantalla = window.innerWidth;

        if (anchoPantalla >= 840) {
            // Mostrar todas las secciones en pantallas grandes
            Object.values(secciones).forEach(elem => elem.style.display = 'block');
        } else {
            // Mantener visible solo la sección que estaba abierta en pantallas pequeñas
            Object.entries(secciones).forEach(([clave, elem]) => {
                if (elem.style.display === 'block') {
                    elem.style.display = 'block';
                } else {
                    elem.style.display = 'none';
                }
            });
        }
    };

    // Función para alternar la visibilidad de las secciones en pantallas pequeñas
    const alternarSeccion = (seccion) => {
        const anchoPantalla = window.innerWidth;

        if (anchoPantalla < 840) {
            Object.entries(secciones).forEach(([clave, elem]) => {
                elem.style.display = clave === seccion ? 'block' : 'none';
            });
        }
    };

    // Listeners para los botones de alternar secciones en pantallas pequeñas
    document.getElementById('seccionNotificacionesCel').addEventListener('click', () => {
        const estadoActual = secciones.notificaciones.style.display;
        alternarSeccion(estadoActual === 'block' ? '' : 'notificaciones');
    });

    document.getElementById('seccionCalendarioCel').addEventListener('click', () => {
        const estadoActual = secciones.calendario.style.display;
        alternarSeccion(estadoActual === 'block' ? '' : 'calendario');
    });

    // Inicializar visibilidad al cargar la página
    actualizarVisibilidad();
    // Actualizar visibilidad al cambiar el tamaño de la ventana
    window.addEventListener('resize', actualizarVisibilidad);
});

