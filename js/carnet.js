/* ==========================================================================
   AFA Atalaya — Página /carnet/ (la que enseña el socio)
   1. Toma el carnet de la URL (detrás de "#") o, si no viene, del guardado
      en este navegador.
   2. Lo guarda y lo vuelve a poner en la URL, para que "Añadir a pantalla de
      inicio" guarde el enlace completo (en iPhone, la app de la pantalla de
      inicio no comparte el almacenamiento con Safari).
   3. Lo comprueba con js/carnet-token.js y lo pinta con su QR.
   Necesita js/lib/qrcode-generator.js (MIT, copiado en el proyecto).
   ========================================================================== */

(function () {
  "use strict";

  var cargando = document.getElementById("carnet-cargando");
  var zonaSin = document.getElementById("carnet-sin");
  var zona = document.getElementById("carnet-zona");
  var tarjeta = document.getElementById("carnet");
  var sello = document.getElementById("carnet-sello");

  /* ---------- QR en SVG ---------- */
  // Se dibuja con rectángulos SVG: nítido a cualquier tamaño y sin innerHTML.
  // Corrección de errores "L": en una pantalla no hay manchas ni roturas, y
  // así el QR sale menos denso y se lee mejor.
  function dibujarQR(contenedor, texto) {
    var qr = qrcode(0, "L");
    qr.addData(texto, "Byte");
    qr.make();

    var n = qr.getModuleCount();
    var margen = 4; // zona blanca que exige el estándar
    var lado = n + margen * 2;
    var NS = "http://www.w3.org/2000/svg";

    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + lado + " " + lado);
    svg.setAttribute("shape-rendering", "crispEdges");
    svg.setAttribute("aria-hidden", "true");

    var fondo = document.createElementNS(NS, "rect");
    fondo.setAttribute("width", lado);
    fondo.setAttribute("height", lado);
    fondo.setAttribute("fill", "#fff");
    svg.appendChild(fondo);

    // Un único <path> con todos los módulos: mucho más ligero que miles de <rect>
    var d = "";
    for (var f = 0; f < n; f++) {
      for (var c = 0; c < n; c++) {
        if (qr.isDark(f, c)) d += "M" + (c + margen) + " " + (f + margen) + "h1v1h-1z";
      }
    }
    var modulos = document.createElementNS(NS, "path");
    modulos.setAttribute("d", d);
    modulos.setAttribute("fill", "#000");
    svg.appendChild(modulos);

    contenedor.textContent = "";
    contenedor.appendChild(svg);
  }

  /* ---------- Pintar ---------- */

  function mostrarSin(texto) {
    cargando.hidden = true;
    zona.hidden = true;
    zonaSin.hidden = false;
    if (texto) document.getElementById("carnet-sin-texto").textContent = texto;
  }

  function mostrarCarnet(carnet, resultado) {
    var datos = carnet.datos;
    document.getElementById("carnet-nombre").textContent = datos.n;
    document.getElementById("carnet-curso").textContent =
      "Socio/a · curso " + CarnetAFA.cursoLegible(datos.c);
    document.getElementById("carnet-caducidad").textContent =
      "Válido hasta el " + CarnetAFA.fechaLegible(datos.exp);
    document.getElementById("carnet-numero").textContent = "Nº " + datos.id;

    // El QR apunta a /validar/ de la misma web desde la que se abre el carnet
    var urlValidar = location.origin + "/validar/#" + carnet.token;
    dibujarQR(document.getElementById("carnet-qr"), urlValidar);

    tarjeta.classList.remove("is-caducado", "is-prueba");
    sello.hidden = true;

    if (resultado.estado === "invalido" && resultado.motivo === "caducado") {
      tarjeta.classList.add("is-caducado");
      sello.textContent = "Este carnet est\u00e1 caducado.";
      sello.hidden = false;
    } else if (resultado.estado === "invalido" && resultado.motivo === "baja") {
      tarjeta.classList.add("is-caducado");
      sello.textContent = "Este carnet está dado de baja.";
      sello.hidden = false;
    } else if (resultado.estado === "invalido" && resultado.motivo === "curso") {
      tarjeta.classList.add("is-caducado");
      sello.textContent = "Este carnet es de un curso que ya no está en vigor.";
      sello.hidden = false;
    } else if (CarnetAFA.esPrueba(datos.c)) {
      tarjeta.classList.add("is-prueba");
      sello.textContent = "Carnet de PRUEBA: no vale para descuentos.";
      sello.hidden = false;
    }
    // resultado "error" (sin conexión): se enseña el carnet tal cual; quien
    // lo comprueba de verdad es el comercio al escanear el QR.

    cargando.hidden = true;
    zonaSin.hidden = true;
    zona.hidden = false;
  }

  /* ---------- Arranque ---------- */

  function iniciar() {
    var desdeURL = location.hash.slice(1);
    var token = desdeURL || CarnetAFA.recuperar();

    if (!token) { mostrarSin(); return; }

    var carnet = CarnetAFA.leer(token);
    if (!carnet) {
      mostrarSin("El enlace no contiene un carnet válido. Ábrelo de nuevo desde el correo de la AFA, sin cambiar nada.");
      return;
    }

    CarnetAFA.verificar(carnet.token, "./").then(function (r) {
      if (r.estado === "invalido" && r.motivo === "falso") {
        mostrarSin("El enlace no contiene un carnet válido. Ábrelo de nuevo desde el correo de la AFA, sin cambiar nada.");
        return;
      }

      CarnetAFA.guardar(carnet.token);
      if (!desdeURL) {
        try { history.replaceState(null, "", "#" + carnet.token); } catch (e) { /* nada */ }
      }
      mostrarCarnet(carnet, r);
    });
  }

  document.getElementById("carnet-borrar").addEventListener("click", function () {
    CarnetAFA.borrar();
    try { history.replaceState(null, "", location.pathname); } catch (e) { /* nada */ }
    mostrarSin("Has quitado el carnet de este móvil. Puedes volver a abrirlo cuando quieras desde el enlace del correo.");
  });

  iniciar();
})();
