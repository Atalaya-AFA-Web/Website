# Tareas pendientes · Web de la AFA Atalaya

Estado a 9 de septiembre de 2026.

**Entorno actual:** repositorio en `C:\PERSONAL\AFA Atalaya\Website` (GitHub,
gestionado con SourceTree) y despliegue automático en Vercel.

> La carpeta `C:\PERSONAL\AFA Atalaya\WEB AFA` es de trabajo, no es el repo.
> Comprobado hoy: los 21 ficheros de código y contenido son **idénticos** en las
> dos carpetas, así que no hay nada desincronizado. Conviene decidir si se
> mantiene esa carpeta doble o se trabaja solo contra el repo — dos copias de lo
> mismo acaban divergiendo.

---

## 0. Lo que hay que hacer TÚ, fuera de la web (27 de agosto de 2026)

Estas cuatro cosas no se pueden resolver desde el código. Son las que quedan
para que lo publicado funcione de verdad.

### 0.1 Blindar el grupo de WhatsApp (antes de que se indexe el enlace)

La web publica ahora el enlace de invitación al grupo. Por defecto ese enlace
deja entrar a cualquiera y, al estar en una página pública, Google lo va a
encontrar. Con dos ajustes deja de ser un problema:

1. **Aprobación de nuevos participantes.** Abre el grupo → toca el nombre del
   grupo → *Configuración del grupo* (o *Permisos*) → activa
   **«Aprobar nuevos participantes»**. Desde ese momento, quien use el enlace
   entra en una cola y un administrador acepta o rechaza uno a uno. El enlace
   puede estar público sin riesgo: sin tu visto bueno nadie entra.
2. **Que solo los administradores puedan invitar.** En el mismo menú, deja
   *«Editar la información del grupo»* y el envío de invitaciones restringidos a
   administradores.

Además, conviene saber que **el enlace se puede regenerar** en cualquier momento
(*Invitar por enlace → Restablecer enlace*), lo que invalida el anterior. Si
algún día entra alguien de fuera del colegio, se restablece y **se pega el
enlace nuevo en `js/config.js`**, apartado 4. Si no se actualiza ahí, el botón
de la web deja de funcionar.

Los nombres exactos de los menús cambian un poco entre versiones de WhatsApp y
entre Android e iPhone, pero la opción se llama siempre algo parecido a
«Aprobar nuevos participantes».

### 0.2 Que los mensajes del formulario lleguen al correo de la AFA

Lo pediste y hay que aclararlo: **Web3Forms envía siempre al buzón de la cuenta
que creó la clave**, que es `colegioatalaya.afa.web@gmail.com`. Añadir un
segundo destinatario (el campo `ccemail`) es una función de pago, así que no se
puede hacer desde el código. Dos vías, las dos gratis:

- [ ] **Opción A, recomendada — reenvío automático.** En
      `colegioatalaya.afa.web@gmail.com`: *Configuración → Reenvío y correo
      POP/IMAP → Añadir una dirección de reenvío* →
      `colegioatalaya.afa@gmail.com`, y confirmar el correo de verificación que
      llega a la cuenta pública. No hay que tocar nada del código.
- [ ] **Opción B — clave nueva.** Crear una access key en web3forms.com
      directamente desde la cuenta pública y pegarla en `js/config.js`. Los
      mensajes llegan al buzón público sin reenvío intermedio, a cambio de
      perder la separación entre cuenta técnica y pública.
- [ ] **En cualquier caso: mandar un mensaje de prueba real** desde la web y
      comprobar dónde aterriza. Esto sigue sin hacerse y es lo único que
      demuestra que la cadena entera funciona.

### 0.3 El logotipo

La cabecera lleva ahora un **monograma tipográfico provisional** («AFA» sobre
verde). Se retiró el escudo del Colegio Atalaya porque la AFA es una entidad
independiente y el aviso legal lo dice expresamente.

- [ ] **Sacar el concurso de rediseño** que acordó la asamblea del 29 de mayo de
      2026. Hay que redactar las bases y llevarlas a asamblea.
