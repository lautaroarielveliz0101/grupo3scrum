const PORCENTAJE_CARGO = 0.05;
const CANTIDAD_MIN = 1;
const CANTIDAD_MAX = 106;

const tipos = document.querySelectorAll('.checkout-tipo-entrada');
const inputCantidad = document.getElementById('cantidad');
const btnMenos = document.getElementById('btn-menos');
const btnMas = document.getElementById('btn-mas');
const form = document.getElementById('form-entrada');

const outLabel = document.getElementById('pedido-entrada-label');
const outPrecio = document.getElementById('pedido-entrada-precio');
const outCargo = document.getElementById('pedido-cargo');
const outTotal = document.getElementById('pedido-total');
const btnPagar = document.getElementById('btn-pagar');   // paso tarjeta
const btnMedio = document.getElementById('btn-medio');   // paso 3

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

    // Los botones de pago muestran el monto
    btnPagar.textContent = `Pagar ${formatearPrecio(total)}`;
    actualizarBotonMedio();
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

// Escribir la cantidad a mano
inputCantidad.addEventListener('focus', () => inputCantidad.select());

inputCantidad.addEventListener('input', () => {
    // Solo dígitos (también limpia lo que se pegue)
    const texto = inputCantidad.value.replace(/\D/g, '').slice(0, 3);
    const numero = Number(texto);

    // Campo vacío o 0: se deja escribir, pero todavía no se recalcula
    if (texto === '' || numero < CANTIDAD_MIN) {
        inputCantidad.value = texto;
        return;
    }

    // Si se pasa del máximo, se queda en el máximo
    estado.cantidad = Math.min(numero, CANTIDAD_MAX);
    actualizarPedido();
});

// Al salir del campo, si quedó vacío o en 0, vuelve a la última cantidad válida
inputCantidad.addEventListener('blur', actualizarPedido);

// Enter en este campo confirma la cantidad, no avanza de paso
inputCantidad.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        inputCantidad.blur();
    }
});

// =========================================================
// PASOS DEL CHECKOUT
//   '1' Entrada · '2' Datos · '3' Medio de pago · 'tarjeta' (parte del Pago)
// =========================================================
const pasos = document.querySelectorAll('.checkout-paso');
const indicadores = document.querySelectorAll('.checkout-caja-titulo > div button');
const pagoError = document.getElementById('pago-error');
const pagoErrorTitulo = document.getElementById('pago-error-titulo');

let pasoActual = '1';

// Muestra un paso y oculta los demás. Como solo se oculta/muestra,
// los datos cargados se conservan al ir y volver.
// (PLACEHOLDER: reemplazalo por la función de RC-14 / RC-15 si ya la tenés.)
function irAPaso(paso) {
    paso = String(paso);
    const destino = document.getElementById(`paso-${paso}`);
    if (!destino) return; // el paso 4 "Listo" todavía no existe

    pagoError.hidden = true;
    pasos.forEach((p) => {
        p.hidden = true;
    });
    destino.hidden = false;
    pasoActual = paso;

    // El formulario de tarjeta cuenta como paso 3 en la barra de arriba
    const numeroIndicador = paso === 'tarjeta' ? 3 : Number(paso);
    indicadores.forEach((boton, i) => {
        const esActual = i + 1 === numeroIndicador;
        boton.classList.toggle('activo', esActual);
        if (esActual) {
            boton.setAttribute('aria-current', 'step');
        } else {
            boton.removeAttribute('aria-current');
        }
    });

    const titulo = destino.querySelector('h3');
    if (titulo) titulo.focus();
}

// Botones "Volver"
document.querySelectorAll('[data-ir-paso]').forEach((boton) => {
    boton.addEventListener('click', () => irAPaso(boton.dataset.irPaso));
});

// =========================================================
// MEDIO DE PAGO (paso 3)
// =========================================================
function medioSeleccionado() {
    return form.querySelector('input[name="medio-pago"]:checked').value;
}

// Tarjeta -> "Continuar" (falta cargar la tarjeta) / Mercado Pago -> paga directo
function actualizarBotonMedio() {
    btnMedio.textContent =
        medioSeleccionado() === 'tarjeta' ? 'Continuar' : `Pagar ${outTotal.textContent} con Mercado Pago`;
}

form.querySelectorAll('input[name="medio-pago"]').forEach((radio) => {
    radio.addEventListener('change', actualizarBotonMedio);
});

