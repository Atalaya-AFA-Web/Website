/* ==========================================================================
   AFA Atalaya — Página /validar/ (la que ve el comercio)
   Lee el carnet de la URL (detrás de "#"), lo verifica con
   js/carnet-token.js y pinta el resultado. Mantiene un reloj en marcha.
   ========================================================================== */

(function () {
  "use strict";

  var panel = document.getElementById("validar-panel");
  var icono = document.getElementById("validar-icono");
  var titulo = document.getElementById("validar-titulo");
  var motivo = document.getElementById("validar-motivo");
  var prueba = document.getElementById("validar-prueba");
  var bloqueDatos = document.getElementById("validar-datos");
  var avisoBajas = document.getElementById("validar-aviso-bajas");

  var MOTIVOS = {
    falso: "El carnet es falso o ha sido modificado.",
    caducado: "El carnet está caducado.",
    baja: "Este carnet está dado de baja.",
    curso: "El carnet es de un curso que ya no está en vigor."
  };

  /* ---------- Reloj ---------- */

  var formatoHora = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit", second: "2-digit"
  });
  var formatoFecha = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid", weekday: "short", day: "numeric", month: "short"
  });

  function tic() {
    var ahora = new Date();
    document.getElementById("validar-hora").textContent = formatoHora.format(ahora);
    document.getElementById("validar-fecha").textContent = formatoFecha.format(ahora);
  }
  tic();
  setInterval(tic, 1000);

  /* ---------- Pintar el resultado ---------- */

  function pintar(clase, simbolo, textoTitulo, textoMotivo) {
    panel.className = "validar-panel " + clase;
    icono.textContent = simbolo;
    titulo.textContent = textoTitulo;
    motivo.textContent = textoMotivo || "";
  }

  // Los datos se escriben siempre con textContent: el nombre nunca se
  // interpreta como HTML.
  function pintarDatos(datos) {
    if (!datos) { bloqueDatos.hidden = true; return; }
    document.getElementById("validar-nombre").textContent = datos.n;
    document.getElementById("validar-curso").textContent =
      "Socio/a · curso " + CarnetAFA.cursoLegible(datos.c);
    document.getElementById("validar-numero").textContent = "Nº " + datos.id;
    document.getElementById("validar-caducidad").textContent =
      "Válido hasta el " + CarnetAFA.fechaLegible(datos.exp);
    bloqueDatos.hidden = false;
    prueba.hidden = !CarnetAFA.esPrueba(datos.c);
  }

  function comprobar() {
    var token = location.hash.slice(1);
    avisoBajas.hidden = true;
    prueba.hidden = true;

    if (!token) {
      pintar("is-vacio", "?", "Sin carnet",
        "Escanea con la cámara de tu móvil el código QR del carnet del socio.");
      pintarDatos(null);
      return;
    }

    pintar("is-cargando", "", "Comprobando…", "");

    CarnetAFA.verificar(token, "../carnet/").then(function (r) {
      if (r.estado === "valido") {
        pintar("is-valido", "✓", "VÁLIDO", "");
        pintarDatos(r.datos);
        avisoBajas.hidden = r.bajasComprobadas;
      } else if (r.estado === "invalido") {
        pintar("is-invalido", "✕", "NO VÁLIDO", MOTIVOS[r.motivo] || MOTIVOS.falso);
        pintarDatos(r.datos);
      } else {
        pintar("is-error", "!", "NO SE HA PODIDO COMPROBAR",
          "Revisa la conexión a internet y vuelve a escanear el QR.");
        pintarDatos(null);
      }
    });
  }

  comprobar();
  // Si se escanea otro carnet con la página ya abierta, solo cambia el "#"
  window.addEventListener("hashchange", comprobar);
})();
