/* ==========================================================================
   AFA Atalaya — Analítica de la web (Vercel Web Analytics)

   ▸ POR QUÉ ESTE FICHERO EXISTE EN LUGAR DE PEGAR EL SCRIPT EN EL HTML

   Vercel da un fragmento de dos etiquetas para webs en HTML. Pegarlo tal cual
   significaría repetirlo en las trece páginas, y con él la lógica de exclusión
   voluntaria. Así está en un sitio solo, como config.js o enlaces-externos.js.

   ▸ QUÉ RECOGE, Y QUÉ NO

   El script es de PRIMERA PARTE: se sirve desde afacolegioatalaya.es
   (/_vercel/insights/script.js), no desde un dominio ajeno. Por eso la web
   sigue sin cargar nada de terceros.

   Según la documentación de Vercel, NO usa cookies ni guarda nada en el
   dispositivo: identifica al visitante con un hash calculado en el servidor a
   partir de la propia petición, y lo descarta a las 24 horas. Guarda la página
   vista, el referente, el país, el sistema operativo, el navegador y el tipo de
   dispositivo. Nada que permita seguir a nadie entre webs distintas.

   Como no se almacena nada en el equipo del visitante, no entra en el supuesto
   del artículo 22.2 de la LSSI y por eso la web sigue sin aviso de cookies. El
   tratamiento se declara en la política de privacidad.

   ▸ EXCLUSIÓN VOLUNTARIA

   La guía de cookies de la AEPD pide, para la analítica propia, que se informe
   y que se pueda uno oponer. Aquí la oposición es real y no un párrafo: el
   botón de la página de privacidad guarda una marca en el navegador y, con esa
   marca puesta, este fichero no carga nada.

   Esa marca es lo ÚNICO que esta web guarda en el navegador por la analítica,
   y solo si la persona pide que no se la mida. Quien no toca nada no deja
   ninguna marca.

   ▸ DÓNDE NO SE CARGA

   A propósito, en /carnet/ y /validar/ NO se incluye este fichero. Son páginas
   funcionales que abren personas socias identificadas, con su carnet; medirlas
   no aporta nada y era mejor dejarlas fuera.
   ========================================================================== */

(function () {
  "use strict";

  var MARCA = "afa-sin-analitica";
  var RUTA = "/_vercel/insights/script.js";

  /* El acceso al almacenamiento del navegador puede fallar (ventana privada,
     cookies de sitio bloqueadas). Ante la duda, se respeta la privacidad:
     si no se puede leer la marca, no se mide. */

  function excluido() {
    try {
      return window.localStorage.getItem(MARCA) === "1";
    } catch (e) {
      return true;
    }
  }

  function guardarExclusion(valor) {
    try {
      if (valor) {
        window.localStorage.setItem(MARCA, "1");
      } else {
        window.localStorage.removeItem(MARCA);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ---------- Carga del script de Vercel ---------- */

  function cargar() {
    // Cola que usa el script de Vercel mientras termina de cargarse.
    window.va =
      window.va ||
      function () {
        (window.vaq = window.vaq || []).push(arguments);
      };

    var s = document.createElement("script");
    s.defer = true;
    s.src = RUTA;
    document.head.appendChild(s);
  }

  /* ---------- Botón de la página de privacidad ----------
     Solo existe en paginas/privacidad/. El HTML trae el botón ya escrito con
     un texto de reserva, así que si este script no llega a ejecutarse la
     página se lee igual; lo único que no habrá es el botón funcionando. */

  function initBoton() {
    var boton = document.getElementById("analitica-boton");
    var aviso = document.getElementById("analitica-estado");
    if (!boton) return;

    function pintar() {
      var fuera = excluido();
      boton.textContent = fuera ? "Volver a permitir la medición" : "No quiero que se me mida";
      boton.setAttribute("aria-pressed", String(fuera));
      if (aviso) {
        aviso.textContent = fuera
          ? "Hecho: en este navegador no se cuentan tus visitas."
          : "Ahora mismo tus visitas se cuentan de forma anónima y agregada.";
      }
    }

    boton.hidden = false;
    pintar();

    boton.addEventListener("click", function () {
      var fuera = excluido();
      if (!guardarExclusion(!fuera) && aviso) {
        aviso.textContent =
          "Tu navegador no nos deja guardar esa preferencia. Puedes bloquear " +
          "la analítica con cualquier extensión de bloqueo de contenido.";
        return;
      }
      pintar();
      if (aviso) {
        aviso.textContent += excluido()
          ? ""
          : " El cambio se aplica al recargar la página.";
      }
    });
  }

  /* ---------- Arranque ---------- */

  if (!excluido()) cargar();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBoton);
  } else {
    initBoton();
  }
})();
