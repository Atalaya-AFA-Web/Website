/* ==========================================================================
   AFA Atalaya — Enlaces externos configurables
   Se carga en todas las páginas, después de config.js.

   Qué hace:
     1. Aplica el correo público de AFA_CONFIG.email en todos los enlaces
        marcados con data-email y en los textos marcados con data-email-text.
     2. Sustituye el href de los botones marcados con data-enlace="clave"
        por la URL correspondiente de AFA_CONFIG.enlaces (si está puesta).
     3. Rellena los iconos de redes sociales marcados con data-red="clave"
        y oculta los que no tengan URL configurada.

   El HTML lleva siempre un valor de reserva escrito a mano, así que si este
   script no se ejecuta la web sigue siendo perfectamente usable.
   ========================================================================== */

(function () {
  "use strict";

  function getConfig() {
    return typeof AFA_CONFIG !== "undefined" ? AFA_CONFIG : null;
  }

  /* ---------- 1. Correo público ----------
     Permite cambiar la dirección de contacto de toda la web editando una sola
     línea de config.js, en lugar de buscarla por los ocho ficheros HTML.

       <a data-email href="mailto:...">      → se reescribe la dirección,
                                               conservando el ?subject= si lo hay
       <span data-email-text>...</span>      → se reescribe el texto visible */

  function initEmail(config) {
    var email = config.email;
    if (!email) return;

    document.querySelectorAll("a[data-email]").forEach(function (link) {
      var href = link.getAttribute("href") || "";

      // Algunos botones llevan data-email como respaldo Y data-enlace hacia un
      // formulario externo (por ejemplo "Solicitar alta"). Si initExternalLinks
      // ya les ha puesto la URL del formulario, este módulo no debe pisarla:
      // solo actúa sobre los enlaces que siguen siendo de correo.
      if (href.indexOf("mailto:") !== 0) return;

      // Conserva la parte de consulta (?subject=…) que ya tuviera el enlace
      var query = href.split("?")[1];
      link.href = "mailto:" + email + (query ? "?" + query : "");
    });

    document.querySelectorAll("[data-email-text]").forEach(function (el) {
      el.textContent = email;
    });
  }

  /* ---------- 2. Botones que apuntan a formularios externos ---------- */

  function initExternalLinks(config) {
    var enlaces = config.enlaces || {};

    document.querySelectorAll("[data-enlace]").forEach(function (link) {
      var url = enlaces[link.dataset.enlace];

      if (!url) return; // sin configurar: se queda el href de reserva

      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });
  }

  /* ---------- 3. Iconos de redes sociales ---------- */

  function initSocialLinks(config) {
    var redes = config.redes || {};

    document.querySelectorAll("[data-red]").forEach(function (link) {
      var url = redes[link.dataset.red];
      var item = link.closest("li") || link;

      if (!url) {
        // Sin URL: se oculta el icono en lugar de dejar un enlace muerto
        item.hidden = true;
        return;
      }

      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });

    // Si no queda ninguna red visible, oculta también el texto "Síguenos"
    document.querySelectorAll(".footer-social").forEach(function (list) {
      var visibles = list.querySelectorAll("li:not([hidden])").length;

      if (visibles === 0) {
        list.hidden = true;
        var label = list.previousElementSibling;
        if (label && label.classList.contains("footer-social-label")) {
          label.hidden = true;
        }
      }
    });
  }

  /* ---------- Arranque ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    var config = getConfig();
    if (!config) return;

    // El orden importa: los enlaces externos se aplican antes que el correo,
    // porque un mismo botón puede tener las dos marcas y el formulario externo
    // tiene prioridad sobre el respaldo por correo.
    initExternalLinks(config);
    initEmail(config);
    initSocialLinks(config);
  });
})();
