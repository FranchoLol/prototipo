//deslizar el header
function adjustMenu() {
    const menuHeader = document.getElementById('menuHeader');
    const checkbox = document.getElementById('ckbMenuHeader');
    
    if (window.innerWidth < 840) {
        menuHeader.style.transform = checkbox.checked ? 'translateX(0)' : 'translateX(calc(-100% + var(--Wheader)))';
    } else {
        menuHeader.style.transform = 'translateX(0)';
    }
}
document.getElementById('ckbMenuHeader').addEventListener('change', e => {
    adjustMenu();
});
window.addEventListener('resize', adjustMenu);
adjustMenu();

//regresar al login
document.querySelector('#btnExit').onclick = () => location.href = '../../../index.html';

