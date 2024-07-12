let login_form = document.querySelector('#login-form');
let usuario_input = document.querySelector('#login-usuario');
let pass_input = document.querySelector('#login-pass');

login_form.addEventListener('submit', (e) => {
    e.preventDefault();

    let usuario = usuario_input.value.trim();
    let contraseña = pass_input.value.trim();

    let usuarios_registrados = JSON.parse(localStorage.getItem('usuarios-registrados')) || [];

    let buscar_usuario = usuarios_registrados.find((user) => user.usuario === usuario && user.contraseña === contraseña);

    if (buscar_usuario) {
        window.location.href = 'main.html';
    } else {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Usuario inexistente",
            text: "Por favor, intenta con otro nombre de usuario o contraseña.",
        });
    }
});