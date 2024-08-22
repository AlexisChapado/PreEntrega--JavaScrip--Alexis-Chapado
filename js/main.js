const productosDisponibles = [
    {id: 1, nombre: "Fotografia por unidad", tipo: "fotografia", precio: 4000},
    {id: 2, nombre: "Sesion de fotos, solo interiores", tipo: "sesion1", precio: 150000},
    {id: 3, nombre: "Sesion de fotos, interior y exterior", tipo: "sesion2", precio: 250000}
];

let carrito = [];

function agregarAlCarrito() {
    let mensaje = "Selecciona un producto:\n";
    productosDisponibles.forEach(producto => {
        mensaje += `${producto.id}. ${producto.nombre} - $${producto.precio}\n`;
    });
    
    let seleccion = parseInt(prompt(mensaje));
    let producto = productosDisponibles.find(p => p.id === seleccion);
    
    if (producto) {
        let cantidad = parseInt(prompt(`¿Cuántas unidades de "${producto.nombre}" quieres agregar?`));
        let productoEnCarrito = carrito.find(p => p.id === producto.id);
        
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += cantidad;
        } else {
            carrito.push({...producto, cantidad: cantidad});
        }
        
        alert(`Agregaste ${cantidad} "${producto.nombre}" al carrito.`);
    } else {
        alert("Producto no válido.");
    }
}

function eliminarDelCarrito() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }
    
    let mensaje = "Selecciona un producto para eliminar:\n";
    carrito.forEach((producto, index) => {
        mensaje += `${index + 1}. ${producto.nombre} - Cantidad: ${producto.cantidad}\n`;
    });
    
    let seleccion = parseInt(prompt(mensaje));
    if (seleccion > 0 && seleccion <= carrito.length) {
        carrito.splice(seleccion - 1, 1);
        alert("Producto eliminado del carrito.");
    } else {
        alert("Selección no válida.");
    }
}

function calcularTotal() {
    let total = carrito.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0);
    alert(`El total de tu carrito es: $${total}`);
}

function mostrarMenu() {
    let salir = false;
    while (!salir) {
        let opcion = prompt("Seleccione una opción:\n1. Agregar producto\n2. Eliminar producto\n3. Ver total\n4. Salir");
        
        switch (opcion) {
            case "1":
                agregarAlCarrito();
                break;
            case "2":
                eliminarDelCarrito();
                break;
            case "3":
                calcularTotal();
                break;
            case "4":
                salir = true;
                alert("Gracias por su visita!.");
                break;
            default:
                alert("Opción no válida.");
        }
    }
}

mostrarMenu();