- [ ] Mientras tanto, decidir si se quiere usar alguna de las dos marcas que ya
      circulan (la casita roja de la circular de la ludoteca o el dibujo del
      grupo de WhatsApp). Las dos están en baja resolución dentro de imágenes de
      WhatsApp; si se quiere usar una, hace falta el original o un SVG.
- [ ] Si se decide seguir usando la marca del colegio, **pedir permiso expreso
      al centro** y guardarlo por escrito.

### 0.5 Pedir al colegio su logotipo (para la franja del pie)

La web lleva ahora, encima del pie de las doce páginas, una **franja con el
enlace a la web del colegio** (`colegioatalaya.com`) y una frase que explica que
la AFA y el centro son entidades distintas. En el hueco del logotipo se ve por
ahora un icono neutro de edificio.

- [ ] **Pedir el logotipo a secretaría.** Idealmente un SVG; si no, un PNG con
      fondo transparente y al menos 200 px de alto. Hay un borrador de correo
      preparado (`docs/correo-logotipo-colegio.md`).
- [ ] Cuando llegue: guardarlo en `img/colegio-atalaya.svg` y escribir la ruta en
      `js/config.js` → apartado 5 → `colegio.logo: "/img/colegio-atalaya.svg"`.
      Con la barra inicial, porque la franja está en páginas a dos y a tres
      niveles de profundidad. No hay que tocar el HTML.

      A propósito **no se ha descargado el logotipo de su web**: es su marca, y
      pedirlo además les da la ocasión de decir que sí. Ojo con dónde se usa:
      dentro de la franja, que dice «el centro», es correcto; en la cabecera,
      donde va la marca de la AFA, no lo es — que es exactamente por lo que se
      retiró el escudo en agosto.

### 0.4 Autorizaciones de imagen

Publicadas cuatro fotos, una por actividad, después de que la junta confirmara
que se podían usar:

| Foto | Actividad | Qué se ve |
| --- | --- | --- |
| Magdalenas | Merienda de Carnaval | Solo comida, ninguna persona |
| Merienda literaria | Merienda literaria | Alumnado de infantil desde arriba: no se reconoce ninguna cara |
| Primeros auxilios | Taller de Cruz Roja | Familias adultas, identificables |
| Charla del eclipse | Charla del Observatorio | Familias adultas, identificables |

- [ ] **Confirmar que existe la autorización de imagen de los adultos** que
      aparecen en las dos fotos de los talleres. Los adultos también tienen
      derechos de imagen: no basta con que sean socios. Si alguno pide que se
      retire su foto, hay que hacerlo sin discutir, como dice la política de
      privacidad.
- [ ] **En la de la merienda literaria hay un detalle**: el niño de arriba a la
      izquierda mira hacia abajo y se le ve un perfil parcial (oreja, mejilla y
      el borde del ojo). No es una cara reconocible de frente, pero su familia
      probablemente lo identificaría. Se puede difuminar esa esquina en un
      minuto si preferís curaros en salud.
- [ ] El **mapa del eclipse no se publica**: es material de un tercero y haría
      falta permiso o atribución.
- [ ] La sexta imagen **no es una foto, es la circular de la ludoteca de junio y
      contiene el IBAN de la asociación**. No debe subirse a la web ni al
      repositorio bajo ninguna circunstancia.
- [ ] Preparar el formulario de derechos de imagen para las próximas
      actividades. Ya existe uno de la ludoteca de junio
      (`forms.gle/siimRxjUxehYuV2r7`): puede servir de base.

---

### 0.6 Comprobar que la documentación interna ya no se sirve

Hasta el 9 de septiembre de 2026, **este mismo fichero era legible por
cualquiera** entrando en `afacolegioatalaya.es/PENDIENTES.md`, igual que
`README.md` y `GUIA-FORMULARIOS.md`. Vercel sirve todos los ficheros del
repositorio, no solo los `.html`.

Puestos dos candados: `.vercelignore` (para que no se suban) y una redirección
en `vercel.json` (para que, si aun así se suben, la URL lleve a la portada).

- [ ] **Tras el primer despliegue, comprobar** que
      `https://afacolegioatalaya.es/PENDIENTES.md` lleva a la portada y no
      devuelve el documento. Si devuelve el documento, han fallado los dos
      candados y hay que avisar.
