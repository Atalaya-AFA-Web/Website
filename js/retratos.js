/* ============================================================
   RETRATOS DE LA JUNTA · AMPLIACIÓN AL PULSAR
   Añadido el 2 de noviembre de 2026.
   ============================================================

   Qué hace: convierte cada retrato de la junta en un botón que abre el
   mismo retrato en grande, en una ventana modal.

   POR QUÉ ESTÁ TODO EN JAVASCRIPT Y NADA EN EL HTML
   El HTML de las dos páginas con junta (la portada y paginas/la-afa/) no
   sabe nada de esto: lleva un <img> y ya está. El botón lo crea este
   archivo. Es a propósito. Si el navegador no ejecuta JavaScript, o si no
   entiende <dialog>, no hay botón: el visitante ve el retrato pequeño,
   igual que antes, y no se encuentra con un control que no hace nada.
   Si se quiere retirar la ampliación, basta con quitar la etiqueta
   <script> de las dos páginas; el HTML sigue siendo válido tal cual.

   POR QUÉ <dialog> Y NO UNA CAPA HECHA A MANO
   El elemento <dialog> con showModal() ya trae resuelto lo difícil: cerrar
   con Escape, atrapar el foco dentro mientras está abierto, dejar inerte
   el resto de la página y pintar el fondo oscuro. Hacer eso a mano son
   muchas líneas y se rompe fácil. Aquí solo hay que añadir tres cosas que
   <dialog> no cubre:

     1. Bloquear el scroll de la página de detrás (algunos navegadores lo
        dejan desplazarse).
     2. El botón «atrás» del móvil. Sin esto, quien abre un retrato y pulsa
        «atrás» para cerrarlo se sale de la web entera. Se mete una entrada
        en el historial al abrir y se escucha popstate.
     3. Devolver el foco al retrato desde el que se abrió, para que quien
        navega con teclado no acabe al principio de la página.

   ACCESIBILIDAD
   - Cada botón lleva aria-label con el nombre y el cargo de la persona, no
     un «ampliar imagen» genérico: así quien usa lector de pantalla sabe de
     quién es el retrato que va a abrir.
   - El retrato grande va con alt="" porque el nombre se escribe al lado,
     dentro del propio diálogo.
   - La animación de entrada se salta si el sistema pide reducir el
     movimiento (se controla desde el CSS, no desde aquí).
   ============================================================ */

