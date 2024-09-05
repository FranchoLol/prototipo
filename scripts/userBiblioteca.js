// bibliotecaAlum.js
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const span = document.getElementsByClassName('close')[0];

    document.querySelectorAll('.material-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const title = this.getAttribute('data-title');
            modalTitle.textContent = title;
            // Aquí puedes cargar contenido dinámico para el modal basado en el 'data-title'
            modalBody.innerHTML = `
                <table>
                    <tr>
                        <th>Material</th>
                        <th>Tamaño</th>
                    </tr>
                    <tr>
                        <td>Archivo adjuntado 1</td>
                        <td>153kb</td>
                    </tr>
                    <tr>
                        <td>Archivo adjuntado 2</td>
                        <td>759kb</td>
                    </tr>
                    <tr>
                        <td>Archivo adjuntado 3</td>
                        <td>1.7mb</td>
                    </tr>
                </table>
            `;
            modal.style.display = 'block';
        });
    });

    span.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});

document.querySelectorAll('.tablaBiblioteca tbody tr').forEach((row) => {
    const cells = row.querySelectorAll('td');

    cells[0].addEventListener('mouseover', () => {
        cells[0].style.backgroundColor = 'var(--Tcolor)';
        cells[1].style.backgroundColor = 'var(--Tcolor)';
    });
    cells[0].addEventListener('mouseout', () => {
        cells[0].style.backgroundColor = '';
        cells[1].style.backgroundColor = '';
    });

    cells[2].addEventListener('mouseover', () => {
        cells[2].style.backgroundColor = 'var(--Tcolor)';
        cells[3].style.backgroundColor = 'var(--Tcolor)';
    });
    cells[2].addEventListener('mouseout', () => {
        cells[2].style.backgroundColor = '';
        cells[3].style.backgroundColor = '';
    });

    cells[1].addEventListener('mouseover', () => {
        cells[0].style.backgroundColor = 'var(--Tcolor)';
        cells[1].style.backgroundColor = 'var(--Tcolor)';
    });
    cells[1].addEventListener('mouseout', () => {
        cells[0].style.backgroundColor = '';
        cells[1].style.backgroundColor = '';
    });

    cells[3].addEventListener('mouseover', () => {
        cells[2].style.backgroundColor = 'var(--Tcolor)';
        cells[3].style.backgroundColor = 'var(--Tcolor)';
    });
    cells[3].addEventListener('mouseout', () => {
        cells[2].style.backgroundColor = '';
        cells[3].style.backgroundColor = '';
    });
});

