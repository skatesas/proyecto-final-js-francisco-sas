let registro_form = document.querySelector('#registro-form');
let usuario_input = document.querySelector('#registro-usuario');
let pass_input = document.querySelector('#registro-pass');
let email_input = document.querySelector('#registro-email');

registro_form.addEventListener('submit', (e) => {
    e.preventDefault();

    let usuario = usuario_input.value;
    let contraseña = pass_input.value;
    let email = email_input.value;

    let user = {
        usuario: usuario,
        contraseña: contraseña,
        email: email,
    }

    let usuarios_registrados = JSON.parse(localStorage.getItem('usuarios-registrados')) || [];

    let usuario_existente = usuarios_registrados.find((user) => user.usuario === usuario || user.email === email);

    if (usuario_existente) {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Usuario existente",
            text: "Por favor, intenta con otro nombre de usuario o correo electronico.",
        });
    } else {
        usuarios_registrados.push(user);
        localStorage.setItem('usuarios-registrados', JSON.stringify(usuarios_registrados));
        Swal.fire({
            position: "center",
            icon: "success",
            title: "¡Registro exitoso!",
            timer: 2000
        });
    }
});