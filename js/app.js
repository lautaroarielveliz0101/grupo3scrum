/* ========== SWITCH MODO OSCURO / CLARO ========== */
const temaToggle = document.getElementById("tema-toggle");
temaToggle.checked = document.documentElement.dataset.tema === "claro";
temaToggle.addEventListener("change", () => {
  const tema = temaToggle.checked ? "claro" : "oscuro";
  document.documentElement.dataset.tema = tema;
  try { localStorage.setItem("tema", tema); } catch (e) {}
});

const mapaBing = document.querySelector("#ubicacion .ub-mapa iframe");
if (mapaBing) {
  const urlMapaBing = new URL(mapaBing.src);
  const ajustarAnchoMapa = () => {
    const nuevoAncho = Math.round(mapaBing.parentElement.clientWidth);
    if (nuevoAncho === 0 || urlMapaBing.searchParams.get("w") === String(nuevoAncho)) return;

    urlMapaBing.searchParams.set("w", String(nuevoAncho));
    mapaBing.src = urlMapaBing.toString();
  };
  ajustarAnchoMapa();
  new ResizeObserver(ajustarAnchoMapa).observe(mapaBing.parentElement);
  window.addEventListener("resize", () => window.setTimeout(ajustarAnchoMapa, 100));
}

/* ========== BURBUJA ARRASTRABLE DE CHATBASE ========== */
function inicializarBurbujaChat() {
  const burbuja = document.getElementById("chatbase-bubble-button");
  if (!burbuja || burbuja.dataset.draggable === "true") return Boolean(burbuja);

  burbuja.dataset.draggable = "true";
  burbuja.title = "Arrastrá para mover o tocá para abrir el chat";

  let pointerStart = null;
  let arrastrada = false;
  let suprimirClick = false;
  const posicionGuardada = (() => {
    try {
      const posicion = JSON.parse(localStorage.getItem("rollingchat-position"));
      return posicion && Number.isFinite(posicion.left) && Number.isFinite(posicion.top)
        ? posicion
        : null;
    } catch (error) {
      console.warn("No se pudo recuperar la posición del chatbot.", error);
      return null;
    }
  })();

  function limitarPosicion(left, top) {
    const margen = 8;
    return {
      left: Math.max(margen, Math.min(left, window.innerWidth - burbuja.offsetWidth - margen)),
      top: Math.max(margen, Math.min(top, window.innerHeight - burbuja.offsetHeight - margen))
    };
  }

  function aplicarPosicion(left, top) {
    const posicion = limitarPosicion(left, top);
    burbuja.style.setProperty("left", `${posicion.left}px`, "important");
    burbuja.style.setProperty("top", `${posicion.top}px`, "important");
    burbuja.style.setProperty("right", "auto", "important");
    burbuja.style.setProperty("bottom", "auto", "important");
    return posicion;
  }

  if (posicionGuardada) aplicarPosicion(posicionGuardada.left, posicionGuardada.top);

  burbuja.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    const rect = burbuja.getBoundingClientRect();
    pointerStart = { x: event.clientX, y: event.clientY, left: rect.left, top: rect.top };
    arrastrada = false;
    burbuja.setPointerCapture(event.pointerId);
  });

  burbuja.addEventListener("pointermove", (event) => {
    if (!pointerStart || !burbuja.hasPointerCapture(event.pointerId)) return;
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    if (!arrastrada && Math.hypot(deltaX, deltaY) < 6) return;
    arrastrada = true;
    event.preventDefault();
    aplicarPosicion(pointerStart.left + deltaX, pointerStart.top + deltaY);
  });

  burbuja.addEventListener("pointerup", () => {
    if (arrastrada) {
      const posicion = {
        left: Number.parseFloat(burbuja.style.left),
        top: Number.parseFloat(burbuja.style.top)
      };
      try {
        localStorage.setItem("rollingchat-position", JSON.stringify(posicion));
      } catch (error) {
        console.warn("No se pudo guardar la posición del chatbot.", error);
      }
      suprimirClick = true;
      window.setTimeout(() => { suprimirClick = false; }, 0);
    }
    pointerStart = null;
  });

  burbuja.addEventListener("pointercancel", () => { pointerStart = null; });
  burbuja.addEventListener("click", (event) => {
    if (!suprimirClick) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    suprimirClick = false;
  }, true);

  window.addEventListener("resize", () => {
    const left = Number.parseFloat(burbuja.style.left);
    const top = Number.parseFloat(burbuja.style.top);
    if (Number.isFinite(left) && Number.isFinite(top)) aplicarPosicion(left, top);
  });

  return true;
}

function inicializarCierreChatMovil() {
  const panel = document.getElementById("chatbase-bubble-window");
  if (!panel) return false;
  if (panel.querySelector(".chatbase-mobile-close")) return true;

  const cerrar = document.createElement("button");
  cerrar.type = "button";
  cerrar.className = "chatbase-mobile-close";
  cerrar.setAttribute("aria-label", "Cerrar chatbot");
  cerrar.textContent = "×";
  cerrar.addEventListener("click", () => {
    if (typeof window.chatbase === "function") {
      window.chatbase("close");
      return;
    }
    document.getElementById("chatbase-bubble-button")?.click();
  });
  panel.append(cerrar);
  return true;
}

