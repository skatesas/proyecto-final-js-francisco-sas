let productos = [];

fetch("./json/productos.json")
.then(response => response.json())
.then(datos => {
    productos = datos;
    cargar_productos(productos);
})
.catch(error => console.log(error));

const contenedor_productos = document.querySelector("#contenedor-productos");
const botones_categorias = document.querySelectorAll(".boton-categoria");
const titulo_principal = document.querySelector("h2");
let producto_agregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#cantidad");
const boton_cerrar_sesion = document.querySelector(".cerrar-sesion");
const boton_buscar =document.querySelector("#boton-buscar");

boton_buscar.addEventListener("click", buscar_productos);

function buscar_productos() {
    const buscador = document.querySelector("#buscador");
    const palabra_input = buscador.value.trim().toLowerCase();
    const productos_filtrados = productos.filter(producto => {
        const nombre_producto = producto.nombre.toLowerCase();
        return nombre_producto.includes(palabra_input);
    });
    cargar_productos(productos_filtrados);
}

function cargar_productos(productos_elegidos) {
    contenedor_productos.innerHTML = "";
    productos_elegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-img" src="${producto.img}" alt="${producto.nombre}">
            <div class="producto-propiedades">
                <h3 class="producto-nombre">"${producto.nombre}"</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button
                class="producto-agregar" id="${producto.id}">Agregar al carrito</button>
            </div>
        `;
        contenedor_productos.append(div);
    })
    actualizar_producto_agregar();
}
cargar_productos(productos);

botones_categorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botones_categorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id!= "todos") {
            const producto_categoria = productos.find(producto => producto.categoria === e.currentTarget.id);
            titulo_principal.innerText = producto_categoria.categoria;
            const productos_boton = productos.filter(producto => producto.categoria === e.currentTarget.id);
            cargar_productos(productos_boton);
        } else {
            titulo_principal.innerText = "Todos los Productos";
            cargar_productos(productos);
        }
        
    })
})

function actualizar_producto_agregar() {
    producto_agregar = document.querySelectorAll(".producto-agregar");
    producto_agregar.forEach(boton => {
        boton.addEventListener("click", agregar_al_carrito);
    });
}

let productos_en_carrito;

let productos_en_carrito_ls = localStorage.getItem("productos-en-carrito");
if (productos_en_carrito_ls) {
    productos_en_carrito = JSON.parse(productos_en_carrito_ls);
    actualizar_numerito();
} else {
    productos_en_carrito = [];
}


function agregar_al_carrito(e) {
    const id_boton = e.currentTarget.id;
    const producto_agregado = productos.find(producto => producto.id === id_boton);

    if(productos_en_carrito.some(producto => producto.id === id_boton)) {
        const index = productos_en_carrito.findIndex(producto => producto.id === id_boton);
        productos_en_carrito[index].cantidad++;
    } else {
        producto_agregado.cantidad = 1;
        productos_en_carrito.push(producto_agregado);
    }
    actualizar_numerito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productos_en_carrito));

    Toastify({
        text:`Producto agregado: ${producto_agregado.nombre}`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #ac6515, #bd0606)",
        stopOnFocus: true,
    }).showToast();
}

function actualizar_numerito() {
    let nuevo_numerito = productos_en_carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevo_numerito;
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
        text: "¿Estas seguro de que deseas cerrar sesion? Se borrará todo el progreso.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Si, cerrar sesion",
        cancelButtonText: "Cancelar",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            productos_en_carrito.length = 0;
            localStorage.removeItem("productos-en-carrito");
            window.location.href = "./login.html";
            swalWithBootstrapButtons.fire({
                title: "Sesion cerrada",
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