// =========================================================
// VALIDACIÓN DE CAMPOS (paso 2 y formulario de tarjeta)
// =========================================================
const soloLetras = /^[\p{L}][\p{L}\s'.-]*$/u;

function crearCampo(id, validar, formatear) {
    return {
        input: document.getElementById(id),
        error: document.getElementById(`error-${id}`),
        validar,
        formatear,
    };
}

// "1226" -> "12/26"
function formatearVencimiento(valor) {
    const digitos = valor.replace(/\D/g, '').slice(0, 4);
    return digitos.length >= 3 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos;
}

function validarVencimiento(valor) {
    const mensaje = 'Ingresá un vencimiento válido (MM/AA).';
    const coincide = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(valor);
    if (!coincide) return mensaje;

    const mes = Number(coincide[1]);
    const anio = Number(coincide[2]);
    const hoy = new Date();
    const anioActual = hoy.getFullYear() % 100;
    const mesActual = hoy.getMonth() + 1;

    const vencida = anio < anioActual || (anio === anioActual && mes < mesActual);
    return vencida ? 'La tarjeta está vencida.' : '';
}

const camposDatos = [
    crearCampo('nombre', (v) =>
        soloLetras.test(v) && v.length >= 2 ? '' : 'Ingresá tu nombre (solo letras).'),
    crearCampo('apellido', (v) =>
        soloLetras.test(v) && v.length >= 2 ? '' : 'Ingresá tu apellido (solo letras).'),
    crearCampo('telefono', (v) => {
        const digitos = v.replace(/\D/g, '');
        const formatoOk = /^[\d\s()+-]+$/.test(v);
        return formatoOk && digitos.length >= 8 && digitos.length <= 15
            ? ''
            : 'Ingresá un teléfono válido (entre 8 y 15 números).';
    }),
    crearCampo('Email', (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Ingresá un email válido (ej: nombre@correo.com).'),
];

const camposTarjeta = [
    crearCampo(
        'tarjeta-numero',
        (v) => {
            const digitos = v.replace(/\D/g, '');
            return digitos.length >= 13 && digitos.length <= 19
                ? ''
                : 'Ingresá un número de tarjeta válido (entre 13 y 19 números).';
        },
        // "1234567812345678" -> "1234 5678 1234 5678"
        (v) => v.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ')
    ),
    crearCampo('tarjeta-titular', (v) =>
        soloLetras.test(v) && v.length >= 3 ? '' : 'Ingresá el nombre que figura en la tarjeta.'),
    crearCampo('tarjeta-vencimiento', validarVencimiento, formatearVencimiento),
    crearCampo(
        'tarjeta-cvv',
        (v) => (/^\d{3,4}$/.test(v) ? '' : 'Ingresá el código de seguridad (3 o 4 números).'),
        (v) => v.replace(/\D/g, '').slice(0, 4)
    ),
];

function validarCampo(campo) {
    const mensaje = campo.validar(campo.input.value.trim());
    campo.error.textContent = mensaje;
    campo.error.hidden = mensaje === '';
    campo.input.closest('.checkout-campo').classList.toggle('con-error', mensaje !== '');
    campo.input.setAttribute('aria-invalid', mensaje !== '');
    return mensaje === '';
}

// Valida todos los campos de un grupo y enfoca el primero inválido
function validarGrupo(lista) {
    const resultados = lista.map(validarCampo); // valida todos, no corta en el primero
    const primerInvalido = lista.find((_, i) => !resultados[i]);
    if (primerInvalido) primerInvalido.input.focus();
    return !primerInvalido;
}

// Formato mientras se escribe y revalidación en vivo si el campo ya tenía error
[...camposDatos, ...camposTarjeta].forEach((campo) => {
    campo.input.addEventListener('input', () => {
        if (campo.formatear) campo.input.value = campo.formatear(campo.input.value);

        if (campo.input.closest('.checkout-campo').classList.contains('con-error')) {
            validarCampo(campo);
        }
    });
});

// =========================================================
// PAGO + ERROR DE PAGO
// =========================================================

// TEMPORAL: mientras no exista la pasarela real, el pago siempre falla.
// Sacalo antes del PR.
const SIMULAR_ERROR_PAGO = true;

// Oculta el paso actual y muestra el bloque de error
function mostrarErrorPago() {
    pasos.forEach((p) => {
        p.hidden = true;
    });
    pasoActual = 'error';
    pagoError.hidden = false;
    pagoErrorTitulo.focus();
}

// Intento de pago (Mercado Pago, o "Pagar" del formulario de tarjeta)
function procesarPago() {
    if (SIMULAR_ERROR_PAGO) {
        mostrarErrorPago();
        return;
    }
    // Acá va el flujo normal cuando exista la pasarela (paso 4 "Listo")
}

// "Intentar de nuevo" vuelve al paso 3 y "Volver a la compra" al paso 1
document.getElementById('btn-reintentar').addEventListener('click', () => irAPaso(3));

// Un solo submit para todos los pasos (no recarga la página)
form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (pasoActual === '1') {
        irAPaso(2);
    } else if (pasoActual === '2') {
        if (validarGrupo(camposDatos)) irAPaso(3);
    } else if (pasoActual === '3') {
        if (medioSeleccionado() === 'tarjeta') {
            irAPaso('tarjeta');
        } else {
            procesarPago(); // Mercado Pago
        }
    } else if (pasoActual === 'tarjeta') {
        if (validarGrupo(camposTarjeta)) procesarPago();
    }
});

// Estado inicial
seleccionarTipo(document.querySelector('.checkout-tipo-entrada.activa') || tipos[0]);