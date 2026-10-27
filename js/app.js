/* ========== CONTADOR REGRESIVO ========== */
const fechaLimite = new Date(2026, 9, 31, 23, 59); // mes 9 = octubre

const diasEl = document.getElementById("dias");
const horasEl = document.getElementById("horas");
const minEl = document.getElementById("min");

function dosDigitos(n) {
  return String(n).padStart(2, "0");
}

function actualizarContador() {
  const diferencia = fechaLimite - new Date();

  if (diferencia <= 0) {
    diasEl.textContent = "0";
    horasEl.textContent = "0";
    minEl.textContent = "0";
    return;
  }

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferencia / (1000 * 60)) % 60);

  diasEl.textContent = dosDigitos(dias);
  horasEl.textContent = dosDigitos(horas);
  minEl.textContent = dosDigitos(minutos);
}

actualizarContador();
setInterval(actualizarContador, 1000);

/* ========== BARRA DE CUPOS ========== */
const CUPOS_TOTALES = 60;
let cuposQuedan = 38; // cambiá este número y todo se actualiza

const quedanEl = document.getElementById("cupos-quedan");
const porcentajeEl = document.getElementById("cupos-porcentaje");
const barraEl = document.getElementById("barra-relleno");
const barraContenedor = document.querySelector(".barra");

function actualizarCupos() {
  // 38 / 60 = 63%, tal como pide la consigna
  const porcentaje = Math.round((cuposQuedan / CUPOS_TOTALES) * 100);

  // Si en tu caso 63% tiene que ser "vendidas" de verdad, usá esta línea:
  // const porcentaje = Math.round(((CUPOS_TOTALES - cuposQuedan) / CUPOS_TOTALES) * 100);

  quedanEl.textContent = `Quedan ${cuposQuedan} de ${CUPOS_TOTALES} Early Bird`;
  porcentajeEl.textContent = `${porcentaje}% vendidas`;
  barraEl.style.width = `${porcentaje}%`;
  barraContenedor.setAttribute("aria-valuenow", porcentaje);
}

actualizarCupos();