- [ ] Lo único que estaba expuesto y merece prisa es el **apartado 0.1**: el
      texto explica que el enlace del grupo de WhatsApp es una invitación
      abierta y que falta activar la aprobación de participantes. Mientras eso
      siga sin hacer, es una indicación a quien quiera colarse. Lo demás
      —correos, la clave de Web3Forms, la nota del acta— ya era público por
      otras vías o no es un secreto.

## 1. Corregir ya (afecta a lo que está publicado)

- [x] ~~Contenido viejo publicado en `paginas/el-afa/`~~ — **neutralizado.**
      Ese `index.html` ya no tiene la página antigua: es una redirección a
      `la-afa/` con `noindex`. Además `vercel.json` redirige la ruta de forma
      permanente (301), así que cualquier enlace antiguo sigue funcionando.
- [ ] **Borrar la carpeta `paginas/el-afa/` en SourceTree.** Ya no hace daño,
      pero sobra. No puedo borrarla yo: el puente con tu equipo permite escribir
      pero no eliminar. Dentro hay también un `_prueba.txt` que generé al
      comprobar los permisos; se va con la carpeta.
      *En SourceTree: eliminar la carpeta, confirmar el borrado y push.*

- [ ] **Quitar `img/Cabecera.png` (2 MB) del repositorio.** No se usa: la web
      carga `cabecera.webp` (105 KB) y `cabecera-movil.webp` (47 KB). Está además
      dentro del historial de Git, así que borrarla ahora reduce el repo de cara
      al futuro pero no lo limpia del todo. No es grave; simplemente no hace
      falta que esté.

- [ ] **Actualizar las instrucciones de despliegue.** El `README.md` y
      `docs/README.md` explican cómo publicar con **GitHub Pages** y citan sus
      límites. Ya no aplica: estáis en Vercel. Hay que reescribir esa parte.
- [x] ~~Añadir `vercel.json`~~ — **hecho.** Incluye la redirección de `el-afa`,
      cabeceras de seguridad (`X-Content-Type-Options`, `X-Frame-Options`,
      `Referrer-Policy`, `Permissions-Policy`) y caché de un mes para `/img/`.

- [ ] **Consecuencia buena del cambio a Vercel:** con Pages el repositorio tenía
      que ser público para publicar gratis. En Vercel **no**: podéis tener el
      repo privado y la web pública. Merece la pena decidirlo, porque cambia el
      criterio de qué se puede subir.

---

## 2. Dejar el formulario funcionando de verdad

La clave de Web3Forms ya está puesta en `js/config.js`. Falta lo último:

- [ ] **Activar el reenvío del Gmail técnico al público.** Sin esto los mensajes
      del formulario se quedan en `colegioatalaya.afa.web@gmail.com`, que nadie
      consulta a diario, en lugar de llegar a `colegioatalaya.afa@gmail.com`.
      *Ajustes → Reenvío y correo POP/IMAP → Añadir dirección de reenvío* (hay
      que confirmar desde el correo de destino).

- [ ] **Enviar un mensaje de prueba desde la web publicada** y comprobar tres
      cosas: que llega, que no cae en spam, y que al responder la respuesta va a
      la familia y no a vosotros mismos.

- [ ] **Marcar los correos de Web3Forms como «no es spam»** la primera vez.
      Esto no es un detalle menor: en la memoria del taller de atragantamientos
      ya consta que *«algunos emails de AFA han llegado al buzón de spam»* y
      familias inscritas no vieron el recordatorio. Es un problema real que ya
      os ha pasado.

---

## 3. Formularios de Google por crear

Cada uno se activa pegando su URL en `js/config.js` → `enlaces`.

- [ ] `altaSocio` — alta de socio. **Activa los 20 botones «Hazte socio»** del
      sitio. Los campos propuestos están en `GUIA-FORMULARIOS.md`, sección 3.
- [ ] `inscripcionActividad` — un único formulario reutilizable para todo el
      curso, con desplegable de actividad. Activa el botón del Taller familiar.
