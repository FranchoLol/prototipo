// accedo al perfil del profe o del usuario dependiendo del contenido del input
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim().toLowerCase();
    const profes = ['profe', 'profes', 'profesor', 'ferrando', 'matias', 'ferrando matias', 'matias ferrando'];
    window.location.href = profes.includes(username) ? 'pages/menuProfe.html' : 'pages/menuAlum.html';
});
// ocultar y desocultar la contraseña
document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;

    this.classList.toggle('show-password');
});