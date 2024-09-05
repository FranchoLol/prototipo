document.addEventListener('DOMContentLoaded', () => {
    const filtroMateria = document.getElementById('filtroMateria');
    const todosTbody = document.querySelectorAll('.tablaMaterias tbody');

    filtroMateria.addEventListener('change', (event) => {
        const valorSeleccionado = event.target.value;

        todosTbody.forEach(tbody => {
            if (valorSeleccionado === 'todos' || tbody.id === `materia-${valorSeleccionado}`) {
                tbody.style.display = '';
            } else {
                tbody.style.display = 'none';
            }
        });
    });
});

const secciones = {
    materias: document.querySelector('.seccionMaterias'),
    boletin: document.querySelector('.seccionBoletin')
};

const alternarSeccion = (seccion) => {
    Object.entries(secciones).forEach(([clave, elem]) => {
        if (clave === seccion) {
            elem.style.display = 'block';
            if (clave === 'materias') {
                resetearSeleccion();
                mostrarTodasLasMaterias();
            }
        } else {
            elem.style.display = 'none';
        }
    });
};

const resetearSeleccion = () => {
    const selectElement = document.querySelector('#filtroMateria');
    if (selectElement) {
        selectElement.value = 'todos';
    }
};

const mostrarTodasLasMaterias = () => {
    const todosTbody = document.querySelectorAll('.tablaMaterias tbody');
    todosTbody.forEach(tbody => {
        tbody.style.display = '';
    });
};

document.getElementById('seccionBoletinCel').addEventListener('click', () => {
    const estadoActual = secciones.boletin.style.display;
    alternarSeccion(estadoActual === 'block' ? '' : 'boletin');
});

document.getElementById('seccionMateriasCel').addEventListener('click', () => {
    const estadoActual = secciones.materias.style.display;
    alternarSeccion(estadoActual === 'block' ? '' : 'materias');
});

//ocultar las secciones inicialmente
//Object.values(secciones).forEach(elem => elem.style.display = 'none');

function actualizarTextoCuatrimestresYFinal() {
    const cuatriSpans = document.querySelectorAll('.boletinCuatri');
    const finalSpan = document.querySelector('.boletinFinal');

    if (window.matchMedia("(max-width: 562px)").matches) {
        cuatriSpans.forEach(span => span.textContent = 'C.');
        if (finalSpan) finalSpan.textContent = 'F.';
    } else if (window.matchMedia("(max-width: 675px)").matches) {
        cuatriSpans.forEach(span => span.textContent = 'Cuatr.');
        if (finalSpan) finalSpan.textContent = 'Fin.';
    } else {
        cuatriSpans.forEach(span => span.textContent = 'Cuatrimestre');
        if (finalSpan) finalSpan.textContent = 'Final';
    }
}

window.addEventListener('DOMContentLoaded', actualizarTextoCuatrimestresYFinal);
window.addEventListener('resize', actualizarTextoCuatrimestresYFinal);

// hover
document.querySelectorAll('.tablaMaterias tbody').forEach(tbody => {
    let nombreMateriaElement = null;
    let notasExtrasElements = [];

    tbody.addEventListener('mouseover', (event) => {
        if (event.target.closest('.notasExtras')) {
            const notasExtras = event.target.closest('.notasExtras');
            nombreMateriaElement = tbody.querySelector('.nombreMateria');
            if (nombreMateriaElement) {
                nombreMateriaElement.classList.add('highlightNombreMateria');
            }
            notasExtrasElements = [notasExtras];
            notasExtrasElements.forEach(row => {
                row.classList.add('highlight');
            });
        } else if (event.target.closest('.nombreMateria')) {
            nombreMateriaElement = event.target.closest('.nombreMateria');
            if (nombreMateriaElement) {
                nombreMateriaElement.classList.add('highlightNombreMateria');
            }
            notasExtrasElements = Array.from(tbody.querySelectorAll('.notasExtras'));
            notasExtrasElements.forEach(row => {
                row.classList.add('highlight');
            });
        }
    });

    tbody.addEventListener('mouseout', (event) => {
        if (nombreMateriaElement) {
            nombreMateriaElement.classList.remove('highlightNombreMateria');
        }
        if (notasExtrasElements.length > 0) {
            notasExtrasElements.forEach(row => {
                row.classList.remove('highlight');
            });
        }
        nombreMateriaElement = null;
        notasExtrasElements = [];
    });
});

//reducir notas
function abreviarFechasYNotas() {
    if (window.innerWidth <= 516) {
        document.querySelectorAll('.tablaMaterias th, .tablaMaterias td').forEach((element) => {
            // Abreviar "Nota" a "N."
            if (element.textContent.trim() === 'Nota') {
                element.textContent = 'N.';
            }
        });

        document.querySelectorAll('.tablaMaterias td').forEach((td) => {
            if (td.textContent.includes('/2024')) {
                td.textContent = td.textContent.replace('/2024', '/24');
            }
        });
    } else {
        document.querySelectorAll('.tablaMaterias th, .tablaMaterias td').forEach((element) => {
            if (element.textContent.trim() === 'N.') {
                element.textContent = 'Nota';
            }
        });

        document.querySelectorAll('.tablaMaterias td').forEach((td) => {
            if (td.textContent.includes('/24')) {
                td.textContent = td.textContent.replace('/24', '/2024');
            }
        });
    }
}
window.addEventListener('load', abreviarFechasYNotas);
window.addEventListener('resize', abreviarFechasYNotas);

function ajustarTabla() {
    if (window.innerWidth <= 476) {
        document.querySelectorAll('.tablaMaterias td').forEach((td) => {
            if (td.textContent.includes('/24')) {
                td.textContent = td.textContent.replace('/24', '');
            }
        });
    } else {
        document.querySelectorAll('.tablaMaterias td').forEach((td) => {
            if (/^\d{2}\/\d{2}$/.test(td.textContent)) {
                td.textContent += '/24';
            }
        });
    }
}
window.addEventListener('load', ajustarTabla);
window.addEventListener('resize', ajustarTabla);