- [ ] `comisiones` — para apuntarse a una comisión de trabajo.
- [ ] `autorizacionImagen` — solo si queréis gestionarlo aparte del alta.
- [ ] `propuestas` — **no hace falta.** El formulario de contacto ya tiene
      «Propuesta o sugerencia» en el desplegable de motivo.

> **Ojo:** ya tenéis en circulación un Google Form de *cesión y protección de
> datos* (aparece en la circular del curso de primeros auxilios). Conviene
> decidir si ese formulario se integra en el alta de socio o se mantiene aparte,
> para no pedir dos veces lo mismo a las familias.

---

## 4. Contenido real que sustituye a los ejemplos

**Esto es lo más valioso que hay pendiente.** Ahora mismo la sección de
Actualidad y el calendario llevan contenido inventado de relleno. En
`03. Actividades AFA` hay **cinco actividades reales del curso 2025–2026** con
sus memorias, y son mucho mejores que cualquier ejemplo:

| # | Actividad | Fecha | Datos que ya tenemos |
|---|---|---|---|
| 01 | 1.er Concurso de Postales Navideñas | 5–19 dic 2025 | **58 alumnos** de todas las etapas · 9 vales de 10 € donados por **Librería Gil** · las postales se donaron a la **Residencia Isasti** (Lanestosa) |
| 02 | Merienda del Carnaval del Atalaya | 13 feb 2026 | **52 personas** en la organización · coste 837,06 € · repostería casera de las familias · disfraces en grupo en infantil |
| 03 | Charla sobre alimentación y atragantamientos (0–5 años) | 15 abr 2026 | Ponente **Lara del Valle**, matrona y consultora IBCLC · **17 familias** · gratuita |
| 04 | Taller de Primeros Auxilios (RCP) con **Cruz Roja** | 29 abr 2026 | 15:00–16:30 · aforo 35 · gratuito para familias asociadas |
| 05 | Merienda literaria | 2026 | Solo hay hoja de respuestas, **sin memoria** |

Tareas que salen de aquí:

- [x] ~~Reescribir las noticias de Actualidad~~ — **hecho.** Seis entradas
      reales en orden cronológico, con los filtros ajustados al contenido real
      (Actividades · Formación · Concursos · La AFA).
- [x] ~~Crear la página del curso pasado~~ — **hecho:**
      `paginas/actividades/curso-2025-2026/`. Las cinco actividades con sus
      cifras de participación, las entidades colaboradoras y un apartado de
      «qué aprendimos» sacado de las propias memorias. Enlazada desde la
      portada, desde Actividades y desde cada noticia.
      **Sin datos personales, sin importes y sin desgloses de gastos**, como
      pediste. Repásala y dime qué ajustar.
- [ ] **Revisar el calendario 2026–2027.** Las fechas que hay ahora (12 y 25 de
      septiembre, 10 de octubre) las puse como marcador de posición. Con el
      histórico se pueden proponer fechas reales: el concurso de postales cae en
      diciembre, la merienda de Carnaval en febrero.
- [ ] **Repetir la charla de atragantamientos.** Su propia memoria lo recomienda:
      *«estaría muy bien repetir en años posteriores»*.
- [ ] **Escribir la memoria de la Merienda literaria**, que es la única de las
      cinco que no la tiene.

---

## 5. Documentos por publicar en `docs/`

La sección de documentación tiene cuatro entradas marcadas como «Pendiente de
publicar». Los originales existen ya:

- [ ] **Estatutos** → hay un `.docx` y ocho fotos JPEG. Hay que **exportar el
      .docx a PDF** (las fotos no valen: pesan más y no se pueden buscar).
      Nombre esperado: `estatutos-afa-atalaya.pdf`
- [ ] **Acta de constitución de la junta** → existe `Acta Asamblea 20260320.pdf`
      firmada. **Antes de publicarla hay que comprobar si contiene NIF**: el acta
      que vi incluye los NIF de los seis miembros de la junta, y eso no puede
      subirse a la web. Habría que publicar una versión sin esos datos.
      Nombre esperado: `acta-constitucion-junta-2026-03-20.pdf`
