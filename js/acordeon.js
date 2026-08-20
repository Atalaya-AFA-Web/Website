/* ==========================================================================
   AFA Atalaya — Acordeón (preguntas frecuentes)
   Se carga solo en las páginas que lo necesitan (Formularios).

   Marcado esperado:
     <div class="accordion-item">
       <h3>
         <button class="accordion-trigger" aria-expanded="false" aria-controls="ID">…</button>
       </h3>
       <div class="accordion-panel" id="ID" hidden>…</div>
     </div>
   ========================================================================== */

(function () {
  "use strict";

  function initAccordion() {
    var triggers = document.querySelectorAll(".accordion-trigger");
    if (!triggers.length) return;

    triggers.forEach(function (trigger) {
      var panelId = trigger.getAttribute("aria-controls");
      var panel = document.getElementById(panelId);

      if (!panel) return;

      trigger.addEventListener("click", function () {
        var isOpen = trigger.getAttribute("aria-expanded") === "true";

        trigger.setAttribute("aria-expanded", String(!isOpen));
        panel.hidden = isOpen;
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initAccordion);
})();
