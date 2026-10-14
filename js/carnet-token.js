/* ==========================================================================
   AFA Atalaya — Lectura y verificación del carnet de socio
   Lo usan /carnet/ (para pintar el carnet) y /validar/ (para el comercio).
   Sin dependencias: solo WebCrypto, que traen todos los navegadores actuales.

   FORMATO DEL TOKEN
     token = base64url(JSON en UTF-8) + "." + base64url(firma)
     JSON  = { v: 1, id: "2627-0042-A", n: "Nombre Apellidos",
               c: "2627", exp: "2027-08-31" }
     firma = RSASSA-PKCS1-v1_5 con SHA-256 sobre el TEXTO del primer tramo
             (la parte base64url, que es ASCII puro), igual que un JWT.
             Así no hay dudas de codificación con las tildes: lo que se firma
             son letras y números.

   El token viaja siempre detrás de "#" en la URL: el navegador no lo manda
   al servidor y Vercel no ve ni registra ningún nombre.

   CLAVES: la pública de cada curso está en /carnet/claves/<curso>.pem.
   Si se retira el fichero, los carnets de ese curso dejan de validar.
   BAJAS:  /carnet/bajas.json, una lista de números de carnet.
   ========================================================================== */

var CarnetAFA = (function () {
  "use strict";

  var ALMACEN = "afa-carnet";

  /* ---------- Utilidades de codificación ---------- */

  function base64urlABytes(texto) {
    var b64 = texto.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    var binario = atob(b64);
    var bytes = new Uint8Array(binario.length);
    for (var i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
    return bytes;
  }

  function pemABytes(pem) {
    var cuerpo = pem
      .replace(/-----BEGIN PUBLIC KEY-----/, "")
      .replace(/-----END PUBLIC KEY-----/, "")
      .replace(/\s+/g, "");
    var binario = atob(cuerpo);
    var bytes = new Uint8Array(binario.length);
    for (var i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
    return bytes;
  }

  /* ---------- Lectura del token (sin verificar) ---------- */

  // Devuelve { tramo, firma, datos } o null si el texto no tiene forma de carnet.
  function leer(token) {
    if (typeof token !== "string") return null;
    token = token.replace(/^#/, "").trim();
    if (!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token) || token.length > 2000) return null;

    var partes = token.split(".");
    var datos;
    try {
      var json = new TextDecoder("utf-8", { fatal: true }).decode(base64urlABytes(partes[0]));
      datos = JSON.parse(json);
    } catch (e) {
      return null;
    }

    if (!datos || datos.v !== 1) return null;
    if (typeof datos.c !== "string" || !/^[0-9a-z]{2,8}$/.test(datos.c)) return null;
    if (typeof datos.id !== "string" || datos.id.indexOf(datos.c + "-") !== 0 ||
        !/^[0-9a-z]{2,8}-\d{4}-[AB]$/.test(datos.id)) return null;
    if (typeof datos.n !== "string" || !datos.n.trim() || datos.n.length > 100) return null;
    if (typeof datos.exp !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(datos.exp)) return null;

    return { token: token, tramo: partes[0], firma: partes[1], datos: datos };
  }

  /* ---------- Fechas (siempre en hora de Madrid) ---------- */

  function hoyEnMadrid() {
    // "en-CA" da el formato AAAA-MM-DD, comparable como texto con exp
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit"
    }).format(new Date());
  }

  function fechaLegible(iso) {
    var p = iso.split("-");
    return p[2] + "/" + p[1] + "/" + p[0];
  }

  // "2627" → "2026-2027"; cualquier otro código (p. ej. "test") → "de prueba"
  function cursoLegible(c) {
    if (/^\d{4}$/.test(c)) return "20" + c.slice(0, 2) + "-20" + c.slice(2);
    return "de prueba";
  }

  function esPrueba(c) {
    return !/^\d{4}$/.test(c);
  }

  /* ---------- Verificación completa ---------- */

  // base: ruta hasta la carpeta /carnet/ desde la página que llama (p. ej. "../carnet/")
  // Resultado:
  //   { estado: "valido" | "invalido" | "error", motivo, datos, bajasComprobadas }
  //   · "invalido" con motivo "falso" | "caducado" | "baja" | "curso"
  //   · "error" = no se ha podido comprobar (sin conexión, normalmente)
  function verificar(token, base) {
    var carnet = leer(token);
    if (!carnet) return Promise.resolve({ estado: "invalido", motivo: "falso", datos: null });

    var datos = carnet.datos;

    return fetch(base + "claves/" + datos.c + ".pem", { cache: "no-cache" })
      .then(function (r) {
        if (r.status === 404) throw { motivo: "curso" };
        if (!r.ok) throw { red: true };
        return r.text();
      }, function () { throw { red: true }; })
      .then(function (pem) {
        if (pem.indexOf("BEGIN PUBLIC KEY") === -1) throw { motivo: "curso" };
        return crypto.subtle.importKey(
          "spki", pemABytes(pem),
          { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
          false, ["verify"]
        );
      })
      .then(function (clave) {
        return crypto.subtle.verify(
          "RSASSA-PKCS1-v1_5", clave,
          base64urlABytes(carnet.firma),
          new TextEncoder().encode(carnet.tramo)
        );
      })
      .then(function (firmaBuena) {
        if (!firmaBuena) throw { motivo: "falso" };
        if (hoyEnMadrid() > datos.exp) throw { motivo: "caducado", conDatos: true };

        return fetch(base + "bajas.json", { cache: "no-store" })
          .then(function (r) { return r.ok ? r.json() : null; })
          .catch(function () { return null; })
          .then(function (bajas) {
            if (!Array.isArray(bajas)) {
              return { estado: "valido", datos: datos, bajasComprobadas: false };
            }
            if (bajas.indexOf(datos.id) !== -1) {
              return { estado: "invalido", motivo: "baja", datos: datos, bajasComprobadas: true };
            }
            return { estado: "valido", datos: datos, bajasComprobadas: true };
          });
      })
      .catch(function (fallo) {
        if (fallo && fallo.red) return { estado: "error", datos: null };
        if (fallo && fallo.motivo) {
          return { estado: "invalido", motivo: fallo.motivo, datos: fallo.conDatos ? datos : null };
        }
        // Clave o firma mal formadas, o cualquier otro fallo de WebCrypto
        return { estado: "invalido", motivo: "falso", datos: null };
      });
  }

  /* ---------- Almacenamiento en el propio móvil del socio ---------- */
  // Solo se guarda el token, en este navegador. Nunca sale del dispositivo.

  function guardar(token) {
    try { localStorage.setItem(ALMACEN, token); } catch (e) { /* modo privado, etc. */ }
  }

  function recuperar() {
    try { return localStorage.getItem(ALMACEN); } catch (e) { return null; }
  }

  function borrar() {
    try { localStorage.removeItem(ALMACEN); } catch (e) { /* nada que hacer */ }
  }

  return {
    leer: leer,
    verificar: verificar,
    fechaLegible: fechaLegible,
    cursoLegible: cursoLegible,
    esPrueba: esPrueba,
    guardar: guardar,
    recuperar: recuperar,
    borrar: borrar
  };
})();