- [ ] **Memoria del curso** → se puede montar una memoria 2025–2026 juntando las
      cinco actividades. Ojo: las memorias actuales incluyen desgloses de gastos
      con nombres de personas (aparece quién adelantó dinero en efectivo) — eso
      hay que quitarlo de la versión pública.
      Nombre esperado: `memoria-curso-2025-2026.pdf`
- [ ] **Bases de los concursos** → están dentro de la memoria del concurso de
      postales; se pueden extraer.

> Recordatorio: al subir cada PDF hay que quitarle la clase `is-pending` a su
> enlace en `paginas/formularios/index.html` para que deje de estar apagado.

---

## 6. Datos que siguen faltando

### 6.0 ⚠ DESCUADRE DE 120 € EN LA LUDOTECA DE JUNIO (pendiente de tesorería)

Los datos de asistencia que facilitó la junta el 9 de septiembre de 2026 **no
cuadran con las cifras económicas del acta del 29 de mayo**, que está publicada
en `docs/` y la puede descargar cualquiera.

| | Acta del 29 de mayo | Recuento de asistencia |
|---|---|---|
| Usuarios | 31 «alumnos inscritos» | 35 (27 socios + 8 no socios) |
| Familias | no consta | 31 (24 socias + 7 no socias) |
| Recaudado | 1.265 € | 1.385 € si se aplican 35 €/55 € |
| Aporta la AFA | 360 € | 240 € |

Las tres cifras del acta cuadran entre sí (1.265 + 360 = 1.625), pero con los
precios de junio solo son compatibles con **31 usuarios en un reparto 22/9**, o
con **35 usuarios en un reparto 33/2**. Con 27 socios y 8 no socios no salen.

Hipótesis probable: el acta es del **29 de mayo** y la ludoteca fue del **1 al 19
de junio**, así que sus cifras eran una foto de las inscripciones a esa fecha y
después se apuntaron cuatro niños más. Pero es una hipótesis, no un dato.

- [ ] **Preguntar a tesorería** cuánto se ingresó de verdad por la ludoteca de
      junio y cuánto puso la asociación. Con eso se cierra el descuadre.
- [ ] Mientras no esté aclarado, **la web no suma las dos cosas**: publica el
      recuento de asistencia como recuento y atribuye las cifras de dinero al
      acta, con su fecha. No cambiar los 1.265 €/360 € por los 1.385 €/240 €
      calculados: contradiría el PDF del acta que está colgado en la web. Hay
      un comentario explicándolo en
      `paginas/actividades/curso-2025-2026/index.html`, actividad 08.
- [ ] Cuando se confirme, hay un argumento de captación bueno esperando: las
      7 familias no socias pagaron **440 €**; siendo socias habrían pagado
      **406 €** (8 × 35 € + 7 cuotas de 18 €) y además habrían tenido la cuota
      cubierta para el resto del curso. No está publicado porque depende de
      cifras que todavía no cuadran.
- [ ] Ojo con el ratio 24/187: solo el **13 % de las familias socias** usó la
      ludoteca. Es un dato real y no hay que esconderlo, pero tampoco conviene
      destacarlo como argumento de captación, porque juega en contra.

- [x] ~~Publicar el importe de la cuota.~~ Hecho: **18 € por familia**, con
      página propia (`paginas/hazte-socio/`) que lo traduce en beneficios reales.
      Queda **confirmar que sigue siendo 18 € este curso** antes de dar el dato
      por bueno de cara a las familias.
- [ ] **Lista real de cursos del colegio**, para el desplegable del formulario
      de alta.
- [ ] **Aforo del Taller familiar** (ahora dice solo «aforo limitado»).
- [ ] **Temática concreta del Taller familiar** del 25 de septiembre.
- [ ] **Revisar las descripciones de las nueve comisiones**: la lista es la que
      pasó la junta, pero las descripciones de una línea las redacté yo por
      inferencia. Convivencia y Movilidad e Infraestructuras son las que más
      conviene confirmar.
- [ ] **Origen y licencia de la foto de cabecera** (parece generada con IA o de
      banco de imágenes; si fueran niños del colegio haría falta consentimiento).
