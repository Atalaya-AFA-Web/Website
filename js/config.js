/* ==========================================================================
   AFA Atalaya — CONFIGURACIÓN DEL SITIO

   ▸ ESTE ES EL ÚNICO FICHERO QUE HAY QUE EDITAR PARA PONER LA WEB EN MARCHA.

   Todo lo que depende de un servicio externo (formularios, Google Forms,
   redes sociales) se configura aquí y no repartido por el HTML.

   Regla general: si un valor está VACÍO (""), la web usa el comportamiento
   de reserva que ya funciona sin configurar nada (normalmente, abrir el
   correo del AFA). En cuanto lo rellenas, se usa el servicio.

   Se carga ANTES que el resto de los scripts en todas las páginas.
   ========================================================================== */

var AFA_CONFIG = {

  /* ------------------------------------------------------------------------
     1. CORREO PÚBLICO DE LA ASOCIACIÓN

     Es la dirección que se muestra en TODA la web (pie, contacto, avisos
     legales) y la que se abre al pulsar los enlaces de correo.

     Cambiándola aquí se actualizan las ocho páginas de golpe: no hay que
     buscarla por el HTML. Lo hace js/enlaces-externos.js sobre los elementos
     marcados con data-email y data-email-text.

     ⚠ OJO: esta dirección NO tiene que coincidir con la cuenta con la que se
       registró Web3Forms. Son dos cosas distintas:

         · Este correo  → el que ven las familias y al que escriben.
         · Cuenta de Web3Forms → el buzón donde ATERRIZAN los mensajes del
           formulario de contacto (ver apartado 2).

       Si son distintos, configura en la cuenta de Web3Forms un reenvío
       automático hacia este correo público. Si no, los mensajes del
       formulario se quedarán en un buzón que nadie mira.
     ------------------------------------------------------------------------ */
  // TODO: sustituir por el correo público definitivo cuando se decida.
  email: "afa@colegioatalaya.com",


  /* ------------------------------------------------------------------------
     2. FORMULARIO DE CONTACTO (Web3Forms)

     Una web estática no puede enviar correos por sí misma: hace falta un
     servicio que reciba el envío y lo reenvíe a un buzón.

     CUENTA UTILIZADA: colegioatalaya.afa.web@gmail.com
     Es la cuenta "técnica" del AFA: la que tiene la clave de Web3Forms y la
     que es propietaria de los Google Forms y de sus hojas de respuestas.
     Los mensajes del formulario de contacto llegan AQUÍ.

     ▸ IMPORTANTE: configura en ese Gmail un reenvío automático al correo
       público (apartado 1), o acordaos de revisarlo. En Gmail:
       Configuración → Reenvío y correo POP/IMAP → Añadir dirección de reenvío.

     ▸ Cómo obtener la clave (2 minutos, sin crear contraseña):
         1. Entra en web3forms.com
         2. Escribe colegioatalaya.afa.web@gmail.com y crea la Access Key
         3. Te llega por correo a ese buzón (mira también la carpeta de spam)
         4. Pégala abajo en accessKey y descomenta la línea de endpoint

     ▸ ALTERNATIVAS: Formspree (formspree.io) o Basin (usebasin.com). En esas
       dos la clave va dentro de la propia URL: se rellena solo endpoint y
       accessKey se deja vacío.

     ⚠ SOBRE LA SEGURIDAD DE LA CLAVE
       La access key es PÚBLICA por diseño: viaja en el código de la página y
       cualquiera puede verla, más aún estando el repositorio en abierto.
       No es un secreto peligroso — solo permite enviar mensajes al buzón
       configurado, no leer nada ni acceder a la cuenta de Google. El único
       riesgo real es que alguien la use para mandaros spam. La defensa
       gratuita es la trampa anti-spam que ya lleva el formulario; si algún
       día molesta, se regenera la clave y se pega la nueva aquí.

     Mientras endpoint esté vacío, el formulario abre el gestor de correo del
     usuario con el mensaje ya redactado (funciona, pero es menos fino).
     ------------------------------------------------------------------------ */
  formulario: {

    // Web3Forms. La URL de envío es siempre esta.
    endpoint: "https://api.web3forms.com/submit",

    // Access Key de Web3Forms, ligada a colegioatalaya.afa.web@gmail.com.
    // Es pública por diseño (ver el aviso de arriba): no es una contraseña.
    accessKey: "75d5743a-e557-4e2e-989b-0388db3af9b5",

    // Asunto con el que llegarán los mensajes al buzón.
    asunto: "Nuevo mensaje desde la web del AFA"
  },


  /* ------------------------------------------------------------------------
     3. ENLACES A FORMULARIOS EXTERNOS (Google Forms u otros)

     Recomendación: crear un Google Form para el alta de socio. Las
     respuestas caen en una hoja de cálculo que tesorería puede usar
     directamente, sin programar nada.

     ⚠ NO pidáis el IBAN en un formulario web. Para la domiciliación,
       usad una orden SEPA en PDF firmada que la familia entregue en mano.

     ▸ altaSocio afecta a TODOS los botones "Hazte socio" y "Solicitar alta"
       del sitio: el del header, el del hero de la portada, el del menú móvil,
       el del bloque final de cada página y el de la página de Formularios.
       Son 20 enlaces en total; se configuran todos con esta única línea.

     Mientras estén vacíos, esos botones llevan a la página de Formularios
     (o abren el correo público, según el caso), así que la web nunca queda
     con enlaces roscados.
     ------------------------------------------------------------------------ */
  enlaces: {
    altaSocio: "",              // Google Form de alta de socio
    inscripcionActividad: "",   // Google Form de inscripción a actividades
    autorizacionImagen: "",     // Google Form o PDF de autorización de imagen
    propuestas: ""              // Google Form de propuestas y sugerencias
  },


  /* ------------------------------------------------------------------------
     4. REDES SOCIALES
     Mientras estén vacías, los iconos del pie se ocultan (mejor que dejar
     enlaces que no llevan a ninguna parte).
     ------------------------------------------------------------------------ */
  redes: {
    instagram: "",
    facebook: "",
    whatsapp: ""              // Enlace de invitación al grupo, si lo hay
  }

};