(function () {
  'use strict';

  // Sin <dialog> no se monta nada: mejor el retrato pequeño que un botón roto.
  if (typeof HTMLDialogElement !== 'function' || !HTMLDialogElement.prototype.showModal) {
    return;
  }

  var retratos = document.querySelectorAll('img.avatar');
  if (!retratos.length) { return; }

  var dialogo = null;
  var imagenGrande = null;
  var titulo = null;
  var cargo = null;
  var origen = null;          // el botón desde el que se abrió
  var entradaEnHistorial = false;

  /* ---------- El diálogo se construye una sola vez, al primer uso ------- */

  function construirDialogo() {
    dialogo = document.createElement('dialog');
    dialogo.className = 'retrato-dialogo';

    var caja = document.createElement('div');
    caja.className = 'retrato-caja';

    var cerrar = document.createElement('button');
    cerrar.type = 'button';
    cerrar.className = 'retrato-cerrar';
    cerrar.setAttribute('aria-label', 'Cerrar');
    cerrar.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round"/></svg>';
    cerrar.addEventListener('click', function () { cerrarDialogo(); });

    imagenGrande = document.createElement('img');
    imagenGrande.className = 'retrato-imagen';
    imagenGrande.alt = '';
    imagenGrande.decoding = 'async';

    // Red de seguridad: si alguna vez se añade un retrato y se olvida su
    // versión -grande.webp, en lugar de enseñar una imagen rota se cae al
    // retrato pequeño. Se verá algo borroso, pero se verá.
    imagenGrande.addEventListener('error', function () {
      var respaldo = origen && origen.getAttribute('data-retrato-pequeno');
      if (respaldo && imagenGrande.getAttribute('src') !== respaldo) {
        imagenGrande.src = respaldo;
      }
    });

    titulo = document.createElement('strong');
    titulo.className = 'retrato-nombre';

    cargo = document.createElement('span');
    cargo.className = 'retrato-cargo';

    var pie = document.createElement('p');
    pie.className = 'retrato-pie';
    pie.appendChild(titulo);
    pie.appendChild(cargo);

    caja.appendChild(cerrar);
    caja.appendChild(imagenGrande);
    caja.appendChild(pie);
    dialogo.appendChild(caja);
    document.body.appendChild(dialogo);

    // Pulsar fuera de la tarjeta cierra. El clic en <dialog> cae en el
    // propio elemento cuando se da en el fondo oscuro, no en el contenido.
    dialogo.addEventListener('click', function (e) {
      if (e.target === dialogo) { cerrarDialogo(); }
    });

    // Escape lo gestiona el navegador y dispara 'cancel'; se intercepta
    // para que pase por el mismo camino de cierre que todo lo demás
    // (deshacer el bloqueo de scroll, el historial y devolver el foco).
    dialogo.addEventListener('cancel', function (e) {
      e.preventDefault();
      cerrarDialogo();
    });
  }

  /* ---------- Abrir y cerrar ------------------------------------------- */

  function abrirDialogo(boton) {
    if (!dialogo) { construirDialogo(); }

    origen = boton;
    imagenGrande.src = boton.getAttribute('data-retrato-grande');
    titulo.textContent = boton.getAttribute('data-retrato-nombre');
    cargo.textContent = boton.getAttribute('data-retrato-cargo');

    dialogo.showModal();
    document.documentElement.classList.add('con-dialogo-abierto');

    // Una entrada de historial para que «atrás» cierre el retrato en vez
    // de sacar al visitante de la web.
    try {
      history.pushState({ retrato: true }, '');
      entradaEnHistorial = true;
    } catch (e) {
      entradaEnHistorial = false;
    }
  }

  function cerrarDialogo() {
    if (!dialogo || !dialogo.open) { return; }

    dialogo.close();
    document.documentElement.classList.remove('con-dialogo-abierto');

    // Si abrimos con pushState y no estamos cerrando *por* el botón atrás,
    // hay que retirar esa entrada para no dejar basura en el historial.
    if (entradaEnHistorial) {
      entradaEnHistorial = false;
      history.back();
    }

    if (origen) { origen.focus(); origen = null; }
  }

  window.addEventListener('popstate', function () {
    if (dialogo && dialogo.open) {
      // Llega del botón «atrás»: la entrada ya se ha consumido sola.
      entradaEnHistorial = false;
      cerrarDialogo();
    }
  });

  /* ---------- Envolver cada retrato en un botón ------------------------- */

  Array.prototype.forEach.call(retratos, function (img) {
    var src = img.getAttribute('src');
    if (!src) { return; }

    // El retrato grande se llama igual con el sufijo -grande.
    var grande = src.replace(/\.webp$/, '-grande.webp');
    if (grande === src) { return; }

    // El nombre y el cargo se leen del propio HTML, para no repetirlos aquí
    // y que no puedan quedar desparejados si alguna vez cambia la junta.
    var ficha = img.closest('.board-member, .board-card');
    if (!ficha) { return; }
    var nombreEl = ficha.querySelector('strong');
    var cargoEl = ficha.querySelector('.board-role');
    if (!nombreEl) { return; }

    var nombre = nombreEl.textContent.trim();
    var elCargo = cargoEl ? cargoEl.textContent.trim() : '';

    var boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'avatar-boton';
    boton.setAttribute('aria-label',
      'Ver el retrato de ' + nombre + (elCargo ? ', ' + elCargo : '') + ' más grande');
    boton.setAttribute('data-retrato-grande', grande);
    boton.setAttribute('data-retrato-pequeno', src);
    boton.setAttribute('data-retrato-nombre', nombre);
    boton.setAttribute('data-retrato-cargo', elCargo);

    img.parentNode.insertBefore(boton, img);
    boton.appendChild(img);

    boton.addEventListener('click', function () { abrirDialogo(boton); });
  });
})();