- [ ] **Número de inscripción en el Registro de Asociaciones de Cantabria.**
      Está en blanco en el certificado de modificación de la junta. Hace falta
      para el aviso legal (apartado 1, marcado con un `TODO` en el HTML) y,
      según el propio acta del 20 de marzo, también para poder optar a
      subvenciones: la asociación solo aparece como activa en 2017.
- [ ] **Ubicación exacta del buzón** de la AFA en el colegio, para la página de
      Contacto.

---

## 7. Mejoras que salen de vuestras propias memorias

Las memorias documentan las dificultades de cada actividad, y varias las resuelve
la web. Merece la pena atacarlas explícitamente:

- [ ] **«Los alumnos de secundaria no se enteraron»** (concurso de postales). El
      cartel estaba en la corchera de la entrada, por donde no pasan. La web es
      justo el canal que no depende de dónde esté el cartel — conviene decirlo en
      la reunión de bienvenida y en los grupos de WhatsApp.
- [ ] **«Falta de lectura de las bases; es necesario contenido más visual»**.
      Cuando se publiquen las bases de un concurso, mejor una página con los
      puntos claros que un PDF denso.
- [ ] **«Algunas personas tuvieron dificultad en localizar el buzón»**. La
      página de Contacto menciona el buzón pero no dice dónde está exactamente.
      Añadir la ubicación concreta.
- [ ] **«Dudas sobre el nivel de protección de datos necesario»**. La política de
      privacidad de la web ya cubre buena parte de esto; conviene que la junta la
      lea y la valide, que es una tarea que sigue abierta.

---

## 8. Revisión legal

Los dos textos se reescribieron por completo el 21 de agosto de 2026 con los
datos reales de los estatutos y de las actas. Ya no son borradores genéricos:
llevan el CIF, el domicilio social, la ley de constitución, la tabla de
tratamientos, los encargados reales (Vercel, Web3Forms y Google) y la AEPD.

- [ ] **Que la junta los lea y los apruebe formalmente**, y que quede en acta.
      No son textos de relleno: comprometen a la asociación.
- [ ] **Revisión por alguien con criterio jurídico**, si hay alguna familia del
      colegio que pueda echarles un ojo. Están redactados con cuidado, pero
      quien los escribió no es abogado y conviene decirlo.
- [ ] **Completar el número de registro** en el aviso legal (ver apartado 6).
- [ ] **Actualizar la fecha de «última actualización»** de los dos textos si se
      cambia algo antes de publicar. Ahora dicen 21 de agosto de 2026.
- [x] ~~Decidir sobre Google Fonts.~~ Hecho: la tipografía Nunito se sirve
      ahora desde `/fonts` (ver `css/fuentes.css`). La web **no hace ninguna
      petición a terceros**, comprobado con el navegador. Eso simplifica mucho
      la política de privacidad.
- [x] ~~Redes sociales.~~ Decidido en agosto de 2026: la AFA no tiene ni prevé
      tener. Se retiraron los iconos del pie, el bloque `redes` de `config.js` y
      el módulo `initSocialLinks`. Si algún día se abren, hay que volver a
      añadirlos y declarar a Meta en la política de privacidad.
- [ ] **Autorización de imagen.** La política dice que solo se publican fotos de
      menores con autorización escrita de la familia. Hay que tener realmente
      ese documento firmado antes de publicar la primera foto en la web.
- [ ] **Revisar las fotos de las memorias** antes de subirlas a la web con el
      mismo criterio.

---

## 8 bis. Cómo se mantiene Actualidad (regla editorial)

Desde agosto de 2026 Actualidad **solo contiene lo que está en marcha**. No es
un archivo. La rutina es esta:

1. Se convoca una actividad → se añade una tarjeta en `paginas/actualidad/` y
   **la misma tarjeta** en el bloque «Lo próximo» de `index.html`. Son dos
   sitios: si se cambia uno hay que cambiar el otro.
2. La actividad termina → se **retira** la tarjeta de los dos sitios.
3. Al cerrar el curso se escribe su página en
   `paginas/actividades/curso-XXXX-XXXX/` y se añade una tarjeta al histórico
   de `paginas/actividades/#historico`.

