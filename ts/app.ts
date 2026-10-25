const PORCENTAJE_CARGO = 0.05;
const CANTIDAD_MIN = 1;
const CANTIDAD_MAX = 10;

const tipos = document.querySelectorAll('.checkout-tipo-entrada');
const inputCantidad = document.getElementById('cantidad');
const btnMenos = document.getElementById('btn-menos');
const btnMas = document.getElementById('btn-mas');
const form = document.getElementById('form-entrada');

const outLabel = document.getElementById('pedido-entrada-label');
const outPrecio = document.getElementById('pedido-entrada-precio');
const outCargo = document.getElementById('pedido-cargo');
const outTotal = document.getElementById('pedido-total');

// Estado actual: arranca con la entrada marcada como "activa" en el HTML
const estado = {
    nombre: '',
    precio: 0,
    cantidad: CANTIDAD_MIN,
};

// 25000 -> "$25.000"
function formatearPrecio(numero) {
    return '$' + String(Math.round(numero)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function seleccionarTipo(tipo) {
    tipos.forEach((t) => t.classList.remove('activa'));
    tipo.classList.add('activa');

    estado.nombre = tipo.dataset.nombre;
    estado.precio = Number(tipo.dataset.precio);

    actualizarPedido();
}

function cambiarCantidad(delta) {
    const nueva = estado.cantidad + delta;
    if (nueva < CANTIDAD_MIN || nueva > CANTIDAD_MAX) return;

    estado.cantidad = nueva;
    actualizarPedido();
}

function actualizarPedido() {
    const { nombre, precio, cantidad } = estado;

    const subtotal = precio * cantidad;
    const cargo = subtotal * PORCENTAJE_CARGO;
    const total = subtotal + cargo;

    const palabra = cantidad === 1 ? 'entrada' : 'entradas';
    const detalleUnitario = cantidad > 1 ? ` (${cantidad} × ${formatearPrecio(precio)})` : '';

    outLabel.textContent = `${cantidad} ${palabra} ${nombre}${detalleUnitario}`;
    outPrecio.textContent = formatearPrecio(subtotal);
    outCargo.textContent = formatearPrecio(cargo);
    outTotal.textContent = formatearPrecio(total);

    inputCantidad.value = cantidad;
    btnMenos.disabled = cantidad <= CANTIDAD_MIN;
    btnMas.disabled = cantidad >= CANTIDAD_MAX;
}

// Click (y teclado) en cada tipo de entrada
tipos.forEach((tipo) => {
    tipo.tabIndex = 0;
    tipo.setAttribute('role', 'button');

    tipo.addEventListener('click', () => seleccionarTipo(tipo));
    tipo.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            seleccionarTipo(tipo);
        }
    });
});

btnMenos.addEventListener('click', () => cambiarCantidad(-1));
btnMas.addEventListener('click', () => cambiarCantidad(1));

// Por ahora "Continuar" no envía el formulario (no recarga la página)
form.addEventListener('submit', (e) => e.preventDefault());

// Estado inicial
seleccionarTipo(document.querySelector('.checkout-tipo-entrada.activa') || tipos[0]);
