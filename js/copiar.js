/* ==========================================================================
   AFA Atalaya — Botón "Copiar"

   Mejora progresiva pura. En el HTML el dato SIEMPRE está escrito y se puede
   leer y seleccionar a mano: este script solo añade un botón que lo copia al
   portapapeles. Si el JS no carga, o el navegador no tiene API de
   portapapeles, no aparece ningún botón y la página sigue funcionando igual.

   Por qué existe: el dato que copia es un número de cuenta de 24 caracteres.
   Seleccionarlo con el dedo en un móvil es incómodo y un dígito mal copiado
   significa una transferencia a otra parte.

   Uso en el HTML:
     <span data-copiar>ES30 0049 0056 4720 1150 1583</span>

   Opcionalmente, data-copiar puede llevar el valor exacto que se quiere
   copiar, cuando difiere de lo que se muestra:
     <span data-copiar="ES3000490056472011501583">ES30 0049 …</span>
   ========================================================================== */

(function () {
  "use strict";

  function puedeCopiar() {
    return !!(navigator.clipboard && navigator.clipboard.writeText);
  }

  function crearBoton(destino) {
    var boton = document.createElement("button");
    boton.type = "button";
    boton.className = "btn-copiar";

    var etiqueta = document.createElement("span");
    etiqueta.textContent = "Copiar";
    boton.appendChild(etiqueta);

    // El texto a copiar: el atributo si tiene valor, y si no lo que se ve.
    var valor = destino.getAttribute("data-copiar");
    if (!valor) valor = destino.textContent.trim();

    // Un texto accesible más explícito que "Copiar" a secas, porque un lector
    // de pantalla anuncia el botón fuera del contexto visual del número.
    boton.setAttribute("aria-label", "Copiar " + valor);

    var temporizador = null;

    boton.addEventListener("click", function () {
      navigator.clipboard.writeText(valor).then(
        function () {
          etiqueta.textContent = "Copiado";
          boton.classList.add("is-done");
        },
        function () {
          // Si el navegador deniega el permiso, lo decimos en lugar de
          // fingir que ha funcionado.
          etiqueta.textContent = "No se ha podido";
          boton.classList.add("is-done");
        }
      );

      clearTimeout(temporizador);
      temporizador = setTimeout(function () {
        etiqueta.textContent = "Copiar";
        boton.classList.remove("is-done");
      }, 2500);
    });

    return boton;
  }

  function initCopiar() {
    if (!puedeCopiar()) return;

    document.querySelectorAll("[data-copiar]").forEach(function (destino) {
      var contenedor = destino.parentNode;
      if (!contenedor) return;
      contenedor.appendChild(crearBoton(destino));
    });
  }

  document.addEventListener("DOMContentLoaded", initCopiar);
})();