Consecuencia asumida: habrá meses en que Actualidad esté casi vacía. Para eso
está el párrafo `.news-empty`, que solo hay que desmarcar quitándole `hidden`.

- [ ] Retirar la tarjeta de la **Reunión de bienvenida** después del 12 de
      septiembre de 2026.
- [ ] Retirar la tarjeta del **Taller familiar** después del 25 de septiembre
      de 2026, y escribir su crónica.
- [ ] Al cerrar el curso, crear `curso-2026-2027/` y convertir la tarjeta
      «Curso 2026–2027 · en marcha» del histórico en una tarjeta normal.

---

## 9. Mejoras técnicas (no urgentes)

- [ ] **Dominio propio.** El plan Pro incluye **un dominio gratis el primer
      año**. Da mucha más credibilidad que una URL `*.vercel.app` en una
      circular del colegio.
- [ ] **Página 404 propia**, coherente con el diseño.
- [ ] **`sitemap.xml` y `robots.txt`**, para que Google indexe bien.
- [ ] **Panel de administración.** Ver el apartado siguiente.

---

## 10. Sobre Vercel Pro y el panel de administración

Consultado en su documentación:

**Las funciones de servidor NO son lo que se paga.** Están incluidas también en
el plan gratuito (1 000 000 de invocaciones al mes). Pasar a Pro no os
«desbloquea» el servidor: ya lo tenéis.

Lo que Pro aporta de verdad en vuestro caso:

| | Gratis (Hobby) | Pro |
|---|---|---|
| Funciones de servidor | Sí | Sí, con más límites |
| **Uso** | **Solo personal, no comercial** | Sin esa restricción |
| Equipo con roles | No | Sí (puestos de solo lectura **gratis**) |
| Dominio | De pago | **Uno gratis el primer año** |
| Almacenamiento de ficheros (Blob) | Sí | Sí |

**El argumento de peso para pagar no es técnico, es de legitimidad y de
gobierno:** el plan gratuito está limitado a uso personal y no comercial, y una
asociación no es una persona. Y sobre todo, Pro permite que **varias personas de
la junta tengan acceso con roles distintos** en lugar de compartir una cuenta —
que es justo el problema que venimos evitando en todo el proyecto.

### Y sobre el panel de administración

Un panel necesita tres cosas, no una:

1. **Servidor** → lo tenéis en los dos planes.
2. **Almacenamiento** → Vercel Blob para ficheros; una base de datos se contrata
   aparte y tiene coste propio.
3. **Autenticación** → hay que construirla o contratarla. **Esto es el 80 % del
   trabajo real**, y es lo que ningún plan te da hecho.

Mi recomendación sigue siendo la misma que antes, y ahora con más razón: para
esto no hace falta construir nada. Un **CMS basado en Git** (Pages CMS, Decap,
Sveltia) da un panel con login, editor visual y subida de archivos, guarda cada
cambio como un commit y **no necesita servidor, ni base de datos, ni
autenticación propia**. Es menos código, menos que mantener y sin coste.

Construir un panel propio sobre Vercel tiene sentido si algún día necesitáis
algo que un CMS no cubra: control de aforos en tiempo real, un área privada para
socios o pagos en línea. Mientras el objetivo sea «editar textos y subir PDF sin
tocar HTML», el CMS gana por mucho.

---

## Orden que propongo

1. Borrar `paginas/el-afa/` — es lo único que está mal en producción.
2. Activar el reenvío del Gmail y probar el formulario.
3. Reescribir Actualidad con las cuatro actividades reales.
4. Crear el Google Form de alta y pegar su URL.
5. Publicar estatutos y memoria (con los datos personales quitados).
6. El resto, según vaya haciendo falta.

---

## 11. Hecho el 27 de agosto de 2026

- [x] **Redes sociales.** Corregido el error de la sesión anterior: la web decía
      que la AFA no tenía redes. Sí las tiene. Instagram (@afacolegioatalaya) y
      el grupo de WhatsApp están en `js/config.js`, con iconos en el pie de las
      trece páginas, y **Meta queda declarada en la política de privacidad**,
      incluida la advertencia de que entrar en el grupo expone tu teléfono al
      resto del grupo.