function observarChatbase() {
  if (inicializarBurbujaChat() && inicializarCierreChatMovil()) return;

  const chatObserver = new MutationObserver(() => {
    if (inicializarBurbujaChat() && inicializarCierreChatMovil()) chatObserver.disconnect();
  });
  chatObserver.observe(document.body, { childList: true, subtree: true });
}

observarChatbase();

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

function initSponsor() {
  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_EXT = ["png", "svg", "jpg", "jpeg", "webp"];
  const ALLOWED_MIME = ["image/png", "image/svg+xml", "image/jpeg", "image/webp"];
  const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

  const form = document.getElementById("sponsor-form");
  if (!form) {
    console.warn("[sponsor] No se encontró #sponsor-form: revisá que el HTML de la sección esté en la página.");
    return;
  }

  const success = document.getElementById("sp-success");
  const drop = document.getElementById("sp-drop");
  const fileInput = document.getElementById("sp-logo");
  const dropEmpty = document.getElementById("sp-drop-empty");
  const preview = document.getElementById("sp-preview");
  const previewImg = document.getElementById("sp-preview-img");
  const previewName = document.getElementById("sp-preview-name");
  const previewSize = document.getElementById("sp-preview-size");
  const removeBtn = document.getElementById("sp-remove");
  const logoError = document.getElementById("sp-logo-error");

  let previewUrl = null;

  // ---------- Campos obligatorios ----------
  const rules = {
    "sp-nombre":   (v) => (v ? "" : "Completá este campo."),
    "sp-apellido": (v) => (v ? "" : "Completá este campo."),
    "sp-empresa":  (v) => (v ? "" : "Completá este campo."),
    "sp-email":    (v) => (!v ? "Completá este campo."
                         : !EMAIL_RE.test(v) ? "Revisá el formato del email (ej.: nombre@mail.com)."
                         : ""),
    "sp-tipo":     (v) => (v ? "" : "Elegí una opción."),
  };

  function validateField(id) {
    const el = document.getElementById(id);
    const msg = rules[id](el.value.trim());
    const err = document.getElementById(id + "-error");
    err.textContent = msg;
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  Object.keys(rules).forEach((id) => {
    const el = document.getElementById(id);
    el.addEventListener("blur", () => validateField(id));
    el.addEventListener("input", () => {
      if (el.getAttribute("aria-invalid") === "true") validateField(id);
    });
    el.addEventListener("change", () => validateField(id));
  });

  // ---------- Logo (opcional) ----------
  function formatSize(bytes) {
    return bytes < 1024 * 1024
      ? (bytes / 1024).toFixed(0) + " KB"
      : (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function setLogoError(msg) {
    logoError.textContent = msg;
    drop.classList.toggle("is-invalid", !!msg);
  }

  function clearFile() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
    fileInput.value = "";
    previewImg.removeAttribute("src");
    preview.hidden = true;
    dropEmpty.hidden = false;
    drop.classList.remove("has-file");
  }

  function handleFile(file) {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXT.includes(ext) || (file.type && !ALLOWED_MIME.includes(file.type))) {
      clearFile();
      setLogoError("Formato no válido. Subí un archivo PNG, SVG, JPG o WEBP.");
      return;
    }
    if (file.size > MAX_SIZE) {
      clearFile();
      setLogoError("El archivo pesa " + formatSize(file.size) + ". El máximo permitido es 5 MB.");
      return;
    }
    setLogoError("");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(file);
    previewImg.src = previewUrl;
    previewName.textContent = file.name;
    previewSize.textContent = formatSize(file.size);
    dropEmpty.hidden = true;
    preview.hidden = false;
    drop.classList.add("has-file");
  }

  fileInput.addEventListener("change", () => handleFile(fileInput.files[0]));

  ["dragenter", "dragover"].forEach((evt) =>
    drop.addEventListener(evt, (e) => { e.preventDefault(); drop.classList.add("is-dragover"); })
  );
  ["dragleave", "drop"].forEach((evt) =>
    drop.addEventListener(evt, (e) => { e.preventDefault(); drop.classList.remove("is-dragover"); })
  );
  drop.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    fileInput.files = dt.files;
    handleFile(file);
  });

  removeBtn.addEventListener("click", () => {
    clearFile();
    setLogoError("");
    fileInput.focus();
  });

  // ---------- Envío ----------
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const results = Object.keys(rules).map((id) => ({ id, ok: validateField(id) }));
    const firstInvalid = results.find((r) => !r.ok);
    if (firstInvalid || logoError.textContent) {
      (firstInvalid ? document.getElementById(firstInvalid.id) : fileInput).focus();
      return;
    }

    // Aquí iría el envío real (fetch / FormData) cuando haya backend.
    const nombre = document.getElementById("sp-nombre").value.trim();
    const apellido = document.getElementById("sp-apellido").value.trim();
    document.getElementById("sp-success-name").textContent = nombre + " " + apellido;
    document.getElementById("sp-success-company").textContent = document.getElementById("sp-empresa").value.trim();
    document.getElementById("sp-success-email").textContent = document.getElementById("sp-email").value.trim();

    form.hidden = true;
    success.hidden = false;
    success.focus();
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  document.getElementById("sp-again").addEventListener("click", () => {
    form.reset();
    clearFile();
    setLogoError("");
    Object.keys(rules).forEach((id) => {
      document.getElementById(id).setAttribute("aria-invalid", "false");
      document.getElementById(id + "-error").textContent = "";
    });
    success.hidden = true;
    form.hidden = false;
    document.getElementById("sp-nombre").focus();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSponsor);
} else {
  initSponsor();
}