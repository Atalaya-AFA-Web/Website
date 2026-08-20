/* ==========================================================================
   AFA Atalaya — JavaScript común a todas las páginas
   Módulos:
     1. Menú móvil (hamburguesa)
     2. Marcado del enlace activo del menú según la URL
     3. Filtros por categoría (Actualidad y Actividades)
   Sin dependencias externas.

   Los comportamientos que solo se usan en una página están en ficheros
   aparte: js/acordeon.js y js/formulario-contacto.js
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- 1. Menú móvil ---------- */

  function initMobileNav() {
    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("main-nav");

    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    // Cierra el menú al pulsar un enlace
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    // Cierra el menú al hacer clic fuera de él
    document.addEventListener("click", function (event) {
      if (
        nav.classList.contains("is-open") &&
        !nav.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- 2. Enlace activo del menú ----------
     Evita tener que marcar a mano la clase .is-active en cada página:
     así el bloque del header es idéntico en todas ellas. */

  function normalizePath(path) {
    // "/paginas/el-afa/index.html" y "/paginas/el-afa/" se consideran iguales
    return path.replace(/index\.html$/, "").replace(/\/+$/, "") || "/";
  }

  function initActiveNavLink() {
    var links = document.querySelectorAll(".main-nav li:not(.nav-cta) a");
    if (!links.length) return;

    var current = normalizePath(window.location.pathname);
    var exacto = null;
    var porSeccion = null;

    links.forEach(function (link) {
      var target = normalizePath(new URL(link.href).pathname);

      if (target === current) {
        exacto = link;
        return;
      }

      // Páginas de detalle: /paginas/actividades/reunion-bienvenida/ debe
      // resaltar "Actividades". Se busca el apartado del menú cuya ruta sea
      // prefijo de la actual, quedándonos con el más específico.
      // Se excluye la raíz ("/"), que sería prefijo de todo.
      if (target !== "/" && current.indexOf(target + "/") === 0) {
        if (!porSeccion || target.length > normalizePath(new URL(porSeccion.href).pathname).length) {
          porSeccion = link;
        }
      }
    });

    var activo = exacto || porSeccion;
    if (!activo) return;

    activo.classList.add("is-active");
    // aria-current="page" solo cuando es exactamente esta página; en una ficha
    // de detalle el apartado está relacionado, pero no es la página actual.
    if (activo === exacto) {
      activo.setAttribute("aria-current", "page");
    } else {
      activo.setAttribute("aria-current", "true");
    }
  }

  /* ---------- 3. Filtros por categoría ----------
     Se usa en la home, en Actualidad y en Actividades.
     Cada elemento filtrable lleva class="news-card" y data-category="…";
     cada botón lleva class="chip" y data-filter="…". */

  function initCategoryFilters() {
    var chips = document.querySelectorAll(".filter-chips .chip");
    var items = document.querySelectorAll("#news-grid .news-card");
    var emptyMessage = document.getElementById("news-empty");

    if (!chips.length || !items.length) return;

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var filter = chip.dataset.filter;

        // Estado visual del chip activo
        chips.forEach(function (c) {
          c.classList.toggle("is-active", c === chip);
        });

        // Muestra u oculta los elementos según su categoría
        var visibleCount = 0;

        items.forEach(function (item) {
          var matches = filter === "todas" || item.dataset.category === filter;
          item.classList.toggle("is-hidden", !matches);
          if (matches) visibleCount++;
        });

        // Oculta los grupos de trimestre que se hayan quedado sin actividades
        document.querySelectorAll("#news-grid .term-group").forEach(function (group) {
          var visibleInGroup = group.querySelectorAll(
            ".news-card:not(.is-hidden)"
          ).length;
          group.hidden = visibleInGroup === 0;
        });

        // Mensaje cuando la categoría no tiene contenido
        if (emptyMessage) {
          emptyMessage.hidden = visibleCount > 0;
        }
      });
    });
  }

  /* ---------- Arranque ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initActiveNavLink();
    initCategoryFilters();
  });
})();