- [x] **Marca propia** en la cabecera, sin el escudo del colegio.
- [x] **Cuatro fotos publicadas**, una por actividad, con pie y texto
      alternativo. La de la charla estaba mal atribuida en la primera versión:
      es la del **eclipse solar**, no una charla genérica, y ya está corregida.
- [x] **Página de la cuota** con el argumento de la ludoteca (35 € socios frente
      a 55 €: veinte euros de ahorro con una cuota de dieciocho).
- [x] **Preguntas frecuentes** como sección del menú, con trece preguntas
      agrupadas por tema en lugar de las cinco escondidas en Formularios.
- [ ] **Borrar `img/actividades/charla-familias.webp`** en SourceTree. Era la
      versión recortada y desenfocada de la foto del eclipse, sustituida por la
      completa al confirmarse que se podían publicar las caras. Ya no la usa
      ninguna página.
- [x] **Próximas actividades ocultas.** Se retiraron el calendario del curso, la
      rejilla de la portada y las fichas de la reunión de bienvenida y el taller
      familiar, que tenían fechas inventadas. Las dos carpetas quedan como
      redirección: **bórralas en SourceTree**
      (`paginas/actividades/reunion-bienvenida/` y `taller-familiar/`); el 301
      ya está en `vercel.json`.
- [x] **Ludoteca de septiembre: inscripción abierta** (31 de agosto de 2026). La
      ficha ha pasado de «recogida de interés» a convocatoria de verdad, con las
      fechas (8–30 de septiembre, 17 días lectivos), el precio (45 € socios /
      65 € no socios), el plazo del 4 de septiembre, los datos de la
      transferencia y los datos que hay que enviar. La circular está en
      `docs/circular-ludoteca-septiembre-2026.pdf`, enlazada desde la ficha y
      desde Formularios → Documentación.

      Tres cosas que conviene revisar cuando pase la actividad:

      1. **Retirar la circular de Formularios.** Es una convocatoria con fecha
         de caducidad, no documentación de la asociación. El comentario en el
         HTML lo recuerda.
      2. **Retirar el aviso del cambio de banco** cuando ya no queden circulares
         antiguas circulando (bloque comentado en la ficha).
      3. **Pasar la crónica al histórico del curso 2026–2027** y quitar la
         entrada de Actualidad y de la portada.

- [ ] **La merienda de la ludoteca sigue sin definir.** No aparece ni en la
      circular ni en la web porque no sabíamos si la hay. Si al final se ofrece,
      hay que añadirla a la ficha y a la circular con su precio.
- [x] **El curso 2025–2026 pasa de cinco a ocho actividades.** El acta del 29 de
      mayo documenta tres que faltaban (jornadas culturales, eclipse solar y
      ludoteca de junio) y completa merienda literaria y primeros auxilios. Las
      cifras de cabecera estaban mal: eran 8 actividades, 5 entidades y 3
      talleres, no 5, 3 y 2.
- [x] **Estatutos y las dos actas publicados** en `docs/`, enlazados desde
      Formularios.
- [x] **Acta del 20 de marzo redactada de verdad.** El párrafo que identificaba
      a un asociado concreto se ha sustituido por un resumen neutro, y la página
      se ha convertido en imagen para que **el texto original no se pueda
      extraer del PDF** (comprobado). También se han tapado las dos rúbricas
      manuscritas de la presidenta y la secretaria, dejando los rótulos: una
      firma escaneada en una web pública es una invitación a copiarla. Si
      preferís publicarlas, se revierte.
- [x] **Revisión móvil.** Auditoría automática de las trece páginas a 320, 360,
      390, 430 y 768 px. Tres fallos reales corregidos: desplazamiento
      horizontal de 24 px en La AFA a 320 px (la rejilla de comisiones),
      enlaces de 20-22 px de alto por debajo del mínimo de 24 px de la WCAG
      2.5.8, y la casilla del consentimiento del formulario a 20×20 px. Ahora la
      auditoría sale limpia.
- [x] **Registro de asociaciones.** El acta de mayo confirma que la asociación
      ya está actualizada en el Registro de Consejería, así que el aviso legal
      lo dice. Sigue faltando el número.
