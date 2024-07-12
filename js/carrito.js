let productos_en_carrito = JSON.parse(localStorage.getItem("productos-en-carrito"));

const contenedor_carrito_vacio = document.querySelector("#carrito-vacio");
const contenedor_carrito_productos = document.querySelector("#carrito-productos");
const contenedor_carrito_acciones = document.querySelector("#carrito-acciones");
const numerito = document.querySelector("#cantidad");
let botones_eliminar = document.querySelectorAll(".carrito-eliminar");
const boton_vaciar_carrito = document.querySelector("#carrito-acciones-vaciar");
const contenedor_total = document.querySelector("#total");
const boton_comprar = document.querySelector("#carrito-acciones-comprar");
const boton_cerrar_sesion = document.querySelector(".cerrar-sesion")

function cargar_productos_carrito() {
    if (productos_en_carrito && productos_en_carrito.length > 0) {

        contenedor_carrito_vacio.classList.add("disabled");
        contenedor_carrito_productos.classList.remove("disabled");
        contenedor_carrito_acciones.classList.remove("disabled");
    
        contenedor_carrito_productos.innerHTML = "";
    
        productos_en_carrito.forEach(producto => {
    
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-img" src="${producto.img}" alt="${producto.nombre}">
                <div class="carrito-nombre">
                    <small>Nombre</small>
                    <h3>${producto.nombre}</h3>
                </div>
                <div class="carrito-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button id="${producto.id}" class="carrito-eliminar"><i class="bi bi-x-circle-fill"></i></button>
            `;
            contenedor_carrito_productos.append(div);
        })
        actualizar_numerito();
    } else {
        contenedor_carrito_vacio.classList.remove("disabled");
        contenedor_carrito_productos.classList.add("disabled");
        contenedor_carrito_acciones.classList.add("disabled");
    }
    actualizar_botones_eliminar();
    actualizar_total();
}

cargar_productos_carrito();

function actualizar_botones_eliminar() {
    botones_eliminar = document.querySelectorAll(".carrito-eliminar");
    botones_eliminar.forEach(boton => {
        boton.addEventListener("click", eliminar_del_carrito);
    });
}

function eliminar_del_carrito(e) {
    const id_boton = e.currentTarget.id;
    const index = productos_en_carrito.findIndex(producto => producto.id === id_boton);
    productos_en_carrito.splice(index, 1);
    cargar_productos_carrito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productos_en_carrito));
    actualizar_numerito();
}

boton_vaciar_carrito.addEventListener("click", vaciar_carrito);

function vaciar_carrito () {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "botones-swal",
            cancelButton: "botones-swal",
        },
    buttonsStyling: false
    });
    return swalWithBootstrapButtons.fire({
        title: "Vaciar el Carrito",
        text: "¿Estas seguro de que deseas quitar lo que hay en el carrito?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, vaciar",
        cancelButtonText: "Cancelar",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            productos_en_carrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productos_en_carrito));
            cargar_productos_carrito();
            actualizar_numerito();
            swalWithBootstrapButtons.fire({
                title: "Carrito vaciado.",
                text: "Quitaste todo lo que habia en el carrito.",
                icon: "success"
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
                title: "Cancelado",
                text: "¡Puedes seguir comprando!",
                icon: "error"
            });
        }
    });
}

function actualizar_total() {
    const total_calculado = productos_en_carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${total_calculado}`;
}

function actualizar_numerito() {
    let nuevo_numerito = productos_en_carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevo_numerito;
}

boton_comprar.addEventListener("click", comprar_carrito);

function comprar_carrito () {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "botones-swal",
            cancelButton: "botones-swal",
        },
    buttonsStyling: false
    });
    return swalWithBootstrapButtons.fire({
        title: "Comprar Carrito",
        text: "¿Estas seguro de que deseas comprar lo que hay en el carrito?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Si, comprar",
        cancelButtonText: "Cancelar",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            productos_en_carrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productos_en_carrito));
            contenedor_carrito_vacio.classList.remove("disabled");
            contenedor_carrito_productos.classList.add("disabled");
            contenedor_carrito_acciones.classList.add("disabled");
            actualizar_numerito();
            swalWithBootstrapButtons.fire({
                title: "¡Gracias por tu compra!",
                text: "Te esperamos nuevamente.",
                icon: "success"
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
                title: "Cancelado",
                text: "¡Puedes seguir comprando!",
                icon: "error"
            });
        }
    });
}

boton_cerrar_sesion.addEventListener("click", cerrar_sesion);

function cerrar_sesion() {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "botones-swal",
            cancelButton: "botones-swal",
        },
    buttonsStyling: false
    });
    return swalWithBootstrapButtons.fire({
        title: "Cerrar sesion",
        text: "¿Estas seguro de que deseas cerrar sesion? Se borrara todo el progreso.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Si, cerrar sesion",
        cancelButtonText: "Cancelar",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            productos_en_carrito.length = 0;
            localStorage.removeItem("productos-en-carrito");
            contenedor_carrito_vacio.classList.remove("disabled");
            contenedor_carrito_productos.classList.add("disabled");
            contenedor_carrito_acciones.classList.add("disabled");
            window.location.href = "./login.html";
            swalWithBootstrapButtons.fire({
                title: "Sesion cerrada.",
                text: "Has cerrado sesion correctamente.",
                icon: "success"
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
                title: "Cancelado",
                text: "¡Puedes seguir comprando!",
                icon: "error"
            });
        }
    });
}
