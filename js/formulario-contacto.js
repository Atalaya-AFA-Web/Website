/* ==========================================================================
   AFA Atalaya — Formulario de contacto
   Se carga solo en la página de Contacto, después de config.js.

   Cómo funciona
   -------------
   Una web estática no tiene servidor, así que el envío lo hace un servicio
   externo de formularios. Todo se configura en js/config.js:

     · Si AFA_CONFIG.formulario.endpoint TIENE valor
       → el mensaje se envía en segundo plano al servicio y la familia ve
         un aviso de confirmación sin salir de la página.

     · Si está VACÍO
       → se abre el gestor de correo del usuario con el mensaje ya
         redactado (respaldo que funciona sin configurar nada).

   Compatible con Web3Forms, Formspree y Basin: los tres aceptan un POST
   con los campos del formulario y responden en JSON.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Validación ---------- */

  function showError(field, show) {
    var wrapper = field.closest(".field");
    var error = document.querySelector('[data-error-for="' + field.id + '"]');

    if (wrapper) wrapper.classList.toggle("has-error", show);
    if (error) error.hidden = !show;
  }

  function isValid(field) {
    if (field.type === "checkbox") return field.checked;
    if (!field.value.trim()) return false;
    if (field.type === "email") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(field.value.trim());
    }
    return true;
  }

  function validateForm(form) {
    var firstInvalid = null;

    form.querySelectorAll("[required]").forEach(function (field) {
      var ok = isValid(field);
      showError(field, !ok);
      if (!ok && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return false;
    }
    return true;
  }

  /* ---------- Mensajes de estado ---------- */

  function setStatus(el, message, type) {
    if (!el) return;
    el.textContent = message;
    el.classList.toggle("form-status-error", type === "error");
    el.hidden = false;
  }

  /* ---------- Respaldo: abrir el gestor de correo ---------- */

  function buildMailto(form, address) {
    var get = function (name) {
      var el = form.elements[name];
      return el ? el.value.trim() : "";
    };

    var subject = "[Web AFA] " + (get("motivo") || "Consulta");

    var lines = [
      "Nombre: " + get("nombre"),
      "Correo: " + get("email"),
      "Curso: " + (get("curso") || "no indicado"),
      "Motivo: " + get("motivo"),
      "",
      get("mensaje")
    ];

    return (
      "mailto:" + address +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lines.join("\n"))
    );
  }

  /* ---------- Envío al servicio de formularios ---------- */

  function sendToService(form, config, button, status) {
    var data = new FormData(form);

    // El asunto incluye el motivo elegido, para poder clasificar los mensajes
    // desde la propia lista de la bandeja sin abrirlos uno a uno.
    var motivo = data.get("motivo");
    var asunto = config.formulario.asunto + (motivo ? " · " + motivo : "");

    // La casilla de consentimiento llega como "on": se sustituye por un texto
    // legible, porque queda registrado en el correo como prueba del permiso.
    if (data.get("privacidad")) {
      data.set("privacidad", "Sí, acepta la política de privacidad");
    }

    if (config.formulario.accessKey) {
      // --- Web3Forms ---
      // access_key es obligatoria. El campo "email" del formulario se usa
      // automáticamente como remitente, de modo que al responder al correo la
      // respuesta va directamente a la familia.
      data.append("access_key", config.formulario.accessKey);
      data.append("subject", asunto);
      data.append("from_name", "Web AFA Atalaya");
    } else {
      // --- Formspree, Basin y similares ---
      // La clave va dentro de la propia URL; el asunto se pasa como _subject.
      data.append("_subject", asunto);
    }

    var originalLabel = button ? button.innerHTML : "";

    if (button) {
      button.disabled = true;
      button.textContent = "Enviando…";
    }

    fetch(config.formulario.endpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data
    })
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json().catch(function () {
          return {};   // algunos servicios responden sin cuerpo
        });
      })
      .then(function (result) {
        // Web3Forms puede responder 200 con success:false
        if (result && result.success === false) {
          throw new Error(
            (result.body && result.body.message) || "El servicio ha rechazado el envío"
          );
        }
        return result;
      })
      .then(function () {
        form.reset();
        setStatus(
          status,
          "¡Mensaje enviado! Gracias por escribirnos. Te contestaremos en " +
          "cuanto podamos, aunque a veces tardamos unos días porque somos " +
          "familias voluntarias.",
          "ok"
        );
        if (button) {
          button.innerHTML = originalLabel;
          button.disabled = false;
        }
      })
      .catch(function () {
        // Si el servicio falla, no perdemos el mensaje: ofrecemos el correo
        setStatus(
          status,
          "No hemos podido enviar el mensaje. Escríbenos directamente a " +
          config.email + " y lo vemos igualmente.",
          "error"
        );
        if (button) {
          button.innerHTML = originalLabel;
          button.disabled = false;
        }
      });
  }

  /* ---------- Arranque ---------- */

  function initContactForm() {
    var form = document.getElementById("form-contacto");
    if (!form) return;

    var config = typeof AFA_CONFIG !== "undefined" ? AFA_CONFIG : null;
    var status = document.getElementById("form-status");
    var button = form.querySelector('button[type="submit"]');

    // Limpia el error de un campo en cuanto el usuario lo corrige
    form.addEventListener("input", function (event) {
      var field = event.target;
      if (field.hasAttribute("required") && isValid(field)) {
        showError(field, false);
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!validateForm(form)) return;

      // Trampa anti-spam: si este campo oculto viene relleno, es un robot.
      // Fingimos éxito para no darle pistas.
      if (form.elements.botcheck && form.elements.botcheck.checked) {
        setStatus(status, "Mensaje enviado. Gracias.", "ok");
        return;
      }

      var endpoint = config && config.formulario && config.formulario.endpoint;

      if (endpoint) {
        sendToService(form, config, button, status);
        return;
      }

      // Respaldo sin servicio configurado
      var address = (config && config.email) || form.dataset.mailto;
      window.location.href = buildMailto(form, address);

      setStatus(
        status,
        "Hemos abierto tu gestor de correo con el mensaje preparado: solo " +
        "tienes que darle a enviar. Si no se ha abierto, escríbenos a " +
        address + ".",
        "ok"
      );
    });
  }

  document.addEventListener("DOMContentLoaded", initContactForm);
})();
