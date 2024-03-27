  let productos = [];
  let carrito = [];

  // Funcion para cargar los productos del carrito desde el localStorage
  function cargarProductos() {
    let carritoLocalStorage = localStorage.getItem("carrito");
    if (carritoLocalStorage) {
      carrito = JSON.parse(carritoLocalStorage);
      mostrarProductosEnCarrito();
    }

    fetch("productos.json")
      .then((response) => response.json())
      .then((data) => {
        productos = data;
        mostrarProductos();
      })
      .catch((error) => console.error("Error al cargar los productos:", error));
  }

  // Funcion para mostrar los productos en la página HTML
  function mostrarProductos() {
    let productosDiv = document.getElementById("productos");
    productosDiv.innerHTML = "";

    productos.forEach(function (producto) {
      let productoDiv = document.createElement("div");
      productoDiv.className = "producto";
      productoDiv.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div>
                    <p>${producto.nombre}</p>
                    <p>Precio: $${producto.precio.toFixed(2)}</p>
                    <button class="agregar-carrito" data-id="${
                      producto.id
                    }" data-nombre="${producto.nombre}" data-precio="${
        producto.precio
      }">Agregar al Carrito</button>
                </div>
            `;
      productosDiv.appendChild(productoDiv);
    });
  }

  // Funcion para agregar un producto al carrito
  function agregarAlCarrito(id, nombre, precio) {
    carrito.push({ id: id, nombre: nombre, precio: precio });
    mostrarProductosEnCarrito();
    mostrarPrecioTotal();
  }

  // Funcion para mostrar los productos en el carrito y guardarlos en localStorage
  function mostrarProductosEnCarrito() {
    let carritoDiv = document.getElementById("carrito");
    carritoDiv.innerHTML = "";

    localStorage.setItem("carrito", JSON.stringify(carrito));

    carrito.forEach(function (producto) {
      let productoEnCarritoDiv = document.createElement("div");
      productoEnCarritoDiv.innerHTML = `
            <p>${producto.nombre} - Precio: $${producto.precio.toFixed(2)}</p>
        `;
      carritoDiv.appendChild(productoEnCarritoDiv);
    });
  }

  // Funcion para calcular el precio total
  function calcularPrecioTotal() {
    let total = 0;
    carrito.forEach(function (producto) {
      total += producto.precio;
    });
    return total;
  }

  // Funcion para mostrar el precio total
  function mostrarPrecioTotal() {
    let totalDiv = document.getElementById("precio-total");
    let total = calcularPrecioTotal();
    totalDiv.textContent = `Precio Total: $${total.toFixed(2)}`;
  }

  // Funcion para agregar producto al carrito
  document
    .getElementById("productos")
    .addEventListener("click", function (event) {
      if (event.target.classList.contains("agregar-carrito")) {
        let id = event.target.getAttribute("data-id");
        let nombre = event.target.getAttribute("data-nombre");
        let precio = parseFloat(event.target.getAttribute("data-precio"));
        agregarAlCarrito(id, nombre, precio);
      }
    });

  // Funcion para borrar los productos del carrito
  document
    .getElementById("borrarProductos")
    .addEventListener("click", function () {
      carrito = [];
      mostrarProductosEnCarrito();
      mostrarPrecioTotal();
    });

  // Función para finalizar la compra y borrar productos del carrito
  document
    .getElementById("finalizarCompra")
    .addEventListener("click", function () {
      let precioTotal = calcularPrecioTotal();
      Swal.fire({
        title: "¿Estás seguro de finalizar la compra?",
        text: `El precio total de tu compra es: $${precioTotal.toFixed(2)}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, finalizar compra",
      }).then((result) => {
        if (result.isConfirmed) {
          carrito = [];
          mostrarProductosEnCarrito();
          Swal.fire({
            title: "¡Compra finalizada!",
            text: "¡Gracias por su compra!",
            icon: "success",
            confirmButtonText: "Aceptar",
          }).then(() => {
            window.location.reload();
          });
        }
      });
    });

  cargarProductos